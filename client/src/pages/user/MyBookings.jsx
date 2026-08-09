import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { formatDate, img, statusColor } from "../../utils/format.js";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    api
      .get("/bookings/my-bookings")
      .then((res) => setBookings(res.data.bookings || []))
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    setBusyId(id);
    try {
      await api.put(`/bookings/cancel/${id}`);
      toast.success("Booking cancelled");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
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
      <h1 className="mb-6 text-3xl font-black">My Bookings</h1>
      {bookings.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No bookings yet"
          subtitle="Book a trial slot at a gym near you."
          action={
            <Link to="/gyms" className="btn-primary">
              Explore Gyms →
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="card flex flex-wrap items-center gap-4 p-5">
              <div className="h-16 w-24 overflow-hidden rounded-xl bg-slate-800">
                {b.gym?.images?.length ? (
                  <img src={img(b.gym.images)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl">💪</div>
                )}
              </div>
              <div className="min-w-[200px] flex-1">
                <Link to={`/gyms/${b.gym?._id}`} className="font-bold hover:text-brand-400">
                  {b.gym?.gymName || "Gym"}
                </Link>
                <p className="text-sm text-slate-400">
                  {formatDate(b.date)} · {b.slot}
                </p>
                {b.note && <p className="text-xs text-slate-500">Note: {b.note}</p>}
              </div>
              <span className={`chip ${statusColor(b.status)}`}>{b.status}</span>
              {b.status === "Pending" && (
                <button
                  className="btn-danger !py-1.5 text-sm"
                  disabled={busyId === b._id}
                  onClick={() => cancel(b._id)}
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}