import { Link } from "react-router-dom";

export default function CarCard({ car }) {
  return (
    <Link className="group block focus:outline-none" to={`/cars/${car.id}`}>
      <article className="panel relative overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:border-blue-500/60 group-hover:shadow-2xl group-hover:shadow-blue-500/20">
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
        {car.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold shadow-md shadow-red-600/30 transition-transform duration-300 group-hover:scale-105">
            Featured
          </span>
        )}
      </article>
    </Link>
  );
}
