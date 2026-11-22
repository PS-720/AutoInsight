import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Tips() {
  const [type, setType] = useState("all");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "tip", title: "", description: "", tags: "" });
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const user = JSON.parse(sessionStorage.getItem("ai_user") || "null");
  useEffect(() => {
    loadPosts();
  }, []);
  function loadPosts() {
    api.get("/posts?limit=100").then((data) => setPosts(data.items)).catch((loadError) => setError(loadError.message));
  }
  async function createPost(event) {
    event.preventDefault();
    try {
      await api.post("/posts", {
        ...form,
        tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      });
      setForm({ type: "tip", title: "", description: "", tags: "" });
      setShowForm(false);
      setSuccess("Post published.");
      loadPosts();
    } catch (submitError) {
      setError(submitError.message);
    }
  }
  async function toggleComments(postId) {
    if (comments[postId]) {
      setComments((current) => ({ ...current, [postId]: null }));
      return;
    }
    try {
      const data = await api.get(`/posts/${postId}/comments`);
      setComments((current) => ({ ...current, [postId]: data.comments }));
    } catch (loadError) {
      setError(loadError.message);
    }
  }
  async function addComment(postId) {
    if (!commentText[postId]?.trim()) return;
    try {
      const data = await api.post(`/posts/${postId}/comments`, { text: commentText[postId] });
      setComments((current) => ({ ...current, [postId]: [...(current[postId] || []), data.comment] }));
      setCommentText((current) => ({ ...current, [postId]: "" }));
      loadPosts();
    } catch (submitError) {
      setError(submitError.message);
    }
  }
  async function vote(postId, value) {
    try {
      await api.post(`/posts/${postId}/vote`, { vote: value });
      loadPosts();
    } catch (voteError) {
      setError(voteError.message);
    }
  }
  const visible = posts.filter((post) => type === "all" || post.type === type);
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">Tips &amp; Problems</h1>
          <p className="mt-2 text-slate-400">Share maintenance tips with the community</p>
        </div>
        {user ? <button className="primary-button py-2" onClick={() => setShowForm(!showForm)}>Create Post</button> : null}
      </div>
      {success && <p className="mt-5 rounded-xl bg-green-500/10 p-3 text-green-400">{success}</p>}
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
      {showForm && (
        <form className="panel mb-8 space-y-4 p-6" onSubmit={createPost}>
          <div className="grid gap-4 sm:grid-cols-2">
            <select className="field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="tip">Tip</option><option value="problem">Problem</option>
            </select>
            <input className="field" required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <textarea className="field min-h-32" required placeholder="Describe your tip or problem" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className="field" placeholder="Tags separated by commas" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          <button className="primary-button">Publish</button>
        </form>
      )}
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
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
              <button className="rounded-lg bg-white/10 px-3 py-1 text-sm hover:bg-white/20" onClick={() => vote(post.id, 1)}>▲</button>
              <span className="text-sm text-slate-300">{post.votes}</span>
              <button className="rounded-lg bg-white/10 px-3 py-1 text-sm hover:bg-white/20" onClick={() => vote(post.id, -1)}>▼</button>
              <button className="ml-auto text-sm text-blue-400" onClick={() => toggleComments(post.id)}>{post.comments} comments</button>
            </div>
            {comments[post.id] && (
              <div className="mt-4 space-y-3">
                {comments[post.id].map((comment) => <p className="rounded-lg bg-white/5 p-3 text-sm text-slate-300" key={comment.id}><strong>{comment.author?.name || "Owner"}:</strong> {comment.text}</p>)}
                {user && <div className="flex gap-2"><input className="field" placeholder="Add a comment" value={commentText[post.id] || ""} onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })} /><button className="secondary-button" onClick={() => addComment(post.id)}>Send</button></div>}
              </div>
            )}
          </article>
        ))}
        {!visible.length && !error && (
          <p className="panel p-6 text-slate-400">No posts yet.</p>
        )}
      </div>
    </main>
  );
}
