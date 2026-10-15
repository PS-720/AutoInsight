import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function Admin() {
  const [tab, setTab] = useState("Dashboard");
  const [stats, setStats] = useState(null);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCar, setNewCar] = useState({
    brand: "",
    model: "",
    year: 2024,
    price: "",
    fuel: "Petrol",
    seats: 5,
    bodyType: "SUV",
    image: "Asset/Images/cars/1778438147_cretafront.jpg",
    featured: false,
  });

  const loadData = () => {
    Promise.all([api.get("/admin/stats"), api.get("/cars?limit=100")])
      .then(([statsData, carData]) => {
        setStats(statsData.stats);
        setCars(carData.items);
      })
      .catch((loadError) => setError(loadError.message));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteCar = async (carId, carName) => {
    if (!window.confirm(`Are you sure you want to delete ${carName}?`)) return;
    try {
      setError("");
      await api.delete(`/cars/${carId}`);
      setSuccess(`Deleted ${carName} successfully.`);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateCar = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await api.post("/cars", {
        ...newCar,
        year: Number(newCar.year),
        price: Number(newCar.price),
        seats: Number(newCar.seats),
      });
      setSuccess("Car added successfully!");
      setShowAddModal(false);
      setNewCar({
        brand: "",
        model: "",
        year: 2024,
        price: "",
        fuel: "Petrol",
        seats: 5,
        bodyType: "SUV",
        image: "Asset/Images/cars/1778438147_cretafront.jpg",
        featured: false,
      });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        <aside className="border-b border-white/10 p-6 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
          <Link to="/" className="text-xl font-black text-white hover:text-blue-400">
            AutoInsight
          </Link>
          <p className="text-sm text-slate-400">Admin Panel</p>
          <nav className="mt-8 space-y-2">
            {["Dashboard", "Manage Cars"].map((item) => (
              <button
                className={`block w-full rounded-lg px-3 py-2 text-left font-semibold ${
                  tab === item ? "bg-blue-500 text-white" : "text-slate-300 hover:bg-white/10"
                }`}
                onClick={() => {
                  setTab(item);
                  setError("");
                  setSuccess("");
                }}
                key={item}
              >
                {item}
              </button>
            ))}
            <Link
              to="/"
              className="mt-6 block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-400 hover:bg-white/10"
            >
              ← Back to Website
            </Link>
          </nav>
        </aside>

        <section className="flex-1 p-6 md:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-4xl font-black">{tab}</h1>
            {tab === "Manage Cars" && (
              <button
                onClick={() => setShowAddModal(true)}
                className="primary-button flex items-center gap-2 py-2 text-sm"
              >
                <span className="text-lg leading-none">+</span> Add New Car
              </button>
            )}
          </div>

          {error && <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-red-400 border border-red-500/20">{error}</p>}
          {success && <p className="mt-4 rounded-xl bg-green-500/10 p-3 text-green-400 border border-green-500/20">{success}</p>}

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
                <div
                  className="panel flex flex-wrap items-center justify-between gap-4 p-4"
                  key={car.id}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={`/${car.image}`}
                      alt=""
                      className="h-14 w-20 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.src = "/Asset/Images/cars/1778438147_cretafront.jpg";
                      }}
                    />
                    <div>
                      <h4 className="font-bold text-lg">
                        {car.brand} {car.model}
                      </h4>
                      <p className="text-xs text-slate-400">
                        {car.year} · {car.fuel} · {car.bodyType} · ★ {car.rating} ({car.reviewCount} reviews)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-blue-400">₹{car.price}L</span>
                    <button
                      onClick={() => handleDeleteCar(car.id, `${car.brand} ${car.model}`)}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {!cars.length && (
                <p className="panel p-6 text-center text-slate-400">No cars found.</p>
              )}
            </div>
          )}
        </section>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="panel w-full max-w-xl p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Add New Car</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-2xl leading-none text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateCar} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-400">Brand</label>
                  <input
                    required
                    className="field mt-1"
                    placeholder="e.g. BMW"
                    value={newCar.brand}
                    onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400">Model</label>
                  <input
                    required
                    className="field mt-1"
                    placeholder="e.g. M3"
                    value={newCar.model}
                    onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400">Year</label>
                  <input
                    type="number"
                    required
                    className="field mt-1"
                    value={newCar.year}
                    onChange={(e) => setNewCar({ ...newCar, year: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400">Price (Lakh ₹)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    className="field mt-1"
                    placeholder="e.g. 65.5"
                    value={newCar.price}
                    onChange={(e) => setNewCar({ ...newCar, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400">Fuel</label>
                  <select
                    className="field mt-1 [color-scheme:dark]"
                    value={newCar.fuel}
                    onChange={(e) => setNewCar({ ...newCar, fuel: e.target.value })}
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400">Body Type</label>
                  <select
                    className="field mt-1 [color-scheme:dark]"
                    value={newCar.bodyType}
                    onChange={(e) => setNewCar({ ...newCar, bodyType: e.target.value })}
                  >
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Coupe">Coupe</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400">Image Path / Asset</label>
                <input
                  className="field mt-1"
                  placeholder="Asset/Images/cars/1778438147_cretafront.jpg or Asset/Images/bmw.jpg"
                  value={newCar.image}
                  onChange={(e) => setNewCar({ ...newCar, image: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={newCar.featured}
                  onChange={(e) => setNewCar({ ...newCar, featured: e.target.checked })}
                  className="h-4 w-4 rounded"
                />
                <label htmlFor="featured" className="text-sm text-slate-300">
                  Featured on homepage
                </label>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="secondary-button py-2 text-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button py-2 text-sm">
                  Save Car
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
