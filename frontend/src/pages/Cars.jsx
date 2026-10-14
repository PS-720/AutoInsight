import { useState } from "react";

export default function Cars() {
	const [brand, setBrand] = useState("");
	const [fuel, setFuel] = useState("");
	const cars = [];
	const filtered = cars.filter(
		(car) => (!brand || car.brand === brand) && (!fuel || car.fuel === fuel),
	);

	return (
		<main className="mx-auto flex max-w-7xl gap-8 px-4 py-12">
			<aside className="panel h-fit w-64 shrink-0 p-5 max-md:hidden">
				<h2 className="text-xl font-bold">Filters</h2>
				<Filter title="Brand" value={brand} setValue={setBrand} values={[]} />
				<Filter
					title="Fuel Type"
					value={fuel}
					setValue={setFuel}
					values={["Petrol", "Diesel", "Electric"]}
				/>
			</aside>
			<section className="min-w-0 flex-1">
				<h1 className="text-4xl font-black">Browse All Cars</h1>
				<p className="mt-2 text-slate-400">
					Showing <span className="text-blue-400">{filtered.length}</span> of{" "}
					{cars.length} cars
				</p>
				{!filtered.length && (
					<p className="panel mt-8 p-8 text-center text-slate-400">
						Cars will appear here when the backend API is connected.
					</p>
				)}
			</section>
		</main>
	);
}

function Filter({ title, value, setValue, values }) {
	return (
		<label className="mt-6 block text-sm text-slate-400">
			{title}
			<select
				className="field mt-2 bg-slate-900 text-white [color-scheme:dark]"
				value={value}
				onChange={(event) => setValue(event.target.value)}>
				<option value="">All</option>
				{values.map((item) => (
					<option key={item}>{item}</option>
				))}
			</select>
		</label>
	);
}
