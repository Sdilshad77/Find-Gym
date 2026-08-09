export const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const formatDateTime = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export const img = (urls) => {
  if (Array.isArray(urls) && urls.length > 0 && urls[0]) return urls[0];
  if (typeof urls === "string" && urls) return urls;
  return "";
};

export const statusColor = (status) => {
  const map = {
    Pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Active: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Confirmed: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    Processing: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    Shipped: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
    Delivered: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Rejected: "bg-red-500/15 text-red-400 border-red-500/30",
    Cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
    Expired: "bg-slate-500/15 text-slate-400 border-slate-500/30",
    Failed: "bg-red-500/15 text-red-400 border-red-500/30",
    Refunded: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  };
  return map[status] || "bg-slate-500/15 text-slate-400 border-slate-500/30";
};