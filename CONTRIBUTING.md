# Contributing to Portfolio Project

## Development Philosophy

### 1. Code Style and Standards
- Write clear, self-documenting code
- Follow consistent naming conventions:
  - React components: PascalCase
  - Functions: camelCase
  - Files: kebab-case
- Add meaningful comments for complex logic

### 2. Development Process

#### Branch Strategy
main              # Main development branch
├── feature/*     # Feature branches
├── bugfix/*      # Bug fix branches
└── gh-pages      # Production deployment (automated)

#### Workflow Steps
1. Create feature branch from `main`
2. Develop and test locally
3. Submit pull request to `main`
4. Review and merge
5. Deploy using `npm run deploy`

### 3. Commit Guidelines

#### Commit Message Format
```
type: Brief description

Detailed description if needed
```

#### Types
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style updates
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance tasks

### 4. Testing Requirements
- Write unit tests for new features
- Ensure mobile compatibility
- Test across different browsers
- Verify CORS and API functionality

### 5. Code Review Process
1. Submit pull request with:
   - Clear description
   - Testing details
   - Screenshots (if UI changes)
2. Address review comments
3. Obtain approval before merging

### 6. Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### 7. Mobile Development
- Test with Eruda console
- Verify on multiple browsers
- Check responsive design
- Test connection handling

### 8. Security Considerations
- Never commit sensitive data
- Use environment variables
- Follow CORS best practices
- Implement proper error handling