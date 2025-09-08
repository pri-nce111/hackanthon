#!/bin/bash

# Health Chatbot Deployment Script
set -e

echo "🚀 Starting Health Chatbot Deployment..."

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp backend/.env.example .env
    echo "⚠️  Please edit .env file with your actual API keys and configuration"
    echo "   Required: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER"
fi

# Create logs directory
mkdir -p backend/logs

# Build and start services
echo "🔨 Building and starting services..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running successfully!"
    echo ""
    echo "🌐 Application URLs:"
    echo "   Frontend: http://localhost"
    echo "   Backend API: http://localhost:3001"
    echo "   Admin Dashboard: http://localhost/admin"
    echo ""
    echo "📊 Service Status:"
    docker-compose ps
    echo ""
    echo "📝 To view logs:"
    echo "   docker-compose logs -f backend"
    echo "   docker-compose logs -f frontend"
    echo ""
    echo "🛑 To stop services:"
    echo "   docker-compose down"
else
    echo "❌ Some services failed to start. Check logs:"
    docker-compose logs
    exit 1
fi