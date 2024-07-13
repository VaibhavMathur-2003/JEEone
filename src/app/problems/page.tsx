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
  const pageSize = 2; 
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
        },
      },
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { id: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold mb-6 text-center">Question List</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <QuestionListClient
          questions={questions}
          totalPages={totalPages}
          currentPage={page}
        />
      </Suspense>
    </div>
  );
}
