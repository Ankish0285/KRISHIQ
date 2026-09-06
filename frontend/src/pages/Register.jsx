import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../components/common/BrandLogo.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";
import { Button, Input, Select } from "../components/common/ui.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../context/ToastContext.jsx";
import { validateRegister } from "../utils/validation.js";
import { LOCATIONS } from "../utils/mockData.js";

export default function Register() {
  const { register, homeFor, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "farmer",
    location: "Jaipur",
  });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const next = validateRegister(form);
    setErrors(next);
    if (Object.keys(next).length) return;
    try {
      const user = await register(form);
      toast("Account created. Welcome to KRISHIQ.");
      navigate(homeFor(user.role));
    } catch (err) {
      toast(err.message, "info");
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="order-2 flex flex-col justify-center px-6 py-10 lg:order-1">
        <div className="mb-4 flex justify-end">
          <ThemeToggle />
        </div>
        <form className="mx-auto w-full max-w-md space-y-4" onSubmit={submit}>
          <div className="flex items-center gap-3">
            <BrandLogo className="h-12 w-12" />
            <h1 className="text-3xl font-extrabold">Create your KRISHIQ account</h1>
          </div>
          <Input id="name" label="Name" value={form.name} onChange={set("name")} error={errors.name} />
          <Input id="email" label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} />
          <Input id="mobile" label="Mobile" value={form.mobile} onChange={set("mobile")} error={errors.mobile} />
          <Input id="password" label="Password" type="password" value={form.password} onChange={set("password")} error={errors.password} />
          <Input id="confirmPassword" label="Confirm Password" type="password" value={form.confirmPassword} onChange={set("confirmPassword")} error={errors.confirmPassword} />
          <Select id="role" label="Role" value={form.role} onChange={set("role")} error={errors.role}>
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
            <option value="fpo">FPO</option>
          </Select>
          <Select id="location" label="Location" value={form.location} onChange={set("location")} error={errors.location}>
            {LOCATIONS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </Select>
          <Button type="submit" className="w-full" disabled={loading}>Get Started</Button>
          <p className="text-sm text-slate-500">
            Already registered? <Link className="font-semibold text-primary-green" to="/login">Login</Link>
          </p>
        </form>
      </div>
      <div className="relative order-1 hidden bg-slate-950 p-10 text-white lg:order-2 lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(37,99,235,0.28),transparent_36%),radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.25),transparent_32%)]" />
        <div className="relative mt-24 max-w-md">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Join the network</p>
          <h2 className="mt-3 text-4xl font-extrabold">Farmers, FPOs and buyers on one intelligent rail.</h2>
          <p className="mt-4 text-slate-300">Choose your role during registration. Admin access is reserved for the KRISHIQ operations team.</p>
        </div>
      </div>
    </div>
  );
}
