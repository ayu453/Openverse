# OPENVERSE

**An open innovation ecosystem built by everyone.**

OPENVERSE is a community-governed platform where people from any discipline can share ideas, form teams, build projects, and publish useful work together.

## Product principles

- Open participation across every field.
- Public-by-default projects and knowledge, with private personal data protected.
- Transparent, community-led governance.
- Clear attribution and license-aware reuse.
- AI assists people; it does not replace community decisions.

## Current status

**Stage:** Foundation / MVP scaffolding

The first milestone is a usable web application for discovering ideas, submitting ideas, discussing them, converting selected ideas into projects, and recording contributions.

## Planned MVP

1. Public landing and discovery
2. Accounts and contributor profiles
3. Idea submission and detail pages
4. Discussions and feedback
5. Project workspaces and milestones
6. Community proposals and voting
7. Contribution history and attribution
8. Moderation, reporting, and auditability

## Technology direction

- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL, Auth, Storage, Row Level Security)
- GitHub for source control and community development

The implementation may evolve through documented community proposals.

## Local development

Requirements: Node.js 20.9+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

The initial UI can run without Supabase credentials. Configure Supabase before enabling real accounts or persistence.

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md), the [Product Requirements](./docs/PRD.md), and the [Architecture](./docs/ARCHITECTURE.md) before opening a pull request.

## License

The software in this repository is licensed under Apache-2.0. Individual community projects and submitted materials may use their own clearly stated licenses.
