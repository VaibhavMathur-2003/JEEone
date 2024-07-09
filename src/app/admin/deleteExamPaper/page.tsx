// DeleteExamPaper.tsx
import { deleteExamPaper } from './action';

export default function DeleteExamPaper() {
  return (
    <form action={deleteExamPaper}>
      <input type="text" name="examPaperId" placeholder="Enter Exam Paper ID" />
      <button type="submit">Delete Exam</button>
    </form>
  );
}

