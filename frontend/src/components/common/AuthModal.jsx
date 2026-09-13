import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button, Input, Select } from "./ui.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useToast } from "../../context/ToastContext.jsx";
import { isEmail, isMobile, validateRegister } from "../../utils/validation.js";
import { LOCATIONS } from "../../utils/mockData.js";

const initialSignup = { name: "", email: "", phone: "", password: "", confirmPassword: "", role: "farmer", location: "Jaipur" };

export default function AuthModal({ open, initialTab = "login", onClose }) {
  const { login, sendOtp, verifyLoginOtp, sendSignupOtp, signupWithOtp, sendPasswordResetOtp, verifyPasswordResetOtp, resetPassword, homeFor, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState(initialTab);
  const [step, setStep] = useState("form");
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [loginForm, setLoginForm] = useState({ email: "", password: "", remember: true });
  const [signupForm, setSignupForm] = useState(initialSignup);
  const [resetForm, setResetForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  useEffect(() => setTab(initialTab), [initialTab, open]);
  useEffect(() => {
    if (!seconds) return undefined;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(value - 1, 0)), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;
  const setLogin = (key) => (event) => setLoginForm({ ...loginForm, [key]: event.target.value });
  const setSignup = (key) => (event) => setSignupForm({ ...signupForm, [key]: event.target.value });
  const message = (err) => setError(err.response?.data?.message || err.message || "Something went wrong.");
  const finish = (user) => { toast(`Welcome, ${user.name}`); onClose(); navigate(homeFor(user.role)); };

  const submitLogin = async (event) => {
    event.preventDefault(); setError("");
    if (!isEmail(loginForm.email) || !loginForm.password) return setError("Enter a valid email and password.");
    try {
      const user = await login({ identifier: loginForm.email, password: loginForm.password });
      if (user?.requiresOtp) {
        setOtp("");
        setSeconds(60);
        setStep("loginOtp");
        toast("A login OTP was sent to your email.", "info");
        return;
      }
      if (loginForm.remember) localStorage.setItem("krishiq_remember", "1");
      finish(user);
    } catch (err) { message(err); }
  };

  const sendSignup = async (event) => {
    event.preventDefault(); setError("");
    const errors = validateRegister({ ...signupForm, mobile: signupForm.phone || "9876543210" });
    if (signupForm.phone && !isMobile(signupForm.phone)) errors.mobile = "Enter a valid 10-digit mobile.";
    if (Object.keys(errors).length) return setError(Object.values(errors)[0]);
    try {
      await sendSignupOtp(signupForm);
      setOtp(""); setSeconds(60); setStep("signupOtp");
      toast("A verification OTP was sent to your email.", "info");
    } catch (err) { message(err); }
  };

  const verifySignup = async (event) => {
    event.preventDefault(); setError("");
    if (!/^\d{6}$/.test(otp)) return setError("Enter the 6-digit OTP.");
    try { finish(await signupWithOtp({ email: signupForm.email, otp })); } catch (err) { message(err); }
  };

  const verifyLogin = async (event) => {
    event.preventDefault(); setError("");
    if (!/^\d{6}$/.test(otp)) return setError("Enter the 6-digit OTP.");
    try { finish(await verifyLoginOtp({ identifier: loginForm.email, otp })); } catch (err) { message(err); }
  };

  const resendLogin = async () => {
    if (seconds || loading) return;
    try {
      await sendOtp(loginForm.email);
      setOtp(""); setSeconds(60);
      toast("A new login OTP was sent.", "info");
    } catch (err) { message(err); }
  };

  const startReset = async (event) => {
    event.preventDefault(); setError("");
    if (!isEmail(resetForm.email)) return setError("Enter a valid email address.");
    try { await sendPasswordResetOtp(resetForm.email); setOtp(""); setSeconds(60); setStep("resetOtp"); toast("If an account exists, a reset OTP was sent.", "info"); } catch (err) { message(err); }
  };

  const verifyReset = async (event) => {
    event.preventDefault(); setError("");
    try { await verifyPasswordResetOtp(resetForm.email, otp); setStep("newPassword"); setError(""); } catch (err) { message(err); }
  };

  const finishReset = async (event) => {
    event.preventDefault(); setError("");
    if (resetForm.password.length < 6 || resetForm.password !== resetForm.confirmPassword) return setError("Passwords must match and be at least 6 characters.");
    try { finish(await resetPassword({ email: resetForm.email, password: resetForm.password, confirmPassword: resetForm.confirmPassword })); } catch (err) { message(err); }
  };

  const otpForm = step === "signupOtp" ? verifySignup : step === "loginOtp" ? verifyLogin : verifyReset;
  const otpEmail = step === "signupOtp" ? signupForm.email : step === "loginOtp" ? loginForm.email : resetForm.email;

  return createPortal(<div className="fixed inset-0 z-[200] flex min-h-0 items-center justify-center overflow-y-auto bg-slate-950/60 p-3 sm:p-6" role="dialog" aria-modal="true">
    <div className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900 sm:max-h-[calc(100dvh-3rem)] sm:p-6">
      <div className="flex items-center justify-between"><h2 className="text-xl font-bold text-ink dark:text-[#F8FAFC]">Sign in to KRISHIQ</h2><button type="button" onClick={onClose} aria-label="Close"><X /></button></div>
      {step === "form" && <div className="mt-5 flex border-b border-slate-200 dark:border-slate-700"><button className={`flex-1 border-b-2 pb-3 font-semibold ${tab === "login" ? "border-primary-green text-primary-green" : "border-transparent text-slate-500"}`} onClick={() => setTab("login")}>Login</button><button className={`flex-1 border-b-2 pb-3 font-semibold ${tab === "signup" ? "border-primary-green text-primary-green" : "border-transparent text-slate-500"}`} onClick={() => setTab("signup")}>Sign Up</button></div>}
      {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}
      {step === "form" && tab === "login" && <form className="mt-5 space-y-4" onSubmit={submitLogin}><Input id="auth-email" label="Email" type="email" value={loginForm.email} onChange={setLogin("email")} /><Input id="auth-password" label="Password" type="password" value={loginForm.password} onChange={setLogin("password")} /><div className="flex items-center justify-between text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={loginForm.remember} onChange={(e) => setLoginForm({ ...loginForm, remember: e.target.checked })} /> Remember me</label><button type="button" className="text-primary-green" onClick={() => { setResetForm({ ...resetForm, email: loginForm.email }); setStep("resetEmail"); }}>Forgot Password?</button></div><Button type="submit" className="w-full" disabled={loading}>Login</Button><Divider /><Button type="button" variant="secondary" className="w-full" onClick={() => toast("Google sign-in is currently unavailable.", "info")}>Continue with Google</Button></form>}
      {step === "form" && tab === "signup" && <form className="mt-5 space-y-4" onSubmit={sendSignup}><Input id="auth-name" label="Full Name" value={signupForm.name} onChange={setSignup("name")} /><Input id="auth-signup-email" label="Email" type="email" value={signupForm.email} onChange={setSignup("email")} /><Input id="auth-phone" label="Phone (Optional)" value={signupForm.phone} onChange={setSignup("phone")} /><Input id="auth-signup-password" label="Password" type="password" value={signupForm.password} onChange={setSignup("password")} /><Input id="auth-confirm-password" label="Confirm Password" type="password" value={signupForm.confirmPassword} onChange={setSignup("confirmPassword")} /><Select id="auth-role" label="Role" value={signupForm.role} onChange={setSignup("role")}><option value="farmer">Farmer / Seller</option><option value="buyer">Buyer</option><option value="fpo">FPO</option></Select><Select id="auth-location" label="Location" value={signupForm.location} onChange={setSignup("location")}>{LOCATIONS.map((location) => <option key={location}>{location}</option>)}</Select><Button type="submit" className="w-full" disabled={loading}>Send OTP</Button><Divider /><Button type="button" variant="secondary" className="w-full" onClick={() => toast("Google sign-in is currently unavailable.", "info")}>Continue with Google</Button></form>}
      {(step === "signupOtp" || step === "loginOtp" || step === "resetOtp") && <form className="mt-6 space-y-4" onSubmit={otpForm}><h3 className="text-xl font-bold text-ink dark:text-[#F8FAFC]">Verify your email</h3><p className="text-sm text-slate-500">Enter the 6-digit OTP sent to {otpEmail}</p><Input id="auth-otp" label="6-digit OTP" inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} /><Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>Verify OTP</Button><button type="button" disabled={seconds > 0 || loading} onClick={() => { if (step === "signupOtp") sendSignup({ preventDefault: () => {} }); else if (step === "loginOtp") resendLogin(); else startReset({ preventDefault: () => {} }); }} className="w-full text-sm text-primary-green">{seconds ? `Resend OTP in ${seconds}s` : "Resend OTP"}</button><button type="button" className="w-full text-sm text-slate-500" onClick={() => setStep("form")}>Back</button></form>}
      {step === "resetEmail" && <form className="mt-6 space-y-4" onSubmit={startReset}><h3 className="text-xl font-bold text-ink dark:text-[#F8FAFC]">Forgot Password?</h3><Input id="reset-email" label="Email" type="email" value={resetForm.email} onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })} /><Button type="submit" className="w-full" disabled={loading}>Send OTP</Button></form>}
      {step === "newPassword" && <form className="mt-6 space-y-4" onSubmit={finishReset}><h3 className="text-xl font-bold text-ink dark:text-[#F8FAFC]">Create a new password</h3><Input id="new-password" label="New Password" type="password" value={resetForm.password} onChange={(e) => setResetForm({ ...resetForm, password: e.target.value })} /><Input id="new-confirm-password" label="Confirm Password" type="password" value={resetForm.confirmPassword} onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })} /><Button type="submit" className="w-full" disabled={loading}>Update Password</Button></form>}
    </div>
  </div>, document.body);
}

function Divider() { return <div className="flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />OR<span className="h-px flex-1 bg-slate-200" /></div>; }
