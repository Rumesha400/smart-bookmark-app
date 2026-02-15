# Smart Bookmark App

A simple bookmark manager built with **Next.js (App Router)**, **Supabase**, and **Tailwind CSS**.
This project focuses on implementing authentication, database security, and realtime updates in a clean and practical way.

---

## Live Demo

(Add after deployment)

```
https://smart-bookmark-app-phi-puce.vercel.app/
```

---

## Tech Stack

* Next.js (App Router)
* Supabase Auth (Google OAuth)
* Supabase Postgres + Realtime
* Tailwind CSS
* Vercel

---

## Features

**Authentication**

* Google OAuth login only
* Protected dashboard route

**Bookmark Management**

* Add bookmark (title + URL)
* Edit bookmark
* Delete bookmark
* Basic input validation

**Security**

* Row Level Security (RLS) enabled
* Users can only access their own bookmarks

**Realtime**

* Bookmark list syncs across multiple tabs
* Optimistic UI updates for responsiveness

---

## Database Design

Table: `bookmarks`

Columns:

* id (uuid)
* user_id (uuid)
* title (text)
* url (text)
* created_at (timestamp)

RLS policies ensure users can only read/write their own bookmarks.

---

## Local Setup

```bash
git clone https://github.com/Rumesha400/smart-bookmark-app.git
cd smart-bookmark-app
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Run:

```bash
npm run dev
```

---

## Problems I Ran Into

**Supabase environment setup**

* App failed without URL and anon key
* Fixed by configuring `.env.local` and Vercel env variables

**Google OAuth configuration**

* Encountered provider-not-enabled error
* Resolved by creating Google OAuth client and adding Supabase callback URL

**Realtime synchronization**

* Delete events were not updating across tabs initially
* Fixed by using a single realtime subscription and optimistic updates

**State coordination**

* BookmarkForm and BookmarkList needed shared state handling
* Resolved by lifting state into BookmarkList

---

## Improvements (Future Work)

* Search/filter bookmarks
* Loading states
* URL preview metadata
* Tests
* Accessibility improvements

---

## Author

Rumesha Ansari
