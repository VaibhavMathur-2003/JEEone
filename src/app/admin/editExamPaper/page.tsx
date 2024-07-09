"use client";

import { useState } from 'react';
import { editExamPaper, getExamPaper } from './actions';

interface ExamPaperQuestion {
  id: string;
  title: string;
  text: string;
  subject: string;
  type: string;
  positiveMarks: number;
  negativeMarks: number;
  order: number;
  options: { id: string; text: string; isCorrect: boolean }[];
}

interface ExamPaper {
  id: string;
  title: string;
  description: string;
  totalMarks: number;
  duration: number;
  questions: ExamPaperQuestion[];
}


export default function EditExamPaper() {
  const [examPaperId, setExamPaperId] = useState('');
  const [examPaper, setExamPaper] = useState<ExamPaper | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExamPaper = async () => {
    if (!examPaperId.trim()) {
      setError('Please enter an exam paper ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getExamPaper(examPaperId);
      setExamPaper(data);
    } catch (err) {
      setError('Error fetching exam paper');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExamPaperChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExamPaper(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleQuestionChange = (index: number, field: keyof ExamPaperQuestion, value: any) => {
    setExamPaper(prev => {
      if (!prev) return null;
      const newQuestions = [...prev.questions];
      newQuestions[index] = { ...newQuestions[index], [field]: value };
      return { ...prev, questions: newQuestions };
    });
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    setExamPaper(prev => {
      if (!prev) return null;
      const newQuestions = [...prev.questions];
      const newOptions = [...newQuestions[questionIndex].options];
      newOptions[optionIndex] = { ...newOptions[optionIndex], [field]: value };
      newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions };
      return { ...prev, questions: newQuestions };
    });
  };

  const addQuestion = () => {
    setExamPaper(prev => {
      if (!prev) return null;
      const newQuestion: ExamPaperQuestion = {
        id: `temp_${Date.now()}`, // Temporary ID
        title: '',
        text: '',
        subject: '',
        type: 'MULTIPLE_CHOICE_SINGLE',
        positiveMarks: 1,
        negativeMarks: 0,
        order: prev.questions.length + 1,
        options: []
      };
      return { ...prev, questions: [...prev.questions, newQuestion] };
    });
  };

  const addOption = (questionIndex: number) => {
    setExamPaper(prev => {
      if (!prev) return null;
      const newQuestions = [...prev.questions];
      const newOptions = [...newQuestions[questionIndex].options, { id: `temp_${Date.now()}`, text: '', isCorrect: false }];
      newQuestions[questionIndex] = { ...newQuestions[questionIndex], options: newOptions };
      return { ...prev, questions: newQuestions };
    });
  };

  const saveExamPaper = async () => {
    if (!examPaper) return;
    try {
      await editExamPaper(examPaper);
      alert('Exam paper updated successfully');
    } catch (err) {
      setError('Error updating exam paper');
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Exam Paper</h1>
      
      <div className="mb-4">
        <input
          type="text"
          value={examPaperId}
          onChange={(e) => setExamPaperId(e.target.value)}
          placeholder="Enter Exam Paper ID"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={fetchExamPaper}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Fetch Exam Paper
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {examPaper && (
        <>
          <div className="mb-4">
            <label className="block mb-2">Title:</label>
            <input
              type="text"
              name="title"
              value={examPaper.title}
              onChange={handleExamPaperChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Description:</label>
            <textarea
              name="description"
              value={examPaper.description}
              onChange={handleExamPaperChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Total Marks:</label>
            <input
              type="number"
              name="totalMarks"
              value={examPaper.totalMarks}
              onChange={handleExamPaperChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Duration (minutes):</label>
            <input
              type="number"
              name="duration"
              value={examPaper.duration}
              onChange={handleExamPaperChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <h2 className="text-xl font-bold mt-6 mb-4">Questions</h2>
          {examPaper.questions.map((question, qIndex) => (
            <div key={question.id} className="mb-6 p-4 border rounded">
              <h3 className="text-lg font-semibold mb-2">Question {qIndex + 1}</h3>
              <div className="mb-2">
                <label className="block mb-1">Title:</label>
                <input
                  type="text"
                  value={question.title}
                  onChange={(e) => handleQuestionChange(qIndex, 'title', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Text:</label>
                <textarea
                  value={question.text}
                  onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Subject:</label>
                <input
                  type="text"
                  value={question.subject}
                  onChange={(e) => handleQuestionChange(qIndex, 'subject', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Type:</label>
                <select
                  value={question.type}
                  onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="MULTIPLE_CHOICE_SINGLE">Multiple Choice (Single)</option>
                  <option value="MULTIPLE_CHOICE_MULTIPLE">Multiple Choice (Multiple)</option>
                  <option value="FILL_IN_THE_BLANK">Fill in the Blank</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="block mb-1">Positive Marks:</label>
                <input
                  type="number"
                  value={question.positiveMarks}
                  onChange={(e) => handleQuestionChange(qIndex, 'positiveMarks', parseFloat(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-2">
                <label className="block mb-1">Negative Marks:</label>
                <input
                  type="number"
                  value={question.negativeMarks}
                  onChange={(e) => handleQuestionChange(qIndex, 'negativeMarks', parseFloat(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <h4 className="text-md font-semibold mt-4 mb-2">Options</h4>
              {question.options.map((option, oIndex) => (
                <div key={option.id} className="mb-2 flex items-center">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, 'text', e.target.value)}
                    className="flex-grow p-2 border rounded mr-2"
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, 'isCorrect', e.target.checked)}
                      className="mr-1"
                    />
                    Correct
                  </label>
                </div>
              ))}
              <button
                onClick={() => addOption(qIndex)}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Option
              </button>
            </div>
          ))}
          <button
            onClick={addQuestion}
            className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Question
          </button>
          <div>
            <button
              onClick={saveExamPaper}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Exam Paper
            </button>
          </div>
        </>
      )}
    </div>
  );
}