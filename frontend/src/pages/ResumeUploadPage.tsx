import { FileText, UploadCloud } from "lucide-react";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { uploadResume } from "../api/resumeApi";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { useInterviewStore } from "../store/interviewStore";

export default function ResumeUploadPage() {
  const navigate = useNavigate();
  const setResume = useInterviewStore((s) => s.setResume);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are supported.");
      setFile(null);
      return;
    }
    setError(null);
    setFile(selected);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!file) {
      setError("Please select a resume PDF to upload.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      const resume = await uploadResume(name.trim(), email.trim() || undefined, file);
      setResume(resume.id, resume.candidate_id, name.trim());
      navigate("/roles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload resume.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">Start Your AI Interview</h1>
          <p className="text-slate-500 mt-2">
            Upload your resume to begin a personalized, role-specific interview.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Resume (PDF)
              </label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-8 text-slate-500 hover:border-brand-500 hover:text-brand-600 transition-colors"
              >
                {file ? (
                  <>
                    <FileText size={28} />
                    <span className="text-sm font-medium text-slate-700">{file.name}</span>
                    <span className="text-xs text-slate-400">Click to change file</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={28} />
                    <span className="text-sm font-medium">Click to upload your resume</span>
                    <span className="text-xs text-slate-400">PDF only</span>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Continue to Role Selection
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
