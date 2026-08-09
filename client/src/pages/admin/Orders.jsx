import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { formatINR, formatDate, statusColor } from "../../utils/format.js";

const STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [statuses, setStatuses] = useState({});

  const load = () => {
    api
      .get("/orders/all")
      .then((res) => {
        setOrders(res.data.orders || []);
        const map = {};
        res.data.orders?.forEach((o) => (map[o._id] = o.status));
        setStatuses(map);
      })
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filter = (o) => {
    const pc = o.products?.filter((p) => p.product)?.[0]?.product;
    return {
      q: o.products?.reduce((a, p) => a + (p.quantity || 1), 0) || 0,
      name: pc?.productName || "Product",
      images: pc?.images,
    };
  };

  const updateStatus = async (id) => {
    setBusyId(id);
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status: statuses[id] });
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this order permanently?")) return;
    setBusyId(id);
    try {
      await api.delete(`/orders/${id}`);
      toast.success("Order deleted");
      setOrders((o) => o.filter((x) => x._id !== id));
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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-black">All Orders ({orders.length})</h1>
      {orders.length === 0 ? (
        <EmptyState icon="📦" title="No orders yet" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase text-slate-400">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const f = filter(o);
                return (
                  <tr key={o._id} className="border-b border-slate-800/70 hover:bg-slate-900/50">
                    <td className="px-4 py-4">
                      <p className="font-bold">#{o._id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-slate-500">{formatDate(o.createdAt)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p>{o.user?.name || "—"}</p>
                      <p className="text-xs text-slate-500">{o.user?.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium">{f.name}</p>
                      <p className="text-xs text-slate-500">×{f.q} item(s)</p>
                    </td>
                    <td className="px-4 py-4 font-bold">{formatINR(o.totalPrice)}</td>
                    <td className="px-4 py-4">
                      <span className={`chip ${statusColor(o.paymentStatus)}`}>{o.paymentStatus}</span>
                      <p className="mt-1 text-xs text-slate-500">{o.paymentMethod}</p>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        className="input !w-40 !py-1.5 text-xs"
                        value={statuses[o._id] || o.status}
                        onChange={(e) => setStatuses((s) => ({ ...s, [o._id]: e.target.value }))}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          className="btn-primary !px-3 !py-1.5 text-xs"
                          disabled={busyId === o._id}
                          onClick={() => updateStatus(o._id)}
                        >
                          Save
                        </button>
                        <button
                          className="btn-danger !px-3 !py-1.5 text-xs"
                          disabled={busyId === o._id}
                          onClick={() => remove(o._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}