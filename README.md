# 🚀 Collabify

Collabify is a real-time collaboration platform inspired by Notion, Figma, and Dropbox.
It brings **File Management**, **Notion-style Docs**, and a **Realtime Whiteboard** into one seamless workspace.

---

## ✨ Features

* 📂 **File Manager** – Upload, organize, and manage files in the cloud.
* 📝 **Notion-style Docs** – Create, edit, and collaborate on documents.
* 🖊️ **Whiteboard** – Real-time collaborative whiteboard for brainstorming & design.
* ⚡ **Realtime Backend with Convex** – Low-latency data sync across all users.
* 🔐 Authentication & Role-based Access (coming soon).
* 💬 Team Collaboration (coming soon).

---

## ⚡ Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/your-username/collabify.git
cd collabify
```

### 2️⃣ Install dependencies

```bash
pnpm install   # or npm install / yarn install
```

### 3️⃣ Set up environment variables

Create a `.env.local` file in the root directory and add the following:
```env
# Database
DATABASE_URL=mongodb_connection_string

# API
NEXT_PUBLIC_API_URL=/api

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# AWS S3 (file storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket

# Convex (realtime backend)
CONVEX_DEPLOYMENT=your_convex_deployment_url
NEXT_PUBLIC_CONVEX_URL=your_convex_client_url

# Edge Store (optional storage/CDN)
EDGE_STORE_ACCESS_KEY=your_edge_store_access_key
EDGE_STORE_SECRET_KEY=your_edge_store_secret_key
```

> ⚠️ Replace placeholder values with your actual keys.

### 4️⃣ Run the app

```bash
pnpm dev
```

Now open [http://localhost:3000](http://localhost:3000) 🚀

---

## 🔄 Convex Integration

Collabify uses **[Convex](https://convex.dev/)** as the realtime backend to power:

* Multi-user document editing
* Whiteboard collaboration
* Realtime data sync (cursor positions, updates, tasks, etc.)
* Serverless function execution (no manual API endpoints)

📌 To set up Convex:

1. Install Convex CLI:

   ```bash
   npm install -g convex
   ```

2. Initialize Convex in your project:

   ```bash
   npx convex dev
   ```

3. This will create a `convex/` directory where you’ll define backend functions (queries, mutations, actions).

4. Make sure your `.env.local` has your Convex deployment URL.

---

## 🛠️ How to Contribute

We ❤️ contributions! To get started:

1. **Fork** the repo
2. **Create a new branch** for your feature/fix:

   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit your changes**:

   ```bash
   git commit -m "Add: your feature"
   ```
4. **Push** to your branch:

   ```bash
   git push origin feature/your-feature
   ```
5. **Open a Pull Request** 🚀

---


## ✅ Roadmap

* [x] File Manager
* [x] Notion-style Docs
* [x] Whiteboard (with Convex realtime sync)
* [ ] Chat & Messaging
* [ ] Video Meetings
* [ ] Project Management Dashboard

---


---
