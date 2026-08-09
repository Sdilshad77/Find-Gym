import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navLink = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive ? "bg-slate-800 text-brand-400" : "text-slate-300 hover:text-white"
    }`;

  const roleHome = user
    ? user.role === "gymOwner"
      ? "/owner"
      : user.role === "admin"
      ? "/admin"
      : "/account"
    : "/";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 font-black text-white">
            GH
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Gym<span className="text-brand-500">Hub</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={navLink} end>
            Home
          </NavLink>
          <NavLink to="/gyms" className={navLink}>
            Gyms
          </NavLink>
          <NavLink to="/shop" className={navLink}>
            Shop
          </NavLink>
          <NavLink to="/plans" className={navLink}>
            Plans
          </NavLink>
          <NavLink to="/ai" className={navLink}>
            <span className="flex items-center gap-1">
              AI Coach
              <span className="rounded-full bg-brand-500/20 px-1.5 py-0.5 text-[10px] font-bold text-brand-400">
                NEW
              </span>
            </span>
          </NavLink>
          {user?.role === "user" && (
            <>
              <NavLink to="/cart" className={navLink}>
                Cart
              </NavLink>
              <NavLink to="/wishlist" className={navLink}>
                Wishlist
              </NavLink>
            </>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm font-medium hover:border-slate-500"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-xs font-bold text-white">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </span>
                <span className="max-w-[120px] truncate">{user.name}</span>
                <span className="text-xs text-slate-500">▾</span>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl">
                  <Link
                    to={roleHome}
                    className="block px-4 py-2.5 text-sm hover:bg-slate-800"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2.5 text-sm hover:bg-slate-800"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/notifications"
                    className="block px-4 py-2.5 text-sm hover:bg-slate-800"
                    onClick={() => setOpen(false)}
                  >
                    Notifications
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="block w-full border-t border-slate-700 px-4 py-2.5 text-left text-sm text-red-400 hover:bg-slate-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-outline !py-2 text-sm">
                Login
              </Link>
              <Link to="/register" className="btn-primary !py-2 text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          className="text-2xl md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-800 bg-slate-950 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link to="/" className="rounded-lg px-3 py-2 text-sm hover:bg-slate-800" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link to="/gyms" className="rounded-lg px-3 py-2 text-sm hover:bg-slate-800" onClick={() => setOpen(false)}>
              Gyms
            </Link>
            <Link to="/shop" className="rounded-lg px-3 py-2 text-sm hover:bg-slate-800" onClick={() => setOpen(false)}>
              Shop
            </Link>
            <Link to="/plans" className="rounded-lg px-3 py-2 text-sm hover:bg-slate-800" onClick={() => setOpen(false)}>
              Plans
            </Link>
            <Link to="/ai" className="rounded-lg px-3 py-2 text-sm hover:bg-slate-800" onClick={() => setOpen(false)}>
              AI Coach
            </Link>
            {user ? (
              <>
                {user.role === "user" && (
                  <>
                    <Link to="/cart" className="rounded-lg px-3 py-2 text-sm hover:bg-slate-800" onClick={() => setOpen(false)}>
                      Cart
                    </Link>
                    <Link to="/wishlist" className="rounded-lg px-3 py-2 text-sm hover:bg-slate-800" onClick={() => setOpen(false)}>
                      Wishlist
                    </Link>
                  </>
                )}
                <Link to={roleHome} className="rounded-lg px-3 py-2 text-sm hover:bg-slate-800" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/profile" className="rounded-lg px-3 py-2 text-sm hover:bg-slate-800" onClick={() => setOpen(false)}>
                  Profile
                </Link>
                <button onClick={handleLogout} className="rounded-lg px-3 py-2 text-left text-sm text-red-400">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-outline mt-2" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn-primary mt-2" onClick={() => setOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}