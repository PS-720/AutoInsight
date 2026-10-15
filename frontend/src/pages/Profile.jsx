import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function Profile() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/profile")
      .then(setData)
      .catch((loadError) => setError(loadError.message));
  }, []);
  if (error)
    return (
      <main className="mx-auto max-w-5xl px-4 py-12 text-red-400">{error}</main>
    );
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      {data && (
        <>
          <section className="rounded-2xl bg-gradient-to-r from-blue-900 to-slate-900 p-8">
            <img
              className="h-24 w-24 rounded-full border-4 border-blue-400 object-cover"
              src="/Asset/Images/person1.jpg"
              alt=""
            />
            <h1 className="mt-4 text-3xl font-black">{data.user.name}</h1>
            <p className="text-slate-300">{data.user.email}</p>
          </section>
          <section className="panel mt-6 p-6">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <p className="mt-4 text-slate-400">
              {data.reviews.length} reviews · {data.posts.length} posts ·{" "}
              {data.discussions.length} discussions
            </p>
            <Link className="primary-button mt-6 inline-block" to="/cars">
              Browse Cars
            </Link>
          </section>
        </>
      )}
    </main>
  );
}
