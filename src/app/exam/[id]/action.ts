// actions.ts
'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function submitExamAnswers(userId: string, examPaperId: string, answers: Record<string, string[] | string>) {
  try {
    // Create exam attempt
    const examAttempt = await prisma.examAttempt.create({
      data: {
        userId,
        examPaperId,
        score: 0,
      },
    });

    let totalScore = 0;

    // Fetch all questions for this exam paper
    const questions = await prisma.examPaperQuestion.findMany({
      where: { examPaperId },
      include: { options: true },
    });

    // Submit answers and calculate score
    for (const question of questions) {
      const answer = answers[question.id];
      let correctness = 0;

      if (question.type === 'FILL_IN_THE_BLANK') {
        const correctAnswer = question.options[0]?.text;
        correctness = answer === correctAnswer ? 1 : 0;
      } else {
        const selectedOptions = answer as string[];
        const correctOptions = question.options.filter(o => o.isCorrect).map(o => o.id);
        const correctSelections = selectedOptions.filter(id => correctOptions.includes(id));
        correctness = correctSelections.length / correctOptions.length;
      }

      // Create exam answer
      await prisma.examAnswer.create({
        data: {
          examAttemptId: examAttempt.id,
          examPaperQuestionId: question.id,
          answer: typeof answer === 'string' ? answer : JSON.stringify(answer),
          correctness,
        },
      });

      totalScore += correctness * question.positiveMarks;
    }

    // Update exam attempt with final score
    await prisma.examAttempt.update({
      where: { id: examAttempt.id },
      data: { score: totalScore },
    });

    return { success: true, finalScore: totalScore };
  } catch (error) {
    console.error('Error submitting exam answers:', error);
    return { success: false, error: 'Failed to submit exam answers' };
  }
}