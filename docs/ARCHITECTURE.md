# OPENVERSE — Technical Architecture (MVP)

**Status:** Draft v0.1

## Architecture choice
Start with a modular Next.js application and managed PostgreSQL/Auth/Storage. Avoid premature microservices. Keep domain boundaries explicit so services can be extracted only when evidence justifies it.

## Proposed stack
- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase PostgreSQL, Auth, Storage, Row Level Security
- GitHub for source control and community workflow
- Optional AI provider behind a server-side adapter
- Managed Next.js hosting initially; preserve portability

## Domain modules
Identity & Profiles; Ideas & Discovery; Discussions; Projects & Milestones; Contributions & Attribution; Governance & Voting; Moderation & Reports; Notifications; Knowledge; AI Assistance (later).

## Initial data model
- profiles: id (auth UUID), username (unique), display_name, bio, skills, timestamps
- ideas: id, creator_id, title, summary, description, category, tags, status, declared_license, timestamps
- idea_comments: id, idea_id, author_id, body, parent_id, status, timestamps
- projects: id, source_idea_id, owner_id, title, summary, description, status, license_id, visibility, timestamps
- project_members: project_id, user_id, role, joined_at
- milestones: id, project_id, title, description, status, due_at, created_by
- contributions: id, project_id, contributor_id, contribution_type, title, description, evidence_url, review_status, reviewer fields, timestamps
- proposals: id, author_id, title, body, proposal_type, status, voting window, quorum_rule, decision_rule
- votes: id, proposal_id, voter_id, choice, created_at; unique(proposal_id, voter_id)
- reports: id, reporter_id, target_type, target_id, reason, details, status, moderator_id, resolution_note, timestamps
- audit_events: id, actor_id, action, target_type, target_id, metadata JSONB, created_at (never store secrets)

## Authorization
Public read only for published public content. Users manage their own profiles and drafts. Project owners/maintainers manage membership and milestones. Authorized maintainers review contributions. Votes are accepted only from eligible authenticated users during the published window. Moderation records and private notes are restricted. UI hiding is not security: enforce checks in server code and RLS.

## Voting integrity
Validate proposal status/window on server/database; enforce unique(proposal_id, voter_id); publish process events and aggregate results; do not expose individual ballots by default; define quorum and tie handling before opening. Rate-limit abuse. An account is not proof of one human.

## Security baseline
Secrets only in environment variables/secret storage; RLS on all user-data tables; input validation; rate limits; upload restrictions and scanning plan; dependency updates; backups and recovery tests; private vulnerability disclosure before production.

## Delivery order
1. UI shell and design system
2. Supabase project, migrations, auth, RLS
3. Ideas and discovery
4. Discussions and reports
5. Projects, milestones, membership
6. Contributions and attribution
7. Proposals and voting
8. Accessibility, security review, and beta

## Guardrails
No blockchain, tokenized reputation, autonomous write-capable AI, or microservices in MVP without a documented problem and community-reviewed proposal.
