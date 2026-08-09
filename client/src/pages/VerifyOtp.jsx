import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";

export default function VerifyOtp() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = params.get("email") || "";
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email missing. Please start again.");
      return;
    }
    setBusy(true);
    try {
      await api.post("/auth/verify-otp", { email, otp });
      toast.success("OTP verified!");
      navigate(`/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="mb-2 text-center text-2xl font-black">Enter OTP</h1>
          <p className="mb-6 text-center text-sm text-slate-400">
            {email ? `OTP sent to ${email}` : "Verify your email"}
          </p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">6-digit OTP</label>
              <input
                required
                maxLength={6}
                className="input text-center text-lg tracking-[0.5em]"
                placeholder="••••••"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={busy}>
              {busy ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm">
            <Link to="/forgot-password" className="text-brand-400 hover:text-brand-300">
              Resend OTP?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}