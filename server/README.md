# BookSwap — Server

NestJS backend for the BookSwap platform.

## Tech Stack

- NestJS + TypeScript
- Prisma ORM + PostgreSQL
- JWT authentication + Google OAuth (Passport)
- WebSockets (Socket.io)
- AWS S3 for photo storage
- Xenova Transformers for vector embeddings (semantic search)
- Google GenAI / Groq SDK for AI-generated book descriptions

## Getting Started

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run start:dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS` | Secret for access tokens |
| `JWT_REFRESH` | Secret for refresh tokens |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `AWS_ACCESS_KEY_ID` | AWS credentials |
| `AWS_SECRET_ACCESS_KEY` | AWS credentials |
| `AWS_REGION` | AWS region |
| `GROQ_API_KEY` | Groq SDK key for AI descriptions |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google GenAI key |

## Project Structure

```
src/
├── auth/              # JWT + Google OAuth
├── books/             # Book CRUD + search
├── users/             # User profiles
├── chat/              # WebSocket chat
├── exchange-requests/ # Swap request flow
├── wishlist/          # Saved books
├── genres/            # Genre management
├── reviews/           # User reviews & ratings
├── book-photos/       # S3 photo upload
└── embedding/         # Vector embeddings for semantic search
```

## Seeding

```bash
npx ts-node prisma/seed.ts
```
