# Jest Testing Guide for Devathon Website

## 📋 Overview

This project uses **Jest** as the testing framework along with **React Testing Library** for component testing.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (for continuous integration)
npm run test:ci
```

## 📁 Test Structure

```
frontend/
├── __tests__/              # Test files
│   ├── utils.test.ts       # Utility function tests
│   ├── eventData.test.ts   # Data validation tests
│   ├── navigation.test.tsx # Navigation component tests
│   ├── footer.test.tsx     # Footer component tests
│   ├── supabase.test.ts    # Supabase client tests
│   ├── registration-form.test.tsx  # Form tests
│   └── integration.test.tsx        # Integration tests
├── __mocks__/              # Mock files
│   ├── styleMock.js        # CSS mock
│   └── fileMock.js         # Image/file mock
├── jest.config.js          # Jest configuration
└── jest.setup.js           # Test setup and global mocks
```

## 🧪 Test Categories

### 1. Unit Tests
Test individual functions and components in isolation.

**Example: Testing utility functions**
```typescript
// __tests__/utils.test.ts
import { cn } from '../lib/utils'

describe('cn function', () => {
  it('should merge class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2')
  })
})
```

### 2. Component Tests
Test React components behavior and rendering.

**Example: Testing Navigation component**
```typescript
// __tests__/navigation.test.tsx
import { render, screen } from '@testing-library/react'
import Navigation from '../components/navigation'

it('should render navigation bar', () => {
  render(<Navigation />)
  expect(screen.getByRole('navigation')).toBeInTheDocument()
})
```

### 3. Integration Tests
Test multiple components working together.

**Example: Testing registration flow**
```typescript
// __tests__/integration.test.tsx
it('should complete full registration flow', async () => {
  render(<RegistrationForm />)
  // Fill form fields
  // Submit form
  // Verify payment modal appears
})
```

## 📊 Coverage Report

After running `npm run test:coverage`, view the coverage report:

```bash
# Open in browser
open coverage/lcov-report/index.html
```

**Coverage Goals:**
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## ✅ What's Being Tested

### Components
- ✅ Navigation (links, mobile menu, scroll behavior)
- ✅ Footer (links, contact info, social media)
- ✅ Registration Form (validation, team management, payment flow)
- ✅ Organizers (data display, special thanks section)

### Utilities
- ✅ `cn()` function (class name merging)
- ✅ Tailwind class conflicts

### Data & Types
- ✅ Event data structure
- ✅ Organizers data validation
- ✅ TypeScript interfaces
- ✅ Team registration types

### Integration
- ✅ Full registration flow
- ✅ Team name validation
- ✅ Fee calculation
- ✅ Payment modal workflow
- ✅ Supabase integration

## 🎯 Best Practices

### 1. Test File Naming
```
ComponentName.tsx → ComponentName.test.tsx
utils.ts → utils.test.ts
```

### 2. Test Structure (AAA Pattern)
```typescript
it('should do something', () => {
  // Arrange - Setup test data
  const input = 'test'
  
  // Act - Execute the code
  const result = myFunction(input)
  
  // Assert - Verify the result
  expect(result).toBe('expected')
})
```

### 3. Use Descriptive Test Names
```typescript
// ❌ Bad
it('works', () => { ... })

// ✅ Good
it('should display error message when team name is already taken', () => { ... })
```

### 4. Test User Behavior, Not Implementation
```typescript
// ❌ Bad - Testing implementation
expect(component.state.isOpen).toBe(true)

// ✅ Good - Testing user-visible behavior
expect(screen.getByRole('dialog')).toBeVisible()
```

## 🔧 Common Testing Commands

### Run Specific Test File
```bash
npm test -- navigation.test.tsx
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="Navigation"
```

### Update Snapshots
```bash
npm test -- -u
```

### Run Tests in Verbose Mode
```bash
npm test -- --verbose
```

### Debug Tests
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 🐛 Debugging Tips

### 1. Use `screen.debug()`
```typescript
import { render, screen } from '@testing-library/react'

it('should render', () => {
  render(<MyComponent />)
  screen.debug() // Prints DOM to console
})
```

### 2. Use `screen.logTestingPlaygroundURL()`
```typescript
screen.logTestingPlaygroundURL()
// Opens testing playground in browser
```

### 3. Check What Queries Are Available
```typescript
const { container } = render(<MyComponent />)
console.log(container.innerHTML)
```

## 📚 Useful Queries

```typescript
// By Role (Preferred)
screen.getByRole('button', { name: /submit/i })

// By Label Text
screen.getByLabelText(/email/i)

// By Placeholder
screen.getByPlaceholderText(/enter email/i)

// By Text
screen.getByText(/welcome/i)

// By Test ID (Last Resort)
screen.getByTestId('custom-element')
```

## 🔄 Async Testing

```typescript
import { waitFor } from '@testing-library/react'

it('should load data', async () => {
  render(<DataComponent />)
  
  await waitFor(() => {
    expect(screen.getByText(/loaded/i)).toBeInTheDocument()
  })
})
```

## 🎭 Mocking

### Mock API Calls
```typescript
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({ data: [], error: null })
    }))
  }
}))
```

### Mock Next.js Router
```typescript
// Already configured in jest.setup.js
```

### Mock User Events
```typescript
import { fireEvent } from '@testing-library/react'

fireEvent.click(button)
fireEvent.change(input, { target: { value: 'test' } })
```

## 📈 CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:ci
```

## 🎓 Learning Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Playground](https://testing-playground.com/)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🤝 Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain >80% coverage
4. Update this README if needed

## 💡 Tips

- Write tests that give you confidence
- Don't aim for 100% coverage - focus on critical paths
- Test edge cases and error states
- Keep tests simple and readable
- Run tests before committing code

---

**Happy Testing! 🎉**
