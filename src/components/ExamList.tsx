import { auth } from "@/auth";
import { db } from "@/db/db";
import Link from "next/link";

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
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {examPapers.map((exams) => (
        <Link href={`/exam/${exams.id}`} key={exams.id}>
          <div className="p-4 mb-4 flex justify-between bg-indigo-100 rounded-lg shadow-sm hover:bg-indigo-200 transition duration-200">
            <div>
              <p className="text-xl font-semibold text-gray-800">
                {exams.title}
              </p>
            </div>
            <div className="flex">
              <p className="text-lg mx-3 text-gray-600">
                Total Marks: {exams.totalMarks}
              </p>
              <p className="text-lg mx-3 text-gray-600">
                Duration: {exams.duration} mins
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ExamList;
