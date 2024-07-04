'use client';

import React, { useState } from 'react';
import { Question, Option } from '@prisma/client';
import { submitAnswer } from './actions';

interface Props {
  question: Question & { options: Option[] };
  userId?: string;
}

const AnswerForm: React.FC<Props> = ({ question, userId }) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [textAnswer, setTextAnswer] = useState('');
  const [status, setStatus] = useState(question.status);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleOptionChange = (optionId: number) => {
    if (question.type === 'MULTIPLE_CHOICE_SINGLE') {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions(prev => 
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setFeedback('Error: User not authenticated');
      return;
    }
    const answer = question.type === 'FILL_IN_THE_BLANK' ? textAnswer : selectedOptions;
    const result = await submitAnswer(question.id, userId, answer);
    if (result.success) {
      if(result?.correctness && result?.newStatus){
        setFeedback(`Your answer was ${(result.correctness * 100).toFixed(2)}% correct.`);
        setStatus(result?.newStatus);
      }
      
    } else {
      setFeedback(`Error: ${result.error}`);
    }
  };

  if (!userId) {
    return <p>Please log in to answer this question.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {question.type === 'FILL_IN_THE_BLANK' ? (
        <input
          type="text"
          value={textAnswer}
          onChange={(e) => setTextAnswer(e.target.value)}
          placeholder="Your answer"
          required
        />
      ) : (
        question.options.map(option => (
          <div key={option.id}>
            <input
              type={question.type === 'MULTIPLE_CHOICE_SINGLE' ? 'radio' : 'checkbox'}
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
      <button type="submit">Submit Answer</button>
      {feedback && <p>{feedback}</p>}
    </form>
  );
};

export default AnswerForm;