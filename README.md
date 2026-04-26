# QuizCard (Next.js + Supabase)

Flashcard app with folders, cards, Supabase-backed persistence, email/password auth, and a quiz mode that shuffles cards when a session starts.

## Prerequisites

- Node.js 20+ recommended
- A [Supabase](https://supabase.com/) project

## 1. Database setup (Supabase SQL Editor)

In the Supabase dashboard, open **SQL** → **New query**, run:

```sql
-- Folders owned by auth users
create table public.folders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  user_id uuid not null references auth.users (id) on delete cascade
);

-- Cards belonging to a folder
create table public.cards (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid not null references public.folders (id) on delete cascade,
  question text not null default '',
  answer text not null default '',
  created_at timestamptz not null default now()
);

create index cards_folder_id_idx on public.cards (folder_id);

alter table public.folders enable row level security;
alter table public.cards enable row level security;

-- Folders: users see and manage only their rows
create policy "folders_select_own"
  on public.folders for select
  using (auth.uid() = user_id);

create policy "folders_insert_own"
  on public.folders for insert
  with check (auth.uid() = user_id);

create policy "folders_update_own"
  on public.folders for update
  using (auth.uid() = user_id);

create policy "folders_delete_own"
  on public.folders for delete
  using (auth.uid() = user_id);

-- Cards: same user as the parent folder
create policy "cards_select_own"
  on public.cards for select
  using (
    exists (
      select 1 from public.folders f
      where f.id = cards.folder_id and f.user_id = auth.uid()
    )
  );

create policy "cards_insert_own"
  on public.cards for insert
  with check (
    exists (
      select 1 from public.folders f
      where f.id = folder_id and f.user_id = auth.uid()
    )
  );

create policy "cards_update_own"
  on public.cards for update
  using (
    exists (
      select 1 from public.folders f
      where f.id = cards.folder_id and f.user_id = auth.uid()
    )
  );

create policy "cards_delete_own"
  on public.cards for delete
  using (
    exists (
      select 1 from public.folders f
      where f.id = cards.folder_id and f.user_id = auth.uid()
    )
  );
```

Click **Run**. Fix any errors (for example, if tables already exist, drop them in a dev project only or adjust names).

### Authentication

Under **Authentication** → **Providers**, enable **Email** (and optionally adjust **Email Auth** settings such as “Confirm email” for production).

## 2. Environment variables

1. Copy `.env.example` to `.env.local` in the project root.
2. In Supabase: **Project Settings** → **API**, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Save `.env.local` and restart the dev server whenever you change env vars.

> The browser client uses only the **anon** key; Row Level Security above restricts data to the signed-in user.

## 3. Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up or sign in, create folders and cards, then use **Start Quiz** — the deck is shuffled once when the quiz opens. You can reshuffle or reset order from the quiz header.

## Project structure (integration)

| Path | Purpose |
|------|---------|
| `lib/supabaseClient.ts` | Browser Supabase client (`createBrowserClient` + typed `Database`) |
| `lib/database.types.ts` | TypeScript types for `folders` and `cards` tables |
| `lib/types.ts` | UI types (`Folder`, `FlashCard`) and row → UI mappers |
| `lib/shuffle.ts` | Fisher–Yates shuffle used for quiz sessions |
| `components/supabase-provider.tsx` | Client + session context, `useAuth` / `useSupabase` |
| `hooks/use-folder-library.ts` | Load folders (nested cards), create folder, card CRUD with debounced saves |
| `hooks/use-quiz-session.ts` | Quiz deck order, index, flip, prev/next |

Initialization was specified as `supabaseClient.js` in the brief; this repo uses **`lib/supabaseClient.ts`** for full TypeScript type safety with the same initialization pattern.

## Build

```bash
npm run build
npm start
```
