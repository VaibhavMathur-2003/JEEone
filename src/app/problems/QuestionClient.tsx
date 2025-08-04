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
  questionStatus: { status: string; userId: string | undefined }[];
};

type Props = {
  questions: Question[];
  totalPages: number;
  currentPage: number;
  id: string | undefined;
};

export default function QuestionListClient({
  questions,
  totalPages,
  currentPage,
  id,
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
      <div className="mb-6 flex max-w-4xl mx-auto flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-lg shadow-md">
        <input
          type="text"
          placeholder="Search questions..."
          className="px-4 py-2 border rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-4 py-2 border rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
          value={searchParams.get("difficulty") || ""}
          onChange={(e) => updateSearchParams("difficulty", e.target.value)}
        >
          <option value="">All Difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
        <select
          className="px-4 py-2 border rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
          value={searchParams.get("subject") || ""}
          onChange={(e) => updateSearchParams("subject", e.target.value)}
        >
          <option value="">All Subjects</option>
          <option value="Physics">Physics</option>
          <option value="Maths">Maths</option>
          <option value="Chemistry">Chemistry</option>
        </select>
      </div>
      {!questions ? (
        <div className="flex w-full items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full border-4 border-gray-900 border-t-gray-400 h-12 w-12" />
            <p className="text-gray-900">Loading...</p>
          </div>
        </div>
      ) : (
        <ul className="max-w-4xl mx-auto rounded-lg">
          {questions.map((question) => (
            <li
              key={question.id}
              className="p-3 hover:bg-blue-50 bg-blue-100 my-3 transition duration-300 hover:scale-105 rounded-lg"
            >
              <Link href={`/problems/${question.id}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-semibold">
                      {question.title}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                    <div
                      className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${
                        question.difficulty === "EASY"
                          ? "bg-green-100 text-green-600"
                          : question.difficulty === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {question.difficulty.toLowerCase()}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <span className="mr-1">📘</span>
                      {question.subject}
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 max-w-4xl mx-auto flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`px-4 py-2 rounded-lg transition duration-300 ${
              page === currentPage
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-200 text-gray-700"
            } hover:bg-blue-400 hover:text-white`}
            onClick={() => updateSearchParams("page", page.toString())}
          >
            {page}
          </button>
        ))}
      </div>
    </>
  );
}
