import Link from "next/link";
import { db } from "@/db/db";
import { auth } from "@/auth";
import { Suspense } from "react";

export default async function QuestionListPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const questions = await db.question.findMany({
    select: {
      id: true,
      title: true,
      difficulty: true,
      subject: true,
      type: true,
      questionStatus: {
        where: {
          userId: userId,
        },
        select: {
          status: true,
        },
      },
    },
  });

  function getStatusIcon(status: string|undefined) {
    switch (status) {
      case "PARTIALLY_SOLVED":
        return (
          <svg
            className="w-5 h-5 text-yellow-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        );
      case "SOLVED":
        return (
          <svg
            className="w-5 h-5 text-green-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6M12 18h.01" />
          </svg>
        );
      case "ATTEMPTED":
        return (
          <svg
            className="w-5 h-5 text-red-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M4.93 4.93l14.14 14.14" />
          </svg>
        );
      default:
        return null;
    }
  }

  function getTypeIcon(type: string) {
    switch (type) {
      case "MULTIPLE_CHOICE_SINGLE":
        return (
          <svg
            className="w-5 h-5 text-blue-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        );
      case "MULTIPLE_CHOICE_MULTIPLE":
        return (
          <svg
            className="w-5 h-5 text-purple-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6M12 18h.01" />
          </svg>
        );
      case "FILL_IN_THE_BLANK":
        return (
          <svg
            className="w-5 h-5 text-teal-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M4.93 4.93l14.14 14.14" />
          </svg>
        );
      default:
        return null;
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6 text-center">Question List</h1>
      <ul className="divide-y divide-gray-200 bg-white shadow rounded-lg">
        <Suspense fallback={<div>Loading...</div>}>
        {questions.map((question) => (
          <li key={question.id} className="py-4 px-6 hover:bg-gray-50 transition duration-300">
            <Link href={`/problems/${question.id}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(question.questionStatus[0]?.status)}
                  <div className="text-gray-800 font-medium">{question.title}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                      question.difficulty === "EASY"
                        ? "bg-green-100 text-green-800"
                        : question.difficulty === "MEDIUM"
                        ? "bg-yellow-100 text-yellow-800"
                        : question.difficulty === "HARD"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {question.difficulty.toLowerCase()}
                  </div>
                  <div className="text-gray-600">{question.subject}</div>
                  {getTypeIcon(question.type)}
                </div>
              </div>
            </Link>
          </li>
        ))}</Suspense>
      </ul>
    </div>
  );
}
