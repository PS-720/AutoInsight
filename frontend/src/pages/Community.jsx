import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Community() {
  const [category, setCategory] = useState("");
  const [discussions, setDiscussions] = useState([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "General Discussion", title: "", body: "" });
  const [replies, setReplies] = useState({});
  const [replyText, setReplyText] = useState({});
  const user = JSON.parse(sessionStorage.getItem("ai_user") || "null");
  useEffect(() => {
    loadDiscussions();
  }, []);
  function loadDiscussions() {
    api.get("/discussions?limit=100").then((data) => setDiscussions(data.items)).catch((loadError) => setError(loadError.message));
  }
  async function createDiscussion(event) {
    event.preventDefault();
    try {
      await api.post("/discussions", form);
      setForm({ category: "General Discussion", title: "", body: "" });
      setShowForm(false);
      loadDiscussions();
    } catch (submitError) {
      setError(submitError.message);
    }
  }
  async function toggleReplies(id) {
    if (replies[id]) {
      setReplies((current) => ({ ...current, [id]: null }));
      return;
    }
    try {
      const data = await api.get(`/discussions/${id}/replies`);
      setReplies((current) => ({ ...current, [id]: data.replies }));
    } catch (loadError) {
      setError(loadError.message);
    }
  }
  async function addReply(id) {
    if (!replyText[id]?.trim()) return;
    try {
      const data = await api.post(`/discussions/${id}/replies`, { text: replyText[id] });
      setReplies((current) => ({ ...current, [id]: [...(current[id] || []), data.reply] }));
      setReplyText((current) => ({ ...current, [id]: "" }));
      loadDiscussions();
    } catch (submitError) {
      setError(submitError.message);
    }
  }
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
        {user ? <button className="primary-button py-2" onClick={() => setShowForm(!showForm)}>Start Discussion</button> : null}
      </div>
      {showForm && (
        <form className="panel mt-8 space-y-4 p-6" onSubmit={createDiscussion}>
          <select className="field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {["General Discussion", "Buying Advice", "Car Comparison", "Electric Vehicles", "Safety"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <input className="field" required placeholder="Discussion title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea className="field min-h-32" required placeholder="What would you like to discuss?" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          <button className="primary-button">Publish Discussion</button>
        </form>
      )}
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
                <button className="text-blue-400 hover:underline" onClick={() => toggleReplies(item.id)}>{item.replies} replies</button> · {item.views} views
              </p>
              {replies[item.id] && (
                <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                  {replies[item.id].map((reply) => <p className="rounded-lg bg-white/5 p-3 text-sm text-slate-300" key={reply.id}><strong>{reply.author?.name || "Owner"}:</strong> {reply.text}</p>)}
                  {user && <div className="flex gap-2"><input className="field" placeholder="Write a reply" value={replyText[item.id] || ""} onChange={(e) => setReplyText({ ...replyText, [item.id]: e.target.value })} /><button className="secondary-button" onClick={() => addReply(item.id)}>Send</button></div>}
                </div>
              )}
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
