import { db } from "@/db/db";
import Link from "next/link";
import { Suspense } from "react";

const ExamList = async () => {
  const examPapers = await db.examPaper.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      totalMarks: true,
      duration: true,
    },
  });
  const colors = ["bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-red-100"];
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Suspense fallback={<div>Loading...</div>}>
        {examPapers.map((exam, index) => (
          <Link href={`/exam/${exam.id}`} key={exam.id}>
            <div
              className={`p-4 mb-4 rounded-lg shadow-sm hover:shadow-md transition duration-200 cursor-pointer ${
                colors[index % colors.length]
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-gray-800">
                    {exam.title}
                  </h2>
                </div>
                <div className="flex items-center">
                  <p className="text-base text-blue-600 mr-4">
                    Total Marks: {exam.totalMarks}
                  </p>
                  <p className="text-base text-green-600">
                    Duration: {exam.duration} mins
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </Suspense>
    </div>
  );
};

export default ExamList;
