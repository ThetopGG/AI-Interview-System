import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { completeInterview, fetchNextQuestion, submitAnswer } from "../api/interviewApi";
import AnswerInput from "../components/interview/AnswerInput";
import ProgressTracker from "../components/interview/ProgressTracker";
import QuestionCard from "../components/interview/QuestionCard";
import Card from "../components/common/Card";
import { useInterviewStore } from "../store/interviewStore";
import type { QuestionAnswer } from "../types/interview";

const TOTAL_QUESTIONS = 5;

export default function InterviewPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const roleTitle = useInterviewStore((s) => s.roleTitle);

  const [currentQuestion, setCurrentQuestion] = useState<QuestionAnswer | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNextQuestion = useCallback(
    async (sid: string) => {
      setIsLoadingQuestion(true);
      setError(null);
      try {
        const result = await fetchNextQuestion(sid);
        if (result.is_complete || !result.question) {
          setIsComplete(true);
          setCurrentQuestion(null);
        } else {
          setCurrentQuestion(result.question);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load the next question.");
      } finally {
        setIsLoadingQuestion(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!sessionId) {
      navigate("/upload");
      return;
    }
    loadNextQuestion(sessionId);
  }, [sessionId, navigate, loadNextQuestion]);

  const handleAnswerSubmit = async (answerText: string) => {
    if (!sessionId || !currentQuestion) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await submitAnswer(sessionId, currentQuestion.id, answerText);
      setAnsweredCount((prev) => prev + 1);
      await loadNextQuestion(sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit your answer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = async () => {
    if (!sessionId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await completeInterview(sessionId);
      navigate(`/summary/${sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete the interview.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <p className="text-sm font-medium text-brand-600 mb-1">
            {roleTitle ? `Interview for ${roleTitle}` : "Interview in Progress"}
          </p>
          <ProgressTracker current={answeredCount} total={TOTAL_QUESTIONS} />
        </div>

        <Card>
          {isLoadingQuestion && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="animate-spin text-brand-600" size={28} />
              <p className="text-sm text-slate-500">Generating your next question...</p>
            </div>
          )}

          {!isLoadingQuestion && currentQuestion && (
            <>
              <QuestionCard
                questionText={currentQuestion.question_text}
                orderIndex={currentQuestion.order_index}
              />
              <AnswerInput onSubmit={handleAnswerSubmit} isSubmitting={isSubmitting} />
            </>
          )}

          {!isLoadingQuestion && isComplete && (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <h2 className="text-xl font-semibold text-slate-900">
                You've completed all interview questions.
              </h2>
              <p className="text-slate-500 max-w-md">
                Click below to generate your final evaluation summary based on your answers.
              </p>
              <button
                onClick={handleFinish}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {isSubmitting && (
                  <Loader2 className="animate-spin" size={16} />
                )}
                View Summary
              </button>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mt-6">
              {error}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
