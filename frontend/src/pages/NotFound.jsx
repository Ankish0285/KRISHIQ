import { Link } from "react-router-dom";
import { Button } from "../components/common/ui.jsx";
import BrandLogo from "../components/common/BrandLogo.jsx";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas p-6 text-center text-ink dark:bg-night dark:text-white">
      <div>
        <BrandLogo className="mx-auto h-20 w-20" alt="Krishiq logo" />
        <h1 className="mt-6 text-5xl font-extrabold">Page not found</h1>
        <p className="mt-3 max-w-md text-slate-500 dark:text-[#94A3B8]">This Krishiq page does not exist. Use the links below to continue.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/"><Button>Back to homepage</Button></Link>
          <Link to="/marketplace"><Button variant="secondary">Krishiq Marketplace</Button></Link>
        </div>
        <nav className="mt-8 grid gap-2 text-sm font-semibold text-primary-green dark:text-leaf" aria-label="Helpful links">
          <Link to="/krishiq-ai">Krishiq AI</Link>
          <Link to="/for-farmers">Krishiq for Farmers</Link>
          <Link to="/agritech">Krishiq Agritech</Link>
          <Link to="/about">About Krishiq</Link>
        </nav>
      </div>
    </div>
  );
}
