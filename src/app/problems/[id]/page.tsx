import { auth } from '@/auth';
import { db } from '@/db/db';
import AnswerForm from './AnswerForm';
import dynamic from 'next/dynamic'
 
// Server Component:
const DrawingCanvas = dynamic(() => import('./DrawingCanvas'))


export default async function QuestionPage({ params }: { params: { id: string } }) {
  const question = await db.question.findUnique({
    where: { id: parseInt(params.id) },
    include: { options: true },
  });

  if (!question) {
    return <div>Question not found</div>;
  }

  const session = await auth();
  const userId = session?.user.id;

  return (
    <div className="flex h-5/6">
      {/* Left half: Question details */}
      <div className="w-1/2 p-6 overflow-y-auto flex justify-between flex-col">
      <div>
        <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
        <div className='flex justify-between w-1/2'>
        <p className="mb-2 text-xs"><span className=""></span> {question.difficulty}</p>
        <p className="mb-2 text-xs"><span className=""></span> {question.subject}</p>
        <p className="mb-2 text-xs"><span className=""></span> {question.type}</p>
        <p className="mb-4 text-xs"><span className=""></span> {question.status}</p>
        </div>
        <p className="mb-4">{question.text}</p>
        </div>
      
        <AnswerForm question={question} userId={userId} />
      </div>

      {/* Right half: Drawing canvas */}
      <div className="w-1/2 bg-gray-100 p-6">
        <h2 className="text-xl font-bold mb-4">Rough Work</h2>
        <DrawingCanvas />
      </div>
    </div>
  );
}