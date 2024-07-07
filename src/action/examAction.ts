'use server'

import { db } from "@/db/db";

export async function createExamPaper(title: string, description: string, questionIds: number[]) {
  const examPaper = await db.examPaper.create({
    data: {
      title,
      description,
      questions: {
        create: questionIds.map((id, index) => ({
          questionId: id,
          order: index
        }))
      }
    }
  });
  return examPaper;
}

export async function getExamPapers() {
  return db.examPaper.findMany({
    include: {
      questions: {
        include: {
          question: {
            select: {
              title: true
            }
          }
        }
      }
    }
  });
}

export async function getExamPaper(id: string) {
  return db.examPaper.findUnique({
    where: { id },
    include: {
      questions: {
        include: {
          question: {
            include: {
              options: true
            }
          }
        },
        orderBy: {
          order: 'asc'
        }
      }
    }
  });
}

export async function submitExamAttempt(userId: string, examPaperId: string, answers: { questionId: number, answer: string | number[] }[]) {
  const examPaper = await getExamPaper(examPaperId);
  if (!examPaper) throw new Error("Exam paper not found");

  let totalScore = 0;

  const examAnswers = await Promise.all(answers.map(async ({ questionId, answer }) => {
    const question = examPaper.questions.find(q => q.question.id === questionId)?.question;
    if (!question) throw new Error(`Question ${questionId} not found in exam paper`);

    let correctness = 0;

    if (question.type === 'FILL_IN_THE_BLANK') {
      const correctAnswer = question.options[0]?.text;
      correctness = answer === correctAnswer ? 1 : 0;
    } else {
      const selectedOptions = answer as number[];
      const correctOptions = question.options.filter(o => o.isCorrect).map(o => o.id);
      const correctSelections = selectedOptions.filter(id => correctOptions.includes(id));
      correctness = correctSelections.length / correctOptions.length;
    }

    totalScore += correctness;

    return {
      questionId,
      answer: JSON.stringify(answer),
      correctness
    };
  }));

  const examAttempt = await db.examAttempt.create({
    data: {
      userId,
      examPaperId,
      score: totalScore / examPaper.questions.length,
      completedAt: new Date(),
      answers: {
        create: examAnswers
      }
    }
  });

  return examAttempt;
}

// In examActions.ts
