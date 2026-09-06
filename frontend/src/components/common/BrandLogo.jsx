export default function BrandLogo({ className = "h-12 w-12", alt = "KRISHIQ" }) {
  return (
    <img
      src="/logo.png"
      alt={alt}
      className={`rounded-full bg-black object-cover shadow-soft ${className}`}
    />
  );
}
