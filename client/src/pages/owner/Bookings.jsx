import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { formatDate, statusColor } from "../../utils/format.js";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    api
      .get("/bookings/gym-owner")
      .then((res) => setBookings(res.data.bookings || []))
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const action = async (id, type) => {
    setBusyId(id);
    try {
      const { data } = await api.put(`/bookings/${type}/${id}`);
      toast.success(data.message);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
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

  const counts = {
    Pending: bookings.filter((b) => b.status === "Pending").length,
    Approved: bookings.filter((b) => b.status === "Approved").length,
    Completed: bookings.filter((b) => b.status === "Completed").length,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-black">Gym Bookings</h1>
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="card p-4 text-center">
          <p className="text-2xl font-black text-amber-400">{counts.Pending}</p>
          <p className="text-xs text-slate-400">Pending</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-black text-emerald-400">{counts.Approved}</p>
          <p className="text-xs text-slate-400">Approved</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-black text-sky-400">{counts.Completed}</p>
          <p className="text-xs text-slate-400">Completed</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <EmptyState icon="📅" title="No bookings yet" subtitle="Users will book trial slots here." />
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="card flex flex-wrap items-center gap-4 p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 font-bold">
                {b.user?.name?.[0]?.toUpperCase() || "U"}
              </span>
              <div className="min-w-[200px] flex-1">
                <p className="font-bold">{b.user?.name || "User"}</p>
                <p className="text-sm text-slate-400">
                  {b.user?.phone || "No phone"} · {b.user?.email || ""}
                </p>
                <p className="text-xs text-slate-500">
                  {formatDate(b.date)} · {b.slot}
                </p>
                {b.note && <p className="text-xs text-slate-500">Note: {b.note}</p>}
              </div>
              <span className={`chip ${statusColor(b.status)}`}>{b.status}</span>
              {b.status === "Pending" && (
                <div className="flex gap-2">
                  <button className="btn-primary !py-1.5 text-sm" disabled={busyId === b._id} onClick={() => action(b._id, "approve")}>
                    Approve
                  </button>
                  <button className="btn-danger !py-1.5 text-sm" disabled={busyId === b._id} onClick={() => action(b._id, "reject")}>
                    Reject
                  </button>
                </div>
              )}
              {b.status === "Approved" && (
                <button className="btn-outline !py-1.5 text-sm" disabled={busyId === b._id} onClick={() => action(b._id, "complete")}>
                  Mark Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}