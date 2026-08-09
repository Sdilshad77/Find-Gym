import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import RatingStars from "../components/RatingStars.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { formatINR, img, formatDate } from "../utils/format.js";

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data.product))
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
      </div>
    );
  }

  const isOwner = user && product.seller?._id === user._id;

  const addToCart = async () => {
    if (!user || user.role !== "user") {
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }
    setBusy(true);
    try {
      await api.post("/cart", { productId: id, quantity: qty });
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setBusy(false);
    }
  };

  const toggleWishlist = async () => {
    if (!user || user.role !== "user") {
      navigate("/login", { state: { from: `/products/${id}` } });
      return;
    }
    setBusy(true);
    try {
      await api.post(`/wishlist/${id}`);
      toast.success("Added to wishlist!");
    } catch (err) {
      if (err.response?.status === 400) {
        await api.delete(`/wishlist/${id}`);
        toast.success("Removed from wishlist!");
      } else {
        toast.error(err.response?.data?.message || "Failed");
      }
    } finally {
      setBusy(false);
    }
  };

  const images = product.images?.length ? product.images : [];
  const discount =
    product.price > product.discountPrice
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-6 text-sm text-slate-400">
        <Link to="/shop" className="hover:text-brand-400">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-200">{product.productName}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="h-96 w-full bg-slate-900">
            {images.length > 0 ? (
              <img src={img(product.images)} alt={product.productName} className="h-full w-full object-contain" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-8xl">🏋️</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 p-3">
              {images.map((im, i) => (
                <div key={i} className="h-14 w-20 overflow-hidden rounded-lg border border-slate-700">
                  <img src={im} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="chip bg-brand-500/15 text-brand-400">{product.category}</span>
          <h1 className="mt-3 text-3xl font-black">{product.productName}</h1>
          <p className="mt-1 text-sm text-slate-400">Brand: {product.brand}</p>

          <div className="mt-3 flex items-center gap-2">
            <RatingStars rating={product.rating} />
            <span className="text-sm text-slate-400">
              {Number(product.rating).toFixed(1)} ({product.totalReviews || 0} ratings)
            </span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-4xl font-black text-brand-400">{formatINR(product.discountPrice)}</span>
            {discount > 0 && (
              <>
                <span className="text-xl text-slate-500 line-through">{formatINR(product.price)}</span>
                <span className="chip bg-emerald-500/15 text-emerald-400">Save {discount}%</span>
              </>
            )}
          </div>

          <div className="mt-6">
            <p className="label">Quantity</p>
            <div className="flex items-center gap-3">
              <button
                className="btn-outline !px-4 !py-1.5"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="w-10 text-center text-lg font-bold">{qty}</span>
              <button
                className="btn-outline !px-4 !py-1.5"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              >
                +
              </button>
              <span className={`chip ${product.stock > 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn-primary flex-1" onClick={addToCart} disabled={busy || product.stock <= 0}>
              {busy ? "Adding..." : "🛒 Add to Cart"}
            </button>
            <button className="btn-outline flex-1" onClick={toggleWishlist} disabled={busy}>
              ♥ Wishlist
            </button>
          </div>

          {product.gym && (
            <Link
              to={`/gyms/${product.gym._id}`}
              className="mt-4 block rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm transition hover:border-slate-600"
            >
              Sold by <span className="font-semibold text-brand-400">{product.gym.gymName}</span>{" "}
              ({product.gym.city})
            </Link>
          )}

          {isOwner && (
            <div className="mt-4 flex gap-3">
              <Link to={`/owner/products/${id}/edit`} className="btn-outline flex-1 text-sm">
                Edit Product
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="card mt-10 p-6">
        <h2 className="mb-2 text-xl font-bold">Description</h2>
        <p className="text-slate-300">{product.description}</p>
        <p className="mt-6 text-xs text-slate-500">
          Listed on {formatDate(product.createdAt)} by {product.seller?.name}
        </p>
      </div>
    </div>
  );
}