import { Link } from "react-router-dom";
import { Button } from "../components/common/ui.jsx";
import BrandLogo from "../components/common/BrandLogo.jsx";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <BrandLogo className="mx-auto h-20 w-20" />
        <h1 className="mt-6 text-5xl font-extrabold">404</h1>
        <p className="mt-2 text-slate-500">This KRISHIQ page does not exist.</p>
        <Link to="/">
          <Button className="mt-6">Back to home</Button>
        </Link>
      </div>
    </div>
  );
}
