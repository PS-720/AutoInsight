import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Community() {
  const [category, setCategory] = useState("");
  const [discussions, setDiscussions] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/discussions?limit=100")
      .then((data) => setDiscussions(data.items))
      .catch((loadError) => setError(loadError.message));
  }, []);
  const visible = discussions.filter(
    (item) => !category || item.category === category,
  );
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">Community Forum</h1>
          <p className="mt-2 text-slate-400">
            Connect with car enthusiasts and share knowledge
          </p>
        </div>
      </div>
      <div className="mt-10 grid gap-8 md:grid-cols-[220px_1fr]">
        <aside className="panel h-fit p-4">
          {[
            "",
            "Buying Advice",
            "Car Comparison",
            "Electric Vehicles",
            "Safety",
          ].map((item) => (
            <button
              className={`mb-1 w-full rounded-lg px-3 py-2 text-left ${category === item ? "bg-blue-500" : "hover:bg-white/10"}`}
              onClick={() => setCategory(item)}
              key={item}
            >
              {item || "All Discussions"}
            </button>
          ))}
        </aside>
        <div className="space-y-5">
          {error && <p className="text-red-400">{error}</p>}
          {visible.map((item) => (
            <article className="panel p-6" key={item.id}>
              <span className="text-sm text-blue-400">{item.category}</span>
              <h2 className="mt-2 text-xl font-bold">{item.title}</h2>
              <p className="mt-3 text-slate-300">{item.body}</p>
              <p className="mt-5 text-sm text-slate-500">
                {item.replies} replies · {item.views} views
              </p>
            </article>
          ))}
          {!visible.length && !error && (
            <p className="panel p-6 text-slate-400">No discussions yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
