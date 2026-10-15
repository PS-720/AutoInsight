import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

const links = [
  ["/", "home.svg", "Home"],
  ["/cars", "car-ico.svg", "Cars"],
  ["/tips", "tips.svg", "Tips & Problems"],
  ["/community", "chat.svg", "Community"],
  ["/review", "review.svg", "Write Review"],
];
const icon = (name) => `/Asset/Icons/${name}`;
const defaultAvatar = "/Asset/Icons/default-avatar.svg";

export default function Header() {
  const [user, setUser] = useState(() =>
    JSON.parse(sessionStorage.getItem("ai_user") || "null"),
  );
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const logout = () => {
    api.clearSession();
    setUser(null);
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 lg:px-8">
        <Link className="flex shrink-0 items-center gap-3" to="/">
          <span className="rounded-xl bg-blue-500 p-2">
            <img className="h-6 w-6" src={icon("car-ico.svg")} alt="" />
          </span>
          <span className="hidden sm:block">
            <strong className="block text-lg">AutoInsight</strong>
            <small className="text-slate-400">
              Car Reviews &amp; Community
            </small>
          </span>
        </Link>
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map(([to, image, label]) => (
            <li key={to}>
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${isActive ? "bg-blue-500/15 text-blue-400" : "text-slate-300 hover:bg-white/10 hover:text-white"}`
                }
                to={to}
              >
                <img className="h-4 w-4" src={icon(image)} alt="" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="relative flex items-center gap-2">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 pr-3 font-semibold transition-colors hover:border-white/20 hover:bg-white/10"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                type="button"
              >
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={user.avatar || defaultAvatar}
                  alt=""
                  onError={(e) => {
                    e.target.src = defaultAvatar;
                  }}
                />
                {user.name}
                <span className={`text-xs text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>
              {open && (
                <div className="absolute right-0 top-14 w-64 rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-2xl">
                  <div className="mb-3 flex gap-3">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={user.avatar || defaultAvatar}
                      alt=""
                      onError={(e) => {
                        e.target.src = defaultAvatar;
                      }}
                    />
                    <div>
                      <strong>{user.name}</strong>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    className="block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/10"
                    to="/profile"
                    onClick={() => setOpen(false)}
                  >
                    View Profile
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      className="block rounded-lg px-3 py-2 text-sm font-semibold text-blue-400 transition-colors hover:bg-blue-500/10"
                      to="/admin"
                      onClick={() => setOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="secondary-button px-3 py-2 text-sm" to="/login">
                Log In
              </Link>
              <Link
                className="rounded-xl bg-red-600 px-3 py-2 text-sm font-bold hover:bg-red-700"
                to="/signup"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
