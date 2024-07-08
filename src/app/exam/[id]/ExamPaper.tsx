// ExamPaper.tsx
import { PrismaClient } from '@prisma/client';
import ExamPaperClient from './ExamPaperClient';

const prisma = new PrismaClient();

interface Props {
  examPaperId: string;
  userId: string;
}

const ExamPaper: React.FC<Props> = async ({ examPaperId, userId }) => {
  const examPaper = await prisma.examPaper.findUnique({
    where: { id: examPaperId },
    include: {
      questions: {
        include: {
          options: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  });

  if (!examPaper) {
    return <div>Exam paper not found</div>;
  }

  return <ExamPaperClient examPaper={examPaper} userId={userId} />;
}

export default ExamPaper;