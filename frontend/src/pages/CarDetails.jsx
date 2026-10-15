import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";

export default function CarDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get(`/cars/${id}`)
      .then(setData)
      .catch((loadError) => setError(loadError.message));
  }, [id]);
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <Link className="text-blue-400" to="/cars">
        ‹ Back to Cars
      </Link>
      <section className="panel mt-6 p-8">
        {error && <p className="text-red-400">{error}</p>}
        {data && (
          <>
            <img
              className="h-80 w-full rounded-xl object-cover"
              src={`/${data.car.image}`}
              alt={`${data.car.brand} ${data.car.model}`}
            />
            <h1 className="mt-6 text-4xl font-black">
              {data.car.brand} {data.car.model}
            </h1>
            <p className="mt-3 text-slate-400">
              {data.car.year} · {data.car.fuel} · {data.car.seats} seats · ₹
              {data.car.price}L
            </p>
            <h2 className="mt-8 text-2xl font-bold">Owner Reviews</h2>
            <div className="mt-4 space-y-4">
              {data.reviews.map((review) => (
                <article className="rounded-xl bg-white/5 p-4" key={review.id}>
                  <strong>{review.title}</strong>
                  <p className="mt-2 text-slate-300">{review.body}</p>
                </article>
              ))}
              {!data.reviews.length && (
                <p className="text-slate-400">No reviews yet.</p>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
