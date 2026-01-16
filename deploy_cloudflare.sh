#!/bin/bash

# Cloudflare Pages Deployment Helper Script

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Starting Cloudflare Deployment Setup...${NC}"

# 1. Verify Node/NPM
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Error: npm is not installed.${NC} Please install Node.js first."
    exit 1
fi

# 2. Install Dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Dependency installation failed.${NC}"
    exit 1
fi

# 3. Build Project
echo -e "${YELLOW}🔨 Building project for production...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# 4. Check for Wrangler authentication
echo -e "${YELLOW}☁️  Checking Cloudflare authentication...${NC}"
if ! npx wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  You are not logged in to Cloudflare.${NC}"
    echo -e "Opening browser to login..."
    npx wrangler login
fi

# 5. Deploy to Cloudflare Pages
# Using 'dist' as the build output directory (standard for Vite)
PROJECT_NAME="distrito-beef-app"

echo -e "${YELLOW}🚀 Deploying to Cloudflare Pages...${NC}"
echo -e "Target Project: ${PROJECT_NAME}"

npx wrangler pages deploy dist --project-name "$PROJECT_NAME"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✨ Deployment Complete!${NC}"
    echo -e "Visit your dashboard at: https://dash.cloudflare.com/"
else
    echo -e "${RED}❌ Deployment failed.${NC}"
    echo -e "Try running 'npx wrangler pages deploy dist' manually to debug."
    exit 1
fi
