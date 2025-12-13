# 🤖 AI Chatbot - Production-Ready MERN Stack Application

<div align="center">

![Build Status](https://github.com/yourusername/AI-chatbot-MERN/workflows/CI%2FCD%20Pipeline/badge.svg)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A professional, production-ready AI chatbot application built with the MERN stack, featuring advanced AI capabilities through Cohere API integration, comprehensive security measures, and enterprise-grade architecture.

[Features](#-features) • [Architecture](#-architecture) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Deployment](#-deployment)

</div>

## 📸 Screenshots

![chat screen](https://github.com/user-attachments/assets/e43932f3-d713-481f-b2b4-044d6480daf1)
![login screen](https://github.com/user-attachments/assets/8a86457c-af5a-473f-bba0-7f5e319e6fbe)

## ✨ Features

### Core Functionality

- 🤖 **AI-Powered Conversations** - Intelligent chat using Cohere's Command-R-Plus model
- 💬 **Multi-Chat Management** - Create, manage, and switch between multiple chat sessions
- 🎨 **Code Syntax Highlighting** - Properly formatted code snippets in conversations
- 🔐 **Secure Authentication** - JWT-based authentication with HTTP-only cookies
- 💾 **Persistent Storage** - MongoDB integration for reliable data persistence
- 📱 **Responsive Design** - Modern UI with Material-UI components

### Production-Ready Features

- ⚡ **Performance Optimized** - Connection pooling, caching, and efficient queries
- 🛡️ **Enterprise Security** - Helmet, rate limiting, input sanitization, CORS
- 📊 **Comprehensive Logging** - Winston logger with multiple transports
- 🧪 **Tested Codebase** - Unit and integration tests with Jest
- 🐳 **Docker Support** - Multi-stage builds for optimal container size
- 🔄 **CI/CD Pipeline** - Automated testing and deployment with GitHub Actions
- 📈 **Health Checks** - Kubernetes-ready liveness and readiness probes
- 🎯 **Error Handling** - Centralized error handling with custom error classes
- ✅ **Input Validation** - Comprehensive request validation and sanitization
- 📝 **TypeScript** - Full type safety across the entire stack

## 🏗️ Architecture

### Tech Stack

**Backend:**

- Node.js & Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Winston Logging
- Helmet & Express Rate Limit
- Zod Validation

**Frontend:**

- React 18
- TypeScript
- Material-UI
- React Router v6
- Axios
- React Syntax Highlighter

**AI Integration:**

- Cohere API (Command-R-Plus)
- OpenAI (Optional)

**DevOps:**

- Docker & Docker Compose
- GitHub Actions
- Jest & Supertest
- ESLint & Prettier

### Project Structure

```
AI-chatbot-MERN/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   │   ├── env.ts       # Environment validation
│   │   │   ├── logger.ts    # Winston logger setup
│   │   │   └── cohere-config.ts
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   │   ├── errorHandler.ts
│   │   │   ├── security.ts
│   │   │   └── validation.ts
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   │   ├── errors.ts    # Custom error classes
│   │   │   └── token.manager.ts
│   │   ├── __tests__/       # Test files
│   │   ├── app.ts           # Express app setup
│   │   └── index.ts         # Entry point
│   ├── .eslintrc.cjs
│   ├── .prettierrc
│   ├── jest.config.js
│   ├── tsconfig.json
│   └── package.json
├── frontend-ai-chatbot/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── helpers/
│   │   └── pages/
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci-cd.yml        # CI/CD pipeline
├── docker-compose.yml
└── README.md
```

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn
- Cohere API key

### Environment Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/AI-chatbot-MERN.git
cd AI-chatbot-MERN
```

2. **Backend Setup**

```bash
cd backend
npm install
cp sample.env .env
```

3. **Configure Environment Variables**

Edit `backend/.env` with your values:

```env
# IMPORTANT: Generate strong secrets for production!
NODE_ENV=development
PORT=5000

# Database
MONGODB_URL=mongodb://localhost:27017/ai-chatbot

# Security (MUST be at least 32 characters)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
COOKIE_SECRET=your-super-secret-cookie-key-change-in-production
JWT_EXPIRE_TIME=7d

# AI APIs
COHERE_API_KEY=your-actual-cohere-api-key
OPENAI_API_KEY=your-openai-key-optional

# CORS
CORS_ORIGIN=http://localhost:8080,http://localhost:5173

# Logging
LOG_LEVEL=info
```

4. **Frontend Setup**

```bash
cd ../frontend-ai-chatbot
npm install
```

### Running Locally

**Option 1: Manual Start**

Terminal 1 (Backend):

```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):

```bash
cd frontend-ai-chatbot
npm run dev
```

**Option 2: Docker Compose**

```bash
docker-compose up --build
```

The application will be available at:

- Frontend: http://localhost:8080
- Backend API: http://localhost:5000
- MongoDB: localhost:27017

## 📚 API Documentation

### Authentication Endpoints

#### Sign Up

```http
POST /api/v1/user/signup
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login

```http
POST /api/v1/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Logout

```http
GET /api/v1/user/logout
Cookie: auth_token=<jwt_token>
```

### Chat Endpoints

#### Create New Chat

```http
POST /api/v1/chat/new-chat
Cookie: auth_token=<jwt_token>
```

#### Send Message

```http
POST /api/v1/chat/chat-completion
Cookie: auth_token=<jwt_token>
Content-Type: application/json

{
  "message": "Hello, how are you?",
  "id": "chat_id_here"
}
```

#### Get All Chats

```http
GET /api/v1/chat/all-chats
Cookie: auth_token=<jwt_token>
```

#### Delete Chat

```http
DELETE /api/v1/chat/delete/:id
Cookie: auth_token=<jwt_token>
```

### Health Check Endpoints

```http
GET /api/v1/health          # Basic health check
GET /api/v1/health/detailed # Detailed system info
GET /api/v1/health/ready    # Kubernetes readiness probe
GET /api/v1/health/live     # Kubernetes liveness probe
```

## 🧪 Testing

```bash
# Run all tests
cd backend
npm test

# Watch mode
npm run test:watch

# With coverage
npm test -- --coverage

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format
```

## 🐳 Docker Deployment

### Build Images

```bash
# Backend
docker build -t ai-chatbot-backend:latest ./backend

# Frontend
docker build -t ai-chatbot-frontend:latest ./frontend-ai-chatbot
```

### Run with Docker Compose

```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.yml up -d
```

## 🔒 Security Features

- ✅ **Helmet** - Security headers
- ✅ **Rate Limiting** - Prevent DDoS attacks
- ✅ **Input Sanitization** - NoSQL injection prevention
- ✅ **CORS** - Cross-origin resource sharing
- ✅ **HTTP-Only Cookies** - XSS protection
- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **JWT Validation** - Secure token management
- ✅ **Request Validation** - Express-validator
- ✅ **Environment Validation** - Zod schemas

## 📊 Monitoring & Logging

The application uses Winston for comprehensive logging:

- **Error Logs**: `logs/error.log`
- **Combined Logs**: `logs/combined.log`
- **Exception Logs**: `logs/exceptions.log`
- **Console Output**: Development mode

Health check endpoints provide:

- Database connection status
- Memory usage
- Uptime statistics
- Service availability

## 🚀 Performance Optimizations

- Connection pooling for MongoDB
- Request rate limiting
- Efficient database indexing
- Lazy loading for frontend components
- Code splitting
- Docker multi-stage builds
- Optimized bundle sizes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Portfolio: [yourportfolio.com](https://yourportfolio.com)

## 🙏 Acknowledgments

- Cohere AI for their powerful language models
- MongoDB for excellent database solutions
- The open-source community

---

<div align="center">
Made with ❤️ and TypeScript

⭐ Star this repo if you find it helpful!

</div>
