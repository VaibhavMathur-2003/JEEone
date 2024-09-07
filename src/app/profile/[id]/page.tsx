import { signOut } from "@/auth";
import { db } from "@/db/db";
import Link from "next/link";
import { Suspense } from "react";
import { User, ChevronRight, LogOut, Award, FileText } from 'lucide-react';

export default async function Page({ params }: { params: { id: string } }) {
  const user = await db.user.findUnique({
    where: { id: params.id },
    include: { attempts: true, examAttempts: true },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl font-bold text-gray-800">User not found</div>
      </div>
    );
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <Suspense fallback={<div className="text-center text-2xl font-bold text-gray-800">Loading...</div>}>
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="bg-indigo-600 text-white p-3">
            <div className="flex items-center space-x-4">
              <User size={32} />
              <h1 className="text-xl font-bold">{user.username} Dashboard</h1>
            </div>
          </div>
          
          <div className="p-3 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatsCard
                icon={<Award className="text-yellow-500" size={24} />}
                title="Questions Solved"
                value={uniqueAttempts.length}
              />
              <StatsCard
                icon={<FileText className="text-green-500" size={24} />}
                title="Exams Attempted"
                value={ExamuniqueAttempts.length}
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">Recent Questions</h2>
              <ul className="space-y-3">
                {uniqueAttempts.slice(0, 5).map((attempt) => (
                  <AttemptCard
                    key={attempt.id}
                    href={`/problems/${attempt.questionId}`}
                    title={`Question ${attempt.questionId}`}
                    score={attempt.correctness}
                    bgColor="bg-blue-50"
                    hoverColor="hover:bg-blue-100"
                  />
                ))}
              </ul>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800">Recent Exams</h2>
              <ul className="space-y-3">
                {ExamuniqueAttempts.slice(0, 5).map((attempt) => (
                  <AttemptCard
                    key={attempt.id}
                    href={`/exam/${attempt.examPaperId}`}
                    title={`Exam ${attempt.examPaperId}`}
                    score={attempt.score}
                    bgColor="bg-green-50"
                    hoverColor="hover:bg-green-100"
                  />
                ))}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 p-6">
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/signin" });
              }}
            >
              <button
                type="submit"
                className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              >
                <LogOut size={20} className="mr-2" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </Suspense>
    </div>
  );
}

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
    {icon}
    <div>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-3xl font-bold text-indigo-600">{value}</p>
    </div>
  </div>
);

interface AttemptCardProps {
  href: string;
  title: string;
  score: number;
  bgColor: string;
  hoverColor: string;
}

const AttemptCard: React.FC<AttemptCardProps> = ({ href, title, score, bgColor, hoverColor }) => (
  <Link href={href}>
    <li className={`flex justify-between items-center ${bgColor} p-4 rounded-lg shadow-sm ${hoverColor} transition duration-200`}>
      <span className="font-medium text-gray-800">{title}</span>
      <div className="flex items-center">
        <span className="font-semibold text-indigo-600 mr-2">Score: {score}</span>
        <ChevronRight size={20} className="text-gray-400" />
      </div>
    </li>
  </Link>
);