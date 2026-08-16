# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| Latest main branch | ✅ |

## Reporting a Vulnerability

If you discover a security vulnerability in Annadata, please **do NOT open a public GitHub issue**.

Instead:
1. Email the maintainers directly (check the repository for contact info)
2. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fix

We aim to respond within **48 hours** and will coordinate a fix and disclosure timeline with you.

## ⚠️ Known Historical Issue

> The original codebase had secrets (database password, Gmail credentials, JWT secret key) hardcoded in source files that were committed to Git. These have been remediated.

**If you have access to the old Git history, please treat these as compromised and do not use them.**

The fix involved:
- Externalizing all secrets to environment variables
- Updating `.gitignore` to prevent future secret commits
- Providing `.env.example` templates for proper developer onboarding

## Security Best Practices for Contributors

1. **Never commit secrets** to Git (enforced by `.gitignore`)
2. **Use environment variables** for all sensitive configuration
3. **Rotate credentials** after any accidental exposure
4. **Review PRs** for accidentally included secrets before merging
5. **Use Gmail App Passwords** (not your main Gmail password) for SMTP
6. **Generate strong JWT secrets**: `openssl rand -hex 64`

## Dependencies

Keep dependencies up to date:
```bash
# Backend — check for vulnerability advisories
./mvnw dependency:analyze

# Frontend
npm audit
npm audit fix
```
