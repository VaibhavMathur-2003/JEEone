"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  ExamPaper as ExamPaperType,
  ExamPaperQuestion,
  ExamPaperQuestionOption,
} from "@prisma/client";
import ExamAnswerForm from "@/app/exam/[id]/ExamAnswerForm";
import { submitExamAnswers } from "./action";
import { redirect } from "next/navigation";

interface Props {
  examPaper: ExamPaperType & {
    questions: (ExamPaperQuestion & { options: ExamPaperQuestionOption[] })[];
  };
  userId: string;
  duration: number;
}

const ExamPaperClient: React.FC<Props> = ({ examPaper, userId, duration }) => {
  const [answers, setAnswers] = useState<Record<string, string[] | string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenExitCount, setFullScreenExitCount] = useState(0);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  const handleAnswerChange = (
    questionId: string,
    answer: string[] | string
  ) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
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
  const enterFullScreen = useCallback(() => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  }, []);

  const handleFullScreenChange = useCallback(() => {
    setIsFullScreen(!!document.fullscreenElement);
    if (!document.fullscreenElement) {
      setFullScreenExitCount((prevCount) => prevCount + 1);
    }
  }, []);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      setTabSwitchCount((prevCount) => prevCount + 1);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [handleFullScreenChange, handleVisibilityChange]);

  useEffect(() => {
    if (fullScreenExitCount > 2 || tabSwitchCount > 2) {
      handleSubmit();
      redirect("/exam");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullScreenExitCount, tabSwitchCount]);

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
    <div className="bg-gradient-to-b overflow-hidden max-h-[90vh] from-gray-100 to-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      {!isFullScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center">
            <p className="text-xl font-bold mb-4">
              Please enter full-screen mode to start the exam.
            </p>
            <button
              onClick={enterFullScreen}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg"
            >
              Enter Full Screen
            </button>
          </div>
        </div>
      )}
      <div className="mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 flex flex-col justify-between p-6 lg:p-8 overflow-y-scroll h-[85vh]">
            <div>
              <div className="flex flex-col sm:flex-row justify-between">
                <p className="text-xl font-bold text-red-600 mb-4">
                  Time Remaining: {formatTime(timeRemaining)}
                </p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                  <p className="text-lg font-semibold text-yellow-600">
                    Full-screen exits: {fullScreenExitCount}/3
                  </p>
                  <p className="text-lg font-semibold text-yellow-600">
                    Tab switches: {tabSwitchCount}/3
                  </p>
                </div>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
                {examPaper.title}
              </h1>
              <p className="text-gray-600 mb-8">{examPaper.description}</p>
              <p className="mb-4">{currentQuestion.text}</p>
              <ExamAnswerForm
                examPaperQuestion={currentQuestion}
                onAnswerChange={handleAnswerChange}
              />
            </div>
            <div className="mb-8">
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
                  disabled={
                    currentQuestionIndex === examPaper.questions.length - 1
                  }
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
          </div>

          <div className="w-full lg:w-64 bg-gray-50 p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Questions
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
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
