export const formatINR = (value) => {
  const num = Number(value) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatPricePerKg = (value) => `₹${Number(value).toFixed(0)}/kg`;

export default function formatPrice(value) {
  return formatINR(value);
}
