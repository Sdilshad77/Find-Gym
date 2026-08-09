export default function LoadingSpinner({ size = "md" }) {
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-9 w-9 border-2",
    lg: "h-14 w-14 border-4",
  };
  return (
    <div
      className={`${sizes[size]} animate-spin rounded-full border-slate-700 border-t-brand-500`}
    />
  );
}