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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAnswerChange = (questionId: string, answer: string[] | string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitExamAnswers(userId, examPaper.id, answers);
      if (result.success) {
        if (result.finalScore)
          setFinalScore(result.finalScore);
      } else {
        console.error('Error submitting exam:', result.error);
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
    }
    setIsSubmitting(false);
  };

  const handleNext = () => {
    if (currentQuestionIndex < examPaper.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

  const currentQuestion = examPaper.questions[currentQuestionIndex];

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <h1>{examPaper.title}</h1>
        <p>{examPaper.description}</p>
        <div>
          <h2>Question {currentQuestion.order}</h2>
          <ExamAnswerForm
            examPaperQuestion={currentQuestion}
            onAnswerChange={handleAnswerChange}
          />
        </div>
        <div>
          <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            Previous
          </button>
          <button 
            onClick={handleNext} 
            disabled={currentQuestionIndex === examPaper.questions.length - 1}
          >
            Next
          </button>
        </div>
        {currentQuestionIndex === examPaper.questions.length - 1 && (
          <button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        )}
        {finalScore !== null && (
          <p>Your final score: {finalScore.toFixed(2)}</p>
        )}
      </div>
      <div style={{ width: '100px', marginLeft: '20px' }}>
        <h3>Questions</h3>
        {examPaper.questions.map((question, index) => (
          <button
            key={question.id}
            onClick={() => setCurrentQuestionIndex(index)}
            style={{
              display: 'block',
              width: '100%',
              marginBottom: '5px',
              backgroundColor: index === currentQuestionIndex ? '#ddd' : 'white'
            }}
          >
            {question.order}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ExamPaperClient;