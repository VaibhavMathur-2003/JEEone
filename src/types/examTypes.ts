export type ExamPaperQuestionOption = {
    text: string;
    isCorrect: boolean;
  };
  
  export type ExamPaperQuestion = {
    title: string;
    text: string;
    subject: string;
    type: string;
    positiveMarks: number;
    negativeMarks: number;
    options: ExamPaperQuestionOption[];
  };
  
  export type ExamPaper = {
    title: string;
    description?: string;
    totalMarks: number;
    duration: number;
    questions: ExamPaperQuestion[];
  };