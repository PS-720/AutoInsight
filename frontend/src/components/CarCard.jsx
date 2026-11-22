import { Link } from "react-router-dom";

export default function CarCard({
  car,
  comparisonSelected = false,
  onToggleComparison,
}) {
  return (
    <article className="panel group relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/20">
      <Link className="block focus:outline-none" to={`/cars/${car.id}`}>
        <div className="h-52 overflow-hidden bg-slate-900">
          <img
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            src={car.image?.startsWith("/") ? car.image : `/${car.image}`}
            alt={`${car.brand} ${car.model}`}
            onError={(e) => {
              e.target.src = "/Asset/Images/bmw.jpg";
            }}
          />
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold transition-colors duration-200 group-hover:text-blue-400">
                {car.brand} {car.model}
              </h3>
              <p className="text-sm text-slate-400">{car.year} Model</p>
            </div>
            <span className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-2 py-1 text-sm text-yellow-400 transition-transform duration-200 group-hover:scale-105">
              ★ {car.rating}
            </span>
          </div>
          <div className="flex gap-3 text-sm text-slate-400">
            <span>{car.fuel}</span>
            <span>{car.seats} Seats</span>
            <span>₹{car.price}L</span>
          </div>
          <button className="primary-button w-full py-2 text-sm group-hover:bg-blue-600" type="button">
            View Details
          </button>
        </div>
      </Link>
      {onToggleComparison && (
        <button
          type="button"
          className={`absolute left-3 top-3 rounded-lg border px-3 py-2 text-xs font-bold ${
            comparisonSelected
              ? "border-blue-400 bg-blue-500 text-white"
              : "border-white/20 bg-slate-950/95 text-slate-200 hover:border-blue-400"
          }`}
          onClick={() => onToggleComparison(car)}
          aria-pressed={comparisonSelected}
        >
          {comparisonSelected ? "Selected" : "Compare"}
        </button>
      )}
      {car.featured && (
        <span className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold shadow-md shadow-red-600/30 transition-transform duration-300 group-hover:scale-105">
          Featured
        </span>
      )}
    </article>
  );
}
