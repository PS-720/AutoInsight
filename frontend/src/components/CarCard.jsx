import { Link } from "react-router-dom";

export default function CarCard({ car }) {
  return (
    <Link className="group block" to={`/cars/${car.id}`}>
      <article className="panel relative overflow-hidden hover:-translate-y-1 hover:border-blue-500/60">
        <div className="h-52 overflow-hidden">
          <img
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            src={car.image}
            alt={`${car.brand} ${car.model}`}
          />
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold">
                {car.brand} {car.model}
              </h3>
              <p className="text-sm text-slate-400">{car.year} Model</p>
            </div>
            <span className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-2 py-1 text-sm text-yellow-400">
              ★ {car.rating}
            </span>
          </div>
          <div className="flex gap-3 text-sm text-slate-400">
            <span>{car.fuel}</span>
            <span>{car.seats} Seats</span>
            <span>₹{car.price}L</span>
          </div>
          <button className="primary-button w-full py-2 text-sm" type="button">
            View Details
          </button>
        </div>
        {car.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold">
            Featured
          </span>
        )}
      </article>
    </Link>
  );
}
