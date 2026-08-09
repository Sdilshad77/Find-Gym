import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import ProductCard from "../components/ProductCard.jsx";
import Pagination from "../components/Pagination.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import EmptyState from "../components/EmptyState.jsx";

const CATEGORIES = [
  "Protein",
  "Creatine",
  "Mass Gainer",
  "Pre Workout",
  "BCAA",
  "Accessories",
  "Others",
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ products: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const page = Number(params.get("page") || 1);
  const search = params.get("search") || "";
  const category = params.get("category") || "";
  const minPrice = params.get("minPrice") || "";
  const maxPrice = params.get("maxPrice") || "";
  const sort = params.get("sort") || "newest";

  const setQuery = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    setParams(next);
  };

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", {
        params: { search, category, minPrice, maxPrice, sort, page, limit: 12 },
      })
      .then((res) =>
        setData({
          products: res.data.products,
          total: res.data.total,
          page: res.data.page,
          totalPages: res.data.totalPages,
        })
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category, minPrice, maxPrice, sort, page]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">Shop Supplements & Gear</h1>
        <p className="text-slate-400">{data.total} products</p>
      </div>

      <div className="card mb-8 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
        <input
          className="input lg:col-span-2"
          placeholder="Search product..."
          value={search}
          onChange={(e) => setQuery("search", e.target.value)}
        />
        <select
          className="input"
          value={category}
          onChange={(e) => setQuery("category", e.target.value)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          className="input"
          type="number"
          placeholder="Min ₹"
          value={minPrice}
          onChange={(e) => setQuery("minPrice", e.target.value)}
        />
        <input
          className="input"
          type="number"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => setQuery("maxPrice", e.target.value)}
        />
        <select
          className="input"
          value={sort}
          onChange={(e) => setQuery("sort", e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : data.products.length === 0 ? (
        <EmptyState icon="🛒" title="No products found" subtitle="Try different filters." />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {data.products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          <div className="mt-10">
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              onPage={(p) =>
                setParams({ ...Object.fromEntries(params), page: String(p) })
              }
            />
          </div>
        </>
      )}
    </div>
  );
}