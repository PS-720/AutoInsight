import { useState } from "react";
import CarCard from "../components/CarCard";
import { api } from "../lib/api";

export default function Recommend() {
  const [form, setForm] = useState({
    budget: "",
    fuel: "",
    bodyType: "",
    seats: "",
    priority: "balanced",
    requirements: "",
  });
  const [items, setItems] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const update = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const data = await api.post("/cars/recommend", {
        budget: form.budget || undefined,
        fuel: form.fuel || undefined,
        bodyType: form.bodyType || undefined,
        seats: form.seats || undefined,
        priority: form.priority,
        requirements: form.requirements,
        limit: 6,
      });
      setItems(data.items);
      setPreferences(data.preferences);
    } catch (submitError) {
      setItems([]);
      setPreferences(null);
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <div className="max-w-3xl">
        <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-300">
          Smart car finder
        </span>
        <h1 className="mt-5 text-4xl font-black md:text-5xl">
          Tell us what you need
        </h1>
        <p className="mt-3 text-lg text-slate-400">
          Choose your essentials or describe your requirements in your own words.
        </p>
      </div>

      <form className="panel mt-8 grid gap-5 p-6 md:grid-cols-2" onSubmit={submit}>
        <label className="text-sm text-slate-400">
          Maximum budget (₹ lakh)
          <input
            className="field mt-2"
            type="number"
            min="1"
            step="0.5"
            name="budget"
            value={form.budget}
            onChange={update}
            placeholder="For example, 25"
          />
        </label>
        <label className="text-sm text-slate-400">
          Fuel preference
          <select className="field mt-2" name="fuel" value={form.fuel} onChange={update}>
            <option value="">No preference</option>
            <option>Petrol</option>
            <option>Diesel</option>
            <option>Electric</option>
            <option>Hybrid</option>
          </select>
        </label>
        <label className="text-sm text-slate-400">
          Body type
          <select className="field mt-2" name="bodyType" value={form.bodyType} onChange={update}>
            <option value="">No preference</option>
            <option>SUV</option>
            <option>Sedan</option>
            <option>Hatchback</option>
            <option>MPV</option>
          </select>
        </label>
        <label className="text-sm text-slate-400">
          Minimum seats
          <select className="field mt-2" name="seats" value={form.seats} onChange={update}>
            <option value="">No preference</option>
            {[2, 3, 4, 5, 6, 7].map((seats) => (
              <option key={seats} value={seats}>{seats} seats</option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-400">
          What matters most
          <select className="field mt-2" name="priority" value={form.priority} onChange={update}>
            <option value="balanced">Balanced</option>
            <option value="budget">Best value</option>
            <option value="rating">Owner rating</option>
            <option value="space">Maximum space</option>
          </select>
        </label>
        <label className="text-sm text-slate-400 md:col-span-2">
          Requirements and preferences
          <textarea
            className="field mt-2 min-h-28 resize-y"
            name="requirements"
            value={form.requirements}
            onChange={update}
            placeholder="Example: A family-friendly SUV for city use, under 25 lakh, with 7 seats and good fuel economy"
          />
        </label>
        <div className="md:col-span-2">
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Finding matches..." : "Recommend Cars"}
          </button>
        </div>
      </form>

      {error && <p className="panel mt-8 p-6 text-red-400">{error}</p>}
      {searched && !loading && !error && (
        <section className="mt-12">
          <h2 className="text-3xl font-bold">Recommended for you</h2>
          {preferences?.budget !== undefined && preferences?.budget !== null && (
            <p className="mt-2 text-slate-400">
              Results within ₹{preferences.budget} lakh
            </p>
          )}
          {items.length ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((car) => (
                <div key={car.id}>
                  <CarCard car={car} />
                  <div className="mt-3 rounded-xl border border-blue-400/20 bg-blue-500/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-blue-300">Match</span>
                      <span className="text-lg font-black text-blue-400">{car.recommendationScore}%</span>
                    </div>
                    {!!car.reasons?.length && (
                      <ul className="mt-2 space-y-1 text-sm text-slate-300">
                        {car.reasons.map((reason) => <li key={reason}>• {reason}</li>)}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="panel mt-8 p-8 text-center text-slate-400">
              No exact matches found. Try increasing the budget or removing a filter.
            </p>
          )}
        </section>
      )}
    </main>
  );
}
