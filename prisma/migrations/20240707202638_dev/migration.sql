/*
  Warnings:

  - Added the required column `order` to the `ExamPaperQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
INSERT INTO "new_ExamPaperQuestion" ("examPaperId", "id", "negativeMarks", "positiveMarks", "subject", "text", "title", "type") SELECT "examPaperId", "id", "negativeMarks", "positiveMarks", "subject", "text", "title", "type" FROM "ExamPaperQuestion";
DROP TABLE "ExamPaperQuestion";
ALTER TABLE "new_ExamPaperQuestion" RENAME TO "ExamPaperQuestion";
CREATE UNIQUE INDEX "ExamPaperQuestion_examPaperId_order_key" ON "ExamPaperQuestion"("examPaperId", "order");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;