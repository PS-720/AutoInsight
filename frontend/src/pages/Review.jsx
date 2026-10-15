import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function Review() {
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(5);
  const [cars, setCars] = useState([]);
  const [carId, setCarId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    api
      .get("/cars?limit=100")
      .then((data) => setCars(data.items))
      .catch((loadError) => setError(loadError.message));
  }, []);
  async function submit(event) {
    event.preventDefault();
    try {
      await api.post("/reviews", {
        carId: Number(carId),
        rating: Number(rating),
        title: event.currentTarget.title.value,
        body,
      });
      navigate(`/cars/${carId}`);
    } catch (submitError) {
      setError(submitError.message);
    }
  }
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link className="text-blue-400" to="/cars">
        ‹ Back to Cars
      </Link>
      <h1 className="mt-8 text-center text-4xl font-black">Write a Review & Rate</h1>
      <p className="mt-2 text-center text-slate-400">
        Share your car ownership experience and give a rating (0 to 5)
      </p>
      <form className="panel mt-8 space-y-6 p-6" onSubmit={submit}>
        <div>
          <label className="block text-sm font-semibold text-slate-300">Select Car</label>
          <select
            className="field mt-2"
            value={carId}
            onChange={(event) => setCarId(event.target.value)}
            required
          >
            <option value="">Select car</option>
            {cars.map((car) => (
              <option value={car.id} key={car.id}>
                {car.brand} {car.model}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300">
            Rating (0 to 5 Stars)
          </label>
          <div className="mt-2 flex items-center gap-3">
            {[0, 1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setRating(val)}
                className={`flex h-11 w-11 items-center justify-center rounded-xl border text-base font-bold transition ${
                  rating === val
                    ? "border-yellow-400 bg-yellow-500 text-black shadow-lg shadow-yellow-500/30"
                    : "border-white/10 bg-white/5 text-slate-300 hover:border-yellow-400/50 hover:bg-white/10"
                }`}
              >
                {val}★
              </button>
            ))}
            <span className="ml-2 text-sm text-yellow-400 font-semibold">
              Selected: {rating} / 5
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300">Review Title</label>
          <input
            className="field mt-2"
            name="title"
            placeholder="Review title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300">Detailed Review</label>
          <textarea
            className="field mt-2 min-h-40"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Share your experience..."
            required
          />
        </div>

        {error && <p className="text-red-400">{error}</p>}
        <button className="primary-button w-full">Submit Review & Rating</button>
      </form>
    </main>
  );
}
