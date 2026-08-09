import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { formatINR, formatDateTime, statusColor } from "../../utils/format.js";

const STATUSES = ["Pending", "Paid", "Failed", "Refunded"];

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [statuses, setStatuses] = useState({});

  const load = () => {
    api
      .get("/payments")
      .then((res) => {
        setPayments(res.data.payments || []);
        const map = {};
        res.data.payments?.forEach((p) => (map[p._id] = p.paymentStatus));
        setStatuses(map);
      })
      .catch(() => toast.error("Failed to load payments"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id) => {
    setBusyId(id);
    try {
      const { data } = await api.put(`/payments/${id}`, { paymentStatus: statuses[id] });
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-black">All Payments ({payments.length})</h1>
      {payments.length === 0 ? (
        <EmptyState icon="💰" title="No payments yet" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase text-slate-400">
                <th className="px-4 py-3">Txn ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-b border-slate-800/70 hover:bg-slate-900/50">
                  <td className="px-4 py-4">
                    <p className="font-bold text-xs">{p.transactionId}</p>
                    <p className="text-xs text-slate-500">{formatDateTime(p.createdAt)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p>{p.user?.name || "—"}</p>
                    <p className="text-xs text-slate-500">{p.user?.email}</p>
                  </td>
                  <td className="px-4 py-4 text-xs">
                    {p.order ? `#${p.order._id?.slice(-8).toUpperCase()}` : "—"}
                  </td>
                  <td className="px-4 py-4 font-bold">{formatINR(p.amount)}</td>
                  <td className="px-4 py-4">{p.paymentMethod}</td>
                  <td className="px-4 py-4">
                    <select
                      className="input !w-36 !py-1.5 text-xs"
                      value={statuses[p._id] || p.paymentStatus}
                      onChange={(e) => setStatuses((s) => ({ ...s, [p._id]: e.target.value }))}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      className="btn-primary !px-3 !py-1.5 text-xs"
                      disabled={busyId === p._id}
                      onClick={() => updateStatus(p._id)}
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}