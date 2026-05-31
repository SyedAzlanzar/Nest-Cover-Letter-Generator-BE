# 📡 Resume Parser Backend (NestJS + MongoDB + JWT)

This is the main backend API built with **NestJS**. It handles authentication, user onboarding data, resume/media upload, and requests to the Python AI microservice for resume parsing and cover letter PDF generation.

---

## 🔗 System Components
* 🖥️ [CoverCraft Frontend Extension Repository](https://github.com/SyedAzlanzar/CoverCraft) 
* 🤖 [CoverCraft Python Service Respository](https://github.com/SyedAzlanzar/python-ai-server) 

---

## Features

- User registration & login (JWT)
- Onboarding (store job preferences)
- Media upload endpoints (resume PDFs)
- Cover letter generation endpoint (proxies request to Python AI service)
- EJS templates available for server-side cover letter rendering

---

## Project structure

```text
Resume-Parser-Backend
├─ src
│  ├─ auth
│  │  ├─ auth.controller.ts
│  │  ├─ auth.module.ts
│  │  └─ auth.service.ts
│  ├─ config
│  ├─ database
│  ├─ media
│  ├─ onboarding
│  ├─ user
│  ├─ template
│  └─ utils
├─ package.json
├─ tsconfig.json
└─ vercel.json
```

---

## Environment variables (.env)

Create a `.env` in the project root and add values like:

```text
MONGO_URI=mongodb://localhost:27017
JWT_SECRET=your_jwt_secret_here
PORT=3000
PYTHON_SERVICE_URL=http://localhost:8000
```

---

## Install & run (development)

```bash
# install
npm install

# start in development mode
npm run start:dev
```

Default server URL: `http://localhost:3000` (change PORT in `.env` if needed)

---

## Example API endpoints

- `POST /auth/register` — register a new user
- `POST /auth/login` — login (returns JWT)

Notes: Add authentication guard to protected endpoints (JWT guard implemented in `auth/guards`)

---

## Integration with Python AI service

The backend sends relevant requests to the Python service (parse / generate) via `PYTHON_SERVICE_URL` (set in `.env`). The Python service is responsible for heavy NLP, parsing, and PDF generation — the NestJS backend coordinates authentication, storage references, and user workflows.

---

## Deployment notes

- Use a managed MongoDB (Atlas) for production.
- Secure `JWT_SECRET` and any API keys via your deployment provider's secret store.
- Consider containerizing (Docker) both NestJS and Python services for orchestration.

---

## Tech stack

- NestJS (TypeScript)
- MongoDB (Mongoose)
- JWT for auth
- EJS templates for server-side rendering (cover-letter)
