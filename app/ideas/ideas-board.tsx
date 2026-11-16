"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Plus, Search, Sparkles, ThumbsUp, X } from "lucide-react";

type Idea = { id: string; title: string; summary: string; category: string; author: string; votes: number; createdAt: string };
const starter: Idea[] = [
  { id: "seed-1", title: "Community-powered air quality map", summary: "Combine low-cost sensors and public data to help neighbourhoods understand local air quality.", category: "Climate", author: "Openverse community", votes: 28, createdAt: "2026-11-10" },
  { id: "seed-2", title: "Offline-first learning library", summary: "A lightweight, multilingual library that schools can use even with unreliable internet.", category: "Education", author: "Openverse community", votes: 21, createdAt: "2026-11-08" },
  { id: "seed-3", title: "Repair guides for everyday devices", summary: "Step-by-step community documentation that makes common electronics easier to repair.", category: "Open hardware", author: "Openverse community", votes: 16, createdAt: "2026-11-05" },
  { id: "seed-4", title: "Accessible public-space navigator", summary: "A crowdsourced guide to ramps, paths, crossings, and other accessibility information.", category: "Civic ideas", author: "Openverse community", votes: 13, createdAt: "2026-11-02" },
  { id: "seed-5", title: "Visual science experiments at home", summary: "A collection of safe, low-cost demonstrations that explain science through observation.", category: "Science", author: "Openverse community", votes: 11, createdAt: "2026-10-29" },
  { id: "seed-6", title: "Local language study buddy", summary: "An open learning companion that helps learners practise concepts in the language they know best.", category: "Technology", author: "Openverse community", votes: 9, createdAt: "2026-10-26" }
];
const categories = ["All", "Technology", "Science", "Education", "Climate", "Health", "Creative arts", "Open hardware", "Civic ideas"];

export default function IdeasBoard() {
  const [ideas, setIdeas] = useState<Idea[]>(starter);
  const [votes, setVotes] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [newCategory, setNewCategory] = useState("Technology");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    try {
      const savedIdeas = localStorage.getItem("openverse-ideas-v1");
      const savedVotes = localStorage.getItem("openverse-votes-v1");
      if (savedIdeas) setIdeas(JSON.parse(savedIdeas) as Idea[]);
      if (savedVotes) setVotes(JSON.parse(savedVotes) as string[]);
    } catch { /* Ignore malformed local demo data and keep the starter content. */ }
  }, []);
  useEffect(() => { try { localStorage.setItem("openverse-ideas-v1", JSON.stringify(ideas)); } catch {} }, [ideas]);
  useEffect(() => { try { localStorage.setItem("openverse-votes-v1", JSON.stringify(votes)); } catch {} }, [votes]);

  const filtered = useMemo(() => ideas.filter(idea => (category === "All" || idea.category === category) && (idea.title + " " + idea.summary + " " + idea.category).toLowerCase().includes(query.toLowerCase())).sort((a,b) => b.votes - a.votes), [ideas, category, query]);

  function submitIdea(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanSummary = summary.trim();
    if (!cleanTitle || !cleanSummary) return;
    setIdeas(current => [{ id: `local-${Date.now()}`, title: cleanTitle, summary: cleanSummary, category: newCategory, author: author.trim() || "Community member", votes: 0, createdAt: new Date().toISOString().slice(0,10) }, ...current]);
    setTitle(""); setSummary(""); setAuthor(""); setShowForm(false); setCategory("All"); setQuery("");
  }
  function toggleVote(id: string) {
    const active = votes.includes(id);
    setVotes(current => active ? current.filter(v => v !== id) : [...current, id]);
    setIdeas(current => current.map(idea => idea.id === id ? { ...idea, votes: Math.max(0, idea.votes + (active ? -1 : 1)) } : idea));
  }

  return <main className="min-h-screen bg-[#090e1a] text-slate-100">
    <header className="border-b border-white/10"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5"><Link href="/" className="font-semibold tracking-[.18em]">OPENVERSE</Link><Link href="/" className="text-sm text-slate-400 hover:text-mint"><ArrowLeft className="mr-2 inline" size={15}/>Home</Link></div></header>
    <section className="mx-auto max-w-7xl px-6 pb-16 pt-14">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold tracking-[.22em] text-mint">THE IDEA EXCHANGE</p><h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Explore ideas.</h1><p className="mt-4 max-w-xl leading-7 text-slate-400">Discover problems worth solving, add your perspective, and help promising ideas find their people.</p></div><button onClick={() => setShowForm(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-mint px-5 py-3 text-sm font-semibold text-ink hover:bg-white"><Plus size={17}/> Share an idea</button></div>
      <div className="mt-10 flex flex-col gap-4 md:flex-row"><label className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[.03] px-4"><Search size={18} className="text-slate-500"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search ideas, topics, or problems..." className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-600"/></label><div className="flex gap-2 overflow-x-auto pb-1">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs transition ${category===c?"border-mint/50 bg-mint/10 text-mint":"border-white/10 text-slate-400 hover:border-white/30"}`}>{c}</button>)}</div></div>
      <div className="mt-8 flex items-center justify-between text-xs text-slate-500"><span>{filtered.length} ideas found</span><span>Sorted by community support</span></div>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map(idea=><article key={idea.id} className="flex min-h-[245px] flex-col rounded-2xl border border-white/10 bg-[#101827] p-6 transition hover:border-mint/30"><div className="flex items-center justify-between gap-3"><span className="rounded-full border border-mint/20 bg-mint/5 px-3 py-1 text-[11px] text-mint">{idea.category}</span><span className="text-[11px] text-slate-600">{idea.createdAt}</span></div><h2 className="mt-5 text-lg font-semibold leading-7">{idea.title}</h2><p className="mt-2 flex-1 text-sm leading-6 text-slate-400">{idea.summary}</p><div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4"><span className="text-xs text-slate-500">By {idea.author}</span><button onClick={()=>toggleVote(idea.id)} aria-pressed={votes.includes(idea.id)} className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs ${votes.includes(idea.id)?"border-mint/40 bg-mint/10 text-mint":"border-white/10 text-slate-400 hover:border-mint/40 hover:text-mint"}`}><ThumbsUp size={14}/>{idea.votes}</button></div></article>)}</div>
      {filtered.length===0 && <div className="mt-6 rounded-2xl border border-dashed border-white/15 py-16 text-center"><Sparkles className="mx-auto text-slate-600" size={28}/><p className="mt-4 font-medium">No ideas match that search.</p><p className="mt-2 text-sm text-slate-500">Try another keyword or share the first idea in this topic.</p></div>}
      <p className="mt-10 text-center text-xs leading-5 text-slate-600">Demo mode: ideas and votes are saved in this browser only. They are not shared with other visitors yet.</p>
    </section>
    {showForm && <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/75 p-4" onMouseDown={e=>{if(e.target===e.currentTarget)setShowForm(false)}}><div className="my-8 w-full max-w-xl rounded-3xl border border-white/10 bg-[#111a2b] p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold tracking-[.2em] text-mint">ADD TO THE COMMONS</p><h2 className="mt-2 text-2xl font-semibold">Share an idea</h2></div><button onClick={()=>setShowForm(false)} aria-label="Close form" className="rounded-full p-2 text-slate-400 hover:bg-white/10"><X size={19}/></button></div><form onSubmit={submitIdea} className="mt-7 space-y-5"><label className="block text-sm text-slate-300">Idea title<input required maxLength={90} value={title} onChange={e=>setTitle(e.target.value)} placeholder="What would you like to make possible?" className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a1220] px-4 py-3 text-sm outline-none focus:border-mint/50"/></label><label className="block text-sm text-slate-300">What is the idea about?<textarea required maxLength={500} rows={4} value={summary} onChange={e=>setSummary(e.target.value)} placeholder="Describe the problem, who it helps, or how it might work..." className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#0a1220] px-4 py-3 text-sm outline-none focus:border-mint/50"/></label><div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm text-slate-300">Field<select value={newCategory} onChange={e=>setNewCategory(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a1220] px-3 py-3 text-sm outline-none"><option>Technology</option><option>Science</option><option>Education</option><option>Climate</option><option>Health</option><option>Creative arts</option><option>Open hardware</option><option>Civic ideas</option></select></label><label className="block text-sm text-slate-300">Display name (optional)<input maxLength={40} value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Community member" className="mt-2 w-full rounded-xl border border-white/10 bg-[#0a1220] px-3 py-3 text-sm outline-none focus:border-mint/50"/></label></div><div className="flex justify-end gap-3 pt-2"><button type="button" onClick={()=>setShowForm(false)} className="rounded-full border border-white/10 px-5 py-3 text-sm text-slate-300">Cancel</button><button type="submit" className="rounded-full bg-mint px-6 py-3 text-sm font-semibold text-ink">Publish idea <ArrowUpRight className="ml-1 inline" size={15}/></button></div></form></div></div>}
  </main>;
}
