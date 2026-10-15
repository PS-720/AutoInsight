import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Tips() {
  const [type, setType] = useState("all");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/posts?limit=100")
      .then((data) => setPosts(data.items))
      .catch((loadError) => setError(loadError.message));
  }, []);
  const visible = posts.filter((post) => type === "all" || post.type === type);
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-black">Tips &amp; Problems</h1>
      <p className="mt-2 text-slate-400">
        Share maintenance tips with the community
      </p>
      <div className="my-8 flex gap-2">
        {[
          ["all", "All Posts"],
          ["tip", "Tips"],
          ["problem", "Problems"],
        ].map(([value, label]) => (
          <button
            className={`rounded-full px-4 py-2 ${type === value ? "bg-blue-500" : "bg-white/10"}`}
            onClick={() => setType(value)}
            key={value}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="space-y-5">
        {error && <p className="text-red-400">{error}</p>}
        {visible.map((post) => (
          <article className="panel p-6" key={post.id}>
            <div className="flex justify-between text-sm text-slate-400">
              <span>{post.author?.name || "Owner"}</span>
              <span className="text-blue-400">{post.type}</span>
            </div>
            <h2 className="mt-3 text-2xl font-bold">{post.title}</h2>
            <p className="mt-3 leading-7 text-slate-300">{post.description}</p>
            <div className="mt-5 flex gap-2 text-sm text-blue-400">
              {post.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          </article>
        ))}
        {!visible.length && !error && (
          <p className="panel p-6 text-slate-400">No posts yet.</p>
        )}
      </div>
    </main>
  );
}
