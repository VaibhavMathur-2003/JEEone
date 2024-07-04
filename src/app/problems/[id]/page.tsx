import AnswerForm from './AnswerForm';
import { auth } from '@/auth';
import { db } from '@/db/db';

export default async function QuestionPage({ params }: { params: { id: string } }) {
  const question = await db.question.findUnique({
    where: { id: parseInt(params.id) },
    include: { options: true },
  });

  if (!question) {
    return <div>Question not found</div>;
  }

  const session = await auth();
  const userId = session?.user.id;

  return (
    <div>
      <h1>{question.title}</h1>
      <p>{question.text}</p>
      <p>Difficulty: {question.difficulty}</p>
      <p>Subject: {question.subject}</p>
      <p>Type: {question.type}</p>
      <p>Status: {question.status}</p>
      <AnswerForm question={question} userId={userId} />
    </div>
  );
}