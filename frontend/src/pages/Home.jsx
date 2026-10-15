import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CarCard from "../components/CarCard";
import { api } from "../lib/api";

export default function Home() {
  const [cars, setCars] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([api.get("/cars?limit=100"), api.get("/reviews?limit=4")])
      .then(([carData, reviewData]) => {
        setCars(carData.items);
        setReviews(reviewData.items);
      })
      .catch((loadError) => setError(loadError.message));
  }, []);
  return (
    <main>
      <section className="relative flex min-h-[650px] items-center justify-center overflow-hidden px-4 py-32 text-center">
        <div className="absolute inset-0 bg-[linear-gradient(#0009,#0009),url('/Asset/Images/carBackground.jpg')] bg-cover bg-center transition-transform duration-1000 ease-out hover:scale-105" />
        <div className="relative max-w-4xl">
          <span className="inline-block cursor-default rounded-full border border-blue-400/40 bg-blue-950/40 px-4 py-2 text-sm text-slate-200 backdrop-blur-sm transition-all duration-300 hover:border-blue-400 hover:bg-blue-900/60 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
            ✨ India's car review platform
          </span>
          <h1 className="mt-10 text-5xl font-black text-blue-400 transition-colors duration-300 hover:text-blue-300 md:text-7xl">
            Find Your Perfect Car
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 transition-colors duration-300 hover:text-white">
            Explore detailed specifications, read authentic owner reviews, and
            join the car community.
          </p>
          <div className="panel mt-12 p-6 text-slate-400 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:bg-slate-900/90 hover:text-slate-200 hover:shadow-blue-500/10">
            {error ||
              `${cars.length} cars and ${reviews.length} owner reviews available`}
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
        <div className="mt-8 space-y-4">
          {reviews.map((review) => (
            <article
              className="panel cursor-pointer p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:bg-slate-900/90 hover:shadow-lg hover:shadow-blue-500/10"
              key={review.id}
            >
              <div className="flex justify-between">
                <strong className="transition-colors duration-200 hover:text-blue-400">{review.title}</strong>
                <span className="transition-transform duration-200 hover:scale-110 text-yellow-400">★ {review.rating}</span>
              </div>
              <p className="mt-2 text-slate-300">{review.body}</p>
              <p className="mt-3 text-sm text-slate-500">
                By {review.author?.name || "Owner"}
              </p>
            </article>
          ))}
          {!reviews.length && (
            <p className="panel p-6 text-slate-400">No reviews yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}

function CarSection({ title, subtitle, cars }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="mt-2 text-slate-400">{subtitle}</p>
        </div>
        <Link
          className="group inline-flex items-center gap-1 font-semibold text-blue-400 transition-colors duration-200 hover:text-blue-300"
          to="/cars"
        >
          <span>View All</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cars.map((car) => (
          <CarCard car={car} key={car.id} />
        ))}
      </div>
    </section>
  );
}
