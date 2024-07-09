'use client';

import React, { useState, useEffect } from 'react';
import { ExamPaperQuestion, ExamPaperQuestionOption } from '@prisma/client';

interface Props {
  examPaperQuestion: ExamPaperQuestion & { options: ExamPaperQuestionOption[] };
  onAnswerChange: (questionId: string, answer: string[] | string) => void;
}

const ExamAnswerForm: React.FC<Props> = ({ examPaperQuestion, onAnswerChange }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textAnswer, setTextAnswer] = useState('');

  useEffect(() => {
    // Reset state when question changes
    setSelectedOptions([]);
    setTextAnswer('');
  }, [examPaperQuestion.id]);

  const handleOptionChange = (optionId: string) => {
    let newSelectedOptions: string[];
    if (examPaperQuestion.type === 'MULTIPLE_CHOICE_SINGLE') {
      newSelectedOptions = [optionId];
    } else {
      newSelectedOptions = selectedOptions.includes(optionId)
        ? selectedOptions.filter(id => id !== optionId)
        : [...selectedOptions, optionId];
    }
    setSelectedOptions(newSelectedOptions);
    onAnswerChange(examPaperQuestion.id, newSelectedOptions);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTextAnswer = e.target.value;
    setTextAnswer(newTextAnswer);
    onAnswerChange(examPaperQuestion.id, newTextAnswer);
  };

  return (
    <div>
      <p>{examPaperQuestion.text}</p>
      {examPaperQuestion.type === 'FILL_IN_THE_BLANK' ? (
        <input
          type="text"
          value={textAnswer}
          onChange={handleTextChange}
          placeholder="Your answer"
        />
      ) : (
        examPaperQuestion.options.map(option => (
          <div key={option.id}>
            <input
              type={examPaperQuestion.type === 'MULTIPLE_CHOICE_SINGLE' ? 'radio' : 'checkbox'}
              id={`option-${option.id}`}
              name={`question-${examPaperQuestion.id}`}
              value={option.id}
              checked={selectedOptions.includes(option.id)}
              onChange={() => handleOptionChange(option.id)}
            />
            <label htmlFor={`option-${option.id}`}>{option.text}</label>
          </div>
        ))
      )}
    </div>
  );
};

export default ExamAnswerForm;