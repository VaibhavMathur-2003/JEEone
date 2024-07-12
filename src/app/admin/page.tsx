import Link from "next/link";

export default async () => {
  return (
    <div className="flex justify-between w-1/2 mx-auto">
      <Link href="/admin/createQuestion">Create Question</Link>
      <Link href="/admin/createExamPaper">Create Exam</Link>
      <Link href="/admin/editExamPaper">Edit Exam</Link>
    </div>
  );
}