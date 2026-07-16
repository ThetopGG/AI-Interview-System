import { Bot } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/upload" className="flex items-center gap-2">
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-600 text-white">
            <Bot size={20} />
          </span>
          <span className="text-lg font-semibold text-slate-900">AI Interview System</span>
        </Link>
      </div>
    </header>
  );
}
