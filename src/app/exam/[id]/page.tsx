import { useRouter } from 'next/router';
import ExamPaper from '@/components/ExamPaper';
import { auth } from '@/auth';


export default async function ExamPage({
    params,
  }: {
    params: { id: string };
  }) {
 const session = await auth();
 
if(!session) return <div>Log In First</div>

  return (
    <div>
      <h1>Exam</h1>
      <ExamPaper examId={params.id} userId={session.user.id} />
    </div>
  );
}