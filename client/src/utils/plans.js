export const PLANS = [
  { plan: "Monthly", months: 1, discount: 0, tag: "" },
  { plan: "Quarterly", months: 3, discount: 5, tag: "" },
  { plan: "Half-Yearly", months: 6, discount: 10, tag: "Popular" },
  { plan: "Yearly", months: 12, discount: 15, tag: "Best Value" },
];

export const planAmount = (monthlyPrice, months, discount) =>
  Math.round(monthlyPrice * months * (1 - (discount || 0) / 100));