import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { formatINR } from "../../utils/format.js";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    Promise.all([api.get("/dashboard/gym-owner"), api.get("/bookings/gym-owner")])
      .then(([d, b]) => {
        setStats(d.data.dashboard);
        setBookings(b.data.bookings || []);
      })
      .catch(() => {});
  }, []);

  const pending = bookings.filter((x) => x.status === "Pending").length;

  const cards = [
    { label: "My Gyms", value: stats?.totalGyms ?? "—", icon: "🏢" },
    { label: "Products", value: stats?.totalProducts ?? "—", icon: "🏋️" },
    { label: "Total Orders", value: stats?.totalOrders ?? "—", icon: "📦" },
    { label: "Revenue", value: stats ? formatINR(stats.totalRevenue) : "—", icon: "💰" },
    { label: "Pending Bookings", value: pending, icon: "📅" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">Owner Dashboard</h1>
          <p className="text-slate-400">Welcome back, {user.name} 🏢</p>
        </div>
        <div className="flex gap-3">
          <Link to="/owner/gyms/new" className="btn-primary">
            + Add Gym
          </Link>
          <Link to="/owner/products/new" className="btn-outline">
            + Add Product
          </Link>
        </div>
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

      <h2 className="mt-10 mb-4 text-xl font-bold">Management</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/owner/gyms" className="card flex items-center gap-4 p-5 transition hover:border-slate-600">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-2xl">🏢</span>
          <div>
            <p className="font-bold">My Gyms</p>
            <p className="text-sm text-slate-400">Create, edit & delete gyms</p>
          </div>
        </Link>
        <Link to="/owner/products" className="card flex items-center gap-4 p-5 transition hover:border-slate-600">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-2xl">🏋️</span>
          <div>
            <p className="font-bold">My Products</p>
            <p className="text-sm text-slate-400">Manage supplements & stock</p>
          </div>
        </Link>
        <Link to="/owner/bookings" className="card flex items-center gap-4 p-5 transition hover:border-slate-600">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-2xl">📅</span>
          <div>
            <p className="font-bold">Bookings</p>
            <p className="text-sm text-slate-400">Approve / reject trial slots</p>
          </div>
        </Link>
      </div>
    </div>
  );
}