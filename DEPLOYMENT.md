# Deployment Guide

This guide covers deploying the AI Chatbot application to various environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Local Deployment](#local-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Post-Deployment](#post-deployment)

## Prerequisites

### Required Software

- Node.js 18+ or 20+
- MongoDB 5+
- Docker & Docker Compose (for containerized deployment)
- Git

### Required Accounts

- Cohere API account (https://cohere.ai)
- MongoDB Atlas account (optional, for cloud database)
- Cloud provider account (optional, for cloud deployment)

## Environment Configuration

### 1. Backend Environment Variables

Create `backend/.env` from `backend/sample.env`:

```env
# IMPORTANT: Use strong, unique values in production!
NODE_ENV=production
PORT=5000

# Database - Use MongoDB Atlas for production
MONGODB_URL=your-mongodb-connection-string

# Security - Generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-64-character-jwt-secret-here
COOKIE_SECRET=your-64-character-cookie-secret-here
JWT_EXPIRE_TIME=7d

# AI APIs
COHERE_API_KEY=your-cohere-api-key
OPENAI_API_KEY=optional-openai-key

# CORS - Your frontend URLs
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Logging
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Generate Secure Secrets

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate Cookie secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Local Deployment

### Option 1: Native Installation

#### Backend

```bash
cd backend
npm install
npm run build
npm start
```

#### Frontend

```bash
cd frontend-ai-chatbot
npm install
npm run build
npm run preview
```

### Option 2: Docker Compose

```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.yml up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Docker Deployment

### Build Images

```bash
# Backend
cd backend
docker build -t ai-chatbot-backend:latest .

# Frontend
cd frontend-ai-chatbot
docker build -t ai-chatbot-frontend:latest .
```

### Run Containers

```bash
# Network
docker network create ai-chatbot-network

# MongoDB
docker run -d \
  --name mongo \
  --network ai-chatbot-network \
  -p 27017:27017 \
  -v mongo_data:/data/db \
  mongo:7-jammy

# Backend
docker run -d \
  --name backend \
  --network ai-chatbot-network \
  -p 5000:5000 \
  --env-file ./backend/.env \
  -v $(pwd)/backend/logs:/app/logs \
  ai-chatbot-backend:latest

# Frontend
docker run -d \
  --name frontend \
  --network ai-chatbot-network \
  -p 8080:8080 \
  ai-chatbot-frontend:latest
```

## Cloud Deployment

### AWS Deployment

#### Using ECS (Elastic Container Service)

1. **Push images to ECR:**

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push
docker tag ai-chatbot-backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/ai-chatbot-backend:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/ai-chatbot-backend:latest
```

2. **Create ECS Task Definition:**

```json
{
  "family": "ai-chatbot",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "<account>.dkr.ecr.us-east-1.amazonaws.com/ai-chatbot-backend:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [{ "name": "NODE_ENV", "value": "production" }],
      "secrets": [
        { "name": "JWT_SECRET", "valueFrom": "arn:aws:secretsmanager:..." }
      ]
    }
  ]
}
```

#### Using EC2

1. **Launch EC2 instance** (Ubuntu 22.04)
2. **Install dependencies:**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Install nginx
sudo apt install nginx -y
```

3. **Configure nginx as reverse proxy:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }
}
```

4. **Setup SSL with Let's Encrypt:**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

5. **Deploy application:**

```bash
git clone https://github.com/yourusername/AI-chatbot-MERN.git
cd AI-chatbot-MERN
docker-compose up -d
```

6. **Setup PM2 for process management:**

```bash
npm install -g pm2
cd backend
pm2 start dist/index.js --name "ai-chatbot-backend"
pm2 startup
pm2 save
```

### Azure Deployment

#### Using Azure Container Instances

```bash
# Login to Azure
az login

# Create resource group
az group create --name ai-chatbot-rg --location eastus

# Create container registry
az acr create --resource-group ai-chatbot-rg --name aichatbotacr --sku Basic

# Push images
az acr login --name aichatbotacr
docker tag ai-chatbot-backend aichatbotacr.azurecr.io/backend:latest
docker push aichatbotacr.azurecr.io/backend:latest

# Deploy
az container create \
  --resource-group ai-chatbot-rg \
  --name ai-chatbot-backend \
  --image aichatbotacr.azurecr.io/backend:latest \
  --registry-login-server aichatbotacr.azurecr.io \
  --registry-username <username> \
  --registry-password <password> \
  --dns-name-label ai-chatbot-api \
  --ports 5000
```

### Google Cloud Platform

#### Using Cloud Run

```bash
# Build and push
gcloud builds submit --tag gcr.io/PROJECT_ID/ai-chatbot-backend

# Deploy
gcloud run deploy ai-chatbot-backend \
  --image gcr.io/PROJECT_ID/ai-chatbot-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production
```

### Heroku Deployment

1. **Create Heroku apps:**

```bash
heroku create ai-chatbot-backend
heroku create ai-chatbot-frontend
```

2. **Add MongoDB:**

```bash
heroku addons:create mongolab:sandbox -a ai-chatbot-backend
```

3. **Set environment variables:**

```bash
heroku config:set JWT_SECRET=your-secret -a ai-chatbot-backend
heroku config:set COHERE_API_KEY=your-key -a ai-chatbot-backend
```

4. **Deploy:**

```bash
# Backend
git subtree push --prefix backend heroku main

# Frontend
git subtree push --prefix frontend-ai-chatbot heroku main
```

## Post-Deployment

### 1. Verify Deployment

```bash
# Health check
curl https://yourdomain.com/api/v1/health

# Detailed health
curl https://yourdomain.com/api/v1/health/detailed
```

### 2. Monitor Application

```bash
# View logs
docker-compose logs -f backend

# Check container status
docker ps

# Monitor resources
docker stats
```

### 3. Database Backup

```bash
# MongoDB backup
mongodump --uri="your-mongodb-uri" --out=/path/to/backup

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="your-uri" --out=/backups/backup_$DATE
find /backups -mtime +7 -delete  # Keep 7 days
```

### 4. Setup Monitoring

- **Application Monitoring**: New Relic, Datadog, or Application Insights
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Log Management**: ELK Stack, Splunk, or CloudWatch

### 5. Security Checklist

- [ ] HTTPS enabled
- [ ] Strong secrets in environment variables
- [ ] Database access restricted
- [ ] Firewall configured
- [ ] Rate limiting enabled
- [ ] Regular security updates
- [ ] Backup strategy in place
- [ ] Error logging configured
- [ ] CORS properly configured
- [ ] Security headers enabled

### 6. Performance Optimization

```bash
# Enable gzip compression in nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;

# Enable caching
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Troubleshooting

### Common Issues

**MongoDB Connection Failed:**

```bash
# Check MongoDB status
docker logs mongo

# Test connection
mongosh "your-mongodb-uri"
```

**Backend Not Starting:**

```bash
# Check logs
docker logs backend

# Check environment variables
docker exec backend env
```

**Frontend Can't Reach Backend:**

```bash
# Check CORS settings
# Verify backend URL in frontend config
# Check network connectivity
```

### Rollback Procedure

```bash
# Stop current containers
docker-compose down

# Restore previous images
docker tag ai-chatbot-backend:previous ai-chatbot-backend:latest

# Start services
docker-compose up -d
```

## Maintenance

### Regular Updates

```bash
# Update dependencies
cd backend && npm update
cd frontend-ai-chatbot && npm update

# Security audit
npm audit
npm audit fix

# Rebuild images
docker-compose build --no-cache
```

### Database Maintenance

```bash
# Compact database
mongosh "your-uri" --eval "db.runCommand({compact: 'users'})"

# Create indexes
mongosh "your-uri" --eval "db.users.createIndex({email: 1})"
```

## Support

For issues:

1. Check logs: `docker-compose logs -f`
2. Review health endpoints
3. Check GitHub Issues
4. Contact support

---

**Remember:** Always test in staging before deploying to production!
