import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Admin() {
  const [tab, setTab] = useState("Dashboard");
  const [stats, setStats] = useState(null);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([api.get("/admin/stats"), api.get("/cars?limit=100")])
      .then(([statsData, carData]) => {
        setStats(statsData.stats);
        setCars(carData.items);
      })
      .catch((loadError) => setError(loadError.message));
  }, []);
  return (
    <main className="min-h-screen bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        <aside className="border-b border-white/10 p-6 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
          <h2 className="text-xl font-black">AutoInsight</h2>
          <p className="text-sm text-slate-400">Admin Panel</p>
          <nav className="mt-8 space-y-2">
            {["Dashboard", "Manage Cars"].map((item) => (
              <button
                className={`block w-full rounded-lg px-3 py-2 text-left ${tab === item ? "bg-blue-500" : "hover:bg-white/10"}`}
                onClick={() => setTab(item)}
                key={item}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>
        <section className="flex-1 p-6 md:p-12">
          <h1 className="text-4xl font-black">{tab}</h1>
          {error && <p className="mt-4 text-red-400">{error}</p>}
          {tab === "Dashboard" && stats && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {Object.entries(stats).map(([key, value]) => (
                <div className="panel p-5" key={key}>
                  <p className="text-sm capitalize text-slate-400">{key}</p>
                  <strong className="mt-2 block text-3xl">{value}</strong>
                </div>
              ))}
            </div>
          )}
          {tab === "Manage Cars" && (
            <div className="mt-8 space-y-3">
              {cars.map((car) => (
                <div className="panel flex justify-between p-4" key={car.id}>
                  <span>
                    {car.brand} {car.model}
                  </span>
                  <span className="text-slate-400">₹{car.price}L</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
