// ExamPaperClient.tsx
"use client";
import React, { useState } from "react";
import {
  ExamPaper as ExamPaperType,
  ExamPaperQuestion,
  ExamPaperQuestionOption,
} from "@prisma/client";
import ExamAnswerForm from "@/app/exam/[id]/ExamAnswerForm";
import { submitExamAnswers } from "./action";

interface Props {
  examPaper: ExamPaperType & {
    questions: (ExamPaperQuestion & { options: ExamPaperQuestionOption[] })[];
  };
  userId: string;
}

const ExamPaperClient: React.FC<Props> = ({ examPaper, userId }) => {
  const [answers, setAnswers] = useState<Record<string, string[] | string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAnswerChange = (
    questionId: string,
    answer: string[] | string
  ) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitExamAnswers(userId, examPaper.id, answers);
      if (result.success) {
        if (result.finalScore) setFinalScore(result.finalScore);
      } else {
        console.error("Error submitting exam:", result.error);
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
    setIsSubmitting(false);
  };

  const handleNext = () => {
    if (currentQuestionIndex < examPaper.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const currentQuestion = examPaper.questions[currentQuestionIndex];

  return (
    <div className=" bg-gradient-to-b overflow-hidden max-h-[90vh] from-gray-100 to-gray-200 py-8 px-4 sm:px-6 lg:px-8">
  <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
    <div className="flex flex-col lg:flex-row">
      <div className="flex-1 p-6 lg:p-8 overflow-y-scroll h-[85vh]">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          {examPaper.title}
        </h1>
        <p className="text-gray-600 mb-8">{examPaper.description}</p>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Question {currentQuestion.order}
          </h2>
          <ExamAnswerForm
            examPaperQuestion={currentQuestion}
            onAnswerChange={handleAnswerChange}
          />
        </div>
        
        <div className="flex justify-between mb-8">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
              currentQuestionIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === examPaper.questions.length - 1}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
              currentQuestionIndex === examPaper.questions.length - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            }`}
          >
            Next
          </button>
        </div>
        
        {currentQuestionIndex === examPaper.questions.length - 1 && (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg text-sm font-medium transition-colors duration-150 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {isSubmitting ? "Submitting..." : "Submit Exam"}
          </button>
        )}
        
        {finalScore !== null && (
          <p className="mt-6 text-xl font-bold text-green-600 text-center">
            Your final score: {finalScore.toFixed(2)}
          </p>
        )}
      </div>
      
      <div className="w-full lg:w-64 bg-gray-50 p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Questions
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {examPaper.questions.map((question, index) => (
            <button
              key={question.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-full py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                index === currentQuestionIndex
                  ? "bg-blue-500 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {question.order}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default ExamPaperClient;
