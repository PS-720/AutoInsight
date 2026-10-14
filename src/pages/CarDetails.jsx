import { Link, useParams } from "react-router-dom";
import { cars } from "../data";

export default function CarDetails() {
	const car =
		cars.find((item) => item.id === Number(useParams().id)) || cars[0];
	return (
		<main className="mx-auto max-w-6xl px-4 py-12">
			<Link className="text-blue-400" to="/cars">
				‹ Back to Cars
			</Link>
			<section className="panel mt-6 grid gap-8 p-6 md:grid-cols-2">
				<img
					className="h-80 w-full rounded-xl object-cover"
					src={car.image}
					alt={`${car.brand} ${car.model}`}
				/>
				<div>
					<h1 className="text-4xl font-black">
						{car.brand} {car.model}
					</h1>
					<p className="mt-2 text-slate-400">{car.year} model</p>
					<p className="mt-8 text-4xl font-bold text-blue-400">
						₹{car.price} Lakhs
					</p>
					<div className="mt-8 grid grid-cols-2 gap-3">
						{[
							["Fuel Type", car.fuel],
							["Mileage", car.mileage],
							["Seating", car.seats],
							["Safety", "5 Star"],
						].map(([label, value]) => (
							<div className="rounded-xl bg-white/5 p-4" key={label}>
								<small className="text-slate-500">{label}</small>
								<strong className="mt-1 block">{value}</strong>
							</div>
						))}
					</div>
					<Link className="primary-button mt-8 inline-block" to="/review">
						Write a Review
					</Link>
				</div>
			</section>
		</main>
	);
}
