import { auth } from "@/auth";
import { db } from "@/db/db";
import AnswerForm from "./AnswerForm";

export default async function QuestionPage({
  params,
}: {
  params: { id: string };
}) {
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
    <div className="w-1/2 p-8 bg-gray-50 shadow-xl h-[90vh]  rounded-lg overflow-y-scroll flex flex-col justify-between space-y-8">
    <div>
      
      <div className="flex flex-col justify-between mb-6">
      <h3 className="text-2xl font-bold text-blue-600">{question.title}</h3>
        <div className="text-sm font-medium flex justify-between items-center w-full m-3 text-gray-600">
          <p className="flex items-center">
            <span
              className={`px-2 py-1 rounded-full ${
                question.difficulty === 'EASY'
                  ? 'bg-green-500'
                  : question.difficulty === 'MEDIUM'
                  ? 'bg-yellow-500'
                  : question.difficulty === 'HARD'
                  ? 'bg-red-500'
                  : 'bg-gray-500'
              }`}
            >
              {question.difficulty}
            </span>
          </p>
          <p className="flex items-center">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{question.subject}</span>
          </p>
          <p className="flex items-center">
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{question.type}</span>
          </p>
        </div>
      </div>
      <p className="text-base text-gray-700 leading-relaxed">{question.text}</p>
    </div>
  
    <AnswerForm question={question} userId={userId} />
  </div>
  
  );
}
