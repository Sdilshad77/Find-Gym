import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { formatINR, img, statusColor } from "../../utils/format.js";

export default function MyGyms() {
  const navigate = useNavigate();
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    api
      .get("/gyms?limit=100")
      .then((res) => setGyms(res.data.gyms || []))
      .catch(() => toast.error("Failed to load gyms"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this gym? This cannot be undone.")) return;
    setBusyId(id);
    try {
      await api.delete(`/gyms/${id}`);
      toast.success("Gym deleted");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setBusyId(null);
    }
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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-black">My Gyms</h1>
        <Link to="/owner/gyms/new" className="btn-primary">
          + Add Gym
        </Link>
      </div>
      {gyms.length === 0 ? (
        <EmptyState
          icon="🏢"
          title="No gyms yet"
          subtitle="Add your first gym to start receiving bookings & sales."
          action={
            <Link to="/owner/gyms/new" className="btn-primary">
              Add Your First Gym
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {gyms.map((g) => (
            <div key={g._id} className="card flex flex-wrap items-center gap-4 p-4">
              <div className="h-16 w-28 overflow-hidden rounded-xl bg-slate-800">
                {g.images?.length ? (
                  <img src={img(g.images)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl">💪</div>
                )}
              </div>
              <div className="min-w-[200px] flex-1">
                <div className="flex items-center gap-2">
                  <Link to={`/gyms/${g._id}`} className="font-bold hover:text-brand-400">
                    {g.gymName}
                  </Link>
                  {g.verified && <span className="chip bg-emerald-500/10 text-emerald-400">✓ Verified</span>}
                </div>
                <p className="text-sm text-slate-400">
                  {g.city}, {g.state} · {formatINR(g.membershipPrice)}/mo
                </p>
<p className="text-xs text-slate-500">
                  ⭐ {Number(g.rating).toFixed(1)} · {g.totalReviews || 0} reviews
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/owner/gyms/${g._id}/edit`}
                  className="btn-outline !py-1.5 text-sm"
                >
                  Edit
                </Link>
                <button
                  className="btn-danger !py-1.5 text-sm"
                  disabled={busyId === g._id}
                  onClick={() => remove(g._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}