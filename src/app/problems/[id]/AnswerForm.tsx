"use client";

import React, { useState, useEffect } from "react";
import { Question, Option, QuestionStatus } from "@prisma/client";
import { submitAnswer } from "./actions";

interface Props {
  question: Question & { options: Option[]; questionStatus?: QuestionStatus[] };
  userId?: string;
}

const AnswerForm: React.FC<Props> = ({ question, userId }) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [textAnswer, setTextAnswer] = useState("");
  const [status, setStatus] = useState<string | undefined>(
    question.questionStatus?.[0]?.status || "UNATTEMPTED"
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setStatus(question.questionStatus?.[0]?.status || "UNATTEMPTED");
    setFeedback(null);
    setSelectedOptions([]);
    setTextAnswer("");
  }, [question.questionStatus, question.id]);

  const handleOptionChange = (optionId: number) => {
    if (question.type === "MULTIPLE_CHOICE_SINGLE") {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setFeedback("Error: User not authenticated");
      return;
    }

    setLoading(true); // Start loading
    const answer =
      question.type === "FILL_IN_THE_BLANK" ? textAnswer : selectedOptions;
    const result = await submitAnswer(question.id, userId, answer);
    setLoading(false); // End loading

    if (result.success) {
      if (result?.correctness !== undefined && result?.newStatus) {
        setFeedback(
          `Your answer was ${(result.correctness * 100).toFixed(2)}% correct.`
        );
        setStatus(result.newStatus);
      }
    } else {
      setFeedback(`Error: ${result.error}`);
    }
  };

  if (!userId) {
    return <p>Please log in to answer this question.</p>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {question.type === "FILL_IN_THE_BLANK" ? (
          <input
            type="text"
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            placeholder="Your answer"
            required
          />
        ) : (
          question.options.map((option) => (
            <div key={option.id}>
              <input
                type={
                  question.type === "MULTIPLE_CHOICE_SINGLE"
                    ? "radio"
                    : "checkbox"
                }
                id={`option-${option.id}`}
                name="answer"
                value={option.id}
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleOptionChange(option.id)}
              />
              <label htmlFor={`option-${option.id}`}>{option.text}</label>
            </div>
          ))
        )}
        <button type="submit" disabled={loading}>
          Submit Answer
        </button>
      </form>
      {loading && (
        <div className="flex justify-center items-center mt-4">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      {feedback && (
        <div
          className={`mt-4 p-3 rounded text-white font-bold text-center ${
            status === "SOLVED"
              ? "bg-green-500"
              : status === "ATTEMPTED"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        >
          {feedback}
        </div>
      )}
      {status && status !== "UNATTEMPTED"  && (
        <div className="mt-2 text-center font-bold">
          Status:{" "}
          <span
            className={`px-2 py-1 rounded text-white ${
              status === "SOLVED"
                ? "bg-green-500"
                : status === "ATTEMPTED"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
          >
            {status}
          </span>
        </div>
      )}
    </div>
  );
};

export default AnswerForm;
