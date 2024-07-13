'use server'

import { db } from "@/db/db";

export async function getExamPaper(examPaperId: string) {
  try {
    const examPaper = await db.examPaper.findUnique({
      where: { id: examPaperId },
      include: {
        questions: {
          include: {
            options: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!examPaper) {
      throw new Error('Exam paper not found');
    }

    return examPaper;
  } catch (error) {
    console.error('Error fetching exam paper:', error);
    throw error;
  }
}

export async function editExamPaper(examPaper: any) {
  try {
    await db.$transaction(async (prisma) => {
      await prisma.examPaper.update({
        where: { id: examPaper.id },
        data: {
          title: examPaper.title,
          description: examPaper.description,
          totalMarks: examPaper.totalMarks,
          duration: examPaper.duration,
        }
      });

      for (const question of examPaper.questions) {
        await prisma.examPaperQuestion.upsert({
          where: { id: question.id },
          update: {
            title: question.title,
            text: question.text,
            subject: question.subject,
            type: question.type,
            positiveMarks: question.positiveMarks,
            negativeMarks: question.negativeMarks,
            order: question.order,
          },
          create: {
            examPaperId: examPaper.id,
            title: question.title,
            text: question.text,
            subject: question.subject,
            type: question.type,
            positiveMarks: question.positiveMarks,
            negativeMarks: question.negativeMarks,
            order: question.order,
          }
        });

        for (const option of question.options) {
          await prisma.examPaperQuestionOption.upsert({
            where: { id: option.id },
            update: {
              text: option.text,
              isCorrect: option.isCorrect
            },
            create: {
              examPaperQuestionId: question.id,
              text: option.text,
              isCorrect: option.isCorrect
            }
          });
        }
      }
    });
  } catch (error) {
    console.error('Error updating exam paper:', error);
    throw error;
  }
}
export async function deleteExamPaper(formData: FormData) {
  const examPaperId = formData.get('examPaperId') as string;

  if (!examPaperId) {
    throw new Error('Exam paper ID is required');
  }

  try {
    await db.$transaction(async (prisma) => {
      await prisma.examAnswer.deleteMany({
        where: {
          examAttempt: {
            examPaperId: examPaperId
          }
        }
      });

      await prisma.examAttempt.deleteMany({
        where: {
          examPaperId: examPaperId
        }
      });

      await prisma.examPaperQuestionOption.deleteMany({
        where: {
          examPaperQuestion: {
            examPaperId: examPaperId
          }
        }
      });

      await prisma.examPaperQuestion.deleteMany({
        where: {
          examPaperId: examPaperId
        }
      });

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