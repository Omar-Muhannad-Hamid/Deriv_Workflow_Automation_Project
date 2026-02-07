# Deployment Guide

This guide covers deploying the AI Workflow Builder to various cloud platforms.

## Prerequisites

Before deploying, ensure you have:
- [ ] Supabase project set up with database migrated
- [ ] Google Gemini API key
- [ ] Code pushed to a Git repository (GitHub, GitLab, etc.)

## Vercel (Recommended)

Vercel is the easiest deployment option for Next.js applications.

### Step 1: Import Project

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Vercel will auto-detect Next.js configuration

### Step 2: Configure Environment Variables

Add these environment variables in Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
```

### Step 3: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Your app will be live at `https://your-project.vercel.app`

### Step 4: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Railway

Railway offers simple deployment with integrated database options.

### Step 1: Create New Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init
```

### Step 2: Add Service

1. Select "Deploy from GitHub repo"
2. Choose your repository
3. Railway auto-detects Next.js

### Step 3: Environment Variables

```bash
railway variables set NEXT_PUBLIC_SUPABASE_URL=your_value
railway variables set NEXT_PUBLIC_SUPABASE_ANON_KEY=your_value
railway variables set SUPABASE_SERVICE_ROLE_KEY=your_value
railway variables set GEMINI_API_KEY=your_value
```

### Step 4: Deploy

```bash
railway up
```

Your app will be available at the generated Railway URL.

## Netlify

Netlify is another excellent option for Next.js deployments.

### Step 1: Connect Repository

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to your Git provider
4. Select repository

### Step 2: Build Settings

Netlify should auto-detect these settings:
- Build command: `npm run build`
- Publish directory: `.next`

### Step 3: Environment Variables

Add in Site Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY
```

### Step 4: Deploy

Click "Deploy site" and wait for build to complete.

## Docker Deployment

For self-hosted or container-based deployments.

### Create Dockerfile

```dockerfile
# Dockerfile (already configured for the project)
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Build and Run

```bash
# Build image
docker build -t ai-workflow-builder .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_value \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_value \
  -e SUPABASE_SERVICE_ROLE_KEY=your_value \
  -e GEMINI_API_KEY=your_value \
  ai-workflow-builder
```

### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    restart: unless-stopped
```

Run with: `docker-compose up -d`

## AWS (EC2 / Elastic Beanstalk)

### EC2 Manual Deployment

1. Launch Ubuntu EC2 instance
2. SSH into instance
3. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. Clone and setup:
```bash
git clone your-repo
cd ai-workflow-builder
npm install
npm run build
```

5. Use PM2 for process management:
```bash
sudo npm install -g pm2
pm2 start npm --name "workflow-builder" -- start
pm2 startup
pm2 save
```

6. Setup nginx reverse proxy:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Elastic Beanstalk

1. Install EB CLI:
```bash
pip install awsebcli
```

2. Initialize:
```bash
eb init -p node.js-18 ai-workflow-builder
```

3. Create environment:
```bash
eb create production
```

4. Set environment variables:
```bash
eb setenv NEXT_PUBLIC_SUPABASE_URL=your_value \
          NEXT_PUBLIC_SUPABASE_ANON_KEY=your_value \
          SUPABASE_SERVICE_ROLE_KEY=your_value \
          GEMINI_API_KEY=your_value
```

5. Deploy:
```bash
eb deploy
```

## Google Cloud Platform (Cloud Run)

### Step 1: Build Container

```bash
# Build for Cloud Run
gcloud builds submit --tag gcr.io/PROJECT_ID/ai-workflow-builder
```

### Step 2: Deploy to Cloud Run

```bash
gcloud run deploy ai-workflow-builder \
  --image gcr.io/PROJECT_ID/ai-workflow-builder \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "NEXT_PUBLIC_SUPABASE_URL=your_value,NEXT_PUBLIC_SUPABASE_ANON_KEY=your_value,SUPABASE_SERVICE_ROLE_KEY=your_value,GEMINI_API_KEY=your_value"
```

## Post-Deployment Checklist

After deploying to any platform:

- [ ] Test workflow creation via AI chat
- [ ] Verify database connection works
- [ ] Test workflow execution
- [ ] Check that n8n export works
- [ ] Monitor error logs
- [ ] Set up domain and SSL (if needed)
- [ ] Configure CORS if using custom domain
- [ ] Set up monitoring/alerts
- [ ] Configure backups for database

## Environment Variables Reference

| Variable | Description | Required | Where to Get |
|----------|-------------|----------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes | Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes | Supabase Dashboard → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes | Supabase Dashboard → API |
| `GEMINI_API_KEY` | Google Gemini API key | Yes | Google AI Studio |

## Scaling Considerations

### Database
- Monitor Supabase usage
- Upgrade plan if needed
- Consider read replicas for high traffic

### API Rate Limits
- Google Gemini has rate limits
- Implement request queuing for high volume
- Consider caching AI responses

### Performance
- Enable Next.js image optimization
- Use CDN for static assets
- Implement Redis for session/cache if needed

## Monitoring

### Recommended Tools
- Vercel Analytics (built-in for Vercel)
- Sentry for error tracking
- Google Analytics for usage tracking
- Supabase built-in analytics for database

### Key Metrics to Monitor
- API response times
- Workflow execution success rate
- Database query performance
- AI generation time
- Error rates

## Security

### Production Checklist
- [ ] Enable HTTPS
- [ ] Set up proper CORS policies
- [ ] Restrict Supabase RLS policies (currently open for demo)
- [ ] Add rate limiting to API routes
- [ ] Implement user authentication
- [ ] Sanitize AI-generated content
- [ ] Set up secrets management
- [ ] Enable security headers

## Troubleshooting

### Build Failures
- Check Node.js version matches (18+)
- Verify all dependencies are in package.json
- Check for TypeScript errors: `npm run build`

### Runtime Errors
- Check environment variables are set
- Verify database connection
- Check API key validity
- Review application logs

### Performance Issues
- Enable caching where appropriate
- Optimize database queries
- Consider serverless function timeouts
- Monitor memory usage

## Support

For deployment issues:
1. Check the logs on your platform
2. Verify all environment variables
3. Test locally first with `npm run build && npm start`
4. Review this guide's troubleshooting section
5. Check platform-specific documentation

## Updates and Maintenance

### Updating the Application
```bash
git pull origin main
npm install
npm run build
# Platform-specific deploy command
```

### Database Migrations
When schema changes, update Supabase:
1. Export new SQL from `schema/database.sql`
2. Run in Supabase SQL Editor
3. Test in development first

---

**Deployment help needed?** Open an issue on GitHub!
