import { useState, type FormEvent } from "react";

import Button from "../common/Button";

interface AnswerInputProps {
  onSubmit: (answerText: string) => void;
  isSubmitting: boolean;
  disabled?: boolean;
}

export default function AnswerInput({ onSubmit, isSubmitting, disabled }: AnswerInputProps) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = answer.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setAnswer("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        rows={6}
        disabled={disabled || isSubmitting}
        className="w-full rounded-xl border border-slate-300 p-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:bg-slate-100 resize-none"
      />
      <div className="mt-4 flex justify-end">
        <Button type="submit" isLoading={isSubmitting} disabled={disabled || !answer.trim()}>
          Submit Answer
        </Button>
      </div>
    </form>
  );
}
