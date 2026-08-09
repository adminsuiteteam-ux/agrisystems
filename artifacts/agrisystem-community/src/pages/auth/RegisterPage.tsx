import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "../../auth/AuthContext";
import { ArrowRight, Lock, Mail, MapPin, Phone, User, Users } from "lucide-react";
import logo from "@assets/agrosystem_logo-copy_1786259279741.jpeg";

export function RegisterPage() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocationInput] = useState("Bodija, Ibadan");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"household" | "leader" | "farmer" | "admin">("household");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register({ email, password, fullName, phone, role, location });
      setLocation("/");
    } catch (err: any) {
      setError(err.message || "Failed to register account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <div className="text-center">
        <img src={logo} alt="Agrisystems" className="mx-auto h-16 w-20 object-cover object-top" />
        <h1 className="mt-4 font-display text-3xl font-extrabold text-[#174f34]">Create an account</h1>
        <p className="mt-2 text-sm text-[#67776b]">Join your neighbours in direct-from-farm community group buying.</p>
      </div>

      <div className="mt-8 rounded-2xl border border-[#e7dfd2] bg-[#fffefa] p-6 shadow-sm">
        {error && <div className="mb-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#526b58]">I am signing up as</label>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ["household", "Household"],
                ["leader", "Group Leader"],
                ["farmer", "Farmer"],
                ["admin", "Admin"],
              ].map(([r, label]) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r as any)}
                  className={`rounded-xl p-2.5 text-xs font-bold transition-all ${
                    role === r
                      ? "bg-[#1c6039] text-white shadow-sm"
                      : "border border-[#d8e2d4] bg-[#f7faf5] text-[#526b58] hover:bg-[#eef5eb]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#526b58]">Full Name</label>
            <div className="relative mt-1">
              <User className="absolute left-3.5 top-3 text-[#829087]" size={18} />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Amina Okoro"
                className="w-full rounded-xl border border-[#d8e2d4] bg-[#f7faf5] py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#1c6039]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#526b58]">Email address</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3.5 top-3 text-[#829087]" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="amina@community.ng"
                className="w-full rounded-xl border border-[#d8e2d4] bg-[#f7faf5] py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#1c6039]"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#526b58]">Phone Number</label>
              <div className="relative mt-1">
                <Phone className="absolute left-3.5 top-3 text-[#829087]" size={18} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 802 000 0000"
                  className="w-full rounded-xl border border-[#d8e2d4] bg-[#f7faf5] py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#1c6039]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#526b58]">Location / Area</label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3.5 top-3 text-[#829087]" size={18} />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Bodija, Ibadan"
                  className="w-full rounded-xl border border-[#d8e2d4] bg-[#f7faf5] py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#1c6039]"
                />
              </div>
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
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1c6039] py-3.5 text-sm font-bold text-white hover:bg-[#14482b] disabled:opacity-50"
          >
            {submitting ? "Creating account..." : "Complete Sign Up"} <ArrowRight size={16} />
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-[#718077]">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-[#1c6039] underline">
          Log in here
        </Link>
      </p>
    </div>
  );
}
