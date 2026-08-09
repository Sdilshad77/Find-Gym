import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 font-black text-white">
              GH
            </span>
            <span className="text-lg font-extrabold">
              Gym<span className="text-brand-500">Hub</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Find the best gyms near you, book trial slots, buy supplements & get
            AI-powered fitness plans.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-slate-200">Explore</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/gyms" className="hover:text-brand-400">Find Gyms</Link></li>
            <li><Link to="/shop" className="hover:text-brand-400">Shop Supplements</Link></li>
            <li><Link to="/ai" className="hover:text-brand-400">AI Fitness Coach</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-slate-200">Account</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link to="/login" className="hover:text-brand-400">Login</Link></li>
            <li><Link to="/register" className="hover:text-brand-400">Register</Link></li>
            <li><Link to="/profile" className="hover:text-brand-400">Profile</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-slate-200">Contact</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>support@gymhub.com</li>
            <li>Mon - Sun: 6 AM - 10 PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} GymHub. All rights reserved.
      </div>
    </footer>
  );
}