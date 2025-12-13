# Architecture Documentation

## System Overview

The AI Chatbot is a full-stack application built with the MERN stack, featuring a microservices-oriented architecture with clear separation of concerns.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React Frontend (TypeScript)                          │  │
│  │  - Material-UI Components                             │  │
│  │  - React Router                                       │  │
│  │  - Axios API Client                                   │  │
│  │  - Context API (Auth)                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway Layer                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express.js Server                                    │  │
│  │  - Security Middleware (Helmet, CORS, Rate Limit)    │  │
│  │  - Request Logger                                     │  │
│  │  - Error Handler                                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            ▼               ▼               ▼
┌─────────────────┐  ┌─────────────┐  ┌──────────────┐
│ Auth Routes     │  │ Chat Routes │  │ Health Routes│
│ /api/v1/user   │  │ /api/v1/chat│  │ /api/v1/health│
└─────────────────┘  └─────────────┘  └──────────────┘
            │               │               │
            ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ User         │  │ Chat         │  │ Health       │     │
│  │ Controller   │  │ Controller   │  │ Controller   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
            │               │
            ▼               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MongoDB (Mongoose ODM)                               │  │
│  │  - User Model                                         │  │
│  │  - Chat Schema                                        │  │
│  │  - Indexes & Validation                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ Cohere API   │  │ OpenAI API   │                        │
│  │ (Command-R+) │  │ (Optional)   │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Backend Components

#### 1. Application Layer (`app.ts`)

- Express server configuration
- Middleware setup
- Security configuration
- Error handling

#### 2. Controllers

**Responsibilities:**

- Handle HTTP requests
- Validate business logic
- Return appropriate responses

**Key Controllers:**

- `userController.ts` - Authentication and user management
- `chatController.ts` - Chat operations
- `healthController.ts` - System health checks

#### 3. Middleware

**Security Middleware:**

- `helmet` - Security headers
- `cors` - Cross-origin resource sharing
- `rate-limit` - Request throttling
- `mongo-sanitize` - NoSQL injection prevention

**Custom Middleware:**

- `errorHandler.ts` - Centralized error handling
- `validation.ts` - Input validation
- `security.ts` - Additional security measures

#### 4. Models

**User Model:**

```typescript
{
  first_name: string,
  last_name: string,
  email: string (unique, indexed),
  password: string (hashed),
  chats: [Chat],
  lastLogin: Date,
  isActive: boolean,
  timestamps: true
}
```

**Chat Schema:**

```typescript
{
  date: Date,
  chatName: string,
  conversation: [Message],
  isArchived: boolean,
  timestamps: true
}
```

#### 5. Routes

RESTful API design:

- `/api/v1/user` - User operations
- `/api/v1/chat` - Chat operations
- `/api/v1/health` - Health checks

### Frontend Components

#### 1. Pages

- `Home.tsx` - Landing page
- `Login.tsx` - Authentication
- `SignUp.tsx` - User registration
- `Chat.tsx` - Main chat interface

#### 2. Components

- `Header.tsx` - Navigation
- `ChatItem.tsx` - Individual messages
- `ChatPannelComponent.tsx` - Chat history
- `SideBar.tsx` - Navigation sidebar

#### 3. Context

- `AuthContext.tsx` - Global authentication state

## Data Flow

### Authentication Flow

```
1. User submits credentials
   ↓
2. Backend validates input
   ↓
3. Check user in database
   ↓
4. Verify password (bcrypt)
   ↓
5. Generate JWT token
   ↓
6. Set HTTP-only cookie
   ↓
7. Return user data (without password)
```

### Chat Flow

```
1. User sends message
   ↓
2. Validate authentication
   ↓
3. Validate message format
   ↓
4. Fetch chat history
   ↓
5. Send to Cohere API
   ↓
6. Receive AI response
   ↓
7. Update database
   ↓
8. Return updated chat
```

## Security Architecture

### Authentication

- **JWT Tokens**: Stateless authentication
- **HTTP-Only Cookies**: XSS protection
- **Token Expiration**: 7 days default
- **Secure Cookies**: HTTPS-only in production

### Authorization

- **Route Protection**: Middleware verification
- **User Ownership**: Verify resource access
- **Role-Based**: Extensible for future roles

### Data Protection

- **Password Hashing**: bcrypt with 12 rounds
- **Input Validation**: express-validator
- **Output Sanitization**: Prevent data leaks
- **Environment Validation**: zod schemas

## Database Design

### Indexes

```typescript
// User Collection
email: unique index
{ email: 1, isActive: 1 }: compound index
createdAt: -1

// Performance considerations:
- Indexed email for fast lookups
- Compound index for active user queries
- Timestamp index for sorting
```

### Relationships

- **Embedded Documents**: Chats within Users
- **Rationale**:
  - Chat data belongs to user
  - Atomic operations
  - Better read performance
  - Simplified queries

## Scalability Considerations

### Current Architecture

- **Vertical Scaling**: Increase server resources
- **Connection Pooling**: MongoDB connections
- **Rate Limiting**: Prevent resource exhaustion
- **Caching Strategy**: Ready for Redis integration

### Future Enhancements

- **Horizontal Scaling**: Multiple server instances
- **Load Balancing**: Distribute traffic
- **Microservices**: Separate chat service
- **Message Queue**: Async processing
- **CDN**: Static asset delivery
- **Database Sharding**: Partition data

## Monitoring & Observability

### Logging Strategy

- **Winston Logger**: Structured logging
- **Log Levels**: error, warn, info, debug
- **Transport Layers**:
  - Console (development)
  - File (production)
  - Cloud service (future)

### Health Checks

- **Basic**: Server status
- **Detailed**: System resources
- **Readiness**: Database connection
- **Liveness**: Application state

### Metrics (Future)

- Request rate
- Response time
- Error rate
- Database performance
- AI API latency

## Development Workflow

### Local Development

```bash
# Backend
npm run dev  # TypeScript watch + nodemon

# Frontend
npm run dev  # Vite dev server
```

### Testing Strategy

- **Unit Tests**: Individual functions
- **Integration Tests**: API endpoints
- **E2E Tests**: User flows (future)

### CI/CD Pipeline

1. **Build**: Compile TypeScript
2. **Lint**: Code quality checks
3. **Test**: Run test suite
4. **Security Audit**: Dependency check
5. **Docker Build**: Create images
6. **Deploy**: Push to production

## Deployment Architecture

### Docker Compose

```yaml
Services:
  - MongoDB: Database
  - Backend: API Server
  - Frontend: Web Server

Volumes:
  - mongo_data: Persistent storage

Networks:
  - app-network: Internal communication
```

### Production Considerations

- **Reverse Proxy**: nginx
- **SSL/TLS**: Let's Encrypt
- **Environment**: Separate configs
- **Secrets**: Environment variables
- **Monitoring**: Application insights
- **Backup**: Database snapshots

## Performance Optimizations

### Backend

- Connection pooling
- Database indexes
- Efficient queries
- Response compression
- Static asset caching

### Frontend

- Code splitting
- Lazy loading
- Bundle optimization
- Image optimization
- Service workers (future)

## Technology Decisions

### Why MongoDB?

- Flexible schema for chat data
- Excellent performance
- Easy to scale
- Strong TypeScript support

### Why Express?

- Mature ecosystem
- Lightweight
- Extensive middleware
- TypeScript support

### Why React?

- Component-based architecture
- Large ecosystem
- Strong community
- Excellent tooling

### Why TypeScript?

- Type safety
- Better IDE support
- Fewer runtime errors
- Improved maintainability

## Future Roadmap

### Short Term

- [ ] WebSocket support for real-time chat
- [ ] File upload capability
- [ ] Chat export functionality
- [ ] Advanced search

### Medium Term

- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Mobile app (React Native)
- [ ] Admin dashboard

### Long Term

- [ ] Microservices architecture
- [ ] Multi-tenancy support
- [ ] Advanced analytics
- [ ] Custom AI model training
