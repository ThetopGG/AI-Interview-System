import { CheckCircle2, Loader2, RefreshCw, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { generateSummary } from "../api/summaryApi";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { useInterviewStore } from "../store/interviewStore";
import type { InterviewSummary } from "../types/interview";

export default function SummaryPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const roleTitle = useInterviewStore((s) => s.roleTitle);
  const resetStore = useInterviewStore((s) => s.reset);

  const [summary, setSummary] = useState<InterviewSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      navigate("/upload");
      return;
    }

    setIsLoading(true);
    generateSummary(sessionId)
      .then(setSummary)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Failed to generate summary.")
      )
      .finally(() => setIsLoading(false));
  }, [sessionId, navigate]);

  const handleStartOver = () => {
    resetStore();
    navigate("/upload");
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-brand-600" size={32} />
        <p className="text-sm text-slate-500">Evaluating your interview performance...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-600 mb-4">
            <CheckCircle2 size={28} />
          </span>
          <h1 className="text-2xl font-semibold text-slate-900">Interview Complete</h1>
          <p className="text-slate-500 mt-2">
            {roleTitle ? `Your evaluation for the ${roleTitle} role.` : "Your final evaluation."}
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-6">
            {error}
          </p>
        )}

        {summary && (
          <Card className="space-y-6">
            {summary.overall_score !== null && (
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <span className="text-sm font-medium text-slate-500">Overall Score</span>
                <span className="text-3xl font-bold text-brand-600">
                  {summary.overall_score.toFixed(1)}
                  <span className="text-base text-slate-400 font-normal">/10</span>
                </span>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-slate-500 mb-2">Summary</h3>
              <p className="text-slate-800 leading-relaxed">{summary.summary_text}</p>
            </div>

            {summary.strengths && (
              <div className="flex gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 text-green-600 shrink-0">
                  <TrendingUp size={16} />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-1">Strengths</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{summary.strengths}</p>
                </div>
              </div>
            )}

            {summary.weaknesses && (
              <div className="flex gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 text-amber-600 shrink-0">
                  <TrendingDown size={16} />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-1">
                    Areas for Improvement
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{summary.weaknesses}</p>
                </div>
              </div>
            )}
          </Card>
        )}

        <div className="flex justify-center mt-8">
          <Button variant="outline" onClick={handleStartOver}>
            <RefreshCw size={16} />
            Start a New Interview
          </Button>
        </div>
      </div>
    </div>
  );
}
