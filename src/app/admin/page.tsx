import Link from "next/link";

export default async function adminPage () {
  return (
    <div className="flex flex-wrap justify-center gap-4 w-full max-w-4xl mx-auto p-4">
    <Link
      href="/admin/createQuestion"
      className="flex-1 text-center py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
    >
      Create Question
    </Link>
    <Link
      href="/admin/createExamPaper"
      className="flex-1 text-center py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
    >
      Create Exam
    </Link>
    <Link
      href="/admin/editExamPaper"
      className="flex-1 text-center py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
    >
      Edit Exam
    </Link>
    <Link
      href="/admin/editQuestion"
      className="flex-1 text-center py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
    >
      Edit Question
    </Link>
  </div>
  
  );
}