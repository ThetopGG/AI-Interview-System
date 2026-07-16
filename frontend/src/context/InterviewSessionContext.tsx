import { createContext, useContext, type ReactNode } from "react";
import { useInterviewStore } from "../store/interviewStore";

interface InterviewSessionContextValue {
  isResumeUploaded: boolean;
  isRoleSelected: boolean;
  isSessionStarted: boolean;
}

const InterviewSessionContext = createContext<InterviewSessionContextValue | undefined>(
  undefined
);

export function InterviewSessionProvider({ children }: { children: ReactNode }) {
  const resumeId = useInterviewStore((s) => s.resumeId);
  const roleId = useInterviewStore((s) => s.roleId);
  const sessionId = useInterviewStore((s) => s.sessionId);

  const value: InterviewSessionContextValue = {
    isResumeUploaded: Boolean(resumeId),
    isRoleSelected: Boolean(roleId),
    isSessionStarted: Boolean(sessionId),
  };

  return (
    <InterviewSessionContext.Provider value={value}>
      {children}
    </InterviewSessionContext.Provider>
  );
}

export function useInterviewSessionContext(): InterviewSessionContextValue {
  const ctx = useContext(InterviewSessionContext);
  if (!ctx) {
    throw new Error(
      "useInterviewSessionContext must be used within an InterviewSessionProvider"
    );
  }
  return ctx;
}
