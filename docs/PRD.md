# OPENVERSE — Product Requirements (MVP)

**Status:** Draft v0.1 · **Platform:** Responsive web application

## Vision
Enable people across disciplines and geographies to turn ideas and real-world problems into collaborative, reusable projects.

## Principles
- Open participation across every field.
- Public-by-default projects and knowledge; private personal data stays protected.
- Transparent community governance and auditable decisions.
- Accurate contributor attribution and explicit licenses.
- AI assists but does not make binding community decisions.

## Participants
Idea starters, builders (developers/designers/researchers/writers/makers), reviewers, testers, moderators, and visitors.

## MVP scope (P0)
1. Landing page and public idea discovery.
2. Authentication and contributor profiles.
3. Idea create/read/update/archive, categories, tags, search.
4. Idea discussions and content reporting.
5. Project creation linked to an idea.
6. Project overview, milestones, and membership.
7. Contribution records and attribution.
8. Proposal lifecycle and transparent voting.
9. One eligible vote per member per proposal, enforced in the database.
10. Basic moderation, audit events, and privacy controls.

## Later (P1)
Team invitations, Git provider integration, notifications, knowledge library, advanced search, contributor matching, and AI assistance.

## Not in MVP
Tokens or cryptocurrency, paid voting, autonomous write-capable AI, complex real-time editing, native mobile apps, and premature microservices.

## Core journeys
**Idea to project:** discover → submit → discuss → decide → create linked project → milestones → contributions → publish outcome.

**Contributor:** profile → skills/interests → discover project → offer help → contribution review → attribution.

**Governance:** publish proposal → define eligibility/quorum/rule/window → discussion → vote → close → publish auditable result.

## Governance requirements
Every proposal states the exact decision, eligible voters, voting window, quorum, decision rule, tie handling, and effect. Results are public; individual ballots are not public by default. Popularity must not silently become governance authority. Moderation and security powers remain bounded and appealable.

## Privacy and safety
Minimize collected data; keep credentials, email, private messages, and security data private. Enforce authorization server-side and with database RLS. Provide report, block, moderation, and appeal workflows. Do not execute public uploads as code.

## Success measures
Meaningful idea feedback, ideas converted to projects, projects with multiple contributors, reviewed/credited contributions, completed milestones, time to first contribution, and moderation quality.

## Beta acceptance
The idea-to-project journey works with persisted data; permissions and voting are tested; reporting/moderation exist; mobile and accessibility checks pass; backups/recovery are documented; and no secrets are committed.
