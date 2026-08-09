export default function EmptyState({ icon = "📭", title, subtitle, action }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 text-5xl">{icon}</div>
      <h3 className="mb-1 text-lg font-bold">{title}</h3>
      {subtitle && <p className="mb-4 text-sm text-slate-400">{subtitle}</p>}
      {action}
    </div>
  );
}