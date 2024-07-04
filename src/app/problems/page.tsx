import Link from 'next/link';
import { db } from '@/db/db';

export default async function QuestionListPage() {
  const questions = await db.question.findMany({
    select: {
      id: true,
      title: true,
      difficulty: true,
      subject: true,
      type: true,
      status: true,
    },
  });

  return (
    <div>
      <h1>Questions</h1>
      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            <Link href={`/problems/${question.id}`}>
              <h2>{question.title}</h2>
              <p>Difficulty: {question.difficulty}</p>
              <p>Subject: {question.subject}</p>
              <p>Type: {question.type}</p>
              <p>Status: {question.status}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}