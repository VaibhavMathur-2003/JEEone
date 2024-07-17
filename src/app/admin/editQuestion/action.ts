'use server'

import { db } from "@/db/db";

interface Option {
    id: number; // Changed from string to number
    text: string;
    isCorrect: boolean;
    questionId: number; // Added this field
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
        // Update the main question
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
  
        // Get existing option IDs
        const existingOptions = await prisma.option.findMany({
          where: { questionId: question.id },
          select: { id: true }
        });
        const existingOptionIds = existingOptions.map(o => o.id);
  
        // Separate new and existing options
        const newOptions = question.options.filter((o: Option) => !existingOptionIds.includes(o.id));
        const updatedOptions = question.options.filter((o: Option) => existingOptionIds.includes(o.id));
  
        // Delete options that are no longer present
        const optionIdsToKeep = updatedOptions.map((o: Option) => o.id);
        await prisma.option.deleteMany({
          where: {
            questionId: question.id,
            id: { notIn: optionIdsToKeep }
          }
        });
  
        // Update existing options
        for (const option of updatedOptions) {
          await prisma.option.update({
            where: { id: option.id },
            data: {
              text: option.text,
              isCorrect: option.isCorrect
            }
          });
        }
  
        // Create new options
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
      // Delete related AttemptOptions
      await prisma.attemptOption.deleteMany({
        where: {
          option: {
            questionId: questionId
          }
        }
      });

      // Delete related Attempts
      await prisma.attempt.deleteMany({
        where: { questionId: questionId }
      });

      // Delete related QuestionStatus
      await prisma.questionStatus.deleteMany({
        where: { questionId: questionId }
      });

      // Delete related Options
      await prisma.option.deleteMany({
        where: { questionId: questionId }
      });

      // Finally, delete the Question
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