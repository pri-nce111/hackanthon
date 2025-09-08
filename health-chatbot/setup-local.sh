#!/bin/bash

echo "🚀 Setting up Health Chatbot for Local Development"

# Create a simple in-memory setup for demo purposes
echo "📝 Creating simplified environment setup..."

# Create a simple .env file
cat > backend/.env << EOF
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/health-chatbot
JWT_SECRET=demo-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
EOF

echo "✅ Environment configured"
echo ""
echo "🎯 To run the application:"
echo ""
echo "1. Start Frontend (Terminal 1):"
echo "   npm run dev"
echo ""
echo "2. Start Backend (Terminal 2):"
echo "   cd backend && npm run dev"
echo ""
echo "📱 Access points:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:3001"
echo "   Admin: http://localhost:5173/admin"
echo ""
echo "⚠️  Note: Some features require MongoDB and external APIs"
echo "   The chatbot will work with mock data for demonstration"