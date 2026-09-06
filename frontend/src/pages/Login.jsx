import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../components/common/BrandLogo.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";
import Modal from "../components/common/Modal.jsx";
import { Button, Input } from "../components/common/ui.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../context/ToastContext.jsx";
import { validateLogin } from "../utils/validation.js";

const demos = [
  { label: "Farmer demo", identifier: "farmer@krishiq.in" },
  { label: "Buyer demo", identifier: "buyer@krishiq.in" },
  { label: "FPO demo", identifier: "fpo@krishiq.in" },
  { label: "Admin demo", identifier: "admin@krishiq.in" },
];

export default function Login() {
  const { login, homeFor, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [forgot, setForgot] = useState(false);
  const [remember, setRemember] = useState(true);
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});

  const submit = async (e) => {
    e.preventDefault();
    const next = validateLogin(form);
    setErrors(next);
    if (Object.keys(next).length) return;
    try {
      const user = await login(form);
      if (remember) localStorage.setItem("krishiq_remember", "1");
      toast(`Welcome back, ${user.name}`);
      navigate(homeFor(user.role));
    } catch (err) {
      toast(err.message, "info");
    }
  };

  const demo = async (identifier) => {
    const user = await login({ identifier, password: "demo123" });
    toast(`Logged in as ${user.role}`);
    navigate(homeFor(user.role));
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-deep p-10 text-white lg:flex lg:flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.35),transparent_40%)]" />
        <div className="relative flex items-center gap-3">
          <BrandLogo className="h-16 w-16" />
          <div>
            <p className="text-2xl font-extrabold">KRISH<span className="text-sky-300">IQ</span></p>
            <p className="text-sm text-emerald-100">Smart Farming. Direct Markets. Better Future.</p>
          </div>
        </div>
        <div className="relative mt-auto max-w-md space-y-4 pb-8">
          <h1 className="text-4xl font-extrabold leading-tight">Trade produce with AI, not guesswork.</h1>
          <p className="text-emerald-100">Demand signals, fair prices and optimized routes — in one workspace for farmers, FPOs and buyers.</p>
        </div>
      </div>
      <div className="flex flex-col justify-center px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <BrandLogo className="h-12 w-12" />
            <span className="font-extrabold">KRISHIQ</span>
          </Link>
          <ThemeToggle />
        </div>
        <div className="mx-auto w-full max-w-md">
          <h2 className="text-3xl font-extrabold">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">Login with email or mobile. Demo password is demo123.</p>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <Input id="identifier" label="Email / mobile" value={form.identifier} onChange={(e) => setForm({ ...form, identifier: e.target.value })} error={errors.identifier} />
            <Input id="password" label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember me
              </label>
              <button type="button" className="text-ai-blue" onClick={() => setForgot(true)}>Forgot password</button>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>Login</Button>
          </form>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {demos.map((d) => (
              <Button key={d.identifier} variant="secondary" size="sm" onClick={() => demo(d.identifier)}>
                {d.label}
              </Button>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-500">
            New to KRISHIQ? <Link className="font-semibold text-primary-green" to="/register">Create an account</Link>
          </p>
        </div>
      </div>
      <Modal open={forgot} title="Reset password" onClose={() => setForgot(false)}>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          This is a demo. Use the demo accounts with password <strong>demo123</strong>. A live reset flow will attach to the KRISHIQ backend later.
        </p>
      </Modal>
    </div>
  );
}
