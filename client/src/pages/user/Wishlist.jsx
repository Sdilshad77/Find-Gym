import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { formatINR, img, formatDate } from "../../utils/format.js";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = () => {
    api
      .get("/wishlist")
      .then((res) => setWishlist(res.data.wishlist))
      .catch(() => toast.error("Failed to load wishlist"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const items = wishlist?.products?.filter((w) => w.product) || [];

  const remove = async (productId) => {
    setBusy(true);
    try {
      await api.delete(`/wishlist/${productId}`);
      load();
    } catch (err) {
      toast.error("Failed to remove");
    } finally {
      setBusy(false);
    }
  };

  const addToCart = async (productId) => {
    setBusy(true);
    try {
      await api.post("/cart", { productId, quantity: 1 });
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-black">My Wishlist ({items.length})</h1>
      {items.length === 0 ? (
        <EmptyState
          icon="❤️"
          title="Wishlist is empty"
          subtitle="Save products you love."
          action={
            <Link to="/shop" className="btn-primary">
              Browse Shop →
            </Link>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((w) => {
            const p = w.product;
            return (
              <div key={p._id} className="card overflow-hidden">
                <Link to={`/products/${p._id}`} className="block h-40 bg-slate-800">
                  {p.images?.length ? (
                    <img src={img(p.images)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl">🏋️</div>
                  )}
                </Link>
                <div className="p-4">
                  <Link to={`/products/${p._id}`} className="font-bold hover:text-brand-400">
                    {p.productName}
                  </Link>
                  <p className="text-sm text-slate-400">
                    {formatINR(p.discountPrice)}
                    {p.price > p.discountPrice && (
                      <span className="ml-2 text-xs line-through">{formatINR(p.price)}</span>
                    )}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-600">
                    Saved on {formatDate(w.addedAt)}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button className="btn-primary flex-1 !py-1.5 text-sm" disabled={busy || p.stock <= 0} onClick={() => addToCart(p._id)}>
                      Add to Cart
                    </button>
                    <button className="btn-outline !py-1.5 text-sm" disabled={busy} onClick={() => remove(p._id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}