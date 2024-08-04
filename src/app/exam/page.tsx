import ExamList from "@/components/ExamList";

export default function ExamsPage() {
  return (
    <div className="w-full">
      <div className="w-2/3 mb-3 mx-auto text-center">
        <b>Note:</b> This is a sample side project. The problems may contain
        incorrect answers and scores. I would greatly appreciate your feedback
        on my{" "}
        <a
          className="cursor-pointer text-blue-500"
          href="https://www.linkedin.com/in/vaibhav-mathur-a63940231/"
          target="_blank"
        >
          LinkedIn
        </a>{" "}
        or{" "}
        <a
          className="cursor-pointer text-blue-500"
          href="https://x.com/VibeBhav_10"
          target="_blank"
        >
          Twitter (X)
        </a>
        .
      </div>

      <ExamList />
    </div>
  );
}
