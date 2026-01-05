/**
 * Jest Setup
 * Runs before each test suite
 */

import '@testing-library/jest-dom';

// Mock environment variables for testing
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.NEXTAUTH_SECRET = 'test-secret-at-least-32-characters-long';
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_example';
process.env.STRIPE_SECRET_KEY = 'sk_test_example';
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

// Suppress console errors in tests (optional)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
