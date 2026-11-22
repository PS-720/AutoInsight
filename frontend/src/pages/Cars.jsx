import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CarCard from "../components/CarCard";
import { api } from "../lib/api";

export default function Cars() {
  const [brand, setBrand] = useState("");
  const [fuel, setFuel] = useState("");
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");
  const [comparisonIds, setComparisonIds] = useState([]);
  useEffect(() => {
    api
      .get("/cars?limit=100")
      .then((data) => setCars(data.items))
      .catch((loadError) => setError(loadError.message));
  }, []);
  const filtered = cars.filter(
    (car) => (!brand || car.brand === brand) && (!fuel || car.fuel === fuel),
  );
  const toggleComparison = (car) => {
    setComparisonIds((current) => {
      if (current.includes(car.id))
        return current.filter((id) => id !== car.id);
      if (current.length === 2) return [current[1], car.id];
      return [...current, car.id];
    });
  };
  return (
    <main className="mx-auto flex max-w-7xl gap-8 px-4 py-12">
      <aside className="panel h-fit w-64 shrink-0 p-5 max-md:hidden">
        <h2 className="text-xl font-bold">Filters</h2>
        <Filter
          title="Brand"
          value={brand}
          setValue={setBrand}
          values={[...new Set(cars.map((car) => car.brand))]}
        />
        <Filter
          title="Fuel Type"
          value={fuel}
          setValue={setFuel}
          values={["Petrol", "Diesel", "Electric", "Hybrid"]}
        />
      </aside>
      <section className="min-w-0 flex-1">
        <h1 className="text-4xl font-black">Browse All Cars</h1>
        <p className="mt-2 text-slate-400">
          Showing <span className="text-blue-400">{filtered.length}</span> of{" "}
          {cars.length} cars
        </p>
        {error && (
          <p className="panel mt-8 p-8 text-center text-red-400">{error}</p>
        )}
        {!!filtered.length && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((car) => (
              <CarCard
                car={car}
                key={car.id}
                comparisonSelected={comparisonIds.includes(car.id)}
                onToggleComparison={toggleComparison}
              />
            ))}
          </div>
        )}
        {!filtered.length && !error && (
          <p className="panel mt-8 p-8 text-center text-slate-400">
            No cars match the selected filters.
          </p>
        )}
      </section>
      {comparisonIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-blue-400/30 bg-slate-950/95 p-3 shadow-2xl backdrop-blur">
          <span className="text-sm font-semibold text-slate-300">
            {comparisonIds.length} of 2 selected
          </span>
          {comparisonIds.length === 2 ? (
            <Link
              className="primary-button px-4 py-2 text-sm"
              to={`/compare?cars=${comparisonIds.join(",")}`}
            >
              Compare Cars
            </Link>
          ) : (
            <span className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-500">
              Select one more
            </span>
          )}
          <button
            type="button"
            className="rounded-lg px-2 py-2 text-slate-400 hover:bg-white/10 hover:text-white"
            onClick={() => setComparisonIds([])}
          >
            Clear
          </button>
        </div>
      )}
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
        onChange={(event) => setValue(event.target.value)}
      >
        <option value="">All</option>
        {values.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}
