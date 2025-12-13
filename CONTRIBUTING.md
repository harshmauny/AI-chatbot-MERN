# Contributing to AI Chatbot

Thank you for considering contributing to this project! Here are some guidelines to help you get started.

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case and rationale**
- **Potential implementation approach**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code, add tests
3. Ensure the test suite passes
4. Make sure your code lints
5. Write a clear commit message

## Development Process

### Setting Up Development Environment

```bash
# Clone your fork
git clone https://github.com/your-username/AI-chatbot-MERN.git

# Install dependencies
cd backend && npm install
cd ../frontend-ai-chatbot && npm install

# Create environment files
cp backend/sample.env backend/.env
```

### Coding Standards

- **TypeScript**: Use TypeScript for all new code
- **Linting**: Run `npm run lint` before committing
- **Formatting**: Code is auto-formatted with Prettier
- **Testing**: Write tests for new features

### Commit Messages

Follow conventional commits:

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

### Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm run test:watch
```

## Project Structure

- `backend/src/controllers/` - Request handlers
- `backend/src/middleware/` - Custom middleware
- `backend/src/models/` - Database models
- `backend/src/routes/` - API routes
- `backend/src/utils/` - Utility functions
- `frontend-ai-chatbot/src/` - React components

## Questions?

Feel free to open an issue for any questions or clarifications.

Thank you for contributing! 🎉
