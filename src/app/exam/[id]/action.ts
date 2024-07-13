'use server';

import { db } from '@/db/db';

export async function submitExamAnswers(userId: string, examPaperId: string, answers: Record<string, string[] | string>) {
  try {
    const examAttempt = await db.examAttempt.create({
      data: {
        userId,
        examPaperId,
        score: 0,
      },
    });

    let totalScore = 0;

    const questions = await db.examPaperQuestion.findMany({
      where: { examPaperId },
      include: { options: true },
    });

    for (const question of questions) {
      const answer = answers[question.id];
      let correctness = 0;

      if (question.type === 'FILL_IN_THE_BLANK') {
        const correctAnswer = question.options[0]?.text;
        correctness = answer && answer === correctAnswer ? 1 : 0;
      } else {
        const selectedOptions = answer as string[] || [];
        if (selectedOptions.length > 0) {
          const correctOptions = question.options.filter(o => o.isCorrect).map(o => o.id);
          const correctSelections = selectedOptions.filter(id => correctOptions.includes(id));
          correctness = correctSelections.length / correctOptions.length;
        }
      }

      await db.examAnswer.create({
        data: {
          examAttemptId: examAttempt.id,
          examPaperQuestionId: question.id,
          answer: answer ? (typeof answer === 'string' ? answer : JSON.stringify(answer)) : '',
          correctness,
        },
      });

      totalScore += correctness * question.positiveMarks;
    }

    await db.examAttempt.update({
      where: { id: examAttempt.id },
      data: { score: totalScore },
    });

    return { success: true, finalScore: totalScore };
  } catch (error) {
    console.error('Error submitting exam answers:', error);
    return { success: false, error: 'Failed to submit exam answers' };
  }
}