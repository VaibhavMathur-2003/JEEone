/*
  Warnings:

  - You are about to drop the column `questionId` on the `ExamPaperQuestion` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ExamPaperQuestionOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "examPaperQuestionId" TEXT NOT NULL,
    CONSTRAINT "ExamPaperQuestionOption_examPaperQuestionId_fkey" FOREIGN KEY ("examPaperQuestionId") REFERENCES "ExamPaperQuestion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ExamAnswer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "examAttemptId" TEXT NOT NULL,
    "examPaperQuestionId" TEXT,
    "questionId" INTEGER,
    "answer" TEXT NOT NULL,
    "correctness" REAL NOT NULL,
    CONSTRAINT "ExamAnswer_examAttemptId_fkey" FOREIGN KEY ("examAttemptId") REFERENCES "ExamAttempt" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ExamAnswer_examPaperQuestionId_fkey" FOREIGN KEY ("examPaperQuestionId") REFERENCES "ExamPaperQuestion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ExamAnswer" ("answer", "correctness", "examAttemptId", "id", "questionId") SELECT "answer", "correctness", "examAttemptId", "id", "questionId" FROM "ExamAnswer";
DROP TABLE "ExamAnswer";
ALTER TABLE "new_ExamAnswer" RENAME TO "ExamAnswer";
CREATE INDEX "ExamAnswer_examPaperQuestionId_idx" ON "ExamAnswer"("examPaperQuestionId");
CREATE TABLE "new_ExamPaper" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "totalMarks" REAL NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 60,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_ExamPaper" ("createdAt", "description", "id", "title", "updatedAt") SELECT "createdAt", "description", "id", "title", "updatedAt" FROM "ExamPaper";
DROP TABLE "ExamPaper";
ALTER TABLE "new_ExamPaper" RENAME TO "ExamPaper";
CREATE TABLE "new_ExamPaperQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL DEFAULT 'Untitled Question',
    "text" TEXT NOT NULL DEFAULT '',
    "subject" TEXT NOT NULL DEFAULT 'General',
    "type" TEXT NOT NULL DEFAULT 'MULTIPLE_CHOICE_SINGLE',
    "positiveMarks" REAL NOT NULL DEFAULT 1,
    "negativeMarks" REAL NOT NULL DEFAULT 0,
    "examPaperId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "ExamPaperQuestion_examPaperId_fkey" FOREIGN KEY ("examPaperId") REFERENCES "ExamPaper" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ExamPaperQuestion" ("examPaperId", "id", "order") SELECT "examPaperId", "id", "order" FROM "ExamPaperQuestion";
DROP TABLE "ExamPaperQuestion";
ALTER TABLE "new_ExamPaperQuestion" RENAME TO "ExamPaperQuestion";
CREATE UNIQUE INDEX "ExamPaperQuestion_examPaperId_order_key" ON "ExamPaperQuestion"("examPaperId", "order");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ExamPaperQuestionOption_examPaperQuestionId_idx" ON "ExamPaperQuestionOption"("examPaperQuestionId");
