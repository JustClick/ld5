#!/usr/bin/env node

/**
 * Custom development script to run Vite with specific environment settings
 * This helps resolve Firebase authentication CORS issues in development
 */

import { spawn } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting development server with Firebase Auth configuration...');

// Ensure local environment variables are set for development
const envLocalPath = resolve(__dirname, '.env.local');
let envContent;

try {
  envContent = readFileSync(envLocalPath, 'utf8');
  
  // Check if auth domain is set correctly
  if (!envContent.includes('VITE_FIREBASE_AUTH_DOMAIN=localhost:5173')) {
    console.log('⚠️  Setting authDomain to localhost:5173 in .env.local');
    
    // Add or update auth domain
    if (envContent.includes('VITE_FIREBASE_AUTH_DOMAIN=')) {
      envContent = envContent.replace(
        /VITE_FIREBASE_AUTH_DOMAIN=.*/,
        'VITE_FIREBASE_AUTH_DOMAIN=localhost:5173'
      );
    } else {
      envContent += '\nVITE_FIREBASE_AUTH_DOMAIN=localhost:5173';
    }
    
    writeFileSync(envLocalPath, envContent);
  }
} catch (err) {
  console.log('⚠️  Creating .env.local with localhost authDomain');
  // Copy from .env and set authDomain
  try {
    const envContent = readFileSync(resolve(__dirname, '.env'), 'utf8');
    const newEnvContent = envContent.replace(
      /VITE_FIREBASE_AUTH_DOMAIN=.*/,
      'VITE_FIREBASE_AUTH_DOMAIN=localhost:5173'
    );
    writeFileSync(envLocalPath, newEnvContent);
  } catch (err) {
    console.error('❌ Error setting up environment:', err);
    process.exit(1);
  }
}

console.log('✅ Environment configured for Firebase Auth');
console.log('🔒 Starting HTTPS server...');

// Run Vite with HTTPS
const viteProcess = spawn('npx', ['vite', '--https'], { 
  stdio: 'inherit',
  shell: true
});

viteProcess.on('error', (err) => {
  console.error('❌ Failed to start development server:', err);
});

process.on('SIGINT', () => {
  viteProcess.kill('SIGINT');
  process.exit(0);
}); 