# 🧠 Quiz Master - 3D Login & Email System

## 🚀 Quick Start Guide

### **Option 1: Full Email System (Recommended)**

1. **Start Email Server**
   - Double-click `start-server.bat` (Windows)
   - Or run `npm install && npm start` in terminal
   - Wait for "Server running on port 3001" message

2. **Open Quiz Master**
   - Open `index.html` in your browser
   - Look for green "Email server online" status
   - Use "Send Code to Email" for real emails!

### **Option 2: Quick Testing**

1. **Open `index.html`** directly in browser
2. **Use "Generate Test Code"** button (green)
3. **Start quizzing immediately!**

## 📧 Email Features

### ✅ **Real Email Sending**
- Beautiful HTML emails from `sinugahlot0@gmail.com`
- 6-digit verification codes
- One-click verification links
- Professional templates with gradients

### 🔒 **Security Features**
- Email validation
- Code expiration (10 minutes)
- Secure verification tokens
- Input sanitization

### 📊 **Feedback System**
- Feedback sent to `ankitx3mummy941@gmail.com`
- Includes scores, ratings, and user details
- Automatic fallback to mailto if server offline

## 🎯 **Quiz Features**

### 📚 **Question Database**
- **Easy**: 50 basic questions
- **Medium**: 50 intermediate questions  
- **Hard**: 50 advanced questions
- Questions loaded from separate text files

### 🎮 **Quiz Experience**
- 10 random questions per quiz
- 5-minute timer
- Real-time progress tracking
- Performance level assessment
- Beautiful 3D interface

### 📈 **Performance Levels**
- 🏆 **Expert** (90%+): Outstanding!
- 🥇 **Advanced** (80%+): Excellent work!
- 🥈 **Intermediate** (70%+): Good job!
- 🥉 **Beginner** (60%+): Keep practicing!
- 📚 **Needs Improvement** (<60%): Don't give up!

## 🛠️ **Server Status Indicator**

The login screen shows server status:
- 🟢 **Green**: Email server online - real emails work
- 🔴 **Red**: Email server offline - use test codes
- 🟡 **Yellow**: Checking server status

## 📱 **How to Use**

### **Login Process**
1. Enter email, username, password
2. Click "Send Code to Email" (if server online)
3. Check email for verification code
4. Enter code or click verification link
5. Login and start quizzing!

### **Alternative Login**
1. Enter email, username, password
2. Click "Generate Test Code" (always works)
3. Code auto-fills in confirmation field
4. Login immediately!

## 🔧 **Troubleshooting**

### **Email Not Sending?**
- Check if server is running (`start-server.bat`)
- Look for red server status indicator
- Use "Generate Test Code" as backup
- Check spam/junk folder

### **Server Won't Start?**
- Install Node.js from nodejs.org
- Run `npm install` first
- Check if port 3001 is available
- Try running as administrator

### **Questions Not Loading?**
- Make sure text files are in same folder
- Check browser console for errors
- Fallback questions will load automatically

## 📁 **File Structure**

```
quiz-master/
├── index.html              # Main quiz application
├── script.js               # JavaScript functionality
├── style.css               # 3D styling and animations
├── email-server.js         # Node.js email server
├── package.json            # Server dependencies
├── start-server.bat        # Windows server starter
├── easy-questions.txt      # 50 easy questions
├── medium-questions.txt    # 50 medium questions
├── hard-questions.txt      # 50 hard questions
├── test-email.html         # Email testing interface
└── README.md              # This file
```

## 🎨 **Features Highlights**

- ✨ **3D Login Interface** with floating animations
- 📧 **Real Gmail Integration** with app passwords
- 🎯 **Smart Fallback System** for offline use
- 📊 **Performance Tracking** with detailed feedback
- 🔒 **Secure Authentication** with time-limited codes
- 📱 **Responsive Design** for all devices
- 🎮 **Gamified Experience** with levels and achievements

## 📞 **Support**

- **Email**: sinugahlot0@gmail.com
- **Issues**: Check server status first
- **Testing**: Use `test-email.html` for diagnostics

---

**Ready to quiz? Start the server and open index.html!** 🎉