'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getExamPaper, submitExamAttempt } from '@/action/examAction';

interface ExamPaperProps {
  examId: string;
  userId: string;
}

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
  type: 'FILL_IN_THE_BLANK' | 'MULTIPLE_CHOICE_SINGLE' | 'MULTIPLE_CHOICE_MULTIPLE';
  correctPercentage: number;
  createdAt: Date;
  updatedAt: Date;
  options: Option[];
}

interface ExamPaperQuestion {
  question: Question;
}

interface ExamPaper {
  id: string;
  title: string;
  description: string | null;
  questions: ExamPaperQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const ExamPaper: React.FC<ExamPaperProps> = ({ examId, userId }) => {
  const [examPaper, setExamPaper] = useState<ExamPaper | null>(null);
  const [answers, setAnswers] = useState<Record<number, string | number[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchExamPaper = async () => {
      try {
        const paper = await getExamPaper(examId);
        setExamPaper(paper);
        setAnswers(Object.fromEntries(paper.questions.map(q => [q.question.id, q.question.type === 'FILL_IN_THE_BLANK' ? '' : []])));
      } catch (error) {
        console.error('Failed to fetch exam paper:', error);
      }
    };
    fetchExamPaper();
  }, [examId]);

  const handleAnswerChange = (questionId: number, answer: string | number[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    try {
      const result = await submitExamAttempt(userId, examId, Object.entries(answers).map(([questionId, answer]) => ({
        questionId: parseInt(questionId),
        answer
      })));
      setSubmitted(true);
      setScore(result.score);
    } catch (error) {
      console.error('Failed to submit exam attempt:', error);
    }
  };

  if (!examPaper) return <div>Loading...</div>;

  return (
    <div>
      <h2>{examPaper.title}</h2>
      <p>{examPaper.description}</p>
      {!submitted ? (
        <>
          {examPaper.questions.map(({ question }) => (
            <div key={question.id}>
              <h3>{question.title}</h3>
              <p>{question.text}</p>
              {question.type === 'FILL_IN_THE_BLANK' ? (
                <input
                  type="text"
                  value={answers[question.id] as string}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                />
              ) : (
                question.options.map(option => (
                  <div key={option.id}>
                    <input
                      type={question.type === 'MULTIPLE_CHOICE_SINGLE' ? 'radio' : 'checkbox'}
                      id={`option-${option.id}`}
                      name={`question-${question.id}`}
                      value={option.id}
                      checked={(answers[question.id] as number[]).includes(option.id)}
                      onChange={() => {
                        if (question.type === 'MULTIPLE_CHOICE_SINGLE') {
                          handleAnswerChange(question.id, [option.id]);
                        } else {
                          handleAnswerChange(
                            question.id, 
                            (answers[question.id] as number[]).includes(option.id)
                              ? (answers[question.id] as number[]).filter(id => id !== option.id)
                              : [...(answers[question.id] as number[]), option.id]
                          );
                        }
                      }}
                    />
                    <label htmlFor={`option-${option.id}`}>{option.text}</label>
                  </div>
                ))
              )}
            </div>
          ))}
          <button onClick={handleSubmit}>Submit Exam</button>
        </>
      ) : (
        <div>
          <h3>Exam Completed</h3>
          <p>Your score: {score !== null ? (score * 100).toFixed(2) : 'N/A'}%</p>
          <button onClick={() => router.push('/exams')}>Back to Exam List</button>
        </div>
      )}
    </div>
  );
};

export default ExamPaper;