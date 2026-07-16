import { HelpCircle } from "lucide-react";

interface QuestionCardProps {
  questionText: string;
  orderIndex: number;
}

export default function QuestionCard({ questionText, orderIndex }: QuestionCardProps) {
  return (
    <div className="flex gap-4 items-start">
      <span className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-50 text-brand-600 shrink-0">
        <HelpCircle size={20} />
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">
          Question {orderIndex + 1}
        </p>
        <p className="text-lg font-medium text-slate-900 leading-relaxed">{questionText}</p>
      </div>
    </div>
  );
}
