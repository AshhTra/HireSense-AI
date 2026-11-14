
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
} from "lucide-react";

import Navbar from "../components/layout/Navbar/Navbar";
import Container from "../components/common/Container/Container";
import UploadBox from "../components/upload/UploadBox";
import JobDescription from "../components/upload/JobDescription";
import Button from "../components/common/Button/Button";

import {
  generateInterview,
  evaluateInterview,
  type InterviewResponse,
  type InterviewEvaluation,
} from "../services/interviewService";

type InterviewMode = "job-description" | "role" | "resume-only";

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: {
    transcript: string;
  };
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: SpeechRecognitionResultLike[];
};

type SpeechRecognitionErrorLike = {
  error: string;
};

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

function InterviewSetup() {
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string }>();

  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<InterviewResponse | null>(null);
  const [evaluation, setEvaluation] =
    useState<InterviewEvaluation | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interviewFinished, setInterviewFinished] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const validMode: InterviewMode =
    mode === "role" || mode === "resume-only"
      ? mode
      : "job-description";

  const title =
    validMode === "job-description"
      ? "Resume + Job Description"
      : validMode === "role"
        ? "Resume + Job Role"
        : "Resume Only";

  const currentQuestion = result?.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex] ?? "";
  const totalQuestions = result?.questions.length ?? 0;

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();

      if (recognitionRef.current) {
        const recognition = recognitionRef.current;
        recognitionRef.current = null;

        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;

        try {
          recognition.stop();
        } catch {
          // Recognition may already have stopped.
        }
      }
    };
  }, []);

  // Automatically read each new question aloud.
  useEffect(() => {
    if (!currentQuestion || interviewFinished) return;
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      currentQuestion.question
    );

    utterance.lang = "en-IN";
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [currentQuestion, interviewFinished]);

  const stopListening = () => {
    if (recognitionRef.current) {
      const recognition = recognitionRef.current;
      recognitionRef.current = null;

      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;

      try {
        recognition.stop();
      } catch {
        // Recognition may already have stopped.
      }
    }

    setIsListening(false);
  };

  const handleContinue = async () => {
    setError("");
    setResult(null);
    setEvaluation(null);
    setInterviewFinished(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);

    if (!file) {
      setError("Please upload your resume.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a PDF resume.");
      return;
    }

    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      setError("Resume must be non-empty and 5 MB or smaller.");
      return;
    }

    if (
      validMode === "job-description" &&
      (jobDescription.trim().length < 100 ||
        jobDescription.trim().length > 5000)
    ) {
      setError("Job description must contain 100–5,000 characters.");
      return;
    }

    if (
      validMode === "role" &&
      (!jobRole.trim() || jobRole.trim().length > 100)
    ) {
      setError("Please enter a job role (maximum 100 characters).");
      return;
    }

    try {
      setLoading(true);

      const response = await generateInterview(
        file,
        validMode,
        validMode === "job-description" ? jobDescription.trim() : "",
        validMode === "role" ? jobRole.trim() : ""
      );

      setAnswers(Array(response.questions.length).fill(""));
      setCurrentQuestionIndex(0);
      setResult(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReadAgain = () => {
    if (!currentQuestion || !("speechSynthesis" in window)) {
      setError("Text-to-Speech is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      currentQuestion.question
    );

    utterance.lang = "en-IN";
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStartSpeaking = () => {
    setError("");

    const speechWindow = window as SpeechRecognitionWindow;

    const SpeechRecognitionAPI =
      speechWindow.SpeechRecognition ??
      speechWindow.webkitSpeechRecognition;


    if (!SpeechRecognitionAPI) {
      setError(
        "Speech recognition is not supported in this browser. Please type your answer."
      );
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    const recognition = new SpeechRecognitionAPI();

    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognitionRef.current = recognition;

    let finalTranscript = "";
    const startingAnswer = currentAnswer;

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      const spokenText = (
        startingAnswer +
        " " +
        finalTranscript +
        interimTranscript
      ).trim();

      setAnswers((previous) => {
        const updated = [...previous];
        updated[currentQuestionIndex] = spokenText;
        return updated;
      });
    };

    recognition.onerror = (event: SpeechRecognitionErrorLike) => {
      setError(
        event.error === "not-allowed"
          ? "Microphone permission denied. Allow microphone access in Chrome settings."
          : `Speech recognition error: ${event.error}. Please try again.`
      );

      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setError("Unable to start the microphone. Please try again.");
      setIsListening(false);
      recognitionRef.current = null;
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswers((previous) => {
      const updated = [...previous];
      updated[currentQuestionIndex] = value;
      return updated;
    });
  };

  const handleNextQuestion = async () => {
    stopListening();
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setError("");

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((previous) => previous + 1);
      return;
    }

    await submitEvaluation();
  };

  const submitEvaluation = async () => {
    if (!result) return;

    try {
      setEvaluating(true);
      setError("");

      const questionsWithAnswers = result.questions.map(
        (question, index) => ({
          question: question.question,
          category: question.category,
          answer: answers[index]?.trim() ?? "",
        })
      );

      const evaluationResult = await evaluateInterview(
        result.session_id,
        questionsWithAnswers
      );

      setEvaluation(evaluationResult);
      setInterviewFinished(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not evaluate the interview. Please try again."
      );
    } finally {
      setEvaluating(false);
    }
  };

  const handleGenerateAgain = () => {
    stopListening();
    window.speechSynthesis?.cancel();

    setResult(null);
    setEvaluation(null);
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setInterviewFinished(false);
    setError("");
  };

  return (
    <div
      className="min-h-screen pb-20 transition-colors duration-300"
      style={{ backgroundColor: "var(--background)" }}
    >
      <Navbar isAuthenticated />

      <Container>
        <div className="py-10">
          {!result && (
            <>
              <button
                type="button"
                onClick={() => navigate("/interview")}
                className="mb-6 text-sm font-medium"
                style={{ color: "var(--primary)" }}
              >
                ← Back to Interview Options
              </button>

              <h1
                className="text-3xl font-bold md:text-4xl"
                style={{ color: "var(--text)" }}
              >
                {title}
              </h1>

              <p className="mt-3" style={{ color: "var(--text-light)" }}>
                Upload your resume and let AI prepare personalized interview
                questions for you.
              </p>

              <div className="mt-8">
                <UploadBox file={file} setFile={setFile} />
                <p
                  className="mt-2 text-sm"
                  style={{ color: "var(--text-light)" }}
                >
                  PDF only · Maximum size 5 MB
                </p>
              </div>

              {validMode === "job-description" && (
                <div className="mt-8">
                  <JobDescription
                    jobDescription={jobDescription}
                    setJobDescription={setJobDescription}
                  />
                  <p
                    className="mt-2 text-sm"
                    style={{ color: "var(--text-light)" }}
                  >
                    {jobDescription.trim().length} / 5,000 characters
                    (minimum 100)
                  </p>
                </div>
              )}

              {validMode === "role" && (
                <div className="mt-8">
                  <label
                    htmlFor="jobRole"
                    className="mb-2 block font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    Job Role
                  </label>

                  <input
                    id="jobRole"
                    type="text"
                    value={jobRole}
                    onChange={(event) => setJobRole(event.target.value)}
                    placeholder="e.g. Software Engineer"
                    maxLength={100}
                    className="w-full rounded-xl border p-4 outline-none"
                    style={{
                      backgroundColor: "var(--card)",
                      color: "var(--text)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <Button
                  type="button"
                  onClick={handleContinue}
                  className="border-0 bg-linear-to-r from-[#0F766E] to-[#10B981] px-8 py-3 text-white"
                >
                  {loading ? "Generating Questions..." : "Start Interview"}
                </Button>
              </div>
            </>
          )}

          {error && (
            <div
              className="mt-4 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700"
              role="alert"
            >
              {error}

              {result && !interviewFinished && !evaluating &&
                currentQuestionIndex === totalQuestions - 1 && (
                  <button
                    type="button"
                    onClick={submitEvaluation}
                    className="ml-2 font-semibold underline"
                  >
                    Retry evaluation
                  </button>
                )}
            </div>
          )}

          {result && interviewFinished && (
            <section
              className="mx-auto mt-10 max-w-4xl rounded-2xl border p-6 md:p-8"
              style={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <CheckCircle2
                size={52}
                className="mx-auto"
                style={{ color: "var(--primary)" }}
              />

              <h1
                className="mt-4 text-center text-3xl font-bold"
                style={{ color: "var(--text)" }}
              >
                Interview Results
              </h1>

              <p
                className="mt-2 text-center"
                style={{ color: "var(--text-light)" }}
              >
                You completed all {totalQuestions} questions.
              </p>

              {evaluation ? (
                <>
                  <div
                    className="mt-8 rounded-2xl p-6 text-center"
                    style={{ backgroundColor: "var(--background)" }}
                  >
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-light)" }}
                    >
                      Overall Score
                    </p>

                    <p
                      className="mt-2 text-5xl font-bold"
                      style={{ color: "var(--primary)" }}
                    >
                      {evaluation.overall_score}
                      <span className="text-2xl">/100</span>
                    </p>
                  </div>

                  <div className="mt-6">
                    <h2
                      className="text-xl font-bold"
                      style={{ color: "var(--text)" }}
                    >
                      Overall Feedback
                    </h2>
                    <p
                      className="mt-2 leading-7"
                      style={{ color: "var(--text-light)" }}
                    >
                      {evaluation.summary}
                    </p>
                  </div>

                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <div
                      className="rounded-xl border p-5"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <h3
                        className="font-bold"
                        style={{ color: "var(--text)" }}
                      >
                        Strengths
                      </h3>

                      <ul className="mt-3 list-disc space-y-2 pl-5">
                        {evaluation.strengths.map((item, index) => (
                          <li
                            key={index}
                            className="text-sm leading-6"
                            style={{ color: "var(--text-light)" }}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div
                      className="rounded-xl border p-5"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <h3
                        className="font-bold"
                        style={{ color: "var(--text)" }}
                      >
                        Areas to Improve
                      </h3>

                      <ul className="mt-3 list-disc space-y-2 pl-5">
                        {evaluation.improvements.map((item, index) => (
                          <li
                            key={index}
                            className="text-sm leading-6"
                            style={{ color: "var(--text-light)" }}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <h2
                    className="mt-8 text-xl font-bold"
                    style={{ color: "var(--text)" }}
                  >
                    Question-wise Evaluation
                  </h2>

                  <div className="mt-4 space-y-5">
                    {evaluation.question_feedback.map((item, index) => (
                      <article
                        key={`${index}-${item.question}`}
                        className="rounded-xl border p-5"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <h3
                            className="flex-1 font-semibold leading-6"
                            style={{ color: "var(--text)" }}
                          >
                            {index + 1}. {item.question}
                          </h3>

                          <span
                            className="rounded-full px-3 py-1 text-sm font-bold"
                            style={{
                              backgroundColor: "var(--background)",
                              color: "var(--primary)",
                            }}
                          >
                            {item.score}/10
                          </span>
                        </div>

                        <div className="mt-4">
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "var(--text)" }}
                          >
                            Your Answer
                          </p>
                          <p
                            className="mt-1 whitespace-pre-wrap text-sm leading-6"
                            style={{ color: "var(--text-light)" }}
                          >
                            {item.answer || "No answer provided."}
                          </p>
                        </div>

                        <div className="mt-4">
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "var(--text)" }}
                          >
                            AI Feedback
                          </p>
                          <p
                            className="mt-1 text-sm leading-6"
                            style={{ color: "var(--text-light)" }}
                          >
                            {item.feedback}
                          </p>
                        </div>

                        <div
                          className="mt-4 rounded-lg p-4"
                          style={{ backgroundColor: "var(--background)" }}
                        >
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "var(--text)" }}
                          >
                            Ideal Answer
                          </p>
                          <p
                            className="mt-2 whitespace-pre-wrap text-sm leading-6"
                            style={{ color: "var(--text-light)" }}
                          >
                            {item.ideal_answer}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              ) : (
                <p
                  className="mt-6 text-center"
                  style={{ color: "var(--text-light)" }}
                >
                  Evaluation results are unavailable.
                </p>
              )}

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={handleGenerateAgain}
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white"
                  style={{
                    background: "linear-gradient(to right, #0F766E, #10B981)",
                  }}
                >
                  <RotateCcw size={18} />
                  Generate Another Interview
                </button>
              </div>
            </section>
          )}

          {result && !interviewFinished && currentQuestion && (
            <section className="mx-auto mt-8 max-w-4xl">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1
                    className="text-2xl font-bold md:text-3xl"
                    style={{ color: "var(--text)" }}
                  >
                    AI Mock Interview
                  </h1>

                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--text-light)" }}
                  >
                    {result.resume_filename}
                    {result.job_role ? ` · ${result.job_role}` : ""}
                  </p>
                </div>

                <span
                  className="rounded-full px-4 py-2 text-sm font-semibold"
                  style={{
                    backgroundColor: "var(--card)",
                    color: "var(--primary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
              </div>

              <div
                className="mb-5 h-2 overflow-hidden rounded-full"
                style={{ backgroundColor: "var(--border)" }}
              >
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / totalQuestions) * 100
                    }%`,
                    backgroundColor: "var(--primary)",
                  }}
                />
              </div>

              <article
                className="rounded-2xl border p-6 md:p-8"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--primary)",
                    }}
                  >
                    {currentQuestion.category}
                  </span>

                  <span
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "var(--text-light)" }}
                  >
                    <Volume2 size={17} />
                    {isSpeaking ? "Reading question..." : "AI Interviewer"}
                  </span>
                </div>

                <h2
                  className="mt-6 text-xl font-semibold leading-relaxed md:text-2xl"
                  style={{ color: "var(--text)" }}
                >
                  {currentQuestion.question}
                </h2>

                <button
                  type="button"
                  onClick={handleReadAgain}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--primary)",
                  }}
                >
                  <Volume2 size={18} />
                  Read Again
                </button>
              </article>

              <article
                className="mt-6 rounded-2xl border p-6 md:p-8"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                }}
              >
                <h3
                  className="text-xl font-bold"
                  style={{ color: "var(--text)" }}
                >
                  Your Answer
                </h3>

                <p
                  className="mt-2 text-sm"
                  style={{ color: "var(--text-light)" }}
                >
                  Answer aloud like a real interview. For SQL, coding, or
                  technical questions, you can type your answer instead.
                </p>

                <button
                  type="button"
                  onClick={handleStartSpeaking}
                  className="mt-5 flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 transition-colors"
                  style={{
                    borderColor: isListening ? "#EF4444" : "var(--primary)",
                    backgroundColor: "var(--background)",
                  }}
                >
                  <span
                    className="flex h-16 w-16 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: isListening ? "#FEE2E2" : "var(--card)",
                      color: isListening ? "#DC2626" : "var(--primary)",
                    }}
                  >
                    {isListening ? <MicOff size={28} /> : <Mic size={28} />}
                  </span>

                  <span
                    className="font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {isListening ? "Stop Recording" : "Start Speaking"}
                  </span>

                  <span
                    className="text-center text-sm"
                    style={{ color: "var(--text-light)" }}
                  >
                    {isListening
                      ? "Listening... Speak clearly, then stop recording."
                      : "Allow microphone access when Chrome asks."}
                  </span>
                </button>

                <div className="mt-6">
                  <label
                    htmlFor="interviewAnswer"
                    className="mb-2 block font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    Type your answer or code (optional)
                  </label>

                  <textarea
                    id="interviewAnswer"
                    value={currentAnswer}
                    onChange={(event) => handleAnswerChange(event.target.value)}
                    placeholder="Your spoken answer will appear here. You can also write an SQL query, code, or an answer..."
                    rows={7}
                    className="w-full resize-y rounded-xl border p-4 outline-none focus:ring-2"
                    style={{
                      backgroundColor: "var(--background)",
                      color: "var(--text)",
                      borderColor: "var(--border)",
                    }}
                  />
                </div>
              </article>

              <div
                className="mt-6 rounded-xl border p-4"
                style={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                }}
              >
                <p
                  className="text-sm"
                  style={{ color: "var(--text-light)" }}
                >
                  Once you move forward, you cannot return to the previous
                  question. Your current answer will be kept for this session.
                </p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  disabled={evaluating}
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    background: "linear-gradient(to right, #0F766E, #10B981)",
                  }}
                >
                  {evaluating
                    ? "Evaluating Answers..."
                    : currentQuestionIndex === totalQuestions - 1
                      ? "Finish Interview"
                      : "Next Question"}
                  <ArrowRight size={18} />
                </button>
              </div>
            </section>
          )}
        </div>
      </Container>
    </div>
  );
}

export default InterviewSetup;
