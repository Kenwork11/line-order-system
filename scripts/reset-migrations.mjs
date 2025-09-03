/**
 * Production migration reset script for Vercel deployment
 * This script resolves failed migrations by marking them as applied
 */

import { execSync } from 'child_process';

console.log('🔄 Resolving failed migrations...');

try {
  // Mark the failed migration as resolved
  execSync('npx prisma migrate resolve --applied 20250903140803_add_users_rls_policies', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Failed migration marked as resolved');
  
  // Deploy remaining migrations
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('✅ Migrations deployed successfully');
  
} catch (error) {
  console.error('❌ Migration resolution failed:', error.message);
  process.exit(1);
}