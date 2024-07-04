-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNATTEMPTED',
    "explanation" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "correctPercentage" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Question" ("correctPercentage", "createdAt", "difficulty", "explanation", "id", "subject", "text", "title", "type", "updatedAt") SELECT "correctPercentage", "createdAt", "difficulty", "explanation", "id", "subject", "text", "title", "type", "updatedAt" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
CREATE INDEX "Question_difficulty_idx" ON "Question"("difficulty");
CREATE INDEX "Question_subject_idx" ON "Question"("subject");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
