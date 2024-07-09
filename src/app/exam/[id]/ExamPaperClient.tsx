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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-6">
      <div className="flex w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {examPaper.title}
          </h1>
          <p className="text-gray-600 mb-6">{examPaper.description}</p>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">
              Question {currentQuestion.order}
            </h2>
            {/* Placeholder for ExamAnswerForm component */}
            <ExamAnswerForm
              examPaperQuestion={currentQuestion}
              onAnswerChange={handleAnswerChange}
            />
          </div>
          <div className="flex justify-between mb-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded-lg ${
                currentQuestionIndex === 0
                  ? "bg-gray-300"
                  : "bg-blue-500 text-white"
              }`}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === examPaper.questions.length - 1}
              className={`px-4 py-2 rounded-lg ${
                currentQuestionIndex === examPaper.questions.length - 1
                  ? "bg-gray-300"
                  : "bg-blue-500 text-white"
              }`}
            >
              Next
            </button>
          </div>
          {currentQuestionIndex === examPaper.questions.length - 1 && (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Exam"}
            </button>
          )}
          {finalScore !== null && (
            <p className="mt-4 text-lg font-bold text-green-600">
              Your final score: {finalScore.toFixed(2)}
            </p>
          )}
        </div>
        <div className="w-48 ml-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Questions
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {examPaper.questions.map((question, index) => (
              <button
                key={question.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`block w-full py-2 rounded-lg text-center ${
                  index === currentQuestionIndex
                    ? "bg-blue-200"
                    : "bg-white border"
                }`}
              >
                {question.order}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPaperClient;
