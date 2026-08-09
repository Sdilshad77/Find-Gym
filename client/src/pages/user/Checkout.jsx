import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { formatINR, img } from "../../utils/format.js";
import { payWithRazorpay } from "../../utils/payment.js";

const PAY_METHODS = ["UPI", "Card", "Net Banking", "Wallet"];

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("UPI");

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

  const clearCart = async () => {
    try {
      await api.delete("/cart/clear");
    } catch {
      /* ignore */
    }
  };

  const createOrder = async () => {
    const { data } = await api.post("/orders", {
      products: items.map((i) => ({ product: i.product._id, quantity: i.quantity })),
      paymentMethod,
      shippingAddress: address,
    });
    return data.order;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!items.length) return;
    setBusy(true);
    try {
      const order = await createOrder();
      await payWithRazorpay({
        amount: total,
        receipt: `order-${order._id}`,
        orderId: order._id,
        paymentMethod,
      });
      toast.success("Payment successful! Order placed 🎉");
      navigate("/orders");
    } catch (err) {
      toast.error(err.message || err.response?.data?.message || "Checkout failed");
      // payment fail hone par cart wapas restore hota hai (order bana hai, pay bakki)
    } finally {
      setBusy(false);
    }
  };

  const submitCod = async (e) => {
    e.preventDefault();
    if (!items.length) return;
    setBusy(true);
    try {
      const order = await createOrder();
      await api.post("/payments", { order: order._id, paymentMethod: "COD" });
      await clearCart();
      toast.success("Order placed successfully (COD) 🎉");
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
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
          icon="🛍️"
          title="Nothing to checkout"
          subtitle="Your cart is empty."
          action={
            <Link to="/shop" className="btn-primary">
              Go Shopping →
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-black">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div className="card p-6">
            <h2 className="mb-4 text-lg font-bold">1 · Shipping Address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Full Name</label>
                <input className="input" required value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" required value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Address</label>
                <input className="input" required value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} />
              </div>
              <div>
                <label className="label">City</label>
                <input className="input" required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              </div>
              <div>
                <label className="label">State</label>
                <input className="input" required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Pincode</label>
                <input className="input" required value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 text-lg font-black">2 · Payment Method</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  paymentMethod === "COD"
                    ? "border-brand-500 bg-brand-500/10"
                    : "border-slate-700 hover:border-slate-500"
                }`}
              >
                <p className="font-bold">💵 Cash on Delivery</p>
                <p className="text-xs text-slate-400">Pay when you receive</p>
              </button>
              {PAY_METHODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    paymentMethod === m
                      ? "border-brand-500 bg-brand-500/10"
                      : "border-slate-700 hover:border-slate-500"
                  }`}
                >
                  <p className="font-bold">{m === "Card" ? "💳 Credit / Debit Card" : m === "UPI" ? "📱 UPI" : m === "Wallet" ? "👛 Wallet" : "🏦 Net Banking"}</p>
                  <p className="text-xs text-slate-400">Pay online via Razorpay</p>
                </button>
              ))}
            </div>
            {paymentMethod === "COD" ? (
              <button onClick={submitCod} className="btn-primary mt-6 w-full" disabled={busy}>
                {busy ? "Placing order..." : `Place Order (${formatINR(total)})`}
              </button>
            ) : (
              <button onClick={submit} className="btn-primary mt-6 w-full" disabled={busy}>
                {busy ? "Processing payment..." : `Pay ${formatINR(total)} & Place Order`}
              </button>
            )}
            <p className="mt-2 text-center text-xs text-slate-500">
              Secure checkout powered by Razorpay
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card sticky top-24 p-6">
            <h2 className="mb-4 text-lg font-black">Order Summary</h2>
            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i.product._id} className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-800">
                    {i.product.images?.length ? (
                      <img src={img(i.product.images)} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">🏋️</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="truncate text-sm font-semibold">{i.product.productName}</p>
                    <p className="text-xs text-slate-500">Qty: {i.quantity}</p>
                  </div>
                  <p className="text-sm font-bold">
                    {formatINR((i.product.discountPrice || i.product.price) * i.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="my-4 border-t border-slate-800" />
            <div className="flex justify-between text-sm text-slate-400">
              <span>Subtotal</span>
              <span>{formatINR(total)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-slate-400">
              <span>Delivery</span>
              <span className="text-emerald-400">Free</span>
            </div>
            <div className="my-4 border-t border-slate-800" />
            <div className="flex justify-between text-xl font-black">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}