'use client'

import React, { useState, useEffect } from 'react';
import { createExamPaper } from '@/action/examAction';
import { db } from '@/db/db';
import { auth } from '@/auth';

interface Question {
  id: number;
  title: string;
  difficulty: string;
  subject: string;
}

const CreateExamPaper: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserAndQuestions = async () => {
      try {
        const user = await auth();
        const userId = user?.user.id;

        // Fetch available questions from your API
        const response = await db.question.findMany({
          select: {
            id: true,
            title: true,
            difficulty: true,
            subject: true,
            questionStatus: {
              where: {
                userId: userId
              },
              select: {
                status: true
              }
            }
          },
        });

        console.log(response);
        setAvailableQuestions(response);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };

    fetchUserAndQuestions();
  }, []);

  const handleQuestionToggle = (questionId: number) => {
    setSelectedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedQuestions.length === 0) {
      setMessage('Please select at least one question.');
      return;
    }

    try {
      const result = await createExamPaper(title, description, selectedQuestions);
      setMessage(`Exam paper created successfully with ID: ${result.id}`);
      // Reset form
      setTitle('');
      setDescription('');
      setSelectedQuestions([]);
    } catch (error) {
      setMessage('Failed to create exam paper. Please try again.');
      console.error('Error creating exam paper:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Exam Paper</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Select Questions:</h2>
          <div className="space-y-2">
            {availableQuestions.map(question => (
              <div key={question.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`question-${question.id}`}
                  checked={selectedQuestions.includes(question.id)}
                  onChange={() => handleQuestionToggle(question.id)}
                  className="mr-2"
                />
                <label htmlFor={`question-${question.id}`}>
                  {question.title} - {question.difficulty} - {question.subject}
                </label>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Create Exam Paper
        </button>
      </form>
      {message && <p className="mt-4 text-center font-semibold">{message}</p>}
    </div>
  );
};

export default CreateExamPaper;
