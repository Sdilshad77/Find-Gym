import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { formatINR, img } from "../../utils/format.js";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = () => {
    api
      .get("/cart")
      .then((res) => setCart(res.data.cart))
      .catch(() => toast.error("Failed to load cart"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const items = cart?.items?.filter((i) => i.product) || [];

  const total = items.reduce(
    (acc, i) => acc + (i.product.discountPrice || i.product.price || 0) * i.quantity,
    0
  );

  const updateQty = async (productId, quantity) => {
    if (quantity < 1) return;
    setBusy(true);
    try {
      await api.put(`/cart/${productId}`, { quantity });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (productId) => {
    setBusy(true);
    try {
      await api.delete(`/cart/${productId}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove");
    } finally {
      setBusy(false);
    }
  };

  const clear = async () => {
    if (!window.confirm("Clear entire cart?")) return;
    setBusy(true);
    try {
      await api.delete("/cart/clear");
      load();
    } catch (err) {
      toast.error("Failed to clear cart");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState
          icon="🛒"
          title="Your cart is empty"
          subtitle="Add some supplements or accessories to get started."
          action={
            <Link to="/shop" className="btn-primary">
              Shop Now →
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-black">Shopping Cart ({items.length})</h1>
        <button className="btn-danger !py-2 text-sm" onClick={clear} disabled={busy}>
          Clear Cart
        </button>
      </div>

      <div className="space-y-4">
        {items.map((i) => {
          const price = i.product.discountPrice || i.product.price;
          return (
            <div key={i.product._id} className="card flex flex-wrap items-center gap-4 p-4">
              <Link to={`/products/${i.product._id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-800">
                {i.product.images?.length ? (
                  <img src={img(i.product.images)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl">🏋️</div>
                )}
              </Link>
              <div className="min-w-[160px] flex-1">
                <Link to={`/products/${i.product._id}`} className="font-bold hover:text-brand-400">
                  {i.product.productName}
                </Link>
                <p className="text-sm text-slate-400">{i.product.category}</p>
                <p className="text-sm font-semibold text-brand-400">
                  {formatINR(price)}
                  {i.product.price > i.product.discountPrice && (
                    <span className="ml-2 text-xs text-slate-500 line-through">{formatINR(i.product.price)}</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-outline !px-3 !py-1" onClick={() => updateQty(i.product._id, i.quantity - 1)} disabled={busy}>
                  −
                </button>
                <span className="w-8 text-center font-bold">{i.quantity}</span>
                <button
                  className="btn-outline !px-3 !py-1"
                  onClick={() => updateQty(i.product._id, i.quantity + 1)}
                  disabled={busy || i.quantity >= i.product.stock}
                >
                  +
                </button>
              </div>
              <div className="text-right">
                <p className="font-black">{formatINR(price * i.quantity)}</p>
                <button className="mt-1 text-xs text-red-400 hover:underline" onClick={() => remove(i.product._id)} disabled={busy}>
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card mt-6 ml-auto max-w-sm p-6">
        <div className="flex justify-between text-sm text-slate-400">
          <span>Subtotal</span>
          <span>{formatINR(total)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm text-slate-400">
          <span>Delivery</span>
          <span>Free</span>
        </div>
        <div className="my-4 border-t border-slate-800" />
        <div className="flex justify-between text-lg font-black">
          <span>Total</span>
          <span>{formatINR(total)}</span>
        </div>
        <button className="btn-primary mt-4 w-full" onClick={() => navigate("/checkout")}>
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
}