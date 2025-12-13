# 🚀 Quick Start Guide

Get the AI Chatbot running in under 5 minutes!

## Prerequisites Check

```bash
# Check Node.js (need 18+)
node --version

# Check npm
npm --version

# Check Docker (optional)
docker --version
```

## ⚡ Fast Track Setup

### Step 1: Clone & Install (2 min)

```bash
# Clone repository
git clone https://github.com/yourusername/AI-chatbot-MERN.git
cd AI-chatbot-MERN

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend-ai-chatbot
npm install
```

### Step 2: Environment Setup (1 min)

```bash
# Backend - copy and edit .env
cd ../backend
cp sample.env .env
```

**Edit `backend/.env`** - Minimum required:

```env
COHERE_API_KEY=your-cohere-api-key-here
MONGODB_URL=mongodb://localhost:27017/ai-chatbot
JWT_SECRET=change-this-to-a-random-32-character-string
COOKIE_SECRET=change-this-to-another-random-32-character
```

💡 **Get Cohere API Key**: Sign up at https://cohere.ai (free tier available)

### Step 3: Start MongoDB (1 min)

**Option A - Docker:**

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B - Local MongoDB:**

```bash
mongod --dbpath /path/to/data
```

### Step 4: Run Application (1 min)

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd frontend-ai-chatbot
npm run dev
```

### Step 5: Open & Test

1. Open browser: http://localhost:5173 (or the port shown in terminal)
2. Click "Sign Up" and create an account
3. Start chatting! 🎉

## 🐳 Even Faster - Docker Compose

```bash
# From project root
docker-compose up
```

Open: http://localhost:8080

## ⚙️ Configuration Tips

### Generate Strong Secrets

```bash
# JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Cookie Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Using MongoDB Atlas (Cloud)

1. Create account at https://cloud.mongodb.com
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URL` in `.env`

## 🧪 Verify Installation

```bash
# Check backend health
curl http://localhost:5000/api/v1/health

# Expected response:
# {"status":"success","message":"Server is running","timestamp":"..."}
```

## 📱 First Steps After Setup

1. **Sign Up**: Create your account
2. **Create Chat**: Click "New Chat"
3. **Send Message**: Ask the AI anything!
4. **Explore**: Try multiple chats, code formatting, etc.

## 🔧 Troubleshooting

### Backend won't start

```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000                  # Mac/Linux

# Check MongoDB connection
mongosh "your-mongodb-url"
```

### Frontend won't connect

1. Check CORS settings in `backend/.env`
2. Verify backend is running
3. Check browser console for errors

### Database connection failed

```bash
# Verify MongoDB is running
mongosh

# Check connection string in .env
# Should be: mongodb://localhost:27017/ai-chatbot
```

### "Module not found" errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

- Read the [README](README.md) for full documentation
- Check [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Review [SECURITY.md](SECURITY.md) for security best practices

## 🆘 Still Having Issues?

1. Check logs in `backend/logs/`
2. Review [GitHub Issues](https://github.com/yourusername/AI-chatbot-MERN/issues)
3. Check environment variables are set correctly
4. Ensure all dependencies are installed

## 🎓 Development Commands

```bash
# Backend
npm run dev      # Development with hot reload
npm run build    # Build for production
npm start        # Run production build
npm test         # Run tests
npm run lint     # Check code quality

# Frontend
npm run dev      # Development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code quality
```

## 🌟 Pro Tips

1. **Use VSCode**: Install recommended extensions
2. **Enable Auto-save**: Better development experience
3. **Install Postman**: Test API endpoints easily
4. **Use MongoDB Compass**: Visual database management
5. **Check Network Tab**: Debug API calls in browser

## 📊 Default Ports

- Frontend: 5173 (dev) / 8080 (docker)
- Backend: 5000
- MongoDB: 27017

## 🎯 Quick Feature Test

After setup, test these features:

- [ ] Sign up new user
- [ ] Log in
- [ ] Create new chat
- [ ] Send message
- [ ] Receive AI response
- [ ] Create multiple chats
- [ ] Switch between chats
- [ ] Delete a chat
- [ ] Log out

---

**Happy Coding! 🚀**

Questions? Check the main [README.md](README.md) or open an issue!
