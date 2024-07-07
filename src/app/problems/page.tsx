


import Link from "next/link";
import { db } from "@/db/db";
import { auth } from "@/auth";

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
          userId: userId
        },
        select: {
          status: true
        }
      }
    },
  });

  function getStatusIcon(status: string | undefined) {
    switch (status) {
      case "PARTIALLY_SOLVED":
        return (
          <svg
            className="w-4 h-4"
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
            className="w-4 h-4"
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
            className="w-4 h-4"
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
            className="w-4 h-4"
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
            className="w-4 h-4"
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
            className="w-4 h-4"
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
  // ... (getTypeIcon function remains unchanged)

  return (
    <div className="max-w-4xl mx-auto">
      <ul className="divide-y divide-gray-200">
        {questions.map((question) => (
          <li key={question.id} className="py-1">
            <Link href={`/problems/${question.id}`}>
              <div className="block hover:bg-gray-50 rounded-lg p-1 transition duration-300">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  {getStatusIcon(question.questionStatus[0]?.status)}

                  <div className="text-sm text-gray-900">{question.title}</div>
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full ${
                      question.difficulty === "EASY"
                        ? "text-green-500 "
                        : question.difficulty === "MEDIUM"
                        ? "text-orange-500 "
                        : question.difficulty === "HARD"
                        ? "text-red-500 "
                        : "text-gray-300 text-gray-800"
                    }`}
                  >
                    {question.difficulty.toLowerCase()}
                  </div>
                  <div className="text-sm text-gray-900">{question.subject}</div>

                  {getTypeIcon(question.type)}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}