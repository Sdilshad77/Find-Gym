import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function AiChat() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("chat");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm your AI fitness coach 🤖. Ask me about workouts, nutrition, gym recommendations or products. Logged-in users can also get a personalised BMI diet + workout plan.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const [bmi, setBmi] = useState({ height: "", weight: "" });
  const [bmiResult, setBmiResult] = useState(null);
  const [bmiBusy, setBmiBusy] = useState(false);

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendChat = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    if (!user) {
      navigate("/login", { state: { from: "/ai" } });
      return;
    }

    const newMessages = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setInput("");
    setSending(true);

    try {
      const { data } = await api.post("/ai/chat", { message: text });
      setMessages((m) => [...m, { role: "bot", text: data.answer }]);
    } catch (err) {
      toast.error(err.response?.data?.message || "AI request failed");
      setMessages((m) => [...m, { role: "bot", text: "⚠️ Something went wrong. Try again." }]);
    } finally {
      setSending(false);
    }
  };

  const runBmi = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: "/ai" } });
      return;
    }
    if (!bmi.height || !bmi.weight) {
      toast.error("Enter both height and weight");
      return;
    }
    setBmiBusy(true);
    try {
      const { data } = await api.post("/ai/chat", {
        message: "Generate my plan",
        height: Number(bmi.height),
        weight: Number(bmi.weight),
      });
      setBmiResult({ bmi: data.bmi, category: data.category, answer: data.answer });
    } catch (err) {
      toast.error(err.response?.data?.message || "BMI request failed");
    } finally {
      setBmiBusy(false);
    }
  };

  const categoryColor = (c) => {
    const map = {
      Underweight: "bg-sky-500/15 text-sky-400",
      Normal: "bg-emerald-500/15 text-emerald-400",
      Overweight: "bg-amber-500/15 text-amber-400",
      Obese: "bg-red-500/15 text-red-400",
    };
    return map[c] || "bg-slate-500/15 text-slate-400";
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-black">
        GymHub <span className="text-brand-500">AI Coach</span>
      </h1>
      <p className="mt-1 text-slate-400">
        Powered by Gemini — fitness advice, diet plans, recommendations.
      </p>

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setTab("chat")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${tab === "chat" ? "bg-brand-500 text-white" : "border border-slate-700 text-slate-300 hover:border-slate-500"}`}
        >
          💬 Chat
        </button>
        <button
          onClick={() => setTab("bmi")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${tab === "bmi" ? "bg-brand-500 text-white" : "border border-slate-700 text-slate-300 hover:border-slate-500"}`}
        >
          📊 BMI Plan
        </button>
      </div>

      {tab === "chat" ? (
        <div className="card mt-6 flex h-[540px] flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-brand-500 text-white"
                      : "border border-slate-800 bg-slate-950 text-slate-200"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
                  <LoadingSpinner size="sm" />
                  <span className="text-sm text-slate-400">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <form onSubmit={sendChat} className="flex gap-3 border-t border-slate-800 p-4">
            <input
              className="input"
              placeholder="Ask me anything about fitness..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn-primary !px-6" disabled={sending || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      ) : (
        <div className="card mt-6 p-6">
          <form onSubmit={runBmi} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Height (cm)</label>
              <input
                type="number"
                className="input"
                placeholder="e.g. 175"
                value={bmi.height}
                onChange={(e) => setBmi({ ...bmi, height: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Weight (kg)</label>
              <input
                type="number"
                className="input"
                placeholder="e.g. 70"
                value={bmi.weight}
                onChange={(e) => setBmi({ ...bmi, weight: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary w-full" disabled={bmiBusy}>
                {bmiBusy ? "Generating plan..." : "Generate My Fitness Plan"}
              </button>
            </div>
          </form>

          {bmiResult && (
            <div className="mt-8 space-y-4">
              <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-700 bg-slate-950 p-5">
                <div>
                  <p className="text-xs text-slate-400">Your BMI</p>
                  <p className="text-4xl font-black text-brand-400">{bmiResult.bmi}</p>
                </div>
                <div>
                  <span className={`chip ${categoryColor(bmiResult.category)}`}>
                    {bmiResult.category}
                  </span>
                </div>
                <p className="w-full text-xs text-slate-500">
                  BMI scale: Underweight &lt;18.5 · Normal 18.5-24.9 · Overweight 25-29.9 · Obese ≥30
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-200">
                  {bmiResult.answer}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}