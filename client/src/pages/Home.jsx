import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios.js";
import GymCard from "../components/GymCard.jsx";
import ProductCard from "../components/ProductCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const FEATURES = [
  {
    icon: "✅",
    title: "Verified Gyms",
    desc: "Every gym is reviewed & verified before listing. No fake listings, guaranteed quality.",
  },
  {
    icon: "🎫",
    title: "Flexible Plans",
    desc: "Monthly to yearly — pay online in seconds and get instant plan activation.",
  },
  {
    icon: "🛡️",
    title: "Secure Payments",
    desc: "Razorpay-powered checkout. Your money is 100% protected with refund support.",
  },
  {
    icon: "🤖",
    title: "AI Coach 24/7",
    desc: "Free workout plans, diet tips & fitness answers — powered by AI, always on.",
  },
];

const STATS = [
  { value: "500+", label: "Gyms Listed" },
  { value: "50+", label: "Cities" },
  { value: "25K+", label: "Happy Members" },
  { value: "4.8★", label: "Avg. Rating" },
];

const PLAN_PERKS = [
  { icon: "⚡", text: "Instant activation after payment" },
  { icon: "💸", text: "Up to 15% off on yearly plans" },
  { icon: "🎁", text: "Free trial before you commit" },
  { icon: "🔄", text: "Switch gyms anytime, anywhere" },
];

export default function Home() {
  const [gyms, setGyms] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/gyms?limit=6"),
      api.get("/products", { params: { limit: 6, sort: "rating" } }),
    ])
      .then(([g, p]) => {
        setGyms(g.data.gyms || []);
        setProducts(p.data.products || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
        <div className="absolute -top-40 left-1/4 h-[28rem] w-[28rem] rounded-full bg-brand-500/15 blur-[120px]" />
        <div className="absolute top-10 right-1/4 h-72 w-72 rounded-full bg-sky-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 text-center sm:pt-28">
          <span className="chip mb-6 bg-brand-500/15 text-brand-400 ring-1 ring-brand-500/30">
            🚀 India ka #1 Gym Discovery Platform
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
            Train Smarter.{" "}
            <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-lime-300 bg-clip-text text-transparent">
              Live Stronger.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-400">
            Discover verified gyms, grab flexible membership plans, book free
            trials & shop supplements — all in one place.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link to="/plans" className="btn-primary !px-8 !py-4 text-base">
              🎫 Get Membership Plans
            </Link>
            <Link to="/gyms" className="btn-outline !px-8 !py-4 text-base">
              Explore Gyms →
            </Link>
          </div>

          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="card px-4 py-4">
                <p className="text-2xl font-black text-brand-400">{s.value}</p>
                <p className="mt-0.5 text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY US ================= */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 text-center">
          <span className="chip mb-3 bg-brand-500/15 text-brand-400">
            Why GymHub
          </span>
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Everything You Need to <span className="text-brand-400">Start</span>
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card card-hover p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/15 text-2xl ring-1 ring-brand-500/30">
                {f.icon}
              </span>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PLANS PROMO ================= */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-500 to-lime-400 p-8 sm:p-12">
          <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-slate-950/20 blur-2xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="chip bg-slate-950/25 text-white">
                🎫 Membership Plans
              </span>
              <h2 className="mt-4 text-3xl font-black text-slate-950 sm:text-4xl">
                Pick a Plan, Walk In Tomorrow
              </h2>
              <p className="mt-3 max-w-md font-medium text-slate-900/80">
                Browse plans across every gym, compare prices in seconds and pay
                securely online. Long-term plans unlock bigger discounts.
              </p>
              <Link
                to="/plans"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-8 py-4 font-bold text-lime-300 shadow-xl transition hover:bg-slate-900"
              >
                Browse Plans →
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {PLAN_PERKS.map((perk) => (
                <div
                  key={perk.text}
                  className="flex items-center gap-3 rounded-2xl bg-white/15 p-4 font-semibold text-slate-950 backdrop-blur"
                >
                  <span className="text-xl">{perk.icon}</span>
                  <span className="text-sm">{perk.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= GYMS & PRODUCTS ================= */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold">Featured Gyms</h2>
              <p className="text-sm text-slate-400">
                Top-rated gyms near you — view their plans
              </p>
            </div>
            <Link
              to="/gyms"
              className="text-sm font-semibold text-brand-400 hover:text-brand-300"
            >
              View all →
            </Link>
          </div>
          {gyms.length === 0 ? (
            <p className="text-slate-500">No gyms yet. Be the first to add one!</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gyms.map((g) => (
                <GymCard key={g._id} gym={g} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-extrabold">Top Supplements</h2>
            <p className="text-sm text-slate-400">
              Bestselling nutrition &amp; gear
            </p>
          </div>
          <Link
            to="/shop"
            className="text-sm font-semibold text-brand-400 hover:text-brand-300"
          >
            Shop all →
          </Link>
        </div>
        {products.length === 0 ? (
          <p className="text-slate-500">No products yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* ================= OWNER CTA ================= */}
      <div className="mx-auto max-w-7xl px-4 pb-20">
        <div className="card card-hover overflow-hidden p-10 text-center sm:p-16">
          <span className="mx-auto block w-fit rounded-full bg-brand-500/15 px-4 py-1 text-xs font-bold text-brand-400 ring-1 ring-brand-500/30">
            👑 For Gym Owners
          </span>
          <h2 className="mt-4 text-3xl font-black sm:text-4xl">
            Own a Gym? <span className="text-brand-400">Grow With GymHub</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-400">
            List your gym, receive trial bookings, sell supplements &amp; manage
            everything from one dashboard.
          </p>
          <Link
            to="/register?role=gymOwner"
            className="btn-primary mt-6 !px-8 !py-3.5 text-base"
          >
            Register as Gym Owner →
          </Link>
        </div>
      </div>
    </div>
  );
}