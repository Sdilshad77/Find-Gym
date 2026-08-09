import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { formatINR } from "../../utils/format.js";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get("/dashboard/admin")
      .then((res) => setStats(res.data.dashboard))
      .catch(() => {});
  }, []);

  const cards = [
    { label: "Total Users", value: stats?.totalUsers ?? "—", icon: "👥" },
    { label: "Total Gyms", value: stats?.totalGyms ?? "—", icon: "🏢" },
    { label: "Total Products", value: stats?.totalProducts ?? "—", icon: "🏋️" },
    { label: "Total Orders", value: stats?.totalOrders ?? "—", icon: "📦" },
    { label: "Total Revenue", value: stats ? formatINR(stats.totalRevenue) : "—", icon: "💰" },
  ];

  const links = [
    { label: "All Orders", desc: "Update order statuses", to: "/admin/orders", icon: "📦" },
    { label: "All Payments", desc: "Verify payment statuses", to: "/admin/payments", icon: "💰" },
    { label: "Send Notification", desc: "Notify any user", to: "/admin/notify", icon: "🔔" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black">Admin Dashboard</h1>
        <p className="text-slate-400">Welcome back, {user.name} 🛡️</p>
      </div>

      {!stats ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((c) => (
            <div key={c.label} className="card p-5">
              <div className="text-3xl">{c.icon}</div>
              <p className="mt-3 text-2xl font-black">{c.value}</p>
              <p className="text-sm text-slate-400">{c.label}</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-10 mb-4 text-xl font-bold">Manage Platform</h2>
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