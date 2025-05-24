# DevLinkVault 🧰

**DevLinkVault** is a full-stack web application for developers to create and share customizable link profiles. Inspired by Linktree but focused on developers, users can organize their portfolio, GitHub, social links, and more in one beautiful, shareable page.

## 🌐 Live Demo

👉 (https://dev-link-vault.vercel.app/)

---

## ⚙️ Features

* 🔐 **User Authentication** — Secure login with JWT and cookies
* 🧑‍💻 **Developer Profile Pages** — Custom user page with links, avatar, bio
* ➕ **Add / Edit / Delete Links** — Full CRUD functionality for managing links
* 🎨 **Responsive UI** — Built with **Tailwind CSS** and **ShadCN components**
* 🗃️ **Full-Stack Integration** — Frontend (Next.js 14 App Router) + Backend (Express API + MongoDB)

---

## 🛠 Tech Stack

| Frontend                | Backend           | Auth          | Styling               | Database           |
| ----------------------- | ----------------- | ------------- | --------------------- | ------------------ |
| Next.js 15 (App Router) | Node.js + Express | JWT + Cookies | Tailwind CSS + ShadCN | MongoDB + Mongoose |

---

## 📸 Preview

![App Preview](public/dlv-preview.png)

---

## 📂 Project Structure

```
.
├── README.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── dlv-preview.png
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src
│   ├── app
│   │   ├── api
│   │   ├── dashboard
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── links
│   │   ├── login
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   ├── register
│   │   └── user
│   ├── components
│   │   └── ui
│   ├── context
│   │   └── AuthContext.tsx
│   ├── lib
│   │   ├── auth.ts
│   │   ├── cloudinary.ts
│   │   └── mongoose.ts
│   ├── models
│   │   ├── link.model.ts
│   │   └── user.model.ts
│   ├── types
│   └── validators
│       └── auth.ts
├── structure.txt
└── tsconfig.json
```

---

## 🧪 How to Run Locally

```bash
git clone https://github.com/ChrisMerinoDev/devlinkvault.git
cd devlinkvault
npm install
```

Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

```bash
npm run dev
```

---

## ✅ Upcoming Features

* Profile themes and color customization
* Public profile sharing with custom usernames
* Analytics for link clicks and traffic

---

## 📄 License

MIT License © 2025 Chris Merino
