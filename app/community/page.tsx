"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, Vote } from "lucide-react";

const initial = [
  { id: "g1", title: "Adopt a standard project update format", text: "Use a short monthly update with progress, blockers, next steps, and links to contributions.", status: "Open", votes: 34 },
  { id: "g2", title: "Publish a contributor attribution guide", text: "Create a clear guide for crediting research, design, code, documentation, and community work.", status: "Open", votes: 27 },
  { id: "g3", title: "Keep project knowledge public by default", text: "Encourage public documentation while protecting personal data and sensitive information.", status: "Discussion", votes: 19 }
];
export default function CommunityPage() {
  const [voted, setVoted] = useState<string[]>([]);
  const [items, setItems] = useState(initial);
  function cast(id: string) { const has = voted.includes(id); setVoted(v=>has?v.filter(x=>x!==id):[...v,id]); setItems(old=>old.map(item=>item.id===id?{...item,votes:Math.max(0,item.votes+(has?-1:1))}:item)); }
  return <main className="min-h-screen bg-[#090e1a] text-slate-100"><header className="border-b border-white/10"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5"><Link href="/" className="font-semibold tracking-[.18em]">OPENVERSE</Link><Link href="/" className="text-sm text-slate-400 hover:text-mint"><ArrowLeft className="mr-2 inline" size={15}/>Home</Link></div></header><section className="mx-auto max-w-5xl px-6 py-14"><p className="text-xs font-semibold tracking-[.22em] text-mint">COMMUNITY GOVERNANCE</p><h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Decisions in the open.</h1><p className="mt-4 max-w-2xl leading-7 text-slate-400">Community proposals make it possible to discuss shared rules and priorities. This preview demonstrates a simple support vote; it is not a binding governance system.</p><div className="mt-10 space-y-4">{items.map(item=><article key={item.id} className="rounded-2xl border border-white/10 bg-[#101827] p-6 sm:flex sm:items-center sm:justify-between sm:gap-8"><div className="flex-1"><div className="flex items-center gap-3"><span className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-slate-400">{item.status}</span><span className="text-xs text-slate-600">Community proposal</span></div><h2 className="mt-4 text-lg font-semibold">{item.title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p></div><button onClick={()=>cast(item.id)} aria-pressed={voted.includes(item.id)} className={`mt-6 inline-flex min-w-28 items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm sm:mt-0 ${voted.includes(item.id)?"border-mint/40 bg-mint/10 text-mint":"border-white/10 text-slate-300 hover:border-mint/40"}`}>{voted.includes(item.id)?<Check size={16}/>:<Vote size={16}/>} {item.votes} support</button></article>)}</div><p className="mt-8 text-center text-xs text-slate-600">Demo votes reset when this page is refreshed. Real voting requires accounts, eligibility rules, and a trusted database.</p></section></main>;
}
