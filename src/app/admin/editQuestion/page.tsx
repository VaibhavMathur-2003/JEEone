"use client";

import { useState } from "react";
import { deleteQuestion, editQuestion, getQuestion } from "./action";
import { redirect } from "next/navigation";

interface Option {
  id: number; 
  text: string;
  isCorrect: boolean;
  questionId: number;
}

interface Question {
  id: number;
  title: string;
  text: string;
  difficulty: string;
  subject: string;
  explanation: string;
  type: string;
  correctPercentage: number;
  options: Option[];
  questionStatus?: Array<{
    id: string;
    userId: string;
    questionId: number;
    status: string;
  }>;
  attempts?: Array<{
    id: string;
    createdAt: Date;
    userId: string;
    questionId: number;
    textResponse: string | null;
    correctness: number;
  }>;
}

export default function EditQuestion() {
  const [questionId, setQuestionId] = useState<number | "">("");
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestion = async () => {
    if (!questionId) {
      setError("Please enter a question ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getQuestion(Number(questionId));
      setQuestion(data as unknown as Question);
    } catch (err) {
      setError("Error fetching question");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "correctPercentage") {
      setQuestion((prev) =>
        prev ? { ...prev, [name]: parseFloat(value) } : null
      );
    } else {
      setQuestion((prev) => (prev ? { ...prev, [name]: value } : null));
    }
  };

  const handleOptionChange = (
    index: number,
    field: "text" | "isCorrect",
    value: string | boolean
  ) => {
    setQuestion((prev) => {
      if (!prev) return null;
      const newOptions = [...prev.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      return { ...prev, options: newOptions };
    });
  };

  const addOption = () => {
    setQuestion(prev => {
      if (!prev) return null;
      const newOption: Option = {
        id: Math.min(-1, ...prev.options.map(o => o.id)) - 1,
        text: '',
        isCorrect: false,
        questionId: prev.id
      };
      return { ...prev, options: [...prev.options, newOption] };
    });
  };

  const saveQuestion = async () => {
    if (!question) return;
    try {
      await editQuestion(question);
      alert("Question updated successfully");
      redirect("/problems");
    } catch (err) {
      setError("Error updating question");
      console.error(err);
    }
  };

  const handleDeleteQuestion = async () => {
    if (!questionId) return;
    try {
      await deleteQuestion(Number(questionId));
      alert("Question deleted successfully");
      redirect("/questions");
    } catch (err) {
      setError("Error deleting question");
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Question</h1>

      <div className="mb-4">
        <input
          type="number"
          value={questionId}
          onChange={(e) => setQuestionId(Number(e.target.value))}
          placeholder="Enter Question ID"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={fetchQuestion}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Fetch Question
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {question && (
        <>
          <div className="mb-4">
            <label className="block mb-2">Title:</label>
            <input
              type="text"
              name="title"
              value={question.title}
              onChange={handleQuestionChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Text:</label>
            <textarea
              name="text"
              value={question.text}
              onChange={handleQuestionChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Difficulty:</label>
            <select
              name="difficulty"
              value={question.difficulty}
              onChange={handleQuestionChange}
              className="w-full p-2 border rounded"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Subject:</label>
            <input
              type="text"
              name="subject"
              value={question.subject}
              onChange={handleQuestionChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Explanation:</label>
            <textarea
              name="explanation"
              value={question.explanation}
              onChange={handleQuestionChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Type:</label>
            <select
              name="type"
              value={question.type}
              onChange={handleQuestionChange}
              className="w-full p-2 border rounded"
            >
              <option value="MULTIPLE_CHOICE_SINGLE">
                Multiple Choice (Single)
              </option>
              <option value="MULTIPLE_CHOICE_MULTIPLE">
                Multiple Choice (Multiple)
              </option>
              <option value="FILL_IN_THE_BLANK">Fill in the Blank</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Correct Percentage:</label>
            <input
              type="number"
              name="correctPercentage"
              value={question.correctPercentage}
              onChange={handleQuestionChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <h4 className="text-md font-semibold mt-4 mb-2">Options</h4>
          {question.options.map((option, index) => (
            <div key={option.id} className="mb-2 flex items-center">
              <input
                type="text"
                value={option.text}
                onChange={(e) =>
                  handleOptionChange(index, "text", e.target.value)
                }
                className="flex-grow p-2 border rounded mr-2"
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={option.isCorrect}
                  onChange={(e) =>
                    handleOptionChange(index, "isCorrect", e.target.checked)
                  }
                  className="mr-1"
                />
                Correct
              </label>
            </div>
          ))}
          <button
            onClick={addOption}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Option
          </button>

          <div className="mt-6">
            <button
              onClick={saveQuestion}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
            >
              Save Question
            </button>
            <button
              onClick={handleDeleteQuestion}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete Question
            </button>
          </div>
        </>
      )}
    </div>
  );
}
