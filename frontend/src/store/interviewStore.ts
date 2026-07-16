import { create } from "zustand";

interface InterviewState {
  resumeId: string | null;
  candidateId: string | null;
  candidateName: string | null;
  roleId: string | null;
  roleTitle: string | null;
  sessionId: string | null;
  setResume: (resumeId: string, candidateId: string, candidateName: string) => void;
  setRole: (roleId: string, roleTitle: string) => void;
  setSession: (sessionId: string) => void;
  reset: () => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  resumeId: null,
  candidateId: null,
  candidateName: null,
  roleId: null,
  roleTitle: null,
  sessionId: null,
  setResume: (resumeId, candidateId, candidateName) =>
    set({ resumeId, candidateId, candidateName }),
  setRole: (roleId, roleTitle) => set({ roleId, roleTitle }),
  setSession: (sessionId) => set({ sessionId }),
  reset: () =>
    set({
      resumeId: null,
      candidateId: null,
      candidateName: null,
      roleId: null,
      roleTitle: null,
      sessionId: null,
    }),
}));
