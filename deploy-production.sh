#!/bin/bash

# Production Environment Setup Script
# FlagFit Pro - Security Update Deployment

set -e  # Exit on any error

echo "🚀 FlagFit Pro Production Environment Setup"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_success "Dependencies check passed"
}

# Generate secure secrets
generate_secrets() {
    print_status "Generating secure secrets..."
    
    # Generate CSRF secret
    CSRF_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    echo "CSRF_SECRET=$CSRF_SECRET" > .env.production.temp
    
    print_success "Generated CSRF secret"
    print_warning "CSRF_SECRET: $CSRF_SECRET"
    print_warning "Save this secret securely!"
}

# Validate environment variables
validate_env() {
    print_status "Validating environment variables..."
    
    if [ ! -f ".env.production.temp" ]; then
        print_error ".env.production.temp not found"
        exit 1
    fi
    
    # Check required variables
    required_vars=(
        "VITE_SUPABASE_URL"
        "VITE_SUPABASE_ANON_KEY"
        "VITE_API_BASE_URL"
        "VITE_AI_SERVICE_URL"
        "ALLOWED_ORIGINS"
    )
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" .env.production.temp; then
            print_warning "Missing: $var"
        fi
    done
    
    print_success "Environment validation completed"
}

# Security audit check
security_check() {
    print_status "Running security audit..."
    
    npm audit --audit-level=moderate
    
    if [ $? -eq 0 ]; then
        print_success "Security audit passed"
    else
        print_warning "Security vulnerabilities found. Run 'npm audit fix' to resolve."
    fi
}

# Build application
build_app() {
    print_status "Building application..."
    
    # Install dependencies
    npm install
    
    # Run linting
    print_status "Running linting..."
    npm run lint || print_warning "Linting issues found"
    
    # Build (if you have a build script)
    if grep -q "\"build\":" package.json; then
        print_status "Building application..."
        npm run build
        print_success "Build completed"
    else
        print_warning "No build script found in package.json"
    fi
}

# Display deployment instructions
show_instructions() {
    echo ""
    echo "📋 Production Deployment Instructions"
    echo "====================================="
    echo ""
    echo "1. Copy the following environment variables to your hosting platform:"
    echo ""
    
    if [ -f ".env.production.temp" ]; then
        cat .env.production.temp
        echo ""
    fi
    
    echo "2. Required environment variables for production:"
    echo "   - VITE_API_BASE_URL=https://your-production-api-domain.com"
    echo "   - VITE_AI_SERVICE_URL=https://your-ai-service-domain.com"
    echo "   - CSRF_SECRET=$CSRF_SECRET"
    echo "   - ALLOWED_ORIGINS=https://your-production-domain.com"
    echo "   - NODE_ENV=production"
    echo ""
    echo "3. Platform-specific instructions:"
    echo "   - Vercel: Settings → Environment Variables"
    echo "   - Netlify: Site settings → Environment variables"
    echo "   - Railway: Variables tab"
    echo ""
    echo "4. After deployment, verify:"
    echo "   - Security headers are present"
    echo "   - CORS is working correctly"
    echo "   - Rate limiting is active"
    echo "   - CSRF protection is enabled"
    echo ""
    echo "5. Test endpoints:"
    echo "   - GET /api/health"
    echo "   - GET /api/csrf-token"
    echo ""
}

# Cleanup
cleanup() {
    print_status "Cleaning up temporary files..."
    rm -f .env.production.temp
    print_success "Cleanup completed"
}

# Main execution
main() {
    echo "Starting production environment setup..."
    echo ""
    
    check_dependencies
    generate_secrets
    validate_env
    security_check
    build_app
    show_instructions
    
    echo ""
    print_success "Production environment setup completed!"
    print_warning "Remember to:"
    print_warning "1. Add all environment variables to your hosting platform"
    print_warning "2. Redeploy your application"
    print_warning "3. Test all functionality"
    print_warning "4. Monitor logs for any issues"
    echo ""
    
    cleanup
}

# Run main function
main "$@" 