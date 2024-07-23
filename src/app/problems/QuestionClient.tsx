"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

type Question = {
  id: number;
  title: string;
  difficulty: string;
  subject: string;
  type: string;
  questionStatus: { status: string }[];
};

type Props = {
  questions: Question[];
  totalPages: number;
  currentPage: number;
};

export default function QuestionListClient({
  questions,
  totalPages,
  currentPage,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch] = useDebounce(search, 400);

  function getStatusIcon(status: string | undefined) {
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

  useEffect(() => {
    if (debouncedSearch !== searchParams.get("search")) {
      updateSearchParams("search", debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  function updateSearchParams(key: string, value: string) {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
    if (key !== "page") {
      newSearchParams.set("page", "1");
    }
    router.push(`?${newSearchParams.toString()}`);
  }

  return (
    <>
    <div className="mb-4 flex flex-col sm:flex-row flex-wrap gap-2">
      <input
        type="text"
        placeholder="Search questions..."
        className="px-4 py-2 border rounded-md w-full sm:w-auto"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="px-4 py-2 border rounded-md w-full sm:w-auto"
        value={searchParams.get("difficulty") || ""}
        onChange={(e) => updateSearchParams("difficulty", e.target.value)}
      >
        <option value="">All Difficulties</option>
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>
      <select
        className="px-4 py-2 border rounded-md w-full sm:w-auto"
        value={searchParams.get("subject") || ""}
        onChange={(e) => updateSearchParams("subject", e.target.value)}
      >
        <option value="">All Subjects</option>
        <option value="Physics">Physics</option>
        <option value="Maths">Maths</option>
        <option value="Chemistry">Chemistry</option>
      </select>
    </div>
  
    <ul className="divide-y divide-gray-200 bg-white shadow rounded-lg">
      {questions.map((question) => (
        <li
          key={question.id}
          className="py-4 px-6 hover:bg-gray-50 transition duration-300"
        >
          <Link href={`/problems/${question.id}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center space-x-4">
                {getStatusIcon(question.questionStatus[0]?.status)}
                <div className="text-gray-800 font-medium">
                  {question.title}
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-2 sm:mt-0">
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
      ))}
    </ul>
  
    <div className="mt-4 flex justify-center flex-wrap">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`mx-1 my-1 px-3 py-1 rounded ${
            page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => updateSearchParams("page", page.toString())}
        >
          {page}
        </button>
      ))}
    </div>
  </>
  
  );
}
