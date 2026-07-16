import { Briefcase, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchRoles } from "../api/roleApi";
import { startInterview } from "../api/interviewApi";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { useInterviewStore } from "../store/interviewStore";
import type { Role } from "../types/interview";

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const resumeId = useInterviewStore((s) => s.resumeId);
  const candidateName = useInterviewStore((s) => s.candidateName);
  const setRole = useInterviewStore((s) => s.setRole);
  const setSession = useInterviewStore((s) => s.setSession);

  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!resumeId) {
      navigate("/upload");
      return;
    }

    fetchRoles()
      .then(setRoles)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load roles."))
      .finally(() => setIsLoading(false));
  }, [resumeId, navigate]);

  const handleStart = async () => {
    if (!resumeId || !selectedRoleId) return;
    const role = roles.find((r) => r.id === selectedRoleId);
    if (!role) return;

    setIsStarting(true);
    setError(null);
    try {
      const session = await startInterview(resumeId, role.id);
      setRole(role.id, role.title);
      setSession(session.id);
      navigate(`/interview/${session.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start interview.");
    } finally {
      setIsStarting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-600" size={32} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            {candidateName ? `Welcome, ${candidateName}` : "Select a Role"}
          </h1>
          <p className="text-slate-500 mt-2">
            Choose the role you'd like to be interviewed for. Questions will be generated
            based on this role and your resume.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {roles.map((role) => {
            const isSelected = role.id === selectedRoleId;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`text-left rounded-2xl border p-5 transition-colors ${
                  isSelected
                    ? "border-brand-600 bg-brand-50 ring-2 ring-brand-500"
                    : "border-slate-200 bg-white hover:border-brand-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                      isSelected ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Briefcase size={16} />
                  </span>
                  <h3 className="font-semibold text-slate-900">{role.title}</h3>
                </div>
                <p className="text-sm text-slate-500 line-clamp-3">{role.description}</p>
              </button>
            );
          })}
        </div>

        {roles.length === 0 && !error && (
          <p className="text-center text-slate-500 mt-6">No roles available yet.</p>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mt-6">
            {error}
          </p>
        )}

        <div className="flex justify-center mt-8">
          <Button
            onClick={handleStart}
            disabled={!selectedRoleId}
            isLoading={isStarting}
            className="px-8"
          >
            Start Interview
          </Button>
        </div>
      </div>
    </div>
  );
}
