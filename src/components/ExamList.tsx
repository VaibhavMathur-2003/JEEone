'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getExamPapers } from '@/action/examAction';

interface ExamPaper {
  id: string;
  title: string;
  questions: { id: string }[];
}

const ExamList: React.FC = () => {
  const [examPapers, setExamPapers] = useState<ExamPaper[]>([]);

  useEffect(() => {
    const fetchExamPapers = async () => {
      try {
        const papers = await getExamPapers();
        setExamPapers(papers);
      } catch (error) {
        console.error('Failed to fetch exam papers:', error);
      }
    };
    fetchExamPapers();
  }, []);

  return (
    <div>
      <h2>Available Exam Papers</h2>
      <ul>
        {examPapers.map((paper) => (
          <li key={paper.id}>
            <Link href={`/exam/${paper.id}`}>
              {paper.title} - {paper.questions.length} questions
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExamList;