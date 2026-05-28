# BookSwap

> Платформа для обміну книгами між людьми | A platform for exchanging books between people

---

## Українська

### Про проект

**BookSwap** — це веб-застосунок, який дозволяє користувачам обмінюватися фізичними книгами. Замість того, щоб книги пилились на полиці, їх можна запропонувати іншим і отримати щось цікаве натомість.

### Функціональність

- **Каталог книг** — перегляд книг, доступних для обміну, з фільтрацією за жанром, мовою та містом
- **Публікація книг** — додавання власних книг з фото, описом, станом та умовами обміну (платно / безкоштовно)
- **Запити на обмін** — надсилання запитів власникам книг, підтвердження або відхилення запитів
- **Список бажань** — збереження книг, які вас зацікавили
- **Чат у реальному часі** — спілкування з іншими користувачами через WebSocket-чат
- **Профіль та рейтинг** — система відгуків і рейтингів для формування репутації користувачів
- **Google-авторизація** — вхід через обліковий запис Google
- **AI-рекомендації** — семантичний пошук книг на основі векторних ембедингів

### Технологічний стек

**Клієнт:**
- React 19 + TypeScript
- Vite
- React Router
- Axios
- Socket.io-client

**Сервер:**
- NestJS + TypeScript
- Prisma ORM
- PostgreSQL
- JWT + Passport (локальна авторизація та Google OAuth)
- WebSockets (Socket.io)
- AWS S3 (зберігання фото)
- Google GenAI / Groq SDK / Xenova Transformers (AI-функції)

### Запуск проекту

#### Вимоги
- Node.js 18+
- PostgreSQL
- AWS S3 bucket
- Google OAuth credentials (опціонально)

#### Сервер

```bash
cd server
npm install
cp .env.example .env  # заповніть змінні середовища
npx prisma migrate dev
npm run dev
```

#### Клієнт

```bash
cd client
npm install
cp .env.example .env  # заповніть змінні середовища
npm run dev
```

### Змінні середовища

Приклади конфігурації знаходяться у файлах `.env.example` в директоріях `server/` та `client/`.

---

## English

### About

**BookSwap** is a web application that enables users to exchange physical books with each other. Instead of books collecting dust on a shelf, you can offer them to others and receive something interesting in return.

### Features

- **Book catalog** — browse books available for exchange, filtered by genre, language, and city
- **Book listings** — add your own books with photos, description, condition, and exchange terms (paid / free)
- **Exchange requests** — send requests to book owners, accept or decline incoming requests
- **Wishlist** — save books that caught your interest
- **Real-time chat** — communicate with other users via WebSocket-powered chat
- **Profile & ratings** — review and rating system to build user reputation
- **Google authentication** — sign in with a Google account
- **AI recommendations** — semantic book search powered by vector embeddings

### Tech Stack

**Client:**
- React 19 + TypeScript
- Vite
- React Router
- Axios
- Socket.io-client

**Server:**
- NestJS + TypeScript
- Prisma ORM
- PostgreSQL
- JWT + Passport (local auth & Google OAuth)
- WebSockets (Socket.io)
- AWS S3 (photo storage)
- Google GenAI / Groq SDK / Xenova Transformers (AI features)

### Getting Started

#### Prerequisites
- Node.js 18+
- PostgreSQL
- AWS S3 bucket
- Google OAuth credentials (optional)

#### Server

```bash
cd server
npm install
cp .env.example .env  # fill in environment variables
npx prisma migrate dev
npm run dev
```

#### Client

```bash
cd client
npm install
cp .env.example .env  # fill in environment variables
npm run dev
```

### Environment Variables

Configuration examples are available in the `.env.example` files inside the `server/` and `client/` directories.

---

## Architecture

```
BookSwap/
├── client/          # React + Vite frontend
│   └── src/
│       ├── pages/   # Home, BookInfo, Chat, Profile, Wishlist, ...
│       ├── components/
│       ├── api/     # Axios API layer
│       └── context/ # Auth & Socket contexts
└── server/          # NestJS backend
    └── src/
        ├── auth/
        ├── books/
        ├── users/
        ├── chat/
        ├── exchange-requests/
        ├── wishlist/
        ├── genres/
        └── embedding/  # AI semantic search
```

---

*Дипломний проект | Bachelor's thesis project*
