import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import Modal from "../components/Modal.jsx";
import Pagination from "../components/Pagination.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import EmptyState from "../components/EmptyState.jsx";
import RatingStars from "../components/RatingStars.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatINR, img } from "../utils/format.js";
import { payWithRazorpay } from "../utils/payment.js";
import { PLANS, planAmount } from "../utils/plans.js";

export default function MembershipPlans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ gyms: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const [buyGym, setBuyGym] = useState(null);
  const [plan, setPlan] = useState(PLANS[0]);
  const [busy, setBusy] = useState(false);

  const page = Number(params.get("page") || 1);
  const search = params.get("search") || "";
  const city = params.get("city") || "";
  const minPrice = params.get("minPrice") || "";
  const maxPrice = params.get("maxPrice") || "";
  const sort = params.get("sort") || "rating";

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
      .get("/gyms", { params: { search, city, minPrice, maxPrice, sort, page, limit: 8 } })
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

  const requireUser = (gym) => {
    if (!user) {
      navigate("/login", { state: { from: "/plans" } });
      return false;
    }
    if (user.role !== "user") {
      toast.error("Only user accounts can buy membership");
      return false;
    }
    return true;
  };

  const openBuy = (gym, p) => {
    if (!requireUser(gym)) return;
    setBuyGym(gym);
    setPlan(p);
  };

  const submitBuy = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const amount = planAmount(buyGym.membershipPrice, plan.months, plan.discount);
      await payWithRazorpay({
        amount,
        receipt: `membership-${buyGym.gymName}-${plan.plan}`,
        paymentMethod: "UPI",
      });
      const { data: res } = await api.post("/memberships/buy", {
        gym: buyGym._id,
        plan: plan.plan,
        amount,
      });
      toast.success(res.message);
      setBuyGym(null);
      navigate("/memberships");
    } catch (err) {
      toast.error(
        err.message || err.response?.data?.message || "Membership purchase failed"
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 text-center">
        <span className="chip mb-3 bg-brand-500/15 text-brand-400">
          💳 Flexible Membership Plans
        </span>
        <h1 className="text-3xl font-extrabold sm:text-4xl">
          Choose Your <span className="text-brand-400">Plan</span>
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-slate-400">
          Every gym, every plan — pay online, activate instantly. Longer plans =
          bigger savings.
        </p>
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
          placeholder="Min ₹/mo"
          value={minPrice}
          onChange={(e) => setQuery("minPrice", e.target.value)}
        />
        <input
          className="input"
          type="number"
          placeholder="Max ₹/mo"
          value={maxPrice}
          onChange={(e) => setQuery("maxPrice", e.target.value)}
        />
        <select
          className="input"
          value={sort}
          onChange={(e) => setQuery("sort", e.target.value)}
        >
          <option value="rating">Top Rated</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : data.gyms.length === 0 ? (
        <EmptyState
          icon="🎫"
          title="No plans available"
          subtitle="Try changing your search filters."
        />
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            {data.gyms.map((g) => (
              <div key={g._id} className="card overflow-hidden">
                <div className="relative h-44 w-full bg-slate-800">
                  {img(g.images) ? (
                    <img
                      src={img(g.images)}
                      alt={g.gymName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-5xl">
                      💪
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-extrabold text-white">
                          {g.gymName}
                        </h3>
                        <p className="text-xs text-slate-300">
                          📍 {g.city}, {g.state}
                        </p>
                      </div>
                      {g.verified && (
                        <span className="chip shrink-0 bg-emerald-500/20 text-emerald-300">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <RatingStars rating={g.rating} />
                      <span className="text-xs text-slate-300">
                        {g.rating?.toFixed?.(1) || "New"}
                      </span>
                      <span className="ml-auto rounded-lg bg-brand-500 px-2 py-0.5 text-[11px] font-bold text-slate-950">
                        {formatINR(g.membershipPrice)}/mo
                      </span>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-slate-800">
                  {PLANS.map((p) => {
                    const amount = planAmount(
                      g.membershipPrice,
                      p.months,
                      p.discount
                    );
                    return (
                      <button
                        key={p.plan}
                        onClick={() => openBuy(g, p)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-800/50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-base">
                            🎫
                          </span>
                          <div>
                            <p className="text-sm font-semibold">
                              {p.tag && (
                                <span className="chip mr-1 bg-brand-500/15 text-brand-400">
                                  {p.tag}
                                </span>
                              )}
                              {p.plan}
                            </p>
                            <p className="text-xs text-slate-500">
                              {p.months} month{p.months > 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-brand-400">
                            {formatINR(amount)}
                          </p>
                          {p.discount > 0 ? (
                            <p className="text-[11px] text-emerald-400">
                              Save {p.discount}%
                            </p>
                          ) : (
                            <p className="text-[11px] text-slate-500">Pay monthly</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="border-t border-slate-800 bg-slate-900/60 px-4 py-3">
                  <Link
                    to={`/gyms/${g._id}`}
                    className="text-xs font-semibold text-slate-400 transition hover:text-brand-400"
                  >
                    View gym details →
                  </Link>
                </div>
              </div>
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
          <p className="mt-4 text-center text-xs text-slate-500">
            Showing {data.total} gym{(data.total === 1 ? "" : "s")} with membership
            plans
          </p>
        </>
      )}

      <Modal
        open={!!buyGym}
        onClose={() => setBuyGym(null)}
        title={`Subscribe - ${plan.plan}`}
      >
        {buyGym && (
          <form onSubmit={submitBuy} className="space-y-4">
            <div className="card flex items-center gap-4 p-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-800 text-2xl">
                {img(buyGym.images) ? (
                  <img
                    src={img(buyGym.images)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "💪"
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold">{buyGym.gymName}</p>
                <p className="text-xs text-slate-400">
                  {buyGym.city} · {formatINR(buyGym.membershipPrice)}/mo
                </p>
              </div>
            </div>

            <div className="card flex items-center justify-between p-4">
              <div>
                <p className="text-3xl font-black text-brand-400">
                  {formatINR(
                    planAmount(
                      buyGym.membershipPrice,
                      plan.months,
                      plan.discount
                    )
                  )}
                </p>
                <p className="text-xs text-slate-400">
                  Plan: {plan.plan} · {plan.months} month{plan.months > 1 ? "s" : ""}
                  {plan.discount > 0 && (
                    <span className="ml-1 text-emerald-400">
                      · {plan.discount}% off
                    </span>
                  )}
                </p>
              </div>
              <span className="text-3xl">💳</span>
            </div>

            <div className="flex gap-2">
              {PLANS.map((p) => (
                <button
                  key={p.plan}
                  type="button"
                  onClick={() => setPlan(p)}
                  className={`flex-1 rounded-lg border px-2 py-2 text-center text-[11px] font-semibold transition ${
                    plan.plan === p.plan
                      ? "border-brand-500 bg-brand-500/15 text-brand-300"
                      : "border-slate-700 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  {p.plan}
                  <span className="block text-[10px] text-slate-500">
                    {formatINR(
                      planAmount(buyGym.membershipPrice, p.months, p.discount)
                    )}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={busy}
              className="btn-primary w-full !py-3"
            >
              {busy
                ? "Processing payment..."
                : `Pay ${formatINR(
                    planAmount(
                      buyGym.membershipPrice,
                      plan.months,
                      plan.discount
                    )
                  )} & Activate`}
            </button>
            <p className="text-center text-[11px] text-slate-500">
              Secure payment via Razorpay · Activate instantly
            </p>
          </form>
        )}
      </Modal>
    </div>
  );
}