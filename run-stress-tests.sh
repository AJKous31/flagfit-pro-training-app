#!/bin/bash

# Flag Football App - Comprehensive Stress Test Runner
# This script runs all stress tests and generates reports

set -e

echo "🚀 Starting Flag Football App Stress Tests..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create reports directory
mkdir -p stress-test-reports
cd "$(dirname "$0")"

echo -e "${BLUE}📊 Running stress tests...${NC}"

# Function to check if a service is running
check_service() {
    local url=$1
    local service_name=$2
    
    if curl -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $service_name is running${NC}"
        return 0
    else
        echo -e "${RED}❌ $service_name is not running at $url${NC}"
        return 1
    fi
}

# Function to run a stress test with error handling
run_stress_test() {
    local test_file=$1
    local test_name=$2
    local output_file=$3
    
    echo -e "${YELLOW}🔄 Running $test_name...${NC}"
    
    if npx artillery run "$test_file" --output "stress-test-reports/$output_file" 2>&1; then
        echo -e "${GREEN}✅ $test_name completed successfully${NC}"
        
        # Generate HTML report if output exists
        if [ -f "stress-test-reports/$output_file" ]; then
            npx artillery report "stress-test-reports/$output_file" --output "stress-test-reports/${output_file%.json}.html"
            echo -e "${GREEN}📄 Report generated: stress-test-reports/${output_file%.json}.html${NC}"
        fi
        return 0
    else
        echo -e "${RED}❌ $test_name failed${NC}"
        return 1
    fi
}

# Check prerequisites
echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

# Check if Artillery is installed
if ! command -v npx &> /dev/null || ! npx artillery --version &> /dev/null; then
    echo -e "${RED}❌ Artillery is not installed. Installing...${NC}"
    npm install
fi

# Check if services are running (optional - tests can run against different targets)
echo -e "${BLUE}🔍 Checking service availability...${NC}"
check_service "http://localhost:3000/api/health" "Express Server" || echo -e "${YELLOW}⚠️  Express server not running - some tests may fail${NC}"
check_service "http://127.0.0.1:8090/api/health" "PocketBase" || echo -e "${YELLOW}⚠️  PocketBase not running - PocketBase tests will fail${NC}"
check_service "http://localhost:5173" "Vite Dev Server" || echo -e "${YELLOW}⚠️  Vite dev server not running - frontend tests will target production build${NC}"

echo ""
echo -e "${BLUE}🎯 Starting stress test execution...${NC}"
echo ""

# Track test results
failed_tests=0
total_tests=0

# Test 1: Express Server Stress Test
if [ -f "stress-test.yml" ]; then
    total_tests=$((total_tests + 1))
    if ! run_stress_test "stress-test.yml" "Express Server Stress Test" "express-stress.json"; then
        failed_tests=$((failed_tests + 1))
    fi
    echo ""
fi

# Test 2: PocketBase Stress Test
if [ -f "pocketbase-stress-test.yml" ]; then
    total_tests=$((total_tests + 1))
    if ! run_stress_test "pocketbase-stress-test.yml" "PocketBase API Stress Test" "pocketbase-stress.json"; then
        failed_tests=$((failed_tests + 1))
    fi
    echo ""
fi

# Test 3: Frontend Stress Test
if [ -f "frontend-stress-test.yml" ]; then
    total_tests=$((total_tests + 1))
    if ! run_stress_test "frontend-stress-test.yml" "Frontend Load Test" "frontend-stress.json"; then
        failed_tests=$((failed_tests + 1))
    fi
    echo ""
fi

# Summary
echo "================================================"
echo -e "${BLUE}📋 Stress Test Summary${NC}"
echo "================================================"
echo -e "Total tests run: ${BLUE}$total_tests${NC}"
echo -e "Passed: ${GREEN}$((total_tests - failed_tests))${NC}"
echo -e "Failed: ${RED}$failed_tests${NC}"

if [ $failed_tests -eq 0 ]; then
    echo -e "${GREEN}🎉 All stress tests completed successfully!${NC}"
    echo -e "${GREEN}📊 Check stress-test-reports/ directory for detailed reports${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Check the output above for details.${NC}"
    exit 1
fi