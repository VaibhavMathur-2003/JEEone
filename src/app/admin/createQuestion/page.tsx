'use client';

import React, { useState, useEffect } from 'react';
import { createQuestion } from '@/action/question';

type QuestionType = 'MULTIPLE_CHOICE_SINGLE' | 'MULTIPLE_CHOICE_MULTIPLE' | 'FILL_IN_THE_BLANK';
type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface Option {
  text: string;
  isCorrect: boolean;
}

const QuestionForm: React.FC = () => {
  const [options, setOptions] = useState<Option[]>([]);
  const [newOption, setNewOption] = useState<Option>({ text: '', isCorrect: false });
  const [questionType, setQuestionType] = useState<QuestionType>('MULTIPLE_CHOICE_SINGLE');

  useEffect(() => {
    if (questionType === 'FILL_IN_THE_BLANK') {
      setOptions([]);
      setNewOption({ text: '', isCorrect: true });
    } else {
      setNewOption({ text: '', isCorrect: false });
    }
  }, [questionType]);

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setNewOption({ ...newOption, [name]: name === 'isCorrect' ? checked : value });
  };

  const addOption = () => {
    if (questionType === 'FILL_IN_THE_BLANK') {
      setOptions([{ ...newOption, isCorrect: true }]);
    } else {
      setOptions([...options, newOption]);
    }
    setNewOption({ text: '', isCorrect: false });
  };

  

  return (
    <form action={createQuestion} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
    <input
      type="text"
      name="title"
      placeholder="Title"
      required
      className="w-full px-4 py-2 mb-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
    />
    <input
      type="text"
      name="text"
      placeholder="Question text"
      required
      className="w-full px-4 py-2 mb-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
    />
    <select
      name="difficulty"
      required
      className="w-full px-4 py-2 mb-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
    >
      <option value="EASY">Easy</option>
      <option value="MEDIUM">Medium</option>
      <option value="HARD">Hard</option>
    </select>
    <input
      type="text"
      name="subject"
      placeholder="Subject"
      required
      className="w-full px-4 py-2 mb-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
    />
    <textarea
      name="explanation"
      placeholder="Explanation"
      required
      className="w-full px-4 py-2 mb-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
    ></textarea>
    <select
      name="type"
      value={questionType}
      onChange={(e) => setQuestionType(e.target.value as QuestionType)}
      required
      className="w-full px-4 py-2 mb-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
    >
      <option value="MULTIPLE_CHOICE_SINGLE">Single Option Correct</option>
      <option value="MULTIPLE_CHOICE_MULTIPLE">Multiple Options Correct</option>
      <option value="FILL_IN_THE_BLANK">Fill in the Blank</option>
    </select>
  
    <div className="mb-4">
      <input
        type="text"
        value={newOption.text}
        onChange={handleOptionChange}
        name="text"
        placeholder={questionType === 'FILL_IN_THE_BLANK' ? "Correct answer" : "Option text"}
        className="w-full px-4 py-2 mb-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
      />
      {questionType !== 'FILL_IN_THE_BLANK' && (
        <label className="flex items-center mt-2">
          <input
            type="checkbox"
            name="isCorrect"
            checked={newOption.isCorrect}
            onChange={handleOptionChange}
            className="mr-2 leading-tight"
          />
          <span className="text-sm">Correct</span>
        </label>
      )}
    </div>
  
    <button
      type="button"
      onClick={addOption}
      disabled={questionType === 'FILL_IN_THE_BLANK' && options.length > 0}
      className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
    >
      {questionType === 'FILL_IN_THE_BLANK' ? 'Set Answer' : 'Add Option'}
    </button>
  
    <ul className="mt-4">
      {options.map((option, index) => (
        <li key={index} className="text-sm text-gray-700">
          {option.text} - {option.isCorrect ? 'Correct' : 'Incorrect'}
        </li>
      ))}
    </ul>
  
    <input type="hidden" name="options" value={JSON.stringify(options)} />
  
    <button
      type="submit"
      className="w-full py-2 mt-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:bg-green-600"
    >
      Submit Question
    </button>
  </form>
  
  );
};

export default QuestionForm;