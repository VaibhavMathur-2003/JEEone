import Link from "next/link";
import { db } from "@/db/db";
import { auth } from "@/auth";
import { Suspense } from "react";
import QuestionListClient from "./QuestionClient";

export default async function QuestionListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  const userId = session?.user?.id;

  const page = Number(searchParams.page) || 1;
  const pageSize = 7;
  const search = (searchParams.search as string | undefined)?.toLowerCase();
  const difficulty = searchParams.difficulty as string | undefined;
  const subject = searchParams.subject as string | undefined;

  const where = {
    ...(search && {
      OR: [{ title: { contains: search } }, { subject: { contains: search } }],
    }),
    ...(difficulty && { difficulty }),
    ...(subject && { subject }),
  };

  const totalQuestions = await db.question.count({ where });
  const totalPages = Math.ceil(totalQuestions / pageSize);

  const questions = await db.question.findMany({
    where,
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
          userId: true
        },
      },
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { id: "asc" },
  });

  return (
    <div className="max-w-6xl min-h-screen  rounded-t-[50px] mt-5 mx-auto py-8 px-4">
     

      <h1 className="text-2xl font-semibold mb-6 text-center">Question List</h1>
      <Suspense fallback={<LoadingSkeleton />}>
        <QuestionListClient
          questions={questions}
          totalPages={totalPages}
          currentPage={page}
          id={userId}
        />
      </Suspense>
    </div>
  );
}

const LoadingSkeleton = (): JSX.Element => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    ))}
  </div>
);