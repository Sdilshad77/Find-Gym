import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { formatDateTime } from "../utils/format.js";

const TYPE_ICON = {
  Order: "📦",
  Payment: "💰",
  Booking: "📅",
  Membership: "🎫",
  Product: "🏋️",
  General: "🔔",
};

export default function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api
      .get("/notifications")
      .then((res) => setNotifs(res.data.notifications || []))
      .catch(() => toast.error("Failed to load notifications"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifs((n) => n.map((x) => (x._id === id ? { ...x, isRead: true } : x)));
    } catch {
      /* ignore */
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifs((n) => n.filter((x) => x._id !== id));
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const clearAll = async () => {
    if (!window.confirm("Delete all notifications?")) return;
    try {
      await api.delete("/notifications");
      setNotifs([]);
      toast.success("All notifications cleared");
    } catch (err) {
      toast.error("Failed to clear");
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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-black">Notifications</h1>
        {notifs.length > 0 && (
          <button className="btn-outline !py-2 text-sm" onClick={clearAll}>
            Clear All
          </button>
        )}
      </div>
      {notifs.length === 0 ? (
        <EmptyState icon="🔕" title="No notifications" subtitle="You're all caught up." />
      ) : (
        <div className="space-y-3">
          {notifs.map((n) => (
            <div
              key={n._id}
              onClick={() => markRead(n._id, n.isRead)}
              className={`card flex cursor-pointer items-start gap-4 p-4 transition ${
                n.isRead ? "opacity-60" : "border-brand-500/40"
              }`}
            >
              <span className="text-2xl">{TYPE_ICON[n.type] || "🔔"}</span>
              <div className="flex-1">
                <p className="font-bold">{n.title}</p>
                <p className="text-sm text-slate-400">{n.message}</p>
                <p className="mt-1 text-xs text-slate-600">{formatDateTime(n.createdAt)}</p>
              </div>
              {!n.isRead && <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand-500" />}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  remove(n._id);
                }}
                className="text-xs text-red-400 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}