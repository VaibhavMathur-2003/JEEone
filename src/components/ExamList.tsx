import { db } from "@/db/db";
import Link from "next/link";
import { Suspense } from "react";

interface ExamPaper {
  id: string;
  title: string;
  description: string|null;
  totalMarks: number;
  duration: number;
}

const ExamList = async (): Promise<JSX.Element> => {
  const examPapers: ExamPaper[] = await db.examPaper.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      totalMarks: true,
      duration: true,
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Exams</h1>
      <Suspense fallback={<LoadingSkeleton />}>
        <ExamGrid examPapers={examPapers} />
      </Suspense>
    </div>
  );
};



const ExamGrid = ({ examPapers }: { examPapers: ExamPaper[] }): JSX.Element => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {examPapers.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
    </div>
  );
};

const ExamCard = ({ exam }: { exam: ExamPaper }): JSX.Element => {
  return (
    <Link href={`/exam/${exam.id}`}>
      <div className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{exam.title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-2">{exam.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            <AwardIcon className="mr-1" />
            <span>{exam.totalMarks} marks</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="mr-1" />
            <span>{exam.duration} mins</span>
          </div>
        </div>
        <div className="mt-4 text-blue-600 flex items-center">
          <span className="mr-1">Start Exam</span>
          <ChevronRightIcon />
        </div>
      </div>
    </Link>
  );
};

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

const SearchIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const AwardIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }): JSX.Element => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default ExamList;