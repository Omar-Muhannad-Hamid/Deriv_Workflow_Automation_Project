#!/bin/bash

# AI Workflow Builder - Quick Setup Script
# This script helps you get started quickly

echo "🚀 AI Workflow Builder - Quick Setup"
echo "===================================="
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Setup environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: You must edit .env and add your API keys:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - GEMINI_API_KEY"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Check if environment variables are set
echo "🔍 Checking environment configuration..."
source .env 2>/dev/null

MISSING_VARS=0

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ "$NEXT_PUBLIC_SUPABASE_URL" = "your_supabase_url_here" ]; then
    echo "⚠️  NEXT_PUBLIC_SUPABASE_URL is not configured"
    MISSING_VARS=1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ] || [ "$NEXT_PUBLIC_SUPABASE_ANON_KEY" = "your_supabase_anon_key_here" ]; then
    echo "⚠️  NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured"
    MISSING_VARS=1
fi

if [ -z "$GEMINI_API_KEY" ] || [ "$GEMINI_API_KEY" = "your_gemini_api_key_here" ]; then
    echo "⚠️  GEMINI_API_KEY is not configured"
    MISSING_VARS=1
fi

if [ $MISSING_VARS -eq 1 ]; then
    echo ""
    echo "❌ Please configure your .env file with the required API keys"
    echo ""
    echo "📚 Setup Guide:"
    echo "   1. Create Supabase project: https://supabase.com"
    echo "   2. Get Gemini API key: https://ai.google.dev"
    echo "   3. Run database migration (see README.md)"
    echo "   4. Update .env with your credentials"
    echo "   5. Run: npm run dev"
    echo ""
    exit 1
fi

echo "✅ Environment variables configured"
echo ""

# Build check
echo "🔨 Testing build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "✅ Build successful"
echo ""

# All done!
echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Make sure you've run the database migration in Supabase"
echo "   (Copy contents of schema/database.sql to Supabase SQL Editor)"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📖 For more information, check:"
echo "   - README.md - Complete documentation"
echo "   - docs/DEPLOYMENT.md - Deployment guide"
echo "   - docs/ARCHITECTURE.md - System architecture"
echo "   - docs/prompt-examples.md - Example workflows"
echo ""
echo "Happy building! 🚀"
