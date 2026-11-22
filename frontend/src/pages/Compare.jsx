import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";

export default function Compare() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routeParams = useParams();
  const queryIds = searchParams.get("cars") || searchParams.get("ids") || "";
  const initialIds = routeParams.firstId
    ? [routeParams.firstId, routeParams.secondId || ""]
    : queryIds
      ? queryIds.split(",").slice(0, 2)
      : ["", ""];

  const [cars, setCars] = useState([]);
  const [selected, setSelected] = useState(initialIds);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .get("/cars?limit=100")
      .then((data) => setCars(data.items))
      .catch((loadError) => setError(loadError.message));
  }, []);

  useEffect(() => {
    setSelected(initialIds);
  }, [queryIds, routeParams.firstId, routeParams.secondId]);

  const getCar = (id) => cars.find((car) => String(car.id) === String(id));

  const runComparison = () => {
    if (!selected[0] || !selected[1]) {
      setError("Select two different cars to compare.");
      return;
    }
    if (selected[0] === selected[1]) {
      setError("A car cannot be compared with itself.");
      return;
    }
    navigate(`/compare?cars=${selected.join(",")}`);
  };

  const comparedCars = [
    getCar(selected[0]),
    getCar(selected[1]),
  ].filter(Boolean);
  const ready = comparedCars.length === 2;

  useEffect(() => {
    if (!selected[0] || !selected[1] || selected[0] === selected[1]) return;
    setLoading(true);
    setError("");
    api
      .get(`/cars/compare?ids=${selected.join(",")}`)
      .then((data) => {
        setCars((current) =>
          data.cars.reduce(
            (all, car) =>
              all.some((item) => item.id === car.id)
                ? all
                : [...all, car],
            current,
          ),
        );
      })
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, [selected[0], selected[1]]);

  const rows = [
    ["Brand", (car) => car.brand],
    ["Model", (car) => car.model],
    ["Year", (car) => car.year],
    ["Price", (car) => `₹${car.price}L`],
    ["Fuel Type", (car) => car.fuel],
    ["Seats", (car) => car.seats],
    ["Body Type", (car) => car.bodyType],
    ["Rating", (car) => `★ ${car.rating} / 5`],
    ["Reviews", (car) => car.reviewCount || 0],
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-black">Compare Cars</h1>
      <p className="mt-2 text-slate-400">
        Choose two cars to compare price, specifications, rating, and seating.
      </p>

      <section className="panel mt-8 p-6">
        <div className="grid items-end gap-4 md:grid-cols-[1fr_auto_1fr_auto]">
          <SelectCar
            label="First car"
            value={selected[0]}
            cars={cars}
            onChange={(value) => setSelected([value, selected[1]])}
            excluded={selected[1]}
          />
          <button
            type="button"
            className="secondary-button h-[46px] px-4 py-2"
            disabled={!selected[0] && !selected[1]}
            onClick={() => setSelected([selected[1], selected[0]])}
            aria-label="Swap selected cars"
            title="Swap cars"
          >
            ⇄
          </button>
          <SelectCar
            label="Second car"
            value={selected[1]}
            cars={cars}
            onChange={(value) => setSelected([selected[0], value])}
            excluded={selected[0]}
          />
          <button
            type="button"
            className="primary-button h-[46px] px-6 py-2"
            onClick={runComparison}
          >
            Compare
          </button>
        </div>
        {error && (
          <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}
      </section>

      {loading && (
        <p className="mt-8 text-center text-slate-400">Loading comparison...</p>
      )}

      {ready && !loading && (
        <section className="mt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {comparedCars.map((car) => (
              <article key={car.id} className="panel overflow-hidden">
                <div className="h-64 overflow-hidden bg-slate-900">
                  <img
                    className="h-full w-full object-cover"
                    src={car.image?.startsWith("/") ? car.image : `/${car.image}`}
                    alt={`${car.brand} ${car.model}`}
                    onError={(event) => {
                      event.target.src = "/Asset/Images/bmw.jpg";
                    }}
                  />
                </div>
                <div className="flex items-center justify-between p-5">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {car.brand} {car.model}
                    </h2>
                    <p className="mt-1 text-slate-400">{car.year} Model</p>
                  </div>
                  <Link
                    className="text-sm font-semibold text-blue-400 hover:underline"
                    to={`/cars/${car.id}`}
                  >
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="panel mt-6 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-slate-400">Specification</th>
                  {comparedCars.map((car) => (
                    <th className="p-4" key={car.id}>
                      {car.brand} {car.model}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, getValue]) => (
                  <tr className="border-b border-white/10 last:border-0" key={label}>
                    <td className="p-4 font-semibold text-slate-400">{label}</td>
                    {comparedCars.map((car) => (
                      <td className="p-4" key={car.id}>
                        {getValue(car)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {!ready && !loading && (
        <p className="panel mt-8 p-8 text-center text-slate-400">
          Select two cars above to see a side-by-side comparison.
        </p>
      )}
    </main>
  );
}

function SelectCar({ label, value, cars, onChange, excluded }) {
  return (
    <label className="block text-sm font-semibold text-slate-300">
      {label}
      <select
        className="field mt-2"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Select a car</option>
        {cars.map((car) => (
          <option
            key={car.id}
            value={car.id}
            disabled={String(car.id) === String(excluded)}
          >
            {car.brand} {car.model}
          </option>
        ))}
      </select>
    </label>
  );
}
