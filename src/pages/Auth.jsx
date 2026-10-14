import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
	const submit = (event) => {
		event.preventDefault();
		if (signup && values.password !== values.confirm)
			return setError("Passwords do not match.");
		sessionStorage.setItem(
			"ai_user",
			JSON.stringify({
				name: values.name || values.email.split("@")[0],
				email: values.email,
			}),
		);
		navigate("/");
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
function Field({ label, ...props }) {
	return (
		<label className="block text-sm font-bold text-slate-300">
			{label}
			<input className="field mt-2" required {...props} />
		</label>
	);
}
