# Connectia

Connectia is a full-stack social media application built to learn and implement modern frontend, backend, database, API, authentication, and real-time communication concepts.

The project was developed using React + Vite on the frontend and FastAPI + Strawberry GraphQL + PostgreSQL on the backend, containerized with Docker.

**Live app:** https://connectiaa.netlify.app/

---

## Project Status

Connectia is complete and deployed.

The frontend is deployed on Netlify. The backend runs in Docker and is reachable by the deployed frontend over GraphQL (HTTP and WebSocket).

---

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Apollo Client
- GraphQL
- graphql-ws

### Backend

- Python
- FastAPI
- Strawberry GraphQL
- SQLAlchemy
- Alembic
- PostgreSQL
- JWT authentication
- Password hashing (bcrypt via passlib)
- Docker / Docker Compose

### Development Tools

- Git & GitHub
- VS Code
- Postman / GraphQL testing tools (GraphiQL)
- Python virtual environment / Docker
- Node.js & npm
- WebSockets

---

## Features

### Authentication

- Registration with username, email, and password validation
- Duplicate username/email detection
- Password hashing
- Login with email/password
- JWT issued on login, stored in an httpOnly cookie (not localStorage)
- Logout clears the session cookie
- Session expiry handling with a "session expired" notice on the login page
- Optional profile picture upload at registration

### Posts

- Create, edit, and delete posts
- Post content with optional image (image URL or direct upload)
- Infinite-scroll feed (cursor/offset-based pagination)
- Individual post detail page
- Clicking a post opens its detail page

### Likes

- Like / unlike posts
- Real-time like count updates via GraphQL subscriptions
- The backend identifies the current user from the authenticated session; the client never sends a user ID for a like

### Comments

- Add, edit, and delete comments on a post
- Comment length limit with a live character counter
- Preview of the first two comments, with a modal to view the full thread
- Long comments wrap correctly instead of overflowing the page

### Follows

- Follow / unfollow other users
- Follower and following counts on a profile
- "Follows you" / "Follow back" indicator
- Suggested users panel based on mutual connections, with its own scrollable list on both desktop and mobile

### Messaging

- One-on-one direct messages
- Conversations created automatically on first message
- Cursor-based pagination for message history (infinite scroll upward)
- Real-time delivery and read receipts via GraphQL subscriptions
- Unread message indicator in the inbox and in the sidebar navigation
- Starting a conversation from a user's profile or from search

### Notifications

- Notifications for likes, comments, and follows
- Notifications grouped by day with timestamps
- Unread indicator in the sidebar navigation that clears once notifications are viewed
- Clicking a notification opens the related post or profile

### Global Chat Room

- A single public chat room on the Explore page
- Join using your real username or a generated anonymous handle
- Per-user color assigned to each display name for message bubbles
- Persisted message history with real-time delivery via subscriptions
- Clear "this room is public" notice shown to users

### Search

- Search users by username from the sidebar (desktop) or a dedicated drawer (mobile)
- Search specifically for starting a new conversation from the Messages page

### Profiles

- View and edit username and bio
- Upload a profile picture, shown throughout the app (navbar, posts, messages, comments)
- Change password from the settings page
- Profile page shows posts, follower/following counts, and bio

### Real-Time Features

Implemented using GraphQL subscriptions over WebSockets:

- Like count updates
- New message delivery and read receipts
- New notification delivery
- Global chat room message delivery
- Unread-badge updates in the navigation

### Other

- Light UI polish across authentication pages, navigation, and chat
- Image upload endpoint (separate REST endpoint, not GraphQL) backing profile pictures and post images
- Dockerized backend and database, with Alembic migrations run inside the container

---

## Architecture

### Layered Backend Architecture

GraphQL
|
Resolver
|
Service
|
Repository
|
SQLAlchemy
|
PostgreSQL

**Resolver** handles GraphQL requests and responses.
**Service** contains business logic and validation.
**Repository** handles database operations.

This separation keeps the application modular.

### Real-Time Architecture

React
|
Apollo Client
|
graphql-ws
|
WebSocket
|
Strawberry Subscription
|
Backend Event Manager
|
Database / Business Logic

### Authentication Architecture

User
|
Login Form
|
Apollo Client
|
GraphQL Login Mutation
|
Strawberry
|
AuthService
|
Password Verification
|
JWT
|
httpOnly Cookie
|
Authenticated Session

---

## Project Structure

### Root

Connectia/
|
|-- backend/
|-- frontend/
|-- docker-compose.yml
|-- .gitignore
`-- README.md

### Backend

backend/
|
|-- app/
| |
| |-- core/
| | |-- config.py
| | |-- database.py
| | -- security.py | | | |-- models/ | | |-- user.py | | |-- post.py | | |-- like.py | | |-- comment.py | | |-- follow.py | | |-- conversation.py | | |-- message.py | | |-- notification.py | | -- global_message.py
| |
| |-- repositories/
| |-- services/
| |-- schemas/
| |-- routers/
| | -- upload.py | | | |-- graphql/ | | |-- context.py | | |-- schema.py | | |-- inputs/ | | |-- mutations/ | | |-- queries/ | | |-- mappers/ | | |-- subscriptions/ | | -- types/
| |
| -- main.py | |-- alembic/ |-- alembic.ini |-- requirements.txt |-- Dockerfile -- .env

### Frontend

frontend/
|
|-- src/
| |
| |-- components/
| | |-- auth/
| | |-- common/
| | |-- comment/
| | |-- explore/
| | |-- layout/
| | |-- message/
| | -- post/ | | | |-- pages/ | | |-- Home/ | | |-- Login/ | | |-- Register/ | | |-- Profile/ | | |-- EditProfile/ | | |-- Explore/ | | |-- Messages/ | | |-- Post/ | | -- Notifications/
| |
| |-- context/
| |-- graphql/
| | |-- queries/
| | |-- mutations/
| | -- subscriptions/ | | | |-- layouts/ | |-- routes/ | |-- utils/ | |-- App.jsx | -- main.jsx
|
|-- public/
|-- package.json
|-- vite.config.js
`-- .env

---

## Requirements

### Node.js

Use a current Node.js LTS version.

node --version
npm --version

### Python

This project uses Python 3.12.

python --version

### Docker

Docker and Docker Compose are required to run the backend and database.

---

## Environment Variables

### Backend (.env)

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db:5432/connectia
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=connectia

### Frontend (.env)

VITE_GRAPHQL_HTTP_URL=http://localhost:8000/graphql
VITE_GRAPHQL_WS_URL=ws://localhost:8000/graphql

Do not commit `.env` files. `.gitignore` should contain:

.env
venv/
pycache/
node_modules/
dist/

---

## Running Locally

### Backend (Docker)

From the project root:

docker compose up --build -d

This starts the PostgreSQL database and the FastAPI backend.

Run migrations:

docker compose exec backend python -m alembic upgrade head

The backend is available at:

http://localhost:8000

GraphQL endpoint:

http://localhost:8000/graphql

### Frontend

cd frontend
npm install
npm run dev

Vite starts the frontend at:

http://localhost:5173

---

## Testing the GraphQL API

Open `http://localhost:8000/graphql` to use GraphiQL, or use Postman with the GraphQL body type pointed at the same URL.

Example login:

```graphql
mutation {
  login(input: { email: "user@example.com", password: "password123" }) {
    success
    message
    user {
      id
      username
      email
    }
  }
}
```

Example authenticated query:

```graphql
query {
  me {
    id
    username
    email
    bio
    profilePictureUrl
  }
}
```

---

## CORS

The backend allows the frontend's origin and requires credentials to be included on requests, since authentication is cookie-based.

The frontend's Apollo HTTP link is configured with:

credentials: "include"

---

## What I Learned, Week by Week

### Week 1: Project Setup and Authentication Foundations

- Set up the React + Vite frontend and the FastAPI + Strawberry GraphQL backend
- Configured PostgreSQL and SQLAlchemy
- Set up Alembic for migrations
- Learned the repository and service layered architecture pattern
- Built user registration with validation, duplicate checks, and password hashing
- Built login with JWT and cookie-based sessions instead of localStorage
- Learned why GraphQL mutations return `success`/`message` fields rather than relying on HTTP status codes for business logic errors

### Week 2: Posts, Likes, and Real-Time Subscriptions

- Built post creation, editing, and deletion
- Learned GraphQL subscriptions and the publish/subscribe event manager pattern
- Implemented the like system, with the backend deriving the current user from the authenticated session rather than trusting a client-supplied user ID
- Learned to debug schema registration issues by checking GraphiQL's Docs panel directly against what the backend actually serves, rather than assuming a code change took effect
- Learned the importance of restarting the backend and verifying the schema after every mutation/query addition

### Week 3: Comments, Follows, and Debugging Discipline

- Built comments with edit/delete and a collapsed-preview UI
- Built the follow/unfollow system with follower and following counts
- Hit and diagnosed several Alembic autogenerate bugs, including an empty migration caused by a model not being imported in `models/__init__.py`, and a migration that accidentally dropped an unrelated table
- Learned to always read a generated migration file before applying it
- Learned to verify changes by checking the actual file on disk, not just assuming an edit was saved

### Week 4: Direct Messaging and Notifications

- Designed a message/conversation data model for one-on-one chat, including cursor-based pagination
- Implemented real-time message delivery and read receipts using subscriptions
- Built a user-scoped "inbox" event channel, reused later for notifications
- Built the notifications feature for likes, comments, and follows
- Learned to deduplicate incoming subscription data against already-cached data to avoid showing duplicate messages

### Week 5: Search, UI Polish, and a Recurring Bug Pattern

- Added username search for starting conversations and visiting profiles
- Learned to identify and fix a recurring bug: GraphQL types built by hand in multiple places instead of through one shared mapper function, which caused fields like bio and profile picture to silently overwrite each other in Apollo's normalized cache
- Learned how Apollo Client's cache normalizes objects by type and ID, and how that can cause unrelated queries to affect each other if the backend returns incomplete versions of the same entity
- Redesigned the login and register pages with a split-screen layout

### Week 6: File Uploads and Docker

- Built a REST image upload endpoint separate from the GraphQL API
- Added profile picture upload for registration and profile editing
- Added image upload for posts, alongside the existing image URL option
- Learned that uploaded files are not persisted across container rebuilds without a dedicated Docker volume, and added one
- Learned that `localhost` only resolves correctly on the machine it was requested from, and switched the frontend configuration to use environment variables for the API host so other devices on the network could reach the backend

### Week 7: Global Chat Room and Infinite Scroll

- Built a public, single-room chat feature with anonymous or real-username identities
- Implemented a deterministic per-username color scheme for chat bubbles
- Implemented infinite-scroll pagination for the home feed using `IntersectionObserver` and Apollo's `fetchMore`
- Learned the difference between `scrollIntoView` (which can affect unrelated scroll containers) and directly setting `scrollTop` on a specific element

### Week 8: Final Fixes and Deployment

- Fixed foreign key constraint issues preventing post deletion when a post had comments or likes
- Fixed a conversation header bug where the other participant could not be identified from message history alone, by adding a dedicated conversation-by-ID query instead of relying on messages already loaded
- Added dark/light mode toggle infrastructure (navbar only; most components still use the light theme)
- Deployed the frontend to Netlify
- Documented the project and environment setup for future reference

---

## License

This project was built for learning and development purposes.
