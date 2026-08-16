# Contributing to Annadata

Thank you for your interest in contributing! Please read these guidelines before submitting a PR.

## Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following the guidelines below
4. Commit with a clear message: `git commit -m "feat: add product image upload"`
5. Push and open a Pull Request

## Development Setup

Follow the [Quick Start guide in README.md](./README.md#quick-start-local-development).

## Code Style

### Server / Backend (Java / Spring Boot)
- Follow standard Java naming conventions
- Use Lombok annotations to reduce boilerplate (`@Data`, `@Builder`, `@Slf4j`)
- Avoid `System.out.println` — use `@Slf4j` + `log.info()` / `log.debug()`
- Never hardcode secrets, URLs, or credentials — use `@Value("${property.name}")`

### Client / Frontend (React / TypeScript)
- Use TypeScript strictly — avoid `any` type
- Components go in the appropriate folder (`admin/`, `seller/`, `customer/`, `delivery/`, `components/`)
- Use Redux Toolkit for all global state — no prop drilling
- All API calls go through `src/Config/Api.ts` axios instance
- Keep components focused and reusable

## Security Rules

> **NEVER commit secrets, passwords, API keys, or credentials to Git**

- All secrets MUST go in `.env` files (which are gitignored)
- Backend: use `@Value("${env.var.name}")` to inject from `application.properties`
- Frontend: use `import.meta.env.VITE_VAR_NAME` for Vite env vars
- When adding a new env var: update `.env.example` with documentation
- When adding a backend config: update `application.properties` with `${ENV_VAR:}` pattern

## Adding New Features

### Server / Backend
1. Add model in `model/`
2. Add repository in `repository/`
3. Add service interface in `service/` and implementation in `service/impl/`
4. Add controller in `controller/`
5. Update security rules in `AppConfig.java` if needed

### Client / Frontend
1. Add Redux slice in `Redux Toolkit/`
2. Add page component in the appropriate role folder
3. Add route in `routes/`
4. Add API call to the axios instance in `Config/Api.ts` or `Config/appi.ts`

## Testing

```bash
# Backend server tests
cd server
./mvnw test

# Frontend client lint check
cd client
npm run lint
```

## Commit Message Convention

Use conventional commits:

```
feat: add razorpay payment integration
fix: resolve JWT token expiry issue
docs: update API documentation
refactor: extract payment service interface
style: format code per checkstyle
test: add order service unit tests
```

## Bug Reports

Please include:
- Steps to reproduce
- Expected vs actual behavior
- Backend version / frontend version
- Relevant error logs (sanitize any personal data)
