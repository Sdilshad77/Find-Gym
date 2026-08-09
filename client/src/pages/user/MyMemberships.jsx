import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { formatINR, formatDate, img, statusColor } from "../../utils/format.js";

export default function MyMemberships() {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    api
      .get("/memberships/my-memberships")
      .then((res) => setMemberships(res.data.memberships || []))
      .catch(() => toast.error("Failed to load memberships"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this membership?")) return;
    setBusyId(id);
    try {
      const { data } = await api.put(`/memberships/cancel/${id}`);
      toast.success(data.message);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    } finally {
      setBusyId(null);
    }
  };

  const daysLeft = (m) => {
    if (m.status !== "Active") return null;
    const diff = new Date(m.endDate) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-black">My Memberships</h1>
      {memberships.length === 0 ? (
        <EmptyState
          icon="🎫"
          title="No memberships yet"
          subtitle="Subscribe to a gym to unlock your fitness journey."
          action={
            <Link to="/gyms" className="btn-primary">
              Find a Gym →
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {memberships.map((m) => (
            <div key={m._id} className="card flex flex-wrap items-center gap-4 p-5">
              <div className="h-16 w-24 overflow-hidden rounded-xl bg-slate-800">
                {m.gym?.images?.length ? (
                  <img src={img(m.gym.images)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl">💪</div>
                )}
              </div>
              <div className="min-w-[220px] flex-1">
                <Link to={`/gyms/${m.gym?._id}`} className="font-bold hover:text-brand-400">
                  {m.gym?.gymName || "Gym"}
                </Link>
                <p className="text-sm text-slate-400">
                  {m.plan} · {formatINR(m.amount)}
                </p>
                <p className="text-xs text-slate-500">
                  {formatDate(m.startDate)} → {formatDate(m.endDate)}
                </p>
              </div>
              <div className="text-right">
                <span className={`chip ${statusColor(m.status)}`}>{m.status}</span>
                {m.status === "Active" && daysLeft(m) > 0 && (
                  <p className="mt-1 text-xs text-emerald-400">{daysLeft(m)} days left</p>
                )}
                {m.status === "Active" && (
                  <div className="mt-2">
                    <button
                      className="btn-danger !py-1 text-xs"
                      disabled={busyId === m._id}
                      onClick={() => cancel(m._id)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}