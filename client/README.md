# BookSwap — Client

React frontend for the BookSwap platform.

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router
- Axios
- Socket.io-client

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_SOCKET_URL` | WebSocket server URL |

## Project Structure

```
src/
├── pages/       # Home, BookInfo, Chat, Profile, Wishlist, AddBook, ...
├── components/  # Shared UI components
├── api/         # Axios API layer (one file per resource)
└── context/     # Auth context, Socket context
```

## Build

```bash
npm run build
```
