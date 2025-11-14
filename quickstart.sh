#!/bin/bash
# Quick Start Script for Cyber Fraud Support System
# This script helps set up and run both backend and frontend

set -e

echo "========================================"
echo "Cyber Fraud Support System - Quick Start"
echo "========================================"
echo ""

# Check if running from correct directory
if [ ! -d "backend" ]; then
    echo "Error: backend folder not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

if [ ! -d "frontend" ]; then
    echo "Error: frontend folder not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo "Choose an option:"
echo "1. Full Setup (backend + frontend)"
echo "2. Backend Only"
echo "3. Frontend Only"
echo "4. Start Servers (if already set up)"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "========== Setting up Backend =========="
        cd backend
        
        if [ ! -d "venv" ]; then
            echo "Creating virtual environment..."
            python3 -m venv venv
        fi
        
        source venv/bin/activate
        
        if [ ! -f ".env" ]; then
            echo "Creating .env file from template..."
            cp .env.example .env
            echo ""
            echo "⚠️  Please edit backend/.env if needed"
            echo ""
        fi
        
        echo "Installing dependencies..."
        pip install -r requirements.txt
        
        cd ..
        
        echo ""
        echo "========== Setting up Frontend =========="
        cd frontend
        
        if [ ! -d "node_modules" ]; then
            echo "Installing dependencies..."
            npm install
        fi
        
        if [ ! -f ".env" ]; then
            echo "Creating .env file from template..."
            cp .env.example .env
        fi
        
        cd ..
        
        echo ""
        echo "✓ Setup complete!"
        echo ""
        start_servers
        ;;
    
    2)
        echo ""
        echo "========== Setting up Backend =========="
        cd backend
        
        if [ ! -d "venv" ]; then
            echo "Creating virtual environment..."
            python3 -m venv venv
        fi
        
        source venv/bin/activate
        
        if [ ! -f ".env" ]; then
            cp .env.example .env
        fi
        
        echo "Installing dependencies..."
        pip install -r requirements.txt
        
        cd ..
        echo "✓ Backend setup complete!"
        ;;
    
    3)
        echo ""
        echo "========== Setting up Frontend =========="
        cd frontend
        
        if [ ! -d "node_modules" ]; then
            echo "Installing dependencies..."
            npm install
        fi
        
        if [ ! -f ".env" ]; then
            cp .env.example .env
        fi
        
        cd ..
        echo "✓ Frontend setup complete!"
        ;;
    
    4)
        start_servers
        ;;
    
    *)
        echo "Invalid choice. Please enter 1, 2, 3, or 4."
        exit 1
        ;;
esac

start_servers() {
    echo ""
    echo "========== Starting Servers =========="
    echo ""
    echo "Open TWO TERMINAL WINDOWS"
    echo ""
    echo "Terminal 1 - Backend:"
    echo "  cd backend"
    echo "  source venv/bin/activate"
    echo "  python main.py"
    echo ""
    echo "Terminal 2 - Frontend:"
    echo "  cd frontend"
    echo "  npm run dev"
    echo ""
    echo "Then open your browser to: http://localhost:3000
    echo ""
    echo "========================================"
    echo ""
}

# Make start_servers available to all cases
start_servers
