'use client';

import { useState } from 'react';
import { ExamPaper, ExamPaperQuestion, ExamPaperQuestionOption } from '@/types/examTypes';

type ExamPaperFormProps = {
  addExamPaper: (examPaper: ExamPaper) => Promise<{ success: boolean; examPaper?: any; error?: string }>;
};

export default function ExamPaperForm({ addExamPaper }: ExamPaperFormProps) {
  const [examPaper, setExamPaper] = useState<ExamPaper>({
    title: '',
    description: '',
    totalMarks: 0,
    duration: 60,
    questions: [],
  });
  const [message, setMessage] = useState<string>('');

  const importQuestionsFromJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          if (Array.isArray(json)) {
            setExamPaper(prevState => ({
              ...prevState,
              questions: json as ExamPaperQuestion[]
            }));
          } else {
            setMessage('Invalid JSON format. Expected an array of questions.');
          }
        } catch (error) {
          setMessage('Error parsing JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const addQuestion = () => {
    setExamPaper({
      ...examPaper,
      questions: [
        ...examPaper.questions,
        {
          title: '',
          text: '',
          subject: '',
          type: 'MULTIPLE_CHOICE_SINGLE',
          positiveMarks: 1,
          negativeMarks: 0,
          options: [],
        },
      ],
    });
  };

  const updateQuestion = (index: number, question: Partial<ExamPaperQuestion>) => {
    const newQuestions = [...examPaper.questions];
    newQuestions[index] = { ...newQuestions[index], ...question };
    setExamPaper({ ...examPaper, questions: newQuestions });
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...examPaper.questions];
    newQuestions[questionIndex].options.push({ text: '', isCorrect: false });
    setExamPaper({ ...examPaper, questions: newQuestions });
  };

  const updateOption = (questionIndex: number, optionIndex: number, option: Partial<ExamPaperQuestionOption>) => {
    const newQuestions = [...examPaper.questions];
    newQuestions[questionIndex].options[optionIndex] = {
      ...newQuestions[questionIndex].options[optionIndex],
      ...option,
    };
    setExamPaper({ ...examPaper, questions: newQuestions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addExamPaper(examPaper);
    if (result.success) {
      setMessage('Exam paper added successfully!');
      // Optionally reset the form or redirect
    } else {
      setMessage(`Failed to add exam paper: ${result.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
      <label htmlFor="jsonFile" className="block">Import Questions from JSON:</label>
      <input
        type="file"
        id="jsonFile"
        accept=".json"
        onChange={importQuestionsFromJSON}
        className="w-full border p-2"
      />
    </div>

      <div>
        <label htmlFor="title" className="block">Title:</label>
        <input
          type="text"
          id="title"
          value={examPaper.title}
          onChange={(e) => setExamPaper({ ...examPaper, title: e.target.value })}
          required
          className="w-full border p-2"
        />
      </div>
      <div>
        <label htmlFor="description" className="block">Description:</label>
        <textarea
          id="description"
          value={examPaper.description}
          onChange={(e) => setExamPaper({ ...examPaper, description: e.target.value })}
          className="w-full border p-2"
        ></textarea>
      </div>
      <div>
        <label htmlFor="totalMarks" className="block">Total Marks:</label>
        <input
          type="number"
          id="totalMarks"
          value={examPaper.totalMarks}
          onChange={(e) => setExamPaper({ ...examPaper, totalMarks: parseFloat(e.target.value) })}
          required
          className="w-full border p-2"
        />
      </div>
      <div>
        <label htmlFor="duration" className="block">Duration (minutes):</label>
        <input
          type="number"
          id="duration"
          value={examPaper.duration}
          onChange={(e) => setExamPaper({ ...examPaper, duration: parseInt(e.target.value) })}
          required
          className="w-full border p-2"
        />
      </div>
      <h2 className="text-xl font-bold">Questions</h2>
      {examPaper.questions.map((question, qIndex) => (
        <div key={qIndex} className="border p-4 mb-4">
          <h3 className="text-lg font-bold">Question {qIndex + 1}</h3>
          <div>
            <label htmlFor={`question-${qIndex}-title`} className="block">Title:</label>
            <input
              type="text"
              id={`question-${qIndex}-title`}
              value={question.title}
              onChange={(e) => updateQuestion(qIndex, { title: e.target.value })}
              required
              className="w-full border p-2"
            />
          </div>
          <div>
            <label htmlFor={`question-${qIndex}-text`} className="block">Text:</label>
            <textarea
              id={`question-${qIndex}-text`}
              value={question.text}
              onChange={(e) => updateQuestion(qIndex, { text: e.target.value })}
              required
              className="w-full border p-2"
            ></textarea>
          </div>
          <div>
            <label htmlFor={`question-${qIndex}-subject`} className="block">Subject:</label>
            <input
              type="text"
              id={`question-${qIndex}-subject`}
              value={question.subject}
              onChange={(e) => updateQuestion(qIndex, { subject: e.target.value })}
              required
              className="w-full border p-2"
            />
          </div>
          <div>
            <label htmlFor={`question-${qIndex}-type`} className="block">Type:</label>
            <select
              id={`question-${qIndex}-type`}
              value={question.type}
              onChange={(e) => updateQuestion(qIndex, { type: e.target.value })}
              required
              className="w-full border p-2"
            >
              <option value="MULTIPLE_CHOICE_SINGLE">Multiple Choice (Single)</option>
              <option value="MULTIPLE_CHOICE_MULTIPLE">Multiple Choice (Multiple)</option>
              <option value="FILL_IN_THE_BLANK">Fill in the Blank</option>
            </select>
          </div>
          <div>
            <label htmlFor={`question-${qIndex}-positiveMarks`} className="block">Positive Marks:</label>
            <input
              type="number"
              id={`question-${qIndex}-positiveMarks`}
              value={question.positiveMarks}
              onChange={(e) => updateQuestion(qIndex, { positiveMarks: parseFloat(e.target.value) })}
              required
              className="w-full border p-2"
            />
          </div>
          <div>
            <label htmlFor={`question-${qIndex}-negativeMarks`} className="block">Negative Marks:</label>
            <input
              type="number"
              id={`question-${qIndex}-negativeMarks`}
              value={question.negativeMarks}
              onChange={(e) => updateQuestion(qIndex, { negativeMarks: parseFloat(e.target.value) })}
              required
              className="w-full border p-2"
            />
          </div>
          <h4 className="text-lg font-bold mt-4">Options</h4>
          {question.options.map((option, oIndex) => (
            <div key={oIndex} className="ml-4 mb-2">
              <input
                type="text"
                value={option.text}
                onChange={(e) => updateOption(qIndex, oIndex, { text: e.target.value })}
                placeholder="Option text"
                required
                className="border p-2 mr-2"
              />
              <label>
                <input
                  type="checkbox"
                  checked={option.isCorrect}
                  onChange={(e) => updateOption(qIndex, oIndex, { isCorrect: e.target.checked })}
                  className="mr-1"
                />
                Correct
              </label>
            </div>
          ))}
          <button type="button" onClick={() => addOption(qIndex)} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Option
          </button>
        </div>
      ))}
      <button type="button" onClick={addQuestion} className="bg-green-500 text-white px-4 py-2 rounded">
        Add Question
      </button>
      <div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit Exam Paper
        </button>
      </div>
    </form>
  );
}