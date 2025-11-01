# Contributing to DevSync AI Backend

Thank you for considering contributing to DevSync AI! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Run tests (if available): `npm test`
6. Commit your changes: `git commit -m "Add your feature"`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Guidelines

### Code Style

- Follow existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use async/await instead of callbacks

### Commit Messages

Use clear and descriptive commit messages:

```
feat: Add user profile update endpoint
fix: Resolve authentication token expiry issue
docs: Update API documentation for tasks
refactor: Improve error handling in controllers
test: Add unit tests for PRD controller
```

Prefix types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### File Structure

When adding new features:

```
controllers/    - Business logic
models/        - Database schemas
routes/        - API endpoints
middleware/    - Express middleware
services/      - External service integrations
utils/         - Helper functions
validators/    - Input validation
```

### API Development

1. **Controllers**: Handle request/response logic
2. **Models**: Define MongoDB schemas with validation
3. **Routes**: Define endpoints with proper HTTP methods
4. **Middleware**: Authentication, authorization, validation
5. **Error Handling**: Use ErrorResponse class for consistent errors

### Database

- Always use Mongoose models
- Add indexes for frequently queried fields
- Use virtuals for computed fields
- Add proper validation in schemas

### Security

- Never commit sensitive data (.env files)
- Always validate and sanitize user input
- Use parameterized queries to prevent injection
- Implement proper authentication and authorization
- Use HTTPS in production

### Testing

- Write unit tests for utilities
- Write integration tests for API endpoints
- Test error cases and edge cases
- Maintain test coverage above 80%

## Pull Request Process

1. Update README.md with details of changes if needed
2. Update API_EXAMPLES.md if adding/modifying endpoints
3. Ensure all tests pass
4. Update documentation
5. Request review from maintainers
6. Address review comments
7. Squash commits if requested

## Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

## Reporting Bugs

When reporting bugs, include:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Detailed steps
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: OS, Node version, etc.
6. **Screenshots**: If applicable
7. **Additional Context**: Any other relevant information

## Suggesting Features

When suggesting features:

1. **Use Case**: Describe the problem it solves
2. **Proposed Solution**: How it should work
3. **Alternatives**: Other solutions considered
4. **Impact**: Who benefits from this feature

## Code Review Process

- All submissions require review
- Maintainers will review within 48 hours
- Feedback should be addressed promptly
- Be open to constructive criticism
- Help others with their PRs

## Priority Labels

- `priority: critical` - Security issues, data loss
- `priority: high` - Major bugs, important features
- `priority: medium` - Standard bugs and features
- `priority: low` - Nice-to-have improvements

## Areas for Contribution

### High Priority
- Additional test coverage
- Performance optimizations
- Security enhancements
- Documentation improvements

### Medium Priority
- New integrations (Jira, Trello, etc.)
- Enhanced analytics features
- Advanced AI capabilities
- Mobile app support

### Good First Issues
- Documentation updates
- Code comments
- Bug fixes with clear reproduction steps
- UI/UX improvements

## Questions?

- Open an issue with the `question` label
- Join our community discussions
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

Thank you for contributing to DevSync AI! ??
