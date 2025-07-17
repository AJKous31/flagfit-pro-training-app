# FlagFit Pro React App

This is the React frontend for the FlagFit Pro application, migrated from Vue.js with comprehensive technical debt resolution.

## 🚀 Features

- **Authentication System**: Complete login/register functionality with JWT tokens
- **Training Management**: Track training sessions, goals, and progress
- **Analytics**: User behavior tracking and performance metrics
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern Architecture**: React hooks, context API, and service layer pattern
- **Code Quality**: ESLint, Prettier, and comprehensive documentation

## 🛠 Tech Stack

- **React 18** with hooks and context API
- **React Router v6** for navigation
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Custom hooks** for common functionality
- **Service layer** for API communication
- **ESLint & Prettier** for code quality

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── utils/              # Utility functions
├── views/              # Page components
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## 🏗 Architecture Decisions

### Context Pattern
- **AuthContext**: Manages user authentication state and token management
- **TrainingContext**: Handles training sessions, goals, and statistics
- **AnalyticsContext**: Tracks user behavior and performance metrics

### Service Layer
- **Dependency Injection**: Uses a service container for loose coupling
- **Caching**: Implements intelligent caching with TTL and pattern invalidation
- **Error Handling**: Consistent error handling across all services

### Custom Hooks
- **useStandardReducer**: Reduces boilerplate in context reducers
- **useForm**: Handles form state, validation, and submission
- **useLocalStorage**: Persistent state with cross-tab synchronization
- **useDebounce**: Debounced values for search inputs
- **useAsync**: Async operation handling with loading states
- **useOnlineStatus**: Network connectivity tracking

## 🔧 Technical Debt Resolution

### ✅ Completed Fixes

1. **Outdated Dependencies**
   - Added `"type": "module"` to package.json
   - Updated PostCSS configuration
   - Added ESLint and Prettier for code consistency

2. **Placeholder Logic**
   - Replaced cache hit rate placeholder with real implementation
   - Implemented proper dropoff rate calculation in analytics
   - Added comprehensive JSDoc documentation

3. **Code Duplication**
   - Created `useStandardReducer` hook for context reducers
   - Created `useForm` hook for form handling
   - Extracted date utilities to reduce duplication

4. **Complex Functions**
   - Refactored streak calculation into utility functions
   - Split analytics calculations into smaller, testable functions
   - Improved cache service with better separation of concerns

5. **Documentation**
   - Added comprehensive JSDoc comments
   - Updated README with architecture decisions
   - Added inline comments for complex logic

6. **Coding Standards**
   - Added ESLint configuration
   - Added Prettier configuration
   - Enforced consistent code style

### 📋 Remaining Tasks

- [ ] Add unit tests for utilities and hooks
- [ ] Implement error boundary improvements
- [ ] Add performance monitoring
- [ ] Create component storybook
- [ ] Add TypeScript migration

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## 🧪 Testing

```bash
npm test             # Run tests (when implemented)
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 📝 Code Quality

### ESLint Rules
- React hooks rules enabled
- TypeScript support configured
- Prettier integration
- Common best practices enforced

### Prettier Configuration
- Single quotes
- 2-space indentation
- 80 character line length
- Trailing commas enabled

### Commit Guidelines
- Use conventional commits
- Include ticket numbers when applicable
- Write descriptive commit messages

## 🔄 Migration from Vue

### Completed
- ✅ Service layer migration
- ✅ Context providers setup
- ✅ Basic routing structure
- ✅ Authentication flow
- ✅ Form handling patterns

### In Progress
- 🔄 Component migration
- 🔄 State management conversion
- 🔄 API integration testing

### Planned
- 📋 Advanced features migration
- 📋 Performance optimization
- 📋 PWA implementation

## 🐛 Known Issues

1. **Supabase Integration**: Requires proper configuration
2. **Service Container**: Needs dependency registration
3. **Error Boundaries**: Basic implementation, needs enhancement

## 🤝 Contributing

1. Follow the established code structure
2. Use TypeScript for new files (optional but recommended)
3. Add tests for new functionality
4. Follow the established naming conventions
5. Run linting and formatting before committing

### Development Workflow

1. Create feature branch from `main`
2. Make changes following coding standards
3. Add tests for new functionality
4. Run linting and formatting
5. Create pull request with description
6. Request code review

## 📄 License

This project is part of the FlagFit Pro application.

## 🔗 Related Documentation

- [Vue Migration Guide](./docs/VUE_MIGRATION.md)
- [API Documentation](./docs/API.md)
- [Component Library](./docs/COMPONENTS.md)
- [Testing Strategy](./docs/TESTING.md) 