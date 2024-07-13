import { db } from "@/db/db";
import { auth } from "@/auth";
import ExamPaperClient from "./ExamPaperClient";


export default async function ExamPage ({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session) return <div>Log In First</div>;

  const examPaper = await db.examPaper.findUnique({
    where: { id: params.id },
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

  return <ExamPaperClient examPaper={examPaper} userId={session.user.id} duration={examPaper.duration}/>;
}
