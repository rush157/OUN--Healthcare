# Deployment Guide - Health Finder

This guide will help you deploy the Health Finder application to production.

## Prerequisites

- Node.js 18+ installed
- Supabase account
- Vercel account (recommended) or other hosting platform
- Google Cloud Console account (optional, for Maps API)

## Step 1: Database Setup

### 1.1 Create Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready

### 1.2 Set up Database Schema
1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `scripts/setup-database.sql`
3. Run the script to create tables and insert sample data

### 1.3 Get Supabase Credentials
1. Go to Settings > API in your Supabase dashboard
2. Copy the Project URL and anon public key
3. Save these for environment variables

## Step 2: Environment Configuration

### 2.1 Update Environment Variables
Create or update your `.env.local` file:

```env
# Required - Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional - Google Maps API (for enhanced maps)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Optional - OpenAI API (for enhanced chatbot)
OPENAI_API_KEY=your_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_NAME=Health Finder
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_SUPPORTED_LANGUAGES=en,hi,bn,te,mr,ta,gu,kn,ml,pa
```

### 2.2 Google Maps API Setup (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to your domain
6. Add the key to your environment variables

## Step 3: Local Testing

### 3.1 Install Dependencies
```bash
cd health-finder
npm install --legacy-peer-deps
```

### 3.2 Run Development Server
```bash
npm run dev
```

### 3.3 Test Features
- [ ] Search functionality works
- [ ] Location detection works
- [ ] Voice search works (requires HTTPS)
- [ ] Chatbot responds correctly
- [ ] Facility cards display properly
- [ ] Language switching works
- [ ] Offline mode works

## Step 4: Production Deployment

### Option A: Vercel (Recommended)

#### 4.1 Prepare for Deployment
```bash
npm run build
```

#### 4.2 Deploy to Vercel
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Configure environment variables in Vercel dashboard
5. Deploy

#### 4.3 Configure Domain (Optional)
1. Add your custom domain in Vercel dashboard
2. Update DNS settings as instructed
3. Enable HTTPS (automatic with Vercel)

### Option B: Other Platforms

#### Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Configure environment variables
4. Set up redirects for SPA routing

#### Railway
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically

#### DigitalOcean App Platform
1. Create a new app
2. Connect your repository
3. Configure build settings
4. Set environment variables

## Step 5: Post-Deployment Configuration

### 5.1 Update Supabase Settings
1. Add your production domain to allowed origins in Supabase
2. Update CORS settings if needed
3. Configure Row Level Security policies

### 5.2 Configure PWA (Optional)
1. Update `manifest.json` with your app details
2. Configure service worker for offline functionality
3. Test PWA installation on mobile devices

### 5.3 Set up Monitoring
1. Configure error tracking (Sentry, LogRocket)
2. Set up analytics (Google Analytics, Vercel Analytics)
3. Monitor performance and user experience

## Step 6: Performance Optimization

### 6.1 Image Optimization
- Use Next.js Image component for all images
- Optimize images before uploading
- Consider using a CDN for static assets

### 6.2 Code Splitting
- Implement dynamic imports for heavy components
- Use React.lazy for route-based code splitting
- Optimize bundle size

### 6.3 Caching Strategy
- Configure proper cache headers
- Implement service worker caching
- Use Supabase caching for database queries

## Step 7: Security Considerations

### 7.1 Environment Variables
- Never commit sensitive keys to version control
- Use different keys for development and production
- Regularly rotate API keys

### 7.2 API Security
- Implement rate limiting
- Validate all user inputs
- Use HTTPS everywhere

### 7.3 Database Security
- Enable Row Level Security in Supabase
- Create appropriate policies
- Regularly backup your database

## Step 8: Maintenance

### 8.1 Regular Updates
- Keep dependencies updated
- Monitor security vulnerabilities
- Update content and facility data

### 8.2 Monitoring
- Set up uptime monitoring
- Monitor error rates
- Track user feedback

### 8.3 Backup Strategy
- Regular database backups
- Code repository backups
- Environment configuration backups

## Troubleshooting

### Common Issues

#### Build Errors
- Check Node.js version compatibility
- Clear node_modules and reinstall
- Check for TypeScript errors

#### API Connection Issues
- Verify environment variables
- Check network connectivity
- Validate API keys and permissions

#### Performance Issues
- Optimize images and assets
- Implement proper caching
- Monitor bundle size

### Support Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

## Success Checklist

- [ ] Database is set up and populated
- [ ] Environment variables are configured
- [ ] Application builds successfully
- [ ] All features work in production
- [ ] HTTPS is enabled
- [ ] Performance is optimized
- [ ] Monitoring is set up
- [ ] Backup strategy is in place

---

Your Health Finder application is now ready for production! 🎉