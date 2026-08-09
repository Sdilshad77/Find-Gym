import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

const TYPES = ["Order", "Payment", "Booking", "Membership", "Product", "General"];

export default function Notify() {
  const [form, setForm] = useState({ userId: "", title: "", message: "", type: "General" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post("/notifications", {
        user: form.userId,
        title: form.title,
        message: form.message,
        type: form.type,
      });
      toast.success(data.message);
      setForm({ userId: "", title: "", message: "", type: "General" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send notification");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-black">Send Notification</h1>
      <p className="mb-6 text-sm text-slate-400">
        Backend me user IDs ki list ka koi endpoint nahi hai, isliye user ka ID manually
        daalna hoga (MongoDB ObjectId).
      </p>
      <form onSubmit={submit} className="card space-y-4 p-6">
        <div>
          <label className="label">User ID (MongoDB ID) *</label>
          <input
            className="input"
            required
            placeholder="e.g. 65f2c9a1b3c4d5e6f7a8b9c0"
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Title *</label>
            <input className="input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Type</label>
            <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Message *</label>
          <textarea className="input" rows="4" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? "Sending..." : "Send Notification"}
        </button>
      </form>
    </div>
  );
}