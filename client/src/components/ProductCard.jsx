import { Link } from "react-router-dom";
import { formatINR, img } from "../utils/format.js";
import RatingStars from "./RatingStars.jsx";

export default function ProductCard({ product }) {
  const image = img(product.images);
  const discount =
    product.price > product.discountPrice
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 0;

  return (
    <Link
      to={`/products/${product._id}`}
      className="card group overflow-hidden transition hover:border-slate-600 hover:shadow-xl hover:shadow-brand-500/5"
    >
      <div className="relative h-44 w-full overflow-hidden bg-slate-800">
        {image ? (
          <img
            src={image}
            alt={product.productName}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-5xl">
            🏋️
          </div>
        )}
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-500 px-2.5 py-1 text-xs font-bold text-white">
            {discount}% OFF
          </span>
        )}
        {product.stock <= 5 && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold text-white">
            Only {product.stock} left
          </span>
        )}
      </div>
      <div className="p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-400">
          {product.category}
        </span>
        <h3 className="mt-0.5 truncate text-base font-bold group-hover:text-brand-400">
          {product.productName}
        </h3>
        <p className="text-xs text-slate-400">Brand: {product.brand}</p>
        <div className="mt-2 flex items-center gap-2">
          <RatingStars rating={product.rating} size="text-xs" />
          <span className="text-xs text-slate-500">
            ({product.totalReviews || 0})
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-extrabold text-white">
              {formatINR(product.discountPrice)}
            </span>
            {discount > 0 && (
              <span className="ml-2 text-sm text-slate-500 line-through">
                {formatINR(product.price)}
              </span>
            )}
          </div>
          {product.stock > 0 ? (
            <span className="chip bg-emerald-500/10 text-emerald-400">In Stock</span>
          ) : (
            <span className="chip bg-red-500/10 text-red-400">Out of Stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}