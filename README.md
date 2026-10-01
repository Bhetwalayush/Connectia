Connectia

Connectia is a full-stack social media application built to learn and implement modern frontend, backend, database, API, authentication, and real-time communication concepts.

The project is being developed using React + Vite on the frontend and FastAPI + Strawberry GraphQL + PostgreSQL on the backend.

---

🚀 Tech Stack

Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Apollo Client
- GraphQL
- "graphql-ws"

Backend

- Python
- FastAPI
- Strawberry GraphQL
- SQLAlchemy
- Alembic
- PostgreSQL
- JWT Authentication
- Password Hashing

Development Tools

- Git & GitHub
- VS Code
- Postman / GraphQL testing tools
- Python Virtual Environment
- Node.js & npm
- WebSockets

---

📌 Current Features & Progress

The project is being developed in phases.

Authentication

Registration

Implemented user registration using:

React
  ↓
Apollo Client
  ↓
GraphQL Mutation
  ↓
Strawberry
  ↓
AuthService
  ↓
UserRepository
  ↓
SQLAlchemy
  ↓
PostgreSQL

The registration flow includes:

- Username validation
- Email validation
- Password hashing
- Duplicate username detection
- Duplicate email detection
- Saving users to PostgreSQL

Login

Implemented login using:

- GraphQL mutation
- Email/password authentication
- Password verification
- JWT authentication
- Authenticated user information
- Cookie-based authentication

Authentication follows the principle that authentication information should not be unnecessarily stored in browser "localStorage".

---

🧠 What I Have Learned

This project is also being used as a practical learning project.

React

Learned and implemented:

- Components
- Props
- State
- "useState"
- "useEffect"
- Context API
- Custom hooks
- React Router
- Protected/authenticated application flows
- Component organization
- Fast Refresh and React development practices

---

GraphQL

Learned how GraphQL works compared with traditional REST APIs.

Implemented:

- Queries
- Mutations
- Subscriptions
- GraphQL inputs
- GraphQL types
- GraphQL resolvers
- GraphQL context
- Authentication through GraphQL
- Real-time communication through GraphQL subscriptions

Example:

mutation {
  login(
    input: {
      email: "user@example.com"
      password: "password123"
    }
  ) {
    success
    message
    accessToken
    user {
      id
      username
      email
    }
  }
}

---

🐍 FastAPI

Learned how FastAPI provides the backend application layer.

Implemented:

- FastAPI application setup
- CORS configuration
- GraphQL integration
- Request handling
- Authentication context
- WebSocket support
- Environment-based configuration

---

🍓 Strawberry GraphQL

Strawberry is used to create the GraphQL schema and connect GraphQL operations to the backend application.

Learned:

- "@strawberry.type"
- "@strawberry.field"
- "@strawberry.mutation"
- "@strawberry.subscription"
- GraphQL input types
- GraphQL response types
- "Info" and GraphQL context

Example structure:

GraphQL Request
      ↓
Strawberry Resolver
      ↓
Service
      ↓
Repository
      ↓
Database

---

🗄️ PostgreSQL & SQLAlchemy

Learned how application data is stored and managed using PostgreSQL.

SQLAlchemy is used as the ORM.

Implemented concepts such as:

- Database models
- SQLAlchemy sessions
- Repositories
- Relationships
- Database queries
- Creating records
- Reading records
- Updating records
- Deleting records

---

🔄 Repository & Service Architecture

The backend follows a layered architecture.

GraphQL
   ↓
Resolver
   ↓
Service
   ↓
Repository
   ↓
SQLAlchemy
   ↓
PostgreSQL

Resolver

Responsible for handling GraphQL requests and responses.

Service

Contains business logic.

Repository

Responsible for database operations.

This separation keeps the application modular and easier to maintain.

---

🔐 Authentication Architecture

The authentication flow is based on JWT authentication.

The general flow is:

User
 ↓
Login Form
 ↓
Apollo Client
 ↓
GraphQL Login Mutation
 ↓
Strawberry
 ↓
AuthService
 ↓
Password Verification
 ↓
JWT
 ↓
Authenticated Session

The frontend uses cookie-based authentication rather than storing authentication credentials in "localStorage".

---

⚡ Real-Time Features

Connectia is being developed with GraphQL subscriptions for real-time functionality.

One of the main examples is the Like system.

The intended flow is:

User clicks Like
       ↓
Like Mutation
       ↓
Database updated
       ↓
GraphQL Subscription Event
       ↓
Other connected clients receive event
       ↓
Like count updates without page reload

The Like subscription uses the following fields:

postId
userId
likeCount
action

Possible actions include:

LIKED
UNLIKED

---

❤️ Like System

The Like system is designed so that the frontend does not manually provide the authenticated user's ID.

Instead:

Authenticated Request
        ↓
Backend identifies current user
        ↓
current_user.id
        ↓
Like operation

The frontend only needs to provide the post ID.

Example:

mutation {
  likePost(postId: 1) {
    success
    message
    likeCount
  }
}

This prevents the client from simply pretending to be another user by sending an arbitrary "userId".

---

📁 Project Structure

Root

Connectia/
│
├── backend/
│
├── frontend/
│
├── .gitignore
└── README.md

---

🐍 Backend Structure

backend/
│
├── app/
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── database.py
│   │   └── security.py
│   │
│   ├── db/
│   │   └── database.py
│   │
│   ├── models/
│   │   ├── user.py
│   │   ├── post.py
│   │   ├── like.py
│   │   ├── comment.py
│   │   ├── follow.py
│   │   ├── message.py
│   │   ├── notification.py
│   │   └── story.py
│   │
│   ├── repositories/
│   │   └── user_repository.py
│   │
│   ├── services/
│   │   └── auth_service.py
│   │
│   ├── schemas/
│   │   └── user.py
│   │
│   ├── graphql/
│   │   ├── context.py
│   │   ├── schema.py
│   │   │
│   │   ├── inputs/
│   │   │   └── auth_input.py
│   │   │
│   │   ├── mutations/
│   │   │   └── auth_mutation.py
│   │   │
│   │   ├── queries/
│   │   │   └── user_query.py
│   │   │
│   │   └── types/
│   │       ├── auth_type.py
│   │       └── user_type.py
│   │
│   └── main.py
│
├── alembic/
│
├── alembic.ini
├── requirements.txt
├── .env
└── venv/

«The exact files may grow as additional Connectia features are implemented.»

---

⚛️ Frontend Structure

frontend/
│
├── src/
│   │
│   ├── components/
│   │
│   ├── pages/
│   │   ├── Home/
│   │   │   └── Home.jsx
│   │   ├── Login/
│   │   │   └── Login.jsx
│   │   ├── Register/
│   │   │   └── Register.jsx
│   │   ├── Profile/
│   │   ├── Explore/
│   │   ├── Messages/
│   │   └── Notifications/
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── useAuth.js
│   │
│   ├── graphql/
│   │   ├── queries/
│   │   ├── mutations/
│   │   └── subscriptions/
│   │
│   ├── layouts/
│   ├── routes/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── .env

---

⚙️ Requirements

Before running the project, install:

Node.js

Use a current Node.js LTS version.

Check:

node --version
npm --version

Python

This project currently uses Python 3.12.

Check:

python --version

Expected:

Python 3.12.x

PostgreSQL

PostgreSQL must be installed and running.

Check that your PostgreSQL server is available before starting the backend.

---

🗄️ Database Setup

Create a PostgreSQL database for Connectia.

For example:

connectia

Then configure the backend ".env".

Example:

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/connectia
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

Important

Do not commit your ".env" file to GitHub.

Your ".gitignore" should contain:

.env
venv/
__pycache__/
node_modules/
dist/

---

🐍 Backend Setup

Open a terminal in:

Connectia/backend

Create a virtual environment:

python -m venv venv

Activate it on Windows:

.\venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

If dependencies have not yet been saved to "requirements.txt", install the required packages and then generate it:

pip freeze > requirements.txt

---

▶️ Run the Backend

From:

Connectia/backend

run:

uvicorn app.main:app --reload

The backend should run at:

http://localhost:8000

GraphQL is available at:

http://localhost:8000/graphql

---

⚛️ Frontend Setup

Open another terminal.

Go to:

Connectia/frontend

Install dependencies:

npm install

Run the development server:

npm run dev

Vite will normally start the frontend at:

http://localhost:5173

---

🔌 Frontend + Backend

During development:

Frontend
http://localhost:5173
        │
        │ GraphQL
        ▼
Backend
http://localhost:8000/graphql

For real-time subscriptions:

Frontend
       │
       │ WebSocket
       ▼
ws://localhost:8000/graphql

---

🧪 Testing the GraphQL API

Open:

http://localhost:8000/graphql

Use the GraphQL interface to test queries and mutations.

Example Login

mutation {
  login(
    input: {
      email: "john@gmail.com"
      password: "password123"
    }
  ) {
    success
    message
    accessToken
    user {
      id
      username
      email
    }
  }
}

Example User Query

query {
  users {
    id
    username
    email
  }
}

Use the actual fields available in the current schema if they differ.

---

🔐 Authentication Instructions

When working with authentication:

1. Start PostgreSQL.
2. Start the backend.
3. Start the frontend.
4. Register a user.
5. Login using the registered account.
6. Verify the authentication cookie/session.
7. Access authenticated GraphQL operations.

Do not store authentication tokens in "localStorage" unless the authentication architecture is intentionally changed.

---

🌐 CORS

The development frontend runs on:

http://localhost:5173

The backend allows this origin.

When using cookies, requests must include credentials.

The frontend Apollo HTTP configuration therefore needs:

credentials: "include"

---

🧩 Development Workflow

When adding a new feature, follow the existing architecture.

For example:

Frontend
   ↓
GraphQL Query / Mutation
   ↓
Strawberry Resolver
   ↓
Service
   ↓
Repository
   ↓
SQLAlchemy
   ↓
PostgreSQL

Avoid putting database queries directly inside frontend components or GraphQL resolvers when the operation belongs in the repository/service layers.

---

🌱 Git Workflow

Create a feature branch before working on a new feature:

git checkout -b feature-name

Check the current branch:

git branch

Check changed files:

git status

Stage changes:

git add .

Commit:

git commit -m "Add feature description"

Push the branch:

git push -u origin feature-name

Return to master/main when required:

git checkout master

---

⚠️ Important Development Instructions

1. Start PostgreSQL first

The backend requires the database connection to work.

2. Activate the Python virtual environment

Before running backend commands:

.\venv\Scripts\Activate.ps1

3. Never commit ".env"

Secrets such as:

- Database passwords
- JWT secret keys
- API keys

must remain outside GitHub.

4. Don't install packages globally

Use the backend virtual environment for Python dependencies.

5. Don't modify working architecture unnecessarily

Follow:

GraphQL
→ Resolver
→ Service
→ Repository
→ Database

6. Test backend operations before connecting them to React

First verify the GraphQL operation works.

Then connect it to the frontend.

7. Test real-time functionality separately

Subscriptions require both:

HTTP GraphQL

and:

WebSocket GraphQL

to be configured correctly.

---

📚 Main Concepts Practiced

This project has provided practical experience with:

- Full-stack application architecture
- React component architecture
- React state management
- React Context API
- Custom hooks
- React Router
- Vite
- GraphQL
- GraphQL queries
- GraphQL mutations
- GraphQL subscriptions
- Strawberry GraphQL
- FastAPI
- SQLAlchemy ORM
- PostgreSQL
- Alembic migrations
- Repository pattern
- Service layer architecture
- JWT authentication
- Password hashing
- Cookie-based authentication
- CORS
- WebSockets
- Apollo Client
- "graphql-ws"
- Git and GitHub
- Python virtual environments
- Environment variables

---

🚧 Project Status

Connectia is currently under active development.

Completed / Implemented

- [x] Project setup
- [x] React + Vite frontend
- [x] FastAPI backend
- [x] PostgreSQL setup
- [x] SQLAlchemy integration
- [x] Alembic setup
- [x] GraphQL with Strawberry
- [x] GraphQL queries
- [x] GraphQL mutations
- [x] User model
- [x] Repository architecture
- [x] Service architecture
- [x] User registration
- [x] Password hashing
- [x] User login
- [x] JWT authentication
- [x] Cookie-based authentication setup
- [x] Apollo Client integration
- [x] GraphQL subscription architecture
- [x] Like subscription event structure

In Progress

- [ ] Complete frontend authentication flow
- [ ] Authenticated Like mutation
- [ ] Authenticated GraphQL subscriptions
- [ ] Real-time Like count updates
- [ ] Comments
- [ ] Follow system
- [ ] Notifications
- [ ] Messaging
- [ ] Stories
- [ ] Profile features
- [ ] Explore functionality
- [ ] Production deployment

---

🎯 Project Goal

The goal of Connectia is to build a complete social media platform while gaining practical experience in full-stack development.

The project focuses not only on making features work, but also on understanding how the different layers communicate:

React
 ↓
Apollo Client
 ↓
GraphQL
 ↓
FastAPI
 ↓
Strawberry
 ↓
Service Layer
 ↓
Repository Layer
 ↓
SQLAlchemy
 ↓
PostgreSQL

For real-time functionality:

React
 ↓
Apollo Client
 ↓
graphql-ws
 ↓
WebSocket
 ↓
Strawberry Subscription
 ↓
Backend Event
 ↓
Database / Business Logic

---

👨‍💻 Development Notes

This project is being developed incrementally in phases.

Each phase should be tested before moving to the next phase.

When debugging an issue:

1. Check the browser console.
2. Check the Network tab.
3. Check GraphQL request/response.
4. Check the FastAPI terminal.
5. Check SQLAlchemy/database logs when necessary.
6. Verify authentication state.
7. Verify WebSocket connection for subscriptions.

This makes it easier to identify which layer is causing the problem.

---

📄 License

This project is currently for learning and development purposes.
