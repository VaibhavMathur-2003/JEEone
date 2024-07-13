import ExamPaperForm from '@/components/ExamPaperForm';
import { ExamPaper } from '@/types/examTypes';
import { db } from '@/db/db';


async function addExamPaper(examPaper: ExamPaper) {
  'use server'
  
  try {
    const createdExamPaper = await db.examPaper.create({
      data: {
        title: examPaper.title,
        description: examPaper.description,
        totalMarks: examPaper.totalMarks,
        duration: examPaper.duration,
        questions: {
          create: examPaper.questions.map((question, index) => ({
            title: question.title,
            text: question.text,
            subject: question.subject,
            type: question.type,
            positiveMarks: question.positiveMarks,
            negativeMarks: question.negativeMarks,
            order: index + 1,
            options: {
              create: question.options.map((option) => ({
                text: option.text,
                isCorrect: option.isCorrect,
              })),
            },
          })),
        },
      },
    });

    return { success: true, examPaper: createdExamPaper };
  } catch (error) {
    console.error('Error creating exam paper:', error);
    return { success: false, error: 'Error creating exam paper' };
  }
}

export default function AddExamPaper() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Exam Paper</h1>
      <ExamPaperForm addExamPaper={addExamPaper} />
    </div>
  );
}