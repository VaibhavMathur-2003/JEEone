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
      // Update exam paper
      await prisma.examPaper.update({
        where: { id: examPaper.id },
        data: {
          title: examPaper.title,
          description: examPaper.description,
          totalMarks: examPaper.totalMarks,
          duration: examPaper.duration,
        }
      });

      // Update questions and options
      for (const question of examPaper.questions) {
        if (question.id.startsWith('temp')) {
          // New question
          await prisma.examPaperQuestion.create({
            data: {
              examPaperId: examPaper.id,
              title: question.title,
              text: question.text,
              subject: question.subject,
              type: question.type,
              positiveMarks: question.positiveMarks,
              negativeMarks: question.negativeMarks,
              order: question.order,
              options: {
                create: question.options.map((option: any) => ({
                  text: option.text,
                  isCorrect: option.isCorrect
                }))
              }
            }
          });
        } else {
          // Existing question
          await prisma.examPaperQuestion.update({
            where: { id: question.id },
            data: {
              title: question.title,
              text: question.text,
              subject: question.subject,
              type: question.type,
              positiveMarks: question.positiveMarks,
              negativeMarks: question.negativeMarks,
              order: question.order,
            }
          });

          // Update options
          for (const option of question.options) {
            if (option.id.startsWith('temp')) {
              // New option
              await prisma.examPaperQuestionOption.create({
                data: {
                  examPaperQuestionId: question.id,
                  text: option.text,
                  isCorrect: option.isCorrect
                }
              });
            } else {
              // Existing option
              await prisma.examPaperQuestionOption.update({
                where: { id: option.id },
                data: {
                  text: option.text,
                  isCorrect: option.isCorrect
                }
              });
            }
          }
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