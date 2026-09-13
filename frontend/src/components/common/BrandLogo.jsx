export default function BrandLogo({ className = "h-12 w-12", alt = "Krishiq logo", src = "/logo.png" }) {
  return (
    <img
      src={src || "/logo.png"}
      alt={alt}
      width="48"
      height="48"
      decoding="async"
      className={`rounded-full bg-black object-cover shadow-soft ${className}`}
    />
  );
}
