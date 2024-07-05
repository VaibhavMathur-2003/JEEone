'use server';

import { db } from "@/db/db";

export async function submitAnswer(questionId: number, userId: string, answer: number[] | string) {
  try {
    const question = await db.question.findUnique({
      where: { id: questionId },
      include: { options: true },
    });

    if (!question) {
      return { success: false, error: 'Question not found' };
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    let correctness=0;

    if (question.type === 'FILL_IN_THE_BLANK') {
      const correctAnswer = question.options[0]?.text;
      correctness = answer === correctAnswer ? 1 : 0;
    } else {
      const selectedOptions = answer as number[];
      const correctOptions = question.options.filter(o => o.isCorrect).map(o => o.id);
      const correctSelections = selectedOptions.filter(id => correctOptions.includes(id));
      correctness = correctSelections.length / correctOptions.length;
    }

    let newStatus;
    if (correctness === 1) {
      newStatus = 'SOLVED';
    } else if (correctness > 0) {
      newStatus = 'PARTIALLY_SOLVED';
    } else {
      newStatus = 'ATTEMPTED';
    }

    const attempt = await db.attempt.create({
      data: {
        userId,
        questionId,
        correctness,
        textResponse: typeof answer === 'string' ? answer : undefined,
        selectedOptions: {
          create: typeof answer !== 'string'
            ? answer.map(optionId => ({ optionId }))
            : undefined
        },
      },
    });

    // Update user's questionsSolved count
    await db.$transaction([
      db.user.update({
        where: { id: userId },
        data: { questionsSolved: { increment: 1 } },
      }),
      db.question.update({
        where: { id: questionId },
        data: { status: newStatus },
      }),
    ]);
    

    return { success: true, correctness, attemptId: attempt.id, newStatus };
  } catch (error) {
    console.error('Error submitting answer:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}