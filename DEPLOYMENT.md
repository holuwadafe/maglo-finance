# Deployment Guide

## Deploying to Vercel

### Prerequisites
- GitHub account with the repository pushed
- Vercel account (free tier works)
- Appwrite instance configured

### Steps

1. **Push Code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository from the list

3. **Configure Environment Variables**
   In Vercel project settings, add these environment variables:
   ```
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
   NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID=your_invoices_collection_id
   NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your project
   - You'll get a URL like `your-app.vercel.app`

5. **Configure Appwrite for Production**
   - In your Appwrite project, go to Settings
   - Add your Vercel domain to the allowed platforms
   - Format: `your-app.vercel.app`

### Automatic Deployments
Vercel automatically deploys on every push to your main branch.

---

## Deploying to Netlify

### Steps

1. **Push Code to GitHub** (same as Vercel)

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Select Next.js as the framework

4. **Configure Environment Variables**
   In Netlify site settings → Environment variables, add:
   ```
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
   NEXT_PUBLIC_APPWRITE_INVOICES_COLLECTION_ID=your_invoices_collection_id
   NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id
   ```

5. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your project

6. **Configure Appwrite for Production**
   - Add your Netlify domain to allowed platforms in Appwrite

---

## Post-Deployment Checklist

- [ ] Test login/signup functionality
- [ ] Test creating an invoice
- [ ] Test editing an invoice
- [ ] Test deleting an invoice
- [ ] Test marking invoices as paid/unpaid
- [ ] Verify VAT calculations are correct
- [ ] Test responsive design on mobile
- [ ] Check dashboard charts render correctly
- [ ] Verify all environment variables are set
- [ ] Test with multiple users (data isolation)

---

## Troubleshooting

### Build Failures
- Check Node.js version (should be 18+)
- Clear cache and rebuild
- Verify all dependencies are in package.json

### Appwrite Connection Errors
- Verify environment variables are correct
- Check Appwrite platform settings include your domain
- Ensure Appwrite instance is accessible

### Authentication Issues
- Verify Appwrite Auth is enabled
- Check CORS settings in Appwrite
- Ensure domain is whitelisted in Appwrite

---

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate to be issued

### Netlify
1. Go to Site Settings → Domain management
2. Add custom domain
3. Update DNS records
4. SSL certificate is auto-provisioned

---

## Monitoring

### Vercel
- Built-in analytics available
- Error tracking in deployment logs
- Performance monitoring in dashboard

### Netlify
- Analytics available in higher tiers
- Deploy logs for debugging
- Form submissions tracking

---

## Continuous Deployment

Both platforms support:
- Automatic deployments on git push
- Preview deployments for pull requests
- Rollback to previous deployments
- Environment-specific deployments (staging/production)

---

## Performance Optimization

### Before Deployment
- Run `npm run build` locally to check for errors
- Optimize images in `/public` folder
- Enable Next.js Image Optimization
- Review bundle size with `npm run build`

### After Deployment
- Enable caching headers
- Use CDN for static assets
- Monitor Core Web Vitals
- Set up error tracking (Sentry, LogRocket)

---

## Security Checklist

- [ ] Never commit `.env.local` to git
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (automatic on Vercel/Netlify)
- [ ] Configure proper CORS in Appwrite
- [ ] Set up rate limiting in Appwrite
- [ ] Review Appwrite permissions
- [ ] Enable 2FA on Vercel/Netlify account

---

## Support

For deployment issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- Appwrite: [appwrite.io/docs](https://appwrite.io/docs)
