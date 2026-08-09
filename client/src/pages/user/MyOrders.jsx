import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { formatINR, formatDate, img, statusColor } from "../../utils/format.js";

const STATUS_STEPS = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/my-orders")
      .then((res) => setOrders(res.data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stepOf = (s) => STATUS_STEPS.indexOf(s);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-black">My Orders</h1>
      {orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No orders yet"
          subtitle="Shop supplements & accessories."
          action={
            <Link to="/shop" className="btn-primary">
              Shop Now →
            </Link>
          }
        />
      ) : (
        <div className="space-y-5">
          {orders.map((o) => {
            const step = stepOf(o.status);
            return (
              <div key={o._id} className="card p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold">
                      Order #{o._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-500">{formatDate(o.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`chip ${statusColor(o.status)}`}>Status: {o.status}</span>
                    <span className={`chip ${statusColor(o.paymentStatus)}`}>
                      {o.paymentStatus === "Paid" ? `Paid ${o.paymentMethod}` : `Payment ${o.paymentStatus}`}
                    </span>
                  </div>
                </div>

                {step >= 0 && (
                  <div className="mt-4 flex items-center">
                    {STATUS_STEPS.map((s, i) => (
                      <div key={s} className="flex flex-1 items-center last:flex-none">
                        <div className="flex flex-col items-center text-center">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                              i <= step ? "bg-brand-500 text-white" : "bg-slate-800 text-slate-500"
                            }`}
                          >
                            {i < step ? "✓" : i + 1}
                          </div>
                          <span className={`mt-1 hidden text-[10px] sm:block ${i <= step ? "text-brand-400" : "text-slate-600"}`}>
                            {s}
                          </span>
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`mx-1 h-0.5 flex-1 rounded ${i < step ? "bg-brand-500" : "bg-slate-800"}`} />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {o.status === "Cancelled" && (
                  <p className="mt-3 text-sm text-red-400">This order was cancelled.</p>
                )}

                <div className="mt-4 space-y-2">
                  {o.products?.map((p) => (
                    <div key={p?._id || p.product?._id} className="flex items-center gap-3 text-sm">
                      {p.product && (
                        <>
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                            {p.product.images?.length ? (
                              <img src={img(p.product.images)} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">🏋️</div>
                            )}
                          </div>
                          <Link to={`/products/${p.product._id}`} className="flex-1 truncate font-medium hover:text-brand-400">
                            {p.product.productName}
                          </Link>
                          <span className="text-slate-400">×{p.quantity}</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap justify-between gap-2 border-t border-slate-800 pt-4 text-sm">
                  <p className="text-slate-400">
                    📍 {o.shippingAddress?.address}, {o.shippingAddress?.city}, {o.shippingAddress?.state} - {o.shippingAddress?.pincode}
                  </p>
                  <p className="font-black text-brand-400">Total: {formatINR(o.totalPrice)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}