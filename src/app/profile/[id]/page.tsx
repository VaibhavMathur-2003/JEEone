import { db } from "@/db/db";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page({
    params,
  }: {
    params: { id: string };
  }) {
    const user = await db.user.findUnique({
        where: { id: params.id },
        include: { attempts: true },
      });
    
    if (!user) {
        return <div>User not found</div>;
    }

    const questionAttemptsMap = new Map();

    user.attempts.forEach(attempt => {
        const existingAttempt = questionAttemptsMap.get(attempt.questionId);
        if (!existingAttempt || attempt.correctness > existingAttempt.correctness) {
            questionAttemptsMap.set(attempt.questionId, attempt);
        }
    });

    const uniqueAttempts = Array.from(questionAttemptsMap.values());

    return (
        <div>
            <ul>
              <Suspense fallback={<div>Loading...</div>}>
                Hi {user.username}!
                Questions solved: {uniqueAttempts.length}
                {uniqueAttempts.map((attempt) => (
                  <Link href={`/problems/${attempt.questionId}`}>
                    <li key={attempt.id}>
                        Question ID: {attempt.questionId}, Correctness: {attempt.correctness}
                    </li>
                    </Link>
                ))}
                </Suspense>
            </ul>
        </div>
    );
}
