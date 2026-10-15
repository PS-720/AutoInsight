import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function Review() {
  const [body, setBody] = useState("");
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
        rating: 5,
        title: event.currentTarget.title.value,
        body,
      });
      navigate("/cars");
    } catch (submitError) {
      setError(submitError.message);
    }
  }
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link className="text-blue-400" to="/cars">
        ‹ Back to Cars
      </Link>
      <h1 className="mt-8 text-center text-4xl font-black">Write a Review</h1>
      <p className="mt-2 text-center text-slate-400">
        Share your car ownership experience
      </p>
      <form className="panel mt-8 space-y-6 p-6" onSubmit={submit}>
        <select
          className="field"
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
        <input
          className="field"
          name="title"
          placeholder="Review title"
          required
        />
        <textarea
          className="field min-h-52"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Share your experience..."
          required
        />
        <p className="text-sm text-slate-400">
          Minimum 100 characters ({body.length}/100)
        </p>
        {error && <p className="text-red-400">{error}</p>}
        <button className="primary-button">Submit Review</button>
      </form>
    </main>
  );
}
