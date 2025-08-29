# 🚀 NestJS Backend - User Onboarding API

This is a **NestJS backend project** with **JWT authentication** and a **User Onboarding module** built using **MongoDB + Mongoose**.  
It also includes **Swagger API documentation** for easy API testing.

---

## 📌 Features
- 🔐 User authentication with JWT
- 👤 User onboarding (first name, last name, country, city, phone, resume link, etc.)
- 🗂 MongoDB with Mongoose schemas
- 📖 Swagger API documentation
- ✅ Validation using `class-validator`

---

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Install dependencies
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/your-db
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=3600s
```

---

## ▶️ Running the App

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod
```

Server will run at:  
👉 **http://localhost:5000**

---

## 📖 Swagger Documentation

Swagger docs are available at:  

👉 **http://localhost:5000/api/docs**

### Authorize in Swagger
1. Click on the **Authorize** button (top right).
2. Enter: `Bearer <your_token>`.
3. Test protected APIs directly.


## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e
```

---

## 📜 License

MIT © 2025
