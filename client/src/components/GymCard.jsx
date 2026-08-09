import { Link } from "react-router-dom";
import { useState } from "react";
import RatingStars from "./RatingStars.jsx";
import { formatINR, img } from "../utils/format.js";

export default function GymCard({ gym }) {
  const image = img(gym.images);
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/gyms/${gym._id}`}
      className="card group overflow-hidden transition hover:border-slate-600 hover:shadow-xl hover:shadow-brand-500/5"
    >
      <div className="relative h-48 w-full overflow-hidden bg-slate-800">
        {image && !imgError ? (
          <img
            src={image}
            alt={gym.gymName}
            onError={() => setImgError(true)}
            className="block h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-5xl">
            💪
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          ₹{gym.membershipPrice}/mo
        </span>
        {gym.verified && (
          <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white">
            ✓ Verified
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-1 truncate text-base font-bold group-hover:text-brand-400">
          {gym.gymName}
        </h3>
        <p className="mb-3 text-sm text-slate-400">
          📍 {gym.city}, {gym.state}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RatingStars rating={gym.rating} size="text-xs" />
            <span className="text-xs text-slate-400">
              {Number(gym.rating).toFixed(1)} ({gym.totalReviews || 0})
            </span>
          </div>
          <span className="text-xs text-slate-500">
            {gym.openingTime} - {gym.closingTime}
          </span>
        </div>
        {gym.facilities?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {gym.facilities.slice(0, 3).map((f, i) => (
              <span
                key={i}
                className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] text-slate-300"
              >
                {f}
              </span>
            ))}
            {gym.facilities.length > 3 && (
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] text-slate-500">
                +{gym.facilities.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}