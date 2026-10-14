import { useState } from "react";

export default function Admin() {
	const [tab, setTab] = useState("Dashboard");
	const cars = [];
	return (
		<main className="min-h-screen bg-slate-950">
			<div className="mx-auto flex max-w-7xl flex-col md:flex-row">
				<aside className="border-b border-white/10 p-6 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
					<h2 className="text-xl font-black">AutoInsight</h2>
					<p className="text-sm text-slate-400">Admin Panel</p>
					<nav className="mt-8 space-y-2">
						{[
							"Dashboard",
							"Manage Cars",
							"Manage Users",
							"Profile & Settings",
						].map((item) => (
							<button
								className={`block w-full rounded-lg px-3 py-2 text-left ${tab === item ? "bg-blue-500" : "hover:bg-white/10"}`}
								onClick={() => setTab(item)}
								key={item}>
								{item}
							</button>
						))}
					</nav>
				</aside>
				<section className="flex-1 p-6 md:p-12">
					<h1 className="text-4xl font-black">{tab}</h1>
					<p className="mt-2 text-slate-400">
						Frontend admin surface ready for the future Express.js API.
					</p>
					{tab === "Dashboard" && (
						<p className="panel mt-8 p-6 text-slate-400">
							Dashboard statistics will appear when the backend API is connected.
						</p>
					)}
					{tab === "Manage Cars" && (
						<div className="mt-8 space-y-3">
							{cars.map((car) => (
								<div className="panel flex justify-between p-4" key={car.id}>
									<span>
										{car.brand} {car.model}
									</span>
									<span className="text-slate-400">₹{car.price}L</span>
								</div>
							))}
						</div>
					)}
				</section>
			</div>
		</main>
	);
}
