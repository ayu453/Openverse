"use client";

import Link from "next/link";
import { ArrowLeft, Users, Target } from "lucide-react";

const projects = [
  { name: "Neighbourhood Air Watch", field: "Climate · Open data", stage: "Research", people: 4, description: "Explore an affordable, community-led way to understand local air quality and make the data easier to use." },
  { name: "Learn Anywhere", field: "Education · Technology", stage: "Concept", people: 3, description: "Design an offline-friendly learning resource that works across languages, devices, and connectivity levels." },
  { name: "Repair Commons", field: "Open hardware · Community", stage: "Planning", people: 6, description: "Collect clear repair knowledge and practical guides that help people maintain everyday devices." }
];
export default function ProjectsPage() {
  return <main className="min-h-screen bg-[#090e1a] text-slate-100"><header className="border-b border-white/10"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5"><Link href="/" className="font-semibold tracking-[.18em]">OPENVERSE</Link><Link href="/" className="text-sm text-slate-400 hover:text-mint"><ArrowLeft className="mr-2 inline" size={15}/>Home</Link></div></header><section className="mx-auto max-w-7xl px-6 py-14"><p className="text-xs font-semibold tracking-[.22em] text-mint">BUILD TOGETHER</p><h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Community projects.</h1><p className="mt-4 max-w-2xl leading-7 text-slate-400">Ideas become projects when people commit to exploring them together. These sample workspaces show the kind of collaboration OPENVERSE is being built to support.</p><div className="mt-10 grid gap-5 lg:grid-cols-3">{projects.map(p=><article key={p.name} className="rounded-2xl border border-white/10 bg-[#101827] p-6"><span className="rounded-full border border-mint/20 bg-mint/5 px-3 py-1 text-[11px] text-mint">{p.stage}</span><h2 className="mt-6 text-xl font-semibold">{p.name}</h2><p className="mt-2 text-xs text-slate-500">{p.field}</p><p className="mt-5 min-h-20 text-sm leading-6 text-slate-400">{p.description}</p><div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-500"><span><Users className="mr-1 inline" size={14}/>{p.people} contributors</span><span><Target className="mr-1 inline" size={14}/>Early stage</span></div></article>)}</div><p className="mt-8 text-center text-xs text-slate-600">Sample projects for preview. Project creation and shared membership will be enabled in a later backend phase.</p></section></main>;
}
