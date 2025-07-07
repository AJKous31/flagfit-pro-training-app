#!/bin/bash

# Flag Football Training App - Database Setup Script
# This script helps you set up the database schema and sample data in Supabase

echo "🚀 Flag Football Training App - Database Setup"
echo "=============================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local with your Supabase credentials:"
    echo ""
    echo "VITE_SUPABASE_URL=your_supabase_project_url"
    echo "VITE_SUPABASE_ANON_KEY=your_supabase_anon_key"
    echo "VITE_APP_NAME=FlagFit Pro"
    echo "VITE_APP_VERSION=2.0.0"
    echo "VITE_APP_ENVIRONMENT=development"
    echo ""
    echo "You can copy from env.example and update the values."
    exit 1
fi

echo "✅ .env.local found"
echo ""

# Check if database files exist
if [ ! -f "database/schema_v2.sql" ]; then
    echo "❌ database/schema_v2.sql not found!"
    exit 1
fi

if [ ! -f "database/sample_data_v2.sql" ]; then
    echo "❌ database/sample_data_v2.sql not found!"
    exit 1
fi

echo "✅ Database schema and sample data files found"
echo ""

echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. Go to your Supabase project dashboard"
echo "2. Navigate to SQL Editor"
echo "3. Run the following files in order:"
echo "   - database/schema_v2.sql"
echo "   - database/sample_data_v2.sql"
echo ""
echo "4. After running the SQL, test the connection by running:"
echo "   npm run dev"
echo ""
echo "5. Check the browser console for any connection errors"
echo ""

echo "🔧 Database Schema Overview:"
echo "============================"
echo "- Users and authentication"
echo "- Training programs and exercises"
echo "- Daily sessions and weekly templates"
echo "- Athlete progress tracking"
echo "- Wellness tracking"
echo "- Recovery routines"
echo "- Performance metrics"
echo ""

echo "📊 Sample Data Includes:"
echo "========================"
echo "- 3 training programs (Beginner, Intermediate, Advanced)"
echo "- 50+ exercises with detailed instructions"
echo "- Weekly session templates for each program"
echo "- Sample athletes and coaches"
echo "- Recovery routines and wellness data"
echo ""

echo "🎯 Ready to proceed!"
echo "Run the SQL files in Supabase SQL Editor, then test your app." 