-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "correctPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionStatus" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNATTEMPTED',

    CONSTRAINT "QuestionStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attempt" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "textResponse" TEXT,
    "correctness" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Attempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttemptOption" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "optionId" INTEGER NOT NULL,

    CONSTRAINT "AttemptOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamPaper" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "totalMarks" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 60,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamPaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamPaperQuestion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Untitled Question',
    "text" TEXT NOT NULL DEFAULT '',
    "subject" TEXT NOT NULL DEFAULT 'General',
    "type" TEXT NOT NULL DEFAULT 'MULTIPLE_CHOICE_SINGLE',
    "positiveMarks" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "negativeMarks" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "examPaperId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ExamPaperQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamAnswer" (
    "id" TEXT NOT NULL,
    "examAttemptId" TEXT NOT NULL,
    "examPaperQuestionId" TEXT,
    "questionId" INTEGER,
    "answer" TEXT NOT NULL,
    "correctness" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ExamAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamPaperQuestionOption" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "examPaperQuestionId" TEXT NOT NULL,

    CONSTRAINT "ExamPaperQuestionOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examPaperId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ExamAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Question_difficulty_idx" ON "Question"("difficulty");

-- CreateIndex
CREATE INDEX "Question_subject_idx" ON "Question"("subject");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionStatus_userId_questionId_key" ON "QuestionStatus"("userId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "AttemptOption_attemptId_optionId_key" ON "AttemptOption"("attemptId", "optionId");

-- CreateIndex
CREATE UNIQUE INDEX "ExamPaperQuestion_examPaperId_order_key" ON "ExamPaperQuestion"("examPaperId", "order");

-- CreateIndex
CREATE INDEX "ExamAnswer_examPaperQuestionId_idx" ON "ExamAnswer"("examPaperQuestionId");

-- CreateIndex
CREATE INDEX "ExamPaperQuestionOption_examPaperQuestionId_idx" ON "ExamPaperQuestionOption"("examPaperQuestionId");

-- AddForeignKey
ALTER TABLE "QuestionStatus" ADD CONSTRAINT "QuestionStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionStatus" ADD CONSTRAINT "QuestionStatus_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptOption" ADD CONSTRAINT "AttemptOption_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "Attempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttemptOption" ADD CONSTRAINT "AttemptOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamPaperQuestion" ADD CONSTRAINT "ExamPaperQuestion_examPaperId_fkey" FOREIGN KEY ("examPaperId") REFERENCES "ExamPaper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAnswer" ADD CONSTRAINT "ExamAnswer_examAttemptId_fkey" FOREIGN KEY ("examAttemptId") REFERENCES "ExamAttempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAnswer" ADD CONSTRAINT "ExamAnswer_examPaperQuestionId_fkey" FOREIGN KEY ("examPaperQuestionId") REFERENCES "ExamPaperQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamPaperQuestionOption" ADD CONSTRAINT "ExamPaperQuestionOption_examPaperQuestionId_fkey" FOREIGN KEY ("examPaperQuestionId") REFERENCES "ExamPaperQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAttempt" ADD CONSTRAINT "ExamAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamAttempt" ADD CONSTRAINT "ExamAttempt_examPaperId_fkey" FOREIGN KEY ("examPaperId") REFERENCES "ExamPaper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
