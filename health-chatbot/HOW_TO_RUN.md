# 🚀 How to Run the Health Chatbot

## 🎯 **Quick Start - Demo Mode (Recommended for Testing)**

The easiest way to see the Health Chatbot in action is to run it in demo mode with mock data.

### Step 1: Start the Frontend

```bash
# Make sure you're in the health-chatbot directory
cd /workspace/health-chatbot

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The application will start at: **http://localhost:5173**

### Step 2: Access the Application

Open your browser and visit:

- **🏠 Home Page**: http://localhost:5173
- **💬 Chatbot (Demo)**: http://localhost:5173/chat
- **📚 Learn Page**: http://localhost:5173/learn
- **⚙️ Admin Dashboard (Demo)**: http://localhost:5173/admin

---

## 🎮 **Demo Features Available**

### **Chatbot Demo** (`/chat`)
- ✅ **Multilingual Support**: Switch between Hindi and English
- ✅ **Health Queries**: Ask about fever, COVID, dengue, vaccination
- ✅ **Smart Responses**: Context-aware health guidance
- ✅ **Quick Tips**: Pre-defined health questions
- ✅ **Modern UI**: Beautiful, responsive chat interface

**Try these sample queries:**
- "I have fever"
- "मुझे बुखार है" (Hindi)
- "COVID symptoms"
- "How to prevent dengue?"
- "Vaccination schedule"
- "Emergency help"

### **Admin Dashboard Demo** (`/admin`)
- ✅ **Statistics Overview**: User metrics and conversation analytics
- ✅ **Health Query Analysis**: Most common health questions
- ✅ **Language Distribution**: Hindi vs English usage
- ✅ **Health Alerts**: View active health notifications
- ✅ **Modern Dashboard**: Professional admin interface

---

## 🔧 **Full Setup with Backend (Advanced)**

For full functionality including real API integration, database, and messaging:

### Prerequisites
- Node.js 18+ ✅ (You have v22.16.0)
- MongoDB (for database)
- Docker (optional, for containerized deployment)

### Step 1: Setup Environment
```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit with your actual API keys
nano backend/.env
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Start Backend
```bash
# Development mode
npm run dev

# Or production mode
npm run build
npm start
```

Backend will run at: **http://localhost:3001**

### Step 4: Start Frontend (in another terminal)
```bash
# Go back to main directory
cd ..

# Start frontend
npm run dev
```

---

## 🌟 **What You Can Do Right Now**

### **1. Test the Chatbot**
- Visit http://localhost:5173/chat
- Try asking health questions in English or Hindi
- Use the quick tip buttons
- See how the AI responds to different symptoms

### **2. Explore the Admin Dashboard**
- Visit http://localhost:5173/admin
- View user statistics and analytics
- See health query patterns
- Check active health alerts

### **3. Test Multilingual Features**
- Use the language switcher in the header
- Ask questions in Hindi: "मुझे बुखार है"
- See responses in your preferred language

### **4. Mobile-Friendly Design**
- Open on your phone browser
- Responsive design works on all devices
- Touch-friendly interface

---

## 📱 **Sample Conversations**

### **English Examples:**
```
You: "I have high fever and body ache"
Bot: "For fever: Rest, drink fluids, monitor temperature. See a doctor if above 102°F (39°C) or persists for 3+ days."

You: "Where can I get vaccinated?"
Bot: "Vaccination Schedule:
• Birth: BCG, Hepatitis B
• 6 weeks: DPT, Polio
• 9 months: Measles
• Adults: COVID, Influenza vaccines"
```

### **Hindi Examples:**
```
You: "मुझे बुखार है"
Bot: "बुखार के लिए: आराम करें, तरल पदार्थ लें, तापमान की निगरानी करें। यदि 102°F (39°C) से अधिक हो या 3 दिन तक रहे तो डॉक्टर से मिलें।"

You: "कोविड के लक्षण क्या हैं?"
Bot: "कोविड-19 के लक्षण: बुखार, खांसी, सांस की तकलीफ, स्वाद/गंध का चले जाना। जांच कराएं और अलग रहें।"
```

---

## 🐛 **Troubleshooting**

### **Port Already in Use**
```bash
# If port 5173 is busy, try:
npm run dev -- --port 3000
```

### **Dependencies Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **Browser Cache Issues**
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Try incognito/private mode

---

## 🎨 **Customization**

### **Change Languages**
Edit `src/i18n.ts` to add more languages or modify translations.

### **Add More Health Topics**
Edit `src/components/ChatbotDemo.tsx` to add more health responses.

### **Modify UI Theme**
Update colors and styles in the component files.

---

## 🚀 **Next Steps**

1. **✅ Start with Demo Mode** - Run `npm run dev` and explore
2. **📝 Customize Content** - Add your own health responses
3. **🔧 Setup Full Backend** - For production deployment
4. **📱 Deploy Online** - Host on Vercel, Netlify, or your server
5. **📊 Add Analytics** - Track user interactions
6. **🌍 Add Languages** - Expand to more regional languages

---

## 💡 **Tips for Best Experience**

- **Use Chrome/Firefox** for best compatibility
- **Enable JavaScript** for full functionality
- **Test on Mobile** to see responsive design
- **Try Both Languages** to see multilingual features
- **Ask Varied Questions** to test AI responses

---

## 🆘 **Need Help?**

If you encounter any issues:

1. **Check the Console**: Open browser dev tools (F12)
2. **Restart the Server**: Stop (Ctrl+C) and run `npm run dev` again
3. **Clear Cache**: Hard refresh your browser
4. **Check Dependencies**: Run `npm install` again

---

**🎉 Enjoy exploring the Health Chatbot MVP! It's designed to help communities access vital health information in their preferred language.**