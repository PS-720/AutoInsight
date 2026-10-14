import { Link } from "react-router-dom";
import CarCard from "../components/CarCard";

export default function Home() {
	const cars = [];
	const reviews = [];
	return (
		<main>
			<section className="relative flex min-h-[650px] items-center justify-center overflow-hidden px-4 py-32 text-center">
				<div className="absolute inset-0 bg-[linear-gradient(#0009,#0009),url('/Asset/Images/carBackground.jpg')] bg-cover bg-center" />
				<div className="relative max-w-4xl">
					<span className="rounded-full border border-blue-400/40 px-4 py-2 text-sm text-slate-200">
						✨ India's car review platform
					</span>
					<h1 className="mt-10 text-5xl font-black text-blue-400 md:text-7xl">
						Find Your Perfect Car
					</h1>
					<p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
						Explore detailed specifications, read authentic owner reviews, and
						join the car community.
					</p>
					<div className="panel mt-12 p-6 text-slate-400">
						Platform statistics will appear when the backend API is connected.
					</div>
				</div>
			</section>
			<CarSection
				title="Featured Cars"
				subtitle="Handpicked cars for you"
				cars={cars.filter((car) => car.featured)}
			/>
			<CarSection
				title="Top Rated Cars"
				subtitle="Highest rated by our community"
				cars={[...cars].sort((a, b) => b.rating - a.rating).slice(0, 4)}
			/>
			<section className="mx-auto max-w-7xl px-4 py-16">
				<h2 className="text-3xl font-bold">Latest Owner Reviews</h2>
				<p className="mt-2 text-slate-400">Real experiences from real owners</p>
				<p className="panel mt-8 p-6 text-slate-400">
					Reviews will appear when the backend API is connected.
				</p>
			</section>
		</main>
	);
}
function CarSection({ title, subtitle, cars: list }) {
	return (
		<section className="mx-auto max-w-7xl px-4 py-16">
			<div className="flex items-end justify-between">
				<div>
					<h2 className="text-3xl font-bold">{title}</h2>
					<p className="mt-2 text-slate-400">{subtitle}</p>
				</div>
				<Link className="text-blue-400 hover:text-blue-300" to="/cars">
					View All →
				</Link>
			</div>
			<div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
				{list.map((car) => (
					<CarCard car={car} key={car.id} />
				))}
			</div>
		</section>
	);
}
