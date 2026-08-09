export default function RatingStars({ rating = 0, size = "text-sm" }) {
  const rounded = Math.round(Number(rating) || 0);
  return (
    <span className={`flex items-center gap-0.5 ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rounded ? "text-amber-400" : "text-slate-700"}
        >
          ★
        </span>
      ))}
    </span>
  );
}