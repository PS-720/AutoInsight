import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

function EyeIcon({ visible }) {
  if (visible) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 text-slate-400 hover:text-white"
      >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-slate-400 hover:text-white"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function Profile() {
  const [data, setData] = useState(null);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit Profile Form State
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Edit Review Modal / Form State
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const loadProfile = () => {
    Promise.all([api.get("/profile"), api.get("/cars?limit=100")])
      .then(([profileData, carsData]) => {
        setData(profileData);
        setName(profileData.user.name || "");
        setAvatar(profileData.user.avatar || "");
        setCars(carsData.items || []);
      })
      .catch((loadError) => setError(loadError.message));
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        name,
      };
      if (password) {
        payload.password = password;
      }
      const res = await api.put("/auth/profile", payload);
      api.setSession(res);
      setPassword("");
      setSuccess("Profile updated successfully!");
      loadProfile();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target.result;
      try {
        setError("");
        const res = await api.put("/auth/profile", { avatar: base64Data });
        api.setSession(res);
        setAvatar(base64Data);
        setSuccess("Profile picture updated successfully!");
        loadProfile();
      } catch (err) {
        setError(err.message);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm("Are you sure you want to remove your profile picture?")) return;
    try {
      setError("");
      const res = await api.put("/auth/profile", { avatar: "" });
      api.setSession(res);
      setAvatar("");
      setSuccess("Profile picture removed.");
      setShowAvatarModal(false);
      loadProfile();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      setError("");
      await api.delete(`/reviews/${reviewId}`);
      setSuccess("Review deleted successfully.");
      loadProfile();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStartEditReview = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditTitle(review.title);
    setEditBody(review.body);
  };

  const handleSaveEditReview = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await api.put(`/reviews/${editingReview.id}`, {
        rating: Number(editRating),
        title: editTitle,
        body: editBody,
      });
      setSuccess("Review & rating updated successfully!");
      setEditingReview(null);
      loadProfile();
    } catch (err) {
      setError(err.message);
    }
  };

  if (error && !data)
    return (
      <main className="mx-auto max-w-5xl px-4 py-12 text-red-400">{error}</main>
    );

  const userAvatar =
    data?.user?.avatar || avatar || "/Asset/Icons/default-avatar.svg";

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      {error && (
        <p className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
          {error}
        </p>
      )}
      {success && (
        <p className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-400">
          {success}
        </p>
      )}

      {data && (
        <>
          {/* Header Card */}
          <section className="flex flex-wrap items-center gap-6 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-slate-950 p-8 border border-white/10">
            <div className="group relative cursor-pointer" onClick={() => setShowAvatarModal(true)}>
              <img
                className="h-24 w-24 rounded-full border-4 border-blue-500 object-cover shadow-xl transition duration-300 group-hover:brightness-75"
                src={userAvatar}
                alt="Profile Avatar"
                onError={(e) => {
                  e.target.src = "/Asset/Icons/default-avatar.svg";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition duration-300 group-hover:opacity-100">
                <span className="rounded-full bg-black/60 px-2 py-1 text-[11px] font-bold text-white backdrop-blur">
                  View
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black">{data.user.name}</h1>
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300 capitalize border border-blue-500/30">
                  {data.user.role}
                </span>
              </div>
              <p className="text-slate-300 mt-1">{data.user.email}</p>
              <p className="text-xs text-slate-400 mt-2">
                Member since {new Date(data.user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </section>

          {/* Edit Profile Section */}
          <section className="panel mt-8 p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Edit Profile Details</h2>
            <p className="text-sm text-slate-400 mt-1">
              Update your name or change your password.
            </p>

            <form onSubmit={handleUpdateProfile} className="mt-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-300">
                  Full Name
                </label>
                <input
                  required
                  className="field mt-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300">
                  New Password <span className="text-xs text-slate-400 font-normal">(Leave blank if you don't want to change it)</span>
                </label>
                <div className="relative mt-2">
                  <input
                    className="field pr-11"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter at least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="primary-button"
              >
                {savingProfile ? "Saving Profile..." : "Update Profile"}
              </button>
            </form>
          </section>

          {/* Manage My Reviews & Ratings Section */}
          <section className="panel mt-8 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">My Reviews &amp; Ratings</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Edit or delete any ratings and reviews you have posted
                </p>
              </div>
              <Link to="/cars" className="primary-button py-2 text-sm">
                Rate More Cars
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {data.reviews.map((review) => {
                const car = cars.find((c) => c.id === review.carId);
                return (
                  <article
                    className="rounded-xl border border-white/10 bg-white/5 p-5"
                    key={review.id}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <Link
                          to={`/cars/${review.carId}`}
                          className="text-lg font-bold hover:text-blue-400"
                        >
                          {car ? `${car.brand} ${car.model}` : `Car #${review.carId}`}
                        </Link>
                        <div className="mt-1 flex items-center gap-3">
                          <span className="rounded border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-xs font-bold text-yellow-400">
                            ★ {review.rating} / 5
                          </span>
                          <span className="font-semibold text-white">
                            {review.title}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStartEditReview(review)}
                          className="rounded-lg bg-blue-500/20 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-500 hover:text-white"
                        >
                          Edit Review / Rating
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500 hover:text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 text-slate-300 text-sm">{review.body}</p>
                  </article>
                );
              })}

              {!data.reviews.length && (
                <p className="panel p-6 text-center text-slate-400">
                  You haven't written any reviews yet.
                </p>
              )}
            </div>
          </section>
        </>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="panel w-full max-w-lg p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Edit Review &amp; Rating</h3>
              <button
                onClick={() => setEditingReview(null)}
                className="text-2xl leading-none text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveEditReview} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300">
                  Change Rating (0 to 5)
                </label>
                <div className="mt-2 flex items-center gap-3">
                  {[0, 1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setEditRating(val)}
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border text-base font-bold transition ${
                        editRating === val
                          ? "border-yellow-400 bg-yellow-500 text-black shadow-lg shadow-yellow-500/30"
                          : "border-white/10 bg-white/5 text-slate-300 hover:border-yellow-400/50 hover:bg-white/10"
                      }`}
                    >
                      {val}★
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-yellow-400 font-semibold">
                    {editRating} / 5
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300">
                  Review Title
                </label>
                <input
                  required
                  className="field mt-1"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300">
                  Review Description
                </label>
                <textarea
                  className="field mt-1 min-h-28"
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="secondary-button py-2 text-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button py-2 text-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Avatar Zoom & Actions Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="panel w-full max-w-md p-6 sm:p-8 flex flex-col items-center text-center relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowAvatarModal(false)}
              className="absolute right-4 top-4 text-2xl leading-none text-slate-400 hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-white">Profile Picture</h3>

            {/* Zoomed Avatar Display */}
            <div className="mt-6 relative">
              <img
                src={userAvatar}
                alt="Profile Zoom"
                className="h-56 w-56 sm:h-64 sm:w-64 rounded-full border-4 border-blue-500 object-cover shadow-2xl"
                onError={(e) => {
                  e.target.src = "/Asset/Icons/default-avatar.svg";
                }}
              />
            </div>

            {/* Action buttons below the image */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full">
              <label className="primary-button py-2.5 px-4 text-sm cursor-pointer flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Change Picture
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    handleAvatarFileUpload(e);
                  }}
                />
              </label>

              {data?.user?.avatar && (
                <button
                  type="button"
                  onClick={handleDeleteAvatar}
                  className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500 hover:text-white transition flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Picture
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                className="secondary-button py-2.5 px-4 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
