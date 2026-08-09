import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { formatINR, img } from "../../utils/format.js";

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    api
      .get("/products?limit=100")
      .then((res) => setProducts(res.data.products || []))
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setBusyId(id);
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      load();
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
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-black">My Products</h1>
        <Link to="/owner/products/new" className="btn-primary">
          + Add Product
        </Link>
      </div>
      {products.length === 0 ? (
        <EmptyState
          icon="🏋️"
          title="No products yet"
          subtitle="Sell supplements & accessories from your gym."
          action={
            <Link to="/owner/products/new" className="btn-primary">
              Add First Product
            </Link>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p._id} className="card overflow-hidden">
              <div className="relative h-40 bg-slate-800">
                {p.images?.length ? (
                  <img src={img(p.images)} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl">🏋️</div>
                )}
                {p.stock <= 5 && (
                  <span className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white">
                    Low stock
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-[11px] font-semibold uppercase text-brand-400">{p.category}</p>
                <p className="font-bold">{p.productName}</p>
                <p className="text-sm text-slate-400">
                  {formatINR(p.discountPrice)}
                  {p.price > p.discountPrice && (
                    <span className="ml-2 text-xs line-through">{formatINR(p.price)}</span>
                  )}
                  <span className={`ml-2 text-xs ${p.stock > 5 ? "text-emerald-400" : "text-red-400"}`}>
                    {p.stock} in stock
                  </span>
                </p>
                <div className="mt-3 flex gap-2">
                  <Link to={`/owner/products/${p._id}/edit`} className="btn-outline flex-1 !py-1.5 text-sm">
                    Edit
                  </Link>
                  <button
                    className="btn-danger flex-1 !py-1.5 text-sm"
                    disabled={busyId === p._id}
                    onClick={() => remove(p._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}