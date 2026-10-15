import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function Auth({ signup = false }) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const update = (key) => (event) =>
    setValues({ ...values, [key]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    if (signup && values.password !== values.confirm)
      return setError("Passwords do not match.");
    try {
      const payload = signup
        ? await api.post("/auth/register", {
            name: values.name,
            email: values.email,
            password: values.password,
          })
        : await api.post("/auth/login", {
            email: values.email,
            password: values.password,
          });
      api.setSession(payload);
      navigate("/");
    } catch (submitError) {
      setError(submitError.message);
    }
  };
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_center,#12202f,#0a0a0a)] p-4">
      <section className="panel w-full max-w-lg p-8">
        <div className="text-center">
          <img
            className="mx-auto h-14 rounded-xl bg-blue-500 p-3"
            src="/Asset/Icons/car-ico.svg"
            alt=""
          />
          <h1 className="mt-6 text-3xl font-black">
            {signup ? "Join AutoInsight" : "Welcome Back"}
          </h1>
          <p className="mt-2 text-slate-400">
            {signup
              ? "Create your account to get started"
              : "Sign in to your AutoInsight account"}
          </p>
        </div>
        {error && <p className="mt-6 text-red-400">{error}</p>}
        <form className="mt-8 space-y-5" onSubmit={submit}>
          {signup && (
            <Field
              label="Full Name"
              value={values.name}
              onChange={update("name")}
            />
          )}
          {
            <Field
              label="Email Address"
              type="email"
              value={values.email}
              onChange={update("email")}
            />
          }
          {
            <Field
              label="Password"
              type="password"
              value={values.password}
              onChange={update("password")}
            />
          }
          {signup && (
            <Field
              label="Confirm Password"
              type="password"
              value={values.confirm}
              onChange={update("confirm")}
            />
          )}
          <button className="primary-button w-full">
            {signup ? "Create Account" : "Sign In"}
          </button>
        </form>
        <p className="mt-6 text-center text-slate-400">
          {signup ? "Already have an account? " : "Don't have an account? "}
          <Link className="text-blue-400" to={signup ? "/login" : "/signup"}>
            {signup ? "Log In" : "Sign up"}
          </Link>
        </p>
      </section>
    </main>
  );
}
function EyeIcon({ visible }) {
  if (visible) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 text-slate-400 hover:text-white"
      >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-slate-400 hover:text-white"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function Field({ label, type = "text", ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <label className="block text-sm font-bold text-slate-300">
      {label}
      <div className="relative mt-2">
        <input
          className={`field ${isPassword ? "pr-11" : ""}`}
          type={inputType}
          required
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon visible={showPassword} />
          </button>
        )}
      </div>
    </label>
  );
}
