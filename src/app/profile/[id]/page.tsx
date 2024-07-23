import { signOut } from "@/auth";
import { db } from "@/db/db";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page({ params }: { params: { id: string } }) {
  const user = await db.user.findUnique({
    where: { id: params.id },
    include: { attempts: true, examAttempts: true },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const questionAttemptsMap = new Map();

  user.attempts.forEach((attempt) => {
    const existingAttempt = questionAttemptsMap.get(attempt.questionId);
    if (!existingAttempt || attempt.correctness > existingAttempt.correctness) {
      questionAttemptsMap.set(attempt.questionId, attempt);
    }
  });

  const uniqueAttempts = Array.from(questionAttemptsMap.values());

  const ExamquestionAttemptsMap = new Map();

  user.examAttempts.forEach((attempt) => {
    const existingAttempt = ExamquestionAttemptsMap.get(attempt.examPaperId);
    if (!existingAttempt || attempt.score > existingAttempt.correctness) {
      ExamquestionAttemptsMap.set(attempt.examPaperId, attempt);
    }
  });

  const ExamuniqueAttempts = Array.from(ExamquestionAttemptsMap.values());

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Suspense fallback={<div>Loading...</div>}>

    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome, {user.username}!</h1>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Questions Solved: {uniqueAttempts.length}</h2>
          <ul className="space-y-2">
              {uniqueAttempts.map((attempt) => (
                <Link key={attempt.id} href={`/problems/${attempt.questionId}`}>
                  <li className="flex justify-between items-center bg-blue-50 p-4 rounded-lg shadow-sm hover:bg-blue-100 transition duration-200">
                    <span>Question ID: {attempt.questionId}</span>
                    <span className="font-semibold">{attempt.correctness}</span>
                  </li>
                </Link>
              ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Exams Attempted: {ExamuniqueAttempts.length}</h2>
          <ul className="space-y-2">
              {ExamuniqueAttempts.map((attempt) => (
                <Link key={attempt.id} href={`/exam/${attempt.examPaperId}`}>
                  <li className="flex justify-between items-center bg-green-50 p-4 rounded-lg shadow-sm hover:bg-green-100 transition duration-200">
                    <span>Exam ID: {attempt.examPaperId}</span>
                    <span className="font-semibold">Score: {attempt.score}</span>
                  </li>
                </Link>
              ))}
          </ul>
        </div>
      </div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/signin" });
        }}
        className="mt-8"
      >
        <button
          type="submit"
          className="w-1/4 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
        >
          Sign Out
        </button>
      </form>
    </div>
    </Suspense>

  </div>
  );
}
