import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await updateProfile(form);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-black">My Profile</h1>
      <div className="card p-8">
        <div className="mb-6 flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 text-2xl font-black text-white">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </span>
          <div>
            <p className="text-lg font-bold">{user?.name}</p>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <span className="chip mt-1 bg-slate-800 capitalize text-slate-300">
              {user?.role === "gymOwner" ? "Gym Owner" : user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={user?.email} disabled />
            <p className="mt-1 text-xs text-slate-500">Email cannot be changed.</p>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}