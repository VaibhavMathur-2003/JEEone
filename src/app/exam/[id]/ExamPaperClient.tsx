// ExamPaperClient.tsx
'use client';

import React, { useState } from 'react';
import { ExamPaper as ExamPaperType, ExamPaperQuestion, ExamPaperQuestionOption } from '@prisma/client';
import ExamAnswerForm from '@/app/exam/[id]/ExamAnswerForm';
import { submitExamAnswers } from './action';

interface Props {
  examPaper: ExamPaperType & {
    questions: (ExamPaperQuestion & { options: ExamPaperQuestionOption[] })[]
  };
  userId: string;
}

const ExamPaperClient: React.FC<Props> = ({ examPaper, userId }) => {
  const [answers, setAnswers] = useState<Record<string, string[] | string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  const handleAnswerChange = (questionId: string, answer: string[] | string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitExamAnswers(userId, examPaper.id, answers);
      if (result.success) {
        if(result.finalScore)
        setFinalScore(result.finalScore);
      } else {
        console.error('Error submitting exam:', result.error);
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <h1>{examPaper.title}</h1>
      <p>{examPaper.description}</p>
      {examPaper.questions.map((question) => (
        <div key={question.id}>
          <h2>Question {question.order}</h2>
          <ExamAnswerForm
            examPaperQuestion={question}
            onAnswerChange={handleAnswerChange}
          />
          <hr />
        </div>
      ))}
      <button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Exam'}
      </button>
      {finalScore !== null && (
        <p>Your final score: {finalScore.toFixed(2)}</p>
      )}
    </div>
  );
}

export default ExamPaperClient;