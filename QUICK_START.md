# DevSync AI Backend - Quick Start Guide

## ?? 5-Minute Setup

Follow these steps to get the backend running in 5 minutes!

### Step 1: Install Node.js

Make sure you have Node.js 18 or higher installed:

```bash
node --version  # Should be >= 18.0.0
```

If not installed, download from [nodejs.org](https://nodejs.org/)

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (~30-60 seconds)

### Step 3: Setup MongoDB

**Option A: MongoDB Atlas (Cloud - Recommended)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier M0)
4. Click "Connect" ? "Connect your application"
5. Copy the connection string

**Option B: Local MongoDB**

```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt install mongodb
sudo systemctl start mongodb

# Windows
Download from mongodb.com and install
```

### Step 4: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` file with your settings:

```env
# REQUIRED - Add your MongoDB URI
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devsync-ai

# REQUIRED - Change these secrets (use random 32+ character strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-token-secret-min-32-chars

# Optional - For AI features (can be added later)
AI_API_KEY=your-openai-api-key
```

**Quick Secret Generator:**
```bash
# Generate random secrets (Linux/Mac)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Seed Database (Optional)

```bash
node scripts/seed.js
```

This creates test users and a sample project.

### Step 6: Start the Server

```bash
npm start
```

You should see:
```
DevSync AI Backend Server running in development mode on port 5000
MongoDB Connected: cluster.mongodb.net
```

### Step 7: Test the API

```bash
# Test health endpoint
curl http://localhost:5000/health

# Should return:
{
  "success": true,
  "message": "DevSync AI Backend is running",
  "timestamp": "2025-11-01T..."
}
```

### Step 8: Login with Test Account

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice.johnson@devsync.ai",
    "password": "Password123!"
  }'
```

You'll receive a JWT token to use in subsequent requests!

---

## ?? What's Next?

### Test the API

Use the examples in `API_EXAMPLES.md`:

```bash
# Get all projects (use token from login)
curl http://localhost:5000/api/v1/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Use Postman/Insomnia

1. Import the base URL: `http://localhost:5000/api/v1`
2. Create an environment variable for the token
3. Test all endpoints

### Connect a Frontend

Your frontend can now connect to:
- Base API: `http://localhost:5000/api/v1`
- WebSocket: `http://localhost:5000`

Example frontend connection:
```javascript
// API calls
const response = await fetch('http://localhost:5000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// WebSocket connection
import io from 'socket.io-client';
const socket = io('http://localhost:5000');
socket.emit('join', userId);
socket.on('notification', (data) => {
  console.log('New notification:', data);
});
```

---

## ?? Troubleshooting

### Port 5000 already in use?

Change the port in `.env`:
```env
PORT=3000
```

### MongoDB connection failed?

- Check your MongoDB URI
- Verify network access in MongoDB Atlas (whitelist IP)
- Check database user credentials

### Module not found errors?

```bash
rm -rf node_modules package-lock.json
npm install
```

### Can't login?

- Make sure you ran `node scripts/seed.js`
- Or create a new user via `/api/v1/auth/register`

---

## ?? Learn More

- **API Documentation**: See `API_EXAMPLES.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **Full Documentation**: See `README.md`
- **Project Overview**: See `PROJECT_SUMMARY.md`

---

## ? Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] MongoDB setup (Atlas or local)
- [ ] `.env` file configured
- [ ] Database seeded (optional)
- [ ] Server running (`npm start`)
- [ ] Health check passed
- [ ] Successfully logged in

---

## ?? Success!

Your DevSync AI backend is now running! 

**Server URL**: http://localhost:5000  
**API Base**: http://localhost:5000/api/v1  
**Health Check**: http://localhost:5000/health

Start building your frontend or test the API with Postman! ??
