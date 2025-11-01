# DevSync AI - Deployment Guide

## Prerequisites

- Node.js >= 18.0.0
- MongoDB Atlas account (or MongoDB instance)
- npm or yarn package manager

## Local Development Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd devsync-ai-backend
npm install
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Required configurations
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devsync-ai
JWT_SECRET=your-secret-key-min-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-key

# Optional but recommended
AI_API_KEY=your-openai-api-key
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### 3. Start Development Server

```bash
# With auto-reload
npm run dev

# Standard start
npm start
```

The server will be available at `http://localhost:5000`

## MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (Free tier available)
3. Create database user with password
4. Whitelist IP address (0.0.0.0/0 for development)
5. Get connection string and add to `.env`

## Production Deployment

### Option 1: Deploy to Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login and Create App**
```bash
heroku login
heroku create devsync-ai-backend
```

3. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set JWT_REFRESH_SECRET=your-refresh-secret
# Add other environment variables
```

4. **Deploy**
```bash
git push heroku main
```

5. **Scale Dynos**
```bash
heroku ps:scale web=1
```

### Option 2: Deploy to AWS EC2

1. **Launch EC2 Instance**
   - Choose Ubuntu 22.04 LTS
   - t2.micro or larger
   - Configure security group (ports 22, 80, 443, 5000)

2. **Connect and Setup**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone <repository-url>
cd devsync-ai-backend
npm install
```

3. **Configure Environment**
```bash
nano .env
# Add your production configuration
```

4. **Start with PM2**
```bash
pm2 start server.js --name devsync-ai
pm2 save
pm2 startup
```

5. **Configure Nginx (Optional)**
```bash
sudo apt install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/devsync-ai
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/devsync-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 3: Deploy to DigitalOcean

1. **Create Droplet**
   - Ubuntu 22.04
   - Basic plan ($6/month or higher)
   - Add SSH key

2. **Follow Similar Steps as EC2**
   - Install Node.js, PM2
   - Clone repository
   - Configure environment
   - Start with PM2

### Option 4: Deploy to Railway

1. **Sign up at [Railway.app](https://railway.app)**

2. **Create New Project**
   - Connect GitHub repository
   - Railway auto-detects Node.js

3. **Add Environment Variables**
   - Add all variables from `.env.example`

4. **Deploy**
   - Railway automatically deploys on git push

### Option 5: Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
    restart: unless-stopped

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    restart: unless-stopped

volumes:
  mongo-data:
```

Build and run:
```bash
docker-compose up -d
```

## SSL/HTTPS Setup

### Using Certbot (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
sudo certbot renew --dry-run
```

## Monitoring

### PM2 Monitoring

```bash
# View logs
pm2 logs devsync-ai

# Monitor resources
pm2 monit

# View status
pm2 status
```

### Application Logs

Logs are stored in `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled rejections

## Backup Strategy

### Database Backup

```bash
# Export MongoDB database
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/devsync-ai" --out=/backup/$(date +%Y%m%d)

# Restore database
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/devsync-ai" /backup/20251101
```

### Automated Backups

Add to crontab:
```bash
0 2 * * * /usr/bin/mongodump --uri="$MONGODB_URI" --out=/backups/$(date +\%Y\%m\%d)
```

## Performance Optimization

1. **Enable Compression** - Already configured in server.js
2. **Use Redis for Caching** - Optional but recommended
3. **Enable Clustering** - For multi-core systems
4. **Configure MongoDB Indexes** - Already defined in models
5. **Use CDN for Static Assets** - For uploads directory

## Security Checklist

- [x] Environment variables secured
- [x] CORS configured
- [x] Helmet.js security headers
- [x] Rate limiting enabled
- [x] JWT authentication
- [x] Password hashing with bcrypt
- [x] Input validation
- [ ] Enable HTTPS in production
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Database access restrictions

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

### MongoDB Connection Issues
- Check MongoDB URI format
- Verify network access in MongoDB Atlas
- Check firewall rules
- Verify database user credentials

### Memory Issues
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 server.js
```

## Scaling

### Horizontal Scaling
- Use load balancer (nginx, HAProxy)
- Deploy multiple instances
- Share session data (Redis)

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Enable caching

## Health Checks

```bash
# Check server health
curl http://localhost:5000/health

# Response should be:
{
  "success": true,
  "message": "DevSync AI Backend is running",
  "timestamp": "2025-11-01T12:00:00.000Z",
  "environment": "production"
}
```
