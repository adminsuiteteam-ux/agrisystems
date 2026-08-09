import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "../../auth/AuthContext";
import { ArrowRight, Leaf, Lock, Mail, ShieldCheck } from "lucide-react";
import logo from "@assets/agrosystem_logo-copy_1786259279741.jpeg";

export function LoginPage() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      setLocation("/");
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setSubmitting(false);
    }
  };

  const setDemoRole = (role: "household" | "leader" | "farmer" | "admin") => {
    const demoCredentials = {
      household: { email: "household@agrosystems.ng", pass: "demo123" },
      leader: { email: "leader@agrosystems.ng", pass: "demo123" },
      farmer: { email: "farmer@agrosystems.ng", pass: "demo123" },
      admin: { email: "admin@agrosystems.ng", pass: "demo123" },
    };
    setEmail(demoCredentials[role].email);
    setPassword(demoCredentials[role].pass);
  };

  return (
    <div className="mx-auto max-w-md px-5 py-12">
      <div className="text-center">
        <img src={logo} alt="Agrisystems" className="mx-auto h-16 w-20 object-cover object-top" />
        <h1 className="mt-4 font-display text-3xl font-extrabold text-[#174f34]">Welcome back</h1>
        <p className="mt-2 text-sm text-[#67776b]">Log in to manage your group buys, track pick ups, and view your community savings.</p>
      </div>

      <div className="mt-8 rounded-2xl border border-[#e7dfd2] bg-[#fffefa] p-6 shadow-sm">
        {error && <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#526b58]">Email address</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3.5 top-3 text-[#829087]" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@community.ng"
                className="w-full rounded-xl border border-[#d8e2d4] bg-[#f7faf5] py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#1c6039]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#526b58]">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3.5 top-3 text-[#829087]" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#d8e2d4] bg-[#f7faf5] py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#1c6039]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1c6039] py-3 text-sm font-bold text-white hover:bg-[#14482b] disabled:opacity-50"
          >
            {submitting ? "Logging in..." : "Log in to account"} <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 border-t border-[#eee8dd] pt-5 text-center">
          <p className="text-xs font-bold uppercase text-[#88948a]">Quick Pilot Quick-Fill</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => setDemoRole("household")}
              className="rounded-lg border border-[#d8e2d4] bg-[#f7faf5] p-2 text-xs font-semibold text-[#285d3c] hover:bg-[#eaf3e8]"
            >
              Household Member
            </button>
            <button
              onClick={() => setDemoRole("leader")}
              className="rounded-lg border border-[#d8e2d4] bg-[#f7faf5] p-2 text-xs font-semibold text-[#b17a2d] hover:bg-[#faebd7]"
            >
              Group Leader
            </button>
            <button
              onClick={() => setDemoRole("farmer")}
              className="rounded-lg border border-[#d8e2d4] bg-[#f7faf5] p-2 text-xs font-semibold text-[#3d7d40] hover:bg-[#e4f2e2]"
            >
              Farmer / Supplier
            </button>
            <button
              onClick={() => setDemoRole("admin")}
              className="rounded-lg border border-[#d8e2d4] bg-[#f7faf5] p-2 text-xs font-semibold text-[#733d93] hover:bg-[#f5eafc]"
            >
              Admin / Support
            </button>
          </div>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-[#718077]">
        Don't have an account yet?{" "}
        <Link href="/register" className="font-bold text-[#1c6039] underline">
          Sign up here
        </Link>
      </p>
    </div>
  );
}
