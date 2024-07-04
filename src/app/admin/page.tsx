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
    <form action={createQuestion}>
      <input type="text"name='title' placeholder='title' required />
      <input type="text" name="text" placeholder="Question text" required />
      <select name="difficulty" required>
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>
      <input type="text" name="subject" placeholder="Subject" required />
      <textarea name="explanation" placeholder="Explanation" required />
      <select 
        name="type" 
        value={questionType} 
        onChange={(e) => setQuestionType(e.target.value as QuestionType)}
        required
      >
        <option value="MULTIPLE_CHOICE_SINGLE">Single Option Correct</option>
        <option value="MULTIPLE_CHOICE_MULTIPLE">Multiple Options Correct</option>
        <option value="FILL_IN_THE_BLANK">Fill in the Blank</option>
      </select>

      <div>
        <input
          type="text"
          value={newOption.text}
          onChange={handleOptionChange}
          name="text"
          placeholder={questionType === 'FILL_IN_THE_BLANK' ? "Correct answer" : "Option text"}
        />
        {questionType !== 'FILL_IN_THE_BLANK' && (
          <label>
            <input
              type="checkbox"
              name="isCorrect"
              checked={newOption.isCorrect}
              onChange={handleOptionChange}
            />
            Correct
          </label>
        )}
        <button type="button" onClick={addOption} disabled={questionType === 'FILL_IN_THE_BLANK' && options.length > 0}>
          {questionType === 'FILL_IN_THE_BLANK' ? 'Set Answer' : 'Add Option'}
        </button>
      </div>

      <ul>
        {options.map((option, index) => (
          <li key={index}>
            {option.text} - {option.isCorrect ? 'Correct' : 'Incorrect'}
          </li>
        ))}
      </ul>

      <input type="hidden" name="options" value={JSON.stringify(options)} />

      <button type="submit">Submit Question</button>
    </form>
  );
};

export default QuestionForm;