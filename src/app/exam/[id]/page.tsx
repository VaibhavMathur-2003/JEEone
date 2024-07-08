import ExamPaper from "./ExamPaper";
import { auth } from "@/auth";

export default async function ExamPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session) return <div>Log In First</div>;

  return (
    <div>
      <ExamPaper examPaperId={params.id} userId={session.user.id} />{" "}
    </div>
  );
}
