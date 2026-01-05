#!/usr/bin/env node

/**
 * Environment Variable Validation
 * Enterprise-grade configuration validation
 */

const required = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
];

const optional = [
  'STRIPE_WEBHOOK_SECRET',
  'EMAIL_SERVER',
  'EMAIL_FROM',
  'NEXT_PUBLIC_APP_URL',
];

const errors = [];
const warnings = [];

console.log('🔍 Validating environment configuration...\n');

// Check required variables
required.forEach((key) => {
  const value = process.env[key];
  
  if (!value) {
    errors.push(`❌ Missing required: ${key}`);
  } else {
    // Validate formats
    if (key === 'DATABASE_URL' && !value.startsWith('postgresql://')) {
      errors.push(`❌ ${key} must be a PostgreSQL connection string`);
    }
    
    if (key === 'NEXTAUTH_URL' && !value.match(/^https?:\/\//)) {
      errors.push(`❌ ${key} must be a valid URL`);
    }
    
    if (key === 'NEXTAUTH_SECRET' && value.length < 32) {
      errors.push(`❌ ${key} must be at least 32 characters`);
    }
    
    if (key.includes('STRIPE') && value === 'your_key_here') {
      errors.push(`❌ ${key} has placeholder value - set real key`);
    }
  }
});

// Check optional variables
optional.forEach((key) => {
  const value = process.env[key];
  
  if (!value) {
    warnings.push(`⚠️  Optional not set: ${key}`);
  }
});

// Security checks
if (process.env.NODE_ENV === 'production') {
  // Check for test/dev keys in production
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey && stripeKey.includes('test')) {
    errors.push('❌ Using Stripe TEST key in PRODUCTION!');
  }
  
  // Check NEXTAUTH_URL is HTTPS in production
  const authUrl = process.env.NEXTAUTH_URL;
  if (authUrl && !authUrl.startsWith('https://')) {
    errors.push('❌ NEXTAUTH_URL must use HTTPS in production');
  }
}

// Report results
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 VALIDATION RESULTS');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All environment variables are valid!\n');
  process.exit(0);
}

if (errors.length > 0) {
  console.log('🔴 ERRORS:\n');
  errors.forEach((err) => console.log(`  ${err}`));
  console.log('');
}

if (warnings.length > 0) {
  console.log('🟡 WARNINGS:\n');
  warnings.forEach((warn) => console.log(`  ${warn}`));
  console.log('');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (errors.length > 0) {
  console.log('❌ Fix errors before deploying to production!\n');
  process.exit(1);
}

console.log('⚠️  Review warnings and configure optional variables as needed.\n');
process.exit(0);
