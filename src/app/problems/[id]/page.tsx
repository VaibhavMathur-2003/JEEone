import { Suspense } from 'react';
import QuestionPage from './QuestionDetails';
import DrawingCanvas from './DrawingCanvas';

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className='flex'>
      
      <Suspense fallback={<div>Loading...</div>}>
        <QuestionPage params={params} />
      </Suspense>
      <div className="w-1/2 bg-gray-100 p-6">
        <h2 className="text-xl font-bold mb-4">Rough Work</h2>
        <DrawingCanvas />
      </div>
    </div>
  );
}