import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { formatINR } from "../../utils/format.js";

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    Promise.all([api.get("/dashboard/user"), api.get("/notifications/unread-count")])
      .then(([d, n]) => {
        setStats(d.data.dashboard);
        setNotifCount(n.data.unread || 0);
      })
      .catch(() => {});
  }, [user]);

  const cards = [
    { label: "Total Orders", value: stats?.totalOrders ?? "—", icon: "📦", to: "/orders" },
    { label: "Total Spent", value: stats ? formatINR(stats.totalSpent) : "—", icon: "💰", to: "/orders" },
    { label: "Memberships", value: "View", icon: "🎫", to: "/memberships" },
    { label: "Unread Notifications", value: notifCount, icon: "🔔", to: "/notifications" },
  ];

  const links = [
    { label: "My Bookings", desc: "Trial slots & status", to: "/bookings", icon: "📅" },
    { label: "My Memberships", desc: "Active plans & renew", to: "/memberships", icon: "🎫" },
    { label: "My Orders", desc: "Track supplement orders", to: "/orders", icon: "📦" },
    { label: "Cart", desc: "Continue shopping", to: "/cart", icon: "🛒" },
    { label: "Wishlist", desc: "Saved products", to: "/wishlist", icon: "❤️" },
    { label: "AI Coach", desc: "Get fitness plans", to: "/ai", icon: "🤖" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">
            Hey, {user.name} 👋
          </h1>
          <p className="text-slate-400">Here's your fitness journey overview.</p>
        </div>
        <Link to="/gyms" className="btn-primary">
          Find a Gym →
        </Link>
      </div>

      {!stats ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Link key={c.label} to={c.to} className="card p-5 transition hover:border-slate-600">
              <div className="text-3xl">{c.icon}</div>
              <p className="mt-3 text-2xl font-black">{c.value}</p>
              <p className="text-sm text-slate-400">{c.label}</p>
            </Link>
          ))}
        </div>
      )}

      <h2 className="mt-10 mb-4 text-xl font-bold">Quick Access</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <Link key={l.to} to={l.to} className="card flex items-center gap-4 p-5 transition hover:border-slate-600">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-2xl">
              {l.icon}
            </span>
            <div>
              <p className="font-bold">{l.label}</p>
              <p className="text-sm text-slate-400">{l.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
