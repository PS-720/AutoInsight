import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Review() {
  const [body, setBody] = useState('');
  const navigate = useNavigate();
  return <main className="mx-auto max-w-3xl px-4 py-12"><Link className="text-blue-400" to="/cars">‹ Back to Cars</Link><h1 className="mt-8 text-center text-4xl font-black">Write a Review</h1><p className="mt-2 text-center text-slate-400">Share your car ownership experience</p><form className="panel mt-8 space-y-6 p-6" onSubmit={event => { event.preventDefault(); if (body.length < 100) return alert('Your review must be at least 100 characters long.'); alert('Review saved locally and ready for the future Node API.'); navigate('/cars'); }}><div className="grid gap-4 sm:grid-cols-2"><input className="field" placeholder="Brand" required /><input className="field" placeholder="Model" required /></div><input className="field" placeholder="Review title" required /><textarea className="field min-h-52" value={body} onChange={event => setBody(event.target.value)} placeholder="Share your experience..." required /><p className="text-sm text-slate-400">Minimum 100 characters ({body.length}/100)</p><button className="primary-button">Submit Review</button></form></main>;
}
