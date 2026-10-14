import { Link } from "react-router-dom";

export default function CarDetails() {
	return (
		<main className="mx-auto max-w-6xl px-4 py-12">
			<Link className="text-blue-400" to="/cars">
				‹ Back to Cars
			</Link>
			<section className="panel mt-6 p-8 text-center">
				<h1 className="text-3xl font-black">Car details unavailable</h1>
				<p className="mt-3 text-slate-400">
					Car details will appear here when the backend API is connected.
				</p>
			</section>
		</main>
	);
}
