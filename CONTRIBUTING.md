# Contributing to Hospital Management System

Thank you for your interest in contributing to the Hospital Management System! This document provides guidelines for contributing to the project.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/hospital-management-system.git`
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Code Style

### TypeScript
- Use TypeScript for all new files
- Define proper interfaces and types
- Avoid `any` types when possible

### React Components
- Use functional components with hooks
- Follow the existing component structure
- Use proper prop typing with TypeScript interfaces

### Styling
- Use Tailwind CSS classes
- Follow the existing color scheme (cyan/teal theme)
- Ensure responsive design for all components

### File Naming
- Use kebab-case for file names: `patient-dashboard.tsx`
- Use PascalCase for component names: `PatientDashboard`
- Use camelCase for variables and functions

## Commit Guidelines

### Commit Message Format
\`\`\`
type(scope): description

[optional body]

[optional footer]
\`\`\`

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
\`\`\`
feat(patient): add appointment booking functionality
fix(doctor): resolve schedule display issue
docs(readme): update installation instructions
\`\`\`

## Pull Request Process

1. **Update Documentation**: Ensure any new features are documented
2. **Test Your Changes**: Verify all functionality works as expected
3. **Update README**: Add any new dependencies or setup steps
4. **Create Pull Request**: Use the provided template

### Pull Request Template
\`\`\`markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tested locally
- [ ] All existing tests pass
- [ ] Added new tests (if applicable)

## Screenshots (if applicable)
Add screenshots of UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors or warnings
\`\`\`

## Feature Development Guidelines

### Adding New Pages
1. Create the page component in the appropriate dashboard folder
2. Add proper TypeScript interfaces for props and state
3. Implement responsive design
4. Add navigation links if needed
5. Update documentation

### Database Integration
1. Define proper TypeScript interfaces for data models
2. Create API service functions
3. Implement error handling
4. Add loading states

### UI Components
1. Use existing shadcn/ui components when possible
2. Follow the established design system
3. Ensure accessibility (ARIA labels, keyboard navigation)
4. Test on different screen sizes

## Testing

### Manual Testing Checklist
- [ ] All user roles can access their respective dashboards
- [ ] Forms validate input properly
- [ ] Navigation works correctly
- [ ] Responsive design works on mobile/tablet
- [ ] No console errors

### Automated Testing (Future)
- Unit tests for utility functions
- Component testing with React Testing Library
- Integration tests for user workflows

## Code Review Process

### For Reviewers
1. Check code quality and style consistency
2. Verify functionality works as described
3. Test on different browsers/devices
4. Review security implications
5. Ensure documentation is updated

### For Contributors
1. Respond to feedback promptly
2. Make requested changes
3. Update the PR description if scope changes
4. Ensure CI checks pass

## Security Guidelines

### Data Handling
- Never commit sensitive data (passwords, API keys)
- Use environment variables for configuration
- Validate all user inputs
- Implement proper authentication checks

### Dependencies
- Keep dependencies updated
- Review security advisories
- Use `npm audit` to check for vulnerabilities

## Documentation

### Code Documentation
- Add JSDoc comments for complex functions
- Document component props with TypeScript interfaces
- Include usage examples for reusable components

### User Documentation
- Update README for new features
- Add setup instructions for new dependencies
- Include screenshots for UI changes

## Getting Help

### Resources
- [Project Documentation](./README.md)
- [Setup Guide](./SETUP.md)
- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

### Communication
- Create GitHub issues for bugs or feature requests
- Use descriptive titles and provide detailed information
- Include steps to reproduce for bug reports

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Project documentation

Thank you for contributing to the Hospital Management System! 🏥
