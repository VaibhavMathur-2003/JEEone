'use server';

import { db } from "@/db/db";

export async function deleteExamPaper(formData: FormData) {
  const examPaperId = formData.get('examPaperId') as string;

  if (!examPaperId) {
    throw new Error('Exam paper ID is required');
  }

  try {
    // Start a transaction
    await db.$transaction(async (prisma) => {
      // Delete related ExamAnswers
      await prisma.examAnswer.deleteMany({
        where: {
          examAttempt: {
            examPaperId: examPaperId
          }
        }
      });

      // Delete related ExamAttempts
      await prisma.examAttempt.deleteMany({
        where: {
          examPaperId: examPaperId
        }
      });

      // Delete related ExamPaperQuestionOptions
      await prisma.examPaperQuestionOption.deleteMany({
        where: {
          examPaperQuestion: {
            examPaperId: examPaperId
          }
        }
      });

      // Delete related ExamPaperQuestions
      await prisma.examPaperQuestion.deleteMany({
        where: {
          examPaperId: examPaperId
        }
      });

      // Finally, delete the ExamPaper
      await prisma.examPaper.delete({
        where: {
          id: examPaperId
        }
      });
    });

    return { message: 'Exam paper and related records deleted successfully' };
  } catch (error) {
    console.error('Error deleting exam paper:', error);
    throw new Error('Failed to delete exam paper and related records');
  }
}