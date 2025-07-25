# Deployment Guide - Naly Cleaning Services

This guide provides step-by-step instructions for deploying the Naly Cleaning Services application to production.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │────│  Express API    │────│   MongoDB       │
│   (Netlify)     │    │   (Render)      │    │   (Atlas)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

- Node.js 18+ installed locally
- Git repository set up
- MongoDB Atlas account
- Netlify account
- Render account (or alternative like Railway)

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new account or sign in
3. Create a new cluster (free tier is sufficient for development)
4. Wait for cluster to be created (5-10 minutes)

### 2. Configure Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a user with "Read and write to any database" permissions
4. Note down the username and password

### 3. Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Add `0.0.0.0/0` to allow access from anywhere (for production, restrict this)

### 4. Get Connection String

1. Go to "Clusters" and click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with your database name (e.g., `naly-cleaning`)

## 🚀 Backend Deployment (Render)

### 1. Prepare Backend for Deployment

1. Ensure your `server/package.json` has the correct start script:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

2. Create `server/.env.production` with production values:
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secure_jwt_secret_key
CLIENT_URL=https://your-netlify-app.netlify.app
```

### 2. Deploy to Render

1. Go to [Render](https://render.com) and sign up/sign in
2. Connect your GitHub repository
3. Click "New +" and select "Web Service"
4. Choose your repository and configure:
   - **Name**: `naly-cleaning-api`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Instance Type**: Free (for development)

5. Add environment variables in Render dashboard:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `CLIENT_URL`: Your frontend URL (will be added after frontend deployment)

6. Deploy the service

### 3. Verify Backend Deployment

1. Once deployed, visit your Render URL + `/health`
2. You should see: `{"success": true, "message": "Naly Cleaning Services API is running!"}`

## 🌐 Frontend Deployment (Netlify)

### 1. Prepare Frontend for Deployment

1. Update `client/.env.production`:
```env
VITE_API_URL=https://your-render-app.onrender.com/api
```

2. Ensure build script works locally:
```bash
cd client
npm run build
```

### 2. Deploy to Netlify

#### Option A: Drag and Drop (Quick)

1. Build the project locally:
```bash
cd client
npm run build
```

2. Go to [Netlify](https://netlify.com)
3. Drag and drop the `client/dist` folder to deploy

#### Option B: Git Integration (Recommended)

1. Go to Netlify and click "New site from Git"
2. Connect your GitHub repository
3. Configure build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`

4. Add environment variables:
   - `VITE_API_URL`: Your Render backend URL + `/api`

5. Deploy the site

### 3. Configure Redirects

Create `client/public/_redirects` file:
```
/*    /index.html   200
```

This ensures React Router works correctly with client-side routing.

### 4. Update Backend CORS

Update your backend's `CLIENT_URL` environment variable in Render with your Netlify URL.

## 🔧 Environment Variables Summary

### Backend (Render)
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/naly-cleaning
JWT_SECRET=your-super-secure-jwt-secret-key-at-least-32-characters
CLIENT_URL=https://your-netlify-app.netlify.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (Netlify)
```env
VITE_API_URL=https://your-render-app.onrender.com/api
```

## 🔍 Testing Deployment

### 1. Backend Health Check
```bash
curl https://your-render-app.onrender.com/health
```

### 2. Frontend Accessibility
Visit your Netlify URL and verify:
- Home page loads
- Navigation works
- Registration/login forms work
- API calls succeed

### 3. Full User Flow Test
1. Register a new account
2. Login
3. Browse services
4. Create a booking
5. View bookings in dashboard

## 📊 Monitoring and Logging

### 1. Render Monitoring
- View logs in Render dashboard
- Set up log retention
- Monitor resource usage

### 2. Error Tracking (Optional)
Consider integrating services like:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage analytics

### 3. Uptime Monitoring
Set up monitoring with services like:
- UptimeRobot
- Pingdom
- StatusCake

## 🔄 CI/CD Pipeline

The included GitHub Actions workflow (`.github/workflows/ci-cd.yml`) provides:

1. **Automated Testing**: Runs on every push/PR
2. **Security Scanning**: Checks for vulnerabilities
3. **Staging Deployment**: Auto-deploy develop branch
4. **Production Deployment**: Auto-deploy main branch
5. **Notifications**: Slack notifications for deployment status

### Setting up GitHub Secrets

Add these secrets to your GitHub repository:

```
NETLIFY_AUTH_TOKEN=your_netlify_auth_token
NETLIFY_SITE_ID=your_netlify_site_id
RENDER_DEPLOY_HOOK=your_render_deploy_webhook_url
CYPRESS_RECORD_KEY=your_cypress_record_key
SNYK_TOKEN=your_snyk_token
SLACK_WEBHOOK=your_slack_webhook_url
VITE_API_URL=https://your-render-app.onrender.com/api
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CLIENT_URL` in backend matches your frontend URL exactly
   - Check that both HTTP and HTTPS are handled correctly

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check network access settings in Atlas
   - Ensure database user has correct permissions

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in `package.json`
   - Check for environment-specific code

4. **API Calls Failing**
   - Verify `VITE_API_URL` is correct
   - Check network tab in browser dev tools
   - Ensure backend is running and accessible

### Debug Commands

```bash
# Check backend logs
curl https://your-render-app.onrender.com/health

# Test API endpoints
curl -X POST https://your-render-app.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@demo.com","password":"password123"}'

# Check frontend build
cd client && npm run build

# Test frontend locally with production API
cd client && VITE_API_URL=https://your-render-app.onrender.com/api npm run dev
```

## 🔐 Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **HTTPS**: Ensure both frontend and backend use HTTPS in production
3. **CORS**: Restrict CORS to specific domains in production
4. **Rate Limiting**: Configure appropriate rate limits
5. **Input Validation**: Ensure all inputs are validated server-side
6. **Database Security**: Use strong passwords and restrict network access

## 📈 Performance Optimization

1. **Frontend**:
   - Enable gzip compression in Netlify
   - Optimize images and assets
   - Implement code splitting
   - Use CDN for static assets

2. **Backend**:
   - Enable compression middleware
   - Implement caching where appropriate
   - Optimize database queries
   - Use connection pooling

3. **Database**:
   - Create appropriate indexes
   - Monitor query performance
   - Implement pagination for large datasets

## 🎯 Next Steps

After successful deployment:

1. Set up monitoring and alerting
2. Implement backup strategies
3. Plan for scaling (load balancers, multiple instances)
4. Set up staging environment
5. Implement feature flags for gradual rollouts
6. Set up automated security scanning
7. Plan disaster recovery procedures

## 📞 Support

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Review application logs in Render dashboard
3. Test API endpoints manually
4. Verify environment variables are set correctly
5. Check GitHub Actions workflow logs

Remember to keep your deployment documentation updated as your application evolves!