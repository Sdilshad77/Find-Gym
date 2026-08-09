import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Modal from "../components/Modal.jsx";
import RatingStars from "../components/RatingStars.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { formatINR, formatDate, img } from "../utils/format.js";
import { payWithRazorpay } from "../utils/payment.js";
import { PLANS, planAmount } from "../utils/plans.js";

const SLOTS = [
  "06:00 - 08:00",
  "08:00 - 10:00",
  "10:00 - 12:00",
  "16:00 - 18:00",
  "18:00 - 20:00",
  "20:00 - 22:00",
];

export default function GymDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [gym, setGym] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  const [bookOpen, setBookOpen] = useState(false);
  const [membOpen, setMembOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const [bookForm, setBookForm] = useState({ date: "", slot: "", note: "" });
  const [bookBusy, setBookBusy] = useState(false);

  const [plan, setPlan] = useState(PLANS[0]);
  const [membBusy, setMembBusy] = useState(false);

  const [revForm, setRevForm] = useState({ rating: 5, comment: "" });
  const [revBusy, setRevBusy] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.get(`/gyms/${id}`), api.get(`/reviews/${id}`)])
      .then(([g, r]) => {
        setGym(g.data.gym);
        setReviews(r.data.reviews || []);
      })
      .catch(() => toast.error("Failed to load gym"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!gym) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h2 className="text-2xl font-bold">Gym not found</h2>
      </div>
    );
  }

  const images = gym.images?.length ? gym.images : [];

  const requireUser = () => {
    if (!user) {
      navigate("/login", { state: { from: `/gyms/${id}` } });
      return false;
    }
    if (user.role !== "user") {
      toast.error("Only user accounts can book / buy membership");
      return false;
    }
    return true;
  };

  const amountFor = (p) => planAmount(gym.membershipPrice, p.months, p.discount);

  const submitBooking = async (e) => {
    e.preventDefault();
    if (!requireUser()) return;
    setBookBusy(true);
    try {
      await api.post("/bookings", {
        gymId: id,
        date: bookForm.date,
        slot: bookForm.slot,
        note: bookForm.note,
      });
      toast.success("Booking request sent! Gym owner will confirm it.");
      setBookOpen(false);
      setBookForm({ date: "", slot: "", note: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBookBusy(false);
    }
  };

  const buyMembership = async (e) => {
    e.preventDefault();
    if (!requireUser()) return;
    setMembBusy(true);
    try {
      const amount = amountFor(plan);
      await payWithRazorpay({
        amount,
        receipt: `membership-${gym.gymName}-${plan.plan}`,
        paymentMethod: "UPI",
      });
      const { data } = await api.post("/memberships/buy", {
        gym: id,
        plan: plan.plan,
        amount,
      });
      toast.success(data.message);
      setMembOpen(false);
    } catch (err) {
      toast.error(
        err.message || err.response?.data?.message || "Membership purchase failed"
      );
    } finally {
      setMembBusy(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: `/gyms/${id}` } });
      return;
    }
    setRevBusy(true);
    try {
      await api.post(`/reviews/${id}`, revForm);
      toast.success("Review added!");
      setReviewOpen(false);
      setRevForm({ rating: 5, comment: "" });
      const r = await api.get(`/reviews/${id}`);
      setReviews(r.data.reviews || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add review");
    } finally {
      setRevBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="relative h-80 w-full bg-slate-900 sm:h-96">
              {images.length > 0 ? (
                <img
                  src={images[activeImg] || img(gym.images)}
                  alt={gym.gymName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-7xl">
                  💪
                </div>
              )}
              {gym.verified && (
                <span className="absolute left-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                  ✓ Verified
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 p-3">
                {images.map((im, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`h-16 w-24 overflow-hidden rounded-lg border-2 transition ${
                      activeImg === i
                        ? "border-brand-500"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={im} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="card mt-6 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black">{gym.gymName}</h1>
                <p className="mt-1 text-slate-400">
                  📍 {gym.address}, {gym.city}, {gym.state} - {gym.pincode}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <RatingStars rating={gym.rating} />
                  <span className="text-sm text-slate-400">
                    {Number(gym.rating).toFixed(1)} ({gym.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-4 text-right">
                <p className="text-xs text-slate-400">Membership from</p>
                <p className="text-2xl font-black text-brand-400">
                  {formatINR(gym.membershipPrice)}
                  <span className="text-sm font-medium text-slate-400">/mo</span>
                </p>
                <button
                  onClick={() => {
                    if (requireUser()) setMembOpen(true);
                  }}
                  className="btn-primary mt-2 w-full !py-1.5 text-sm"
                >
                  Subscribe
                </button>
                <button
                  onClick={() => {
                    if (requireUser()) setBookOpen(true);
                  }}
                  className="btn-outline mt-2 w-full !py-1.5 text-sm"
                >
                  Book Trial Slot
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
              <p>🕐 {gym.openingTime} - {gym.closingTime}</p>
              <p>📞 {gym.phone}</p>
              {gym.email && <p>✉️ {gym.email}</p>}
              {gym.location?.latitude && (
                <p>
                  🌐 Lat {gym.location.latitude}, Lng {gym.location.longitude}
                </p>
              )}
            </div>

            <h3 className="mt-6 text-lg font-bold">About</h3>
            <p className="mt-2 text-slate-300">{gym.description}</p>

            {gym.facilities?.length > 0 && (
              <>
                <h3 className="mt-6 text-lg font-bold">Facilities</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {gym.facilities.map((f, i) => (
                    <span key={i} className="chip bg-slate-800 text-slate-300">
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </>
            )}

            <p className="mt-6 text-xs text-slate-500">
              Owned by {gym.owner?.name}
              {gym.owner?.email ? ` (${gym.owner.email})` : ""}
            </p>
          </div>

          <div className="card mt-6 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Reviews ({reviews.length})</h2>
              <button onClick={() => setReviewOpen(true)} className="btn-outline !py-2 text-sm">
                Write Review
              </button>
            </div>
            {reviews.length === 0 ? (
              <p className="text-slate-500">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r._id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                          {r.user?.name?.[0]?.toUpperCase() || "U"}
                        </span>
                        <div>
                          <p className="text-sm font-semibold">{r.user?.name || "User"}</p>
                          <RatingStars rating={r.rating} size="text-xs" />
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-300">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-bold">Membership Plans</h3>
            <div className="mt-4 space-y-3">
              {PLANS.map((p) => {
                const base = amountFor(p);
                const savings = p.discount || 0;
                return (
                  <button
                    key={p.plan}
                    onClick={() => {
                      if (requireUser()) {
                        setPlan(p);
                        setMembOpen(true);
                      }
                    }}
                    className="card flex w-full items-center justify-between gap-3 p-4 text-left transition hover:border-brand-500"
                  >
                    <div>
                      <p className="font-bold">
                        {p.plan}{" "}
                        {p.tag && (
                          <span className="chip ml-1 bg-brand-500/15 text-brand-400">
                            {p.tag}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">
                        {p.months} month{p.months > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-brand-400">{formatINR(base)}</p>
                      {savings > 0 && (
                        <p className="text-[11px] text-emerald-400">Save {savings}%</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card p-6 text-sm text-slate-400">
            <h3 className="mb-2 text-lg font-bold text-slate-200">Booking 💡</h3>
            <p>
              Book a trial slot — the gym owner will confirm your request. You'll
              see the status in your bookings page.
            </p>
          </div>
        </div>
      </div>

      {/* Book Modal */}
      <Modal open={bookOpen} onClose={() => setBookOpen(false)} title="Book a Trial Slot">
        <form onSubmit={submitBooking} className="space-y-4">
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              required
              className="input"
              value={bookForm.date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Time Slot</label>
            <select
              required
              className="input"
              value={bookForm.slot}
              onChange={(e) => setBookForm({ ...bookForm, slot: e.target.value })}
            >
              <option value="">Select slot</option>
              {SLOTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Note (optional)</label>
            <textarea
              className="input"
              rows="3"
              placeholder="Any special requirement..."
              value={bookForm.note}
              onChange={(e) => setBookForm({ ...bookForm, note: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={bookBusy}>
            {bookBusy ? "Sending..." : "Submit Booking Request"}
          </button>
        </form>
      </Modal>

      {/* Membership Modal */}
      <Modal open={membOpen} onClose={() => setMembOpen(false)} title={`Subscribe - ${plan.plan}`}>
        <form onSubmit={buyMembership} className="space-y-4">
          <div className="rounded-2xl border border-slate-700 p-4 text-center">
            <p className="text-sm text-slate-400">Amount to pay</p>
            <p className="text-3xl font-black text-brand-400">{formatINR(amountFor(plan))}</p>
            <p className="mt-1 text-xs text-slate-500">
              Plan: {plan.plan} · {plan.months} month(s)
            </p>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={membBusy}>
            {membBusy ? "Processing payment..." : `Pay ${formatINR(amountFor(plan))} & Activate`}
          </button>
          <p className="text-center text-xs text-slate-500">
            Secure payment via Razorpay (UPI / Card / Net Banking / Wallet)
          </p>
        </form>
      </Modal>

      {/* Review Modal */}
      <Modal open={reviewOpen} onClose={() => setReviewOpen(false)} title="Write a Review">
        <form onSubmit={submitReview} className="space-y-4">
          <div>
            <label className="label">Rating</label>
            <div className="flex gap-2 text-3xl">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRevForm({ ...revForm, rating: s })}
                  className={s <= revForm.rating ? "text-amber-400" : "text-slate-700"}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Comment</label>
            <textarea
              className="input"
              rows="4"
              placeholder="Share your experience..."
              value={revForm.comment}
              onChange={(e) => setRevForm({ ...revForm, comment: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={revBusy}>
            {revBusy ? "Posting..." : "Submit Review"}
          </button>
        </form>
      </Modal>
    </div>
  );
}