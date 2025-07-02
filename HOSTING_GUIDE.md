# 🌐 HOSTING SETUP GUIDE - Capital Cargo

## 🎯 QUICK DEPLOYMENT (15 minutes)

### **What You'll Deploy:**
- ✅ **Frontend**: React app → Vercel (Free)
- ✅ **Backend**: Node.js API → Railway (Free trial, then $5/month)
- ✅ **Database**: MongoDB Atlas (Free 512MB)

### **Total Cost**: $0-5/month

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### **STEP 1: Prepare Database (2 minutes)**

1. **Login to MongoDB Atlas**: https://cloud.mongodb.com
2. **Fix IP Whitelist**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow access from anywhere" (0.0.0.0/0)
   - Click "Confirm"
   - ⏳ Wait 2-3 minutes for changes to apply

### **STEP 2: Deploy Backend (5 minutes)**

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with GitHub
3. **Create New Project** → "Deploy from GitHub repo"
4. **Select your repository** (this cargo project)
5. **Configure deployment**:
   - Root Directory: `backend`
   - Start Command: `npm start` (should auto-detect)
6. **Add Environment Variables** (click Variables tab):
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://kattelpranav333:cargo12392@cargotracking.kuvhioj.mongodb.net/cargo-capital?retryWrites=true&w=majority&appName=CargoTracking
   CORS_ORIGIN=https://your-app-name.vercel.app
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=50
   DB_NAME=cargo-capital
   ```
7. **Deploy** and copy the backend URL (e.g., `https://web-production-xyz.up.railway.app`)

### **STEP 3: Deploy Frontend (5 minutes)**

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with GitHub
3. **Import Project** → Select your repository
4. **Configure build**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Add Environment Variable**:
   ```
   VITE_API_URL=https://your-railway-backend-url.up.railway.app/api
   ```
6. **Deploy** and copy the frontend URL

### **STEP 4: Update CORS (2 minutes)**

1. **Go back to Railway** (backend)
2. **Update CORS_ORIGIN** environment variable:
   ```
   CORS_ORIGIN=https://your-vercel-frontend-url.vercel.app
   ```
3. **Redeploy** backend

### **STEP 5: Test Everything (1 minute)**

1. **Visit your frontend URL**
2. **Test tracking** with: `TRK001`, `TRK002`, `TRK003`
3. **Test admin page**: Click "Admin" in navigation
4. **Check API health**: `https://your-backend-url/api/health`

---

## 🔧 CONFIGURATION TEMPLATES

### **Railway Environment Variables:**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://kattelpranav333:cargo12392@cargotracking.kuvhioj.mongodb.net/cargo-capital?retryWrites=true&w=majority&appName=CargoTracking
CORS_ORIGIN=https://cargo-capital.vercel.app
CORS_ORIGINS=https://cargo-capital-git-main.vercel.app,https://www.cargo-capital.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50
DB_NAME=cargo-capital
```

### **Vercel Environment Variables:**
```
VITE_API_URL=https://cargo-backend-production.up.railway.app/api
```

---

## 🌍 CUSTOM DOMAIN SETUP (Optional)

### **Frontend Custom Domain (Vercel):**
1. **Buy domain** (Namecheap, GoDaddy, etc.)
2. **In Vercel**: Project Settings → Domains → Add domain
3. **Update DNS** records as instructed by Vercel
4. **Update backend CORS_ORIGIN** to your custom domain

### **Backend Custom Domain (Railway):**
1. **In Railway**: Project Settings → Custom Domain
2. **Add your subdomain** (e.g., `api.yourdomain.com`)
3. **Update DNS** CNAME record to Railway's URL
4. **Update frontend VITE_API_URL** to your custom API domain

---

## 🚨 TROUBLESHOOTING

### **❌ "Network Error" or CORS Issues**
1. Check CORS_ORIGIN matches your frontend URL exactly
2. Verify backend environment variables are set
3. Redeploy backend after changing CORS settings
4. Clear browser cache

### **❌ "Database Connection Failed"**
1. Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
2. Check MONGODB_URI connection string is correct
3. Test connection with MongoDB Compass

### **❌ Frontend Shows "Loading..." Forever**
1. Check VITE_API_URL points to correct backend
2. Test API health endpoint directly in browser
3. Check browser console for errors

### **❌ Admin Page Shows No Data**
1. Seed database: In Railway, go to Deployments → Run command: `npm run seed`
2. Or manually run seed script locally and push to Atlas

---

## 📊 MONITORING & MAINTENANCE

### **Check Health Status:**
- **Frontend**: Should load normally
- **Backend API**: `https://your-backend/api/health`
- **Database**: Admin page should show shipment data

### **Performance Monitoring:**
- **Vercel**: Built-in analytics and performance monitoring
- **Railway**: Resource usage in project dashboard
- **MongoDB Atlas**: Database performance metrics

### **Backup Strategy:**
- **Code**: Already on GitHub (auto-backup)
- **Database**: MongoDB Atlas has automatic backups
- **Environment**: Document all environment variables

---

## 💰 COST BREAKDOWN

### **Free Tier Limits:**
- **Vercel**: 100GB bandwidth/month (sufficient for most apps)
- **Railway**: $5/month after free trial credit runs out
- **MongoDB Atlas**: 512MB storage (good for thousands of shipments)

### **Scaling Costs:**
- **More backend resources**: Railway Pro ($20/month)
- **More database storage**: Atlas M2 ($9/month for 2GB)
- **CDN/Performance**: Already included with Vercel

---

## ✅ POST-DEPLOYMENT CHECKLIST

### **Essential Tests:**
1. ✅ Frontend loads at production URL
2. ✅ Tracking search works with test IDs
3. ✅ Admin panel loads and shows data
4. ✅ API health check returns success
5. ✅ No console errors in browser
6. ✅ Mobile responsiveness works
7. ✅ Contact form submissions work

### **Security Verification:**
1. ✅ HTTPS enabled (automatic with Vercel/Railway)
2. ✅ Rate limiting active (test with rapid requests)
3. ✅ CORS properly configured
4. ✅ No sensitive data in client-side code

### **Performance Check:**
1. ✅ Page load time < 3 seconds
2. ✅ API response time < 500ms
3. ✅ Images optimized and loading
4. ✅ No memory leaks or excessive API calls

---

## 🎉 READY FOR CUSTOMERS

Once all checks pass, your cargo tracking system is:
- ✅ **Live and accessible** worldwide
- ✅ **Secure and performant**
- ✅ **Ready for real customer data**
- ✅ **Scalable** for growth
- ✅ **Professional grade** for commercial use

**Deployment completed in ~15 minutes!** 🚀
