#!/bin/bash

# EcoHome Vercel Deployment Script
# This script helps deploy the application to Vercel

echo "🚀 EcoHome - Vercel Deployment"
echo "================================"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if logged in
echo "📋 Checking Vercel login status..."
VERCEL_USER=$(vercel whoami 2>&1)
if [[ $VERCEL_USER == *"Error"* ]]; then
    echo "❌ Not logged in to Vercel. Please run: vercel login"
    exit 1
fi

echo "✅ Logged in as: $VERCEL_USER"
echo ""

# Check for .vercel directory
if [ ! -d ".vercel" ]; then
    echo "📝 First time deployment detected."
    echo ""
    echo "Please answer the following prompts:"
    echo "  - Scope: aibymlcom-8896"
    echo "  - Link to existing: N"
    echo "  - Project name: aihome-electrification"
    echo "  - Directory: ./ (just press Enter)"
    echo "  - Override settings: N"
    echo ""
    echo "Starting interactive deployment..."
    exec vercel
else
    echo "✅ Project already linked"
    echo ""
    echo "🚀 Deploying to production..."
    vercel --prod
fi
