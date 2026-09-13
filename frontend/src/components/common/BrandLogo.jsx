export default function BrandLogo({ className = "h-12 w-12", alt = "KRISHIQ", src = "/logo.png" }) {
  return (
    <img
      src={src || "/logo.png"}
      alt={alt}
      className={`rounded-full bg-black object-cover shadow-soft ${className}`}
    />
  );
}
