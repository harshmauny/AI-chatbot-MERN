# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please do NOT open an issue. Email [your-email@example.com] instead.

You should receive a response within 48 hours. If accepted, we will:

1. Confirm the issue
2. Determine severity
3. Release a fix
4. Credit the reporter (if desired)

## Security Measures

This project implements several security measures:

### Authentication & Authorization

- JWT-based authentication
- HTTP-only cookies
- Secure password hashing (bcrypt)
- Token expiration and refresh

### API Security

- Rate limiting (15 min window)
- Request validation
- Input sanitization
- CORS configuration
- Security headers (Helmet)

### Data Protection

- NoSQL injection prevention
- XSS protection
- CSRF protection (HTTP-only cookies)
- Environment variable validation

### Infrastructure

- Docker security best practices
- Health check endpoints
- Comprehensive logging
- Error handling without info leakage

## Best Practices

When contributing:

1. **Never commit sensitive data**

   - API keys
   - Passwords
   - Secrets
   - Personal information

2. **Use environment variables**

   - All secrets in `.env`
   - Never hardcode credentials

3. **Validate all inputs**

   - Use validation middleware
   - Sanitize user data

4. **Keep dependencies updated**

   - Regular `npm audit`
   - Update vulnerable packages

5. **Follow secure coding practices**
   - Principle of least privilege
   - Defense in depth
   - Fail securely

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.x     | ✅        |
| < 1.0   | ❌        |

## Security Checklist

Before deploying:

- [ ] Strong JWT_SECRET (32+ characters)
- [ ] Strong COOKIE_SECRET (32+ characters)
- [ ] HTTPS enabled in production
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Environment variables validated
- [ ] Security headers configured
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info
- [ ] Logging configured properly
- [ ] Database connection secured
- [ ] Dependencies audited

## Contact

For security issues: [your-email@example.com]

For general questions: Open a GitHub issue
