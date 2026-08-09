import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import GymCard from "../components/GymCard.jsx";
import Pagination from "../components/Pagination.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function GymList() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ gyms: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const page = Number(params.get("page") || 1);
  const search = params.get("search") || "";
  const city = params.get("city") || "";
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
      .get("/gyms", { params: { search, city, minPrice, maxPrice, sort, page, limit: 9 } })
      .then((res) =>
        setData({
          gyms: res.data.gyms,
          total: res.data.total,
          page: res.data.page,
          totalPages: res.data.totalPages,
        })
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, city, minPrice, maxPrice, sort, page]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">Find Your Gym</h1>
        <p className="text-slate-400">{data.total} gyms found</p>
      </div>

      <div className="card mb-8 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
        <input
          className="input lg:col-span-2"
          placeholder="Search gym name..."
          value={search}
          onChange={(e) => setQuery("search", e.target.value)}
        />
        <input
          className="input"
          placeholder="City (e.g. delhi)"
          value={city}
          onChange={(e) => setQuery("city", e.target.value)}
        />
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
      ) : data.gyms.length === 0 ? (
        <EmptyState
          icon="🏋️"
          title="No gyms found"
          subtitle="Try changing your search filters."
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.gyms.map((g) => (
              <GymCard key={g._id} gym={g} />
            ))}
          </div>
          <div className="mt-10">
            <Pagination page={data.page} totalPages={data.totalPages} onPage={(p) => setParams({ ...Object.fromEntries(params), page: String(p) })} />
          </div>
        </>
      )}
    </div>
  );
}