#!/bin/bash

# Production Setup Script for HR Management System
# This script sets up the production database and environment variables

echo "🚀 Setting up production environment..."

# Generate a secure JWT secret
JWT_SECRET=$(openssl rand -base64 32)

echo "📝 Adding environment variables to Vercel..."

# Add JWT secret to Vercel
echo "$JWT_SECRET" | vercel env add JWT_SECRET production --yes

# Add SQLite database URL for production
echo "file:./dev.db" | vercel env add DATABASE_URL production --yes

echo "✅ Environment variables added!"
echo ""
echo "🔧 Next steps:"
echo "1. Go to https://console.neon.tech/ and create a free PostgreSQL database"
echo "2. Copy the connection string"
echo "3. Run: echo 'your-database-url' | vercel env add DATABASE_URL production --yes"
echo "4. Run: vercel --prod to redeploy"
echo "5. Contact Vercel support to disable deployment protection or access the admin panel"
echo "6. Manually seed admin user through Vercel dashboard functions"
echo ""
echo "💡 Generated JWT Secret: $JWT_SECRET"
echo "   (This has been automatically added to Vercel)"
echo ""
echo "🌐 Current production URL: https://web-software-hyhrz2d27-devweb3-outlookcoms-projects.vercel.app"
echo "   Note: Deployment protection is enabled - contact project owner to disable"