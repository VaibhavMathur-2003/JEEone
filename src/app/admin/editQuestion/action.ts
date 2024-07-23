'use server'

import { db } from "@/db/db";

interface Option {
    id: number;
    text: string;
    isCorrect: boolean;
    questionId: number;
  }

export async function getQuestion(questionId: number) {
  try {
    const question = await db.question.findUnique({
      where: { id: questionId },
      include: {
        options: true,
        attempts: true,
        questionStatus: true
      }
    });

    if (!question) {
      throw new Error('Question not found');
    }

    return question;
  } catch (error) {
    console.error('Error fetching question:', error);
    throw error;
  }
}

export async function editQuestion(question: any) {
    try {
      await db.$transaction(async (prisma) => {
        await prisma.question.update({
          where: { id: question.id },
          data: {
            title: question.title,
            text: question.text,
            difficulty: question.difficulty,
            subject: question.subject,
            explanation: question.explanation,
            type: question.type,
            correctPercentage: question.correctPercentage,
          }
        });
  
        const existingOptions = await prisma.option.findMany({
          where: { questionId: question.id },
          select: { id: true }
        });
        const existingOptionIds = existingOptions.map(o => o.id);
  
        const newOptions = question.options.filter((o: Option) => !existingOptionIds.includes(o.id));
        const updatedOptions = question.options.filter((o: Option) => existingOptionIds.includes(o.id));
  
        const optionIdsToKeep = updatedOptions.map((o: Option) => o.id);
        await prisma.option.deleteMany({
          where: {
            questionId: question.id,
            id: { notIn: optionIdsToKeep }
          }
        });
  
        for (const option of updatedOptions) {
          await prisma.option.update({
            where: { id: option.id },
            data: {
              text: option.text,
              isCorrect: option.isCorrect
            }
          });
        }
  
        if (newOptions.length > 0) {
          await prisma.option.createMany({
            data: newOptions.map((o: Option) => ({
              text: o.text,
              isCorrect: o.isCorrect,
              questionId: question.id
            }))
          });
        }
      });
  
      return { message: 'Question updated successfully' };
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  }

export async function deleteQuestion(questionId: number) {
  if (!questionId) {
    throw new Error('Question ID is required');
  }

  try {
    await db.$transaction(async (prisma) => {
      await prisma.attemptOption.deleteMany({
        where: {
          option: {
            questionId: questionId
          }
        }
      });

      await prisma.attempt.deleteMany({
        where: { questionId: questionId }
      });

      await prisma.questionStatus.deleteMany({
        where: { questionId: questionId }
      });

      await prisma.option.deleteMany({
        where: { questionId: questionId }
      });

      await prisma.question.delete({
        where: { id: questionId }
      });
    });

    return { message: 'Question and related records deleted successfully' };
  } catch (error) {
    console.error('Error deleting question:', error);
    throw new Error('Failed to delete question and related records');
  }
}