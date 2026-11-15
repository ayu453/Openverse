-- OPENVERSE initial schema. Apply with Supabase CLI after reviewing the project settings.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  bio text not null default '',
  skills text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_format check (username is null or username ~ '^[a-zA-Z0-9_]{3,30}$')
);

create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles(id) on delete restrict,
  title text not null check (char_length(title) between 5 and 200),
  summary text not null default '' check (char_length(summary) <= 500),
  description text not null,
  category text,
  tags text[] not null default '{}',
  status text not null default 'open' check (status in ('draft','open','exploring','accepted','converted','archived')),
  declared_license text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.idea_comments (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references public.ideas(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete restrict,
  parent_id uuid references public.idea_comments(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  source_idea_id uuid references public.ideas(id) on delete set null,
  owner_id uuid not null references public.profiles(id) on delete restrict,
  title text not null check (char_length(title) between 5 and 200),
  summary text not null default '' check (char_length(summary) <= 500),
  description text not null default '',
  status text not null default 'active' check (status in ('planning','active','paused','completed','archived')),
  visibility text not null default 'public' check (visibility in ('public','private')),
  declared_license text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'contributor' check (role in ('owner','maintainer','contributor')),
  joined_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 200),
  description text not null default '',
  status text not null default 'planned' check (status in ('planned','in_progress','completed','cancelled')),
  due_at timestamptz,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.contributions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  contributor_id uuid not null references public.profiles(id) on delete restrict,
  contribution_type text not null,
  title text not null check (char_length(title) between 3 and 200),
  description text not null default '',
  evidence_url text,
  review_status text not null default 'pending' check (review_status in ('pending','accepted','changes_requested','rejected')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete restrict,
  title text not null check (char_length(title) between 5 and 200),
  body text not null,
  proposal_type text not null default 'community',
  status text not null default 'draft' check (status in ('draft','discussion','open','closed','published','withdrawn')),
  voting_opens_at timestamptz,
  voting_closes_at timestamptz,
  quorum_rule text not null default 'simple_participation',
  decision_rule text not null default 'simple_majority',
  created_at timestamptz not null default now(),
  closed_at timestamptz,
  constraint valid_voting_window check (voting_closes_at is null or voting_opens_at is null or voting_closes_at > voting_opens_at)
);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.proposals(id) on delete cascade,
  voter_id uuid not null references public.profiles(id) on delete restrict,
  choice text not null check (choice in ('yes','no','abstain')),
  created_at timestamptz not null default now(),
  unique (proposal_id, voter_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete restrict,
  target_type text not null check (target_type in ('idea','comment','project','contribution','profile')),
  target_id uuid not null,
  reason text not null,
  details text not null default '',
  status text not null default 'open' check (status in ('open','reviewing','resolved','dismissed')),
  moderator_id uuid references public.profiles(id) on delete set null,
  resolution_note text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_type text not null,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists ideas_status_created_idx on public.ideas(status, created_at desc);
create index if not exists ideas_category_idx on public.ideas(category);
create index if not exists idea_comments_idea_created_idx on public.idea_comments(idea_id, created_at);
create index if not exists projects_visibility_created_idx on public.projects(visibility, created_at desc);
create index if not exists contributions_project_status_idx on public.contributions(project_id, review_status);
create index if not exists proposals_status_window_idx on public.proposals(status, voting_opens_at, voting_closes_at);
create index if not exists votes_proposal_idx on public.votes(proposal_id);

-- Create a private profile row automatically when a Supabase Auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.ideas enable row level security;
alter table public.idea_comments enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.milestones enable row level security;
alter table public.contributions enable row level security;
alter table public.proposals enable row level security;
alter table public.votes enable row level security;
alter table public.reports enable row level security;
alter table public.audit_events enable row level security;

-- Public profile fields are discoverable; account email and credentials remain in auth.users.
create policy "Profiles are publicly readable" on public.profiles for select using (true);
create policy "Users update their own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Published ideas are public" on public.ideas for select using (status <> 'draft' or creator_id = auth.uid());
create policy "Authenticated users create ideas" on public.ideas for insert to authenticated with check (creator_id = auth.uid());
create policy "Creators update their ideas" on public.ideas for update to authenticated using (creator_id = auth.uid()) with check (creator_id = auth.uid());

create policy "Comments on visible ideas are public" on public.idea_comments for select using (
  exists (select 1 from public.ideas i where i.id = idea_id and (i.status <> 'draft' or i.creator_id = auth.uid()))
);
create policy "Authenticated users comment" on public.idea_comments for insert to authenticated with check (author_id = auth.uid());
create policy "Authors update own comments" on public.idea_comments for update to authenticated using (author_id = auth.uid()) with check (author_id = auth.uid());

create policy "Public projects are visible" on public.projects for select using (visibility = 'public' or owner_id = auth.uid());
create policy "Authenticated users create projects" on public.projects for insert to authenticated with check (owner_id = auth.uid());
create policy "Owners update projects" on public.projects for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "Project members visible to project readers" on public.project_members for select using (
  exists (select 1 from public.projects p where p.id = project_id and (p.visibility = 'public' or p.owner_id = auth.uid()))
);
create policy "Project owners add members" on public.project_members for insert to authenticated with check (
  exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
);
create policy "Project owners remove members" on public.project_members for delete to authenticated using (
  exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
);

create policy "Milestones visible with project" on public.milestones for select using (
  exists (select 1 from public.projects p where p.id = project_id and (p.visibility = 'public' or p.owner_id = auth.uid()))
);
create policy "Project owners create milestones" on public.milestones for insert to authenticated with check (
  created_by = auth.uid() and exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
);

create policy "Accepted contributions are public" on public.contributions for select using (
  review_status = 'accepted' or contributor_id = auth.uid() or exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
);
create policy "Members submit own contributions" on public.contributions for insert to authenticated with check (
  contributor_id = auth.uid() and exists (select 1 from public.project_members pm where pm.project_id = project_id and pm.user_id = auth.uid())
);
create policy "Project owners review contributions" on public.contributions for update to authenticated using (
  exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
) with check (
  exists (select 1 from public.projects p where p.id = project_id and p.owner_id = auth.uid())
);

create policy "Non-draft proposals are public" on public.proposals for select using (status <> 'draft' or author_id = auth.uid());
create policy "Authenticated users create proposals" on public.proposals for insert to authenticated with check (author_id = auth.uid());
create policy "Authors update draft proposals" on public.proposals for update to authenticated using (author_id = auth.uid() and status = 'draft') with check (author_id = auth.uid());

create policy "Aggregated vote rows are not publicly readable" on public.votes for select to authenticated using (voter_id = auth.uid());
create policy "Eligible users cast one vote during open window" on public.votes for insert to authenticated with check (
  voter_id = auth.uid()
  and exists (
    select 1 from public.proposals p
    where p.id = proposal_id
      and p.status = 'open'
      and p.voting_opens_at <= now()
      and p.voting_closes_at > now()
  )
);

create policy "Reporters can view their own reports" on public.reports for select to authenticated using (reporter_id = auth.uid());
create policy "Authenticated users submit reports" on public.reports for insert to authenticated with check (reporter_id = auth.uid());

-- Audit events are readable only through a future safe public projection.
-- Direct client writes are intentionally not allowed.


-- Add each project owner to the membership table at creation time.
create or replace function public.add_project_owner_membership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.project_members (project_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict (project_id, user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_project_created_add_owner on public.projects;
create trigger on_project_created_add_owner
  after insert on public.projects
  for each row execute procedure public.add_project_owner_membership();

-- Members may join public projects as contributors; maintainers remain owner-managed.
create policy "Authenticated users join public projects"
on public.project_members for insert to authenticated
with check (
  user_id = auth.uid()
  and role = 'contributor'
  and exists (
    select 1 from public.projects p
    where p.id = project_id and p.visibility = 'public'
  )
);

create policy "Members leave projects"
on public.project_members for delete to authenticated
using (user_id = auth.uid() and role = 'contributor');
