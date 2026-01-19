# Fix for HTTP 426 Error on Deployment

## Problem
HTTP 426 "Upgrade Required" error indicates the deployment server requires HTTPS instead of HTTP connections.

## Solution Applied

### 1. **Updated setupProxy.js**
- Changed hardcoded `http://localhost:5000` to dynamic environment-based configuration
- Development uses `http://localhost:5000`
- Production uses HTTPS with `REACT_APP_API_URL` environment variable

### 2. **Enhanced Error Handling**
- Added specific 426 error detection in News.js
- Displays user-friendly error message for upgrade issues

### 3. **Environment Configuration**

Create or update your `.env` file with:

```env
REACT_APP_NEWS_API_KEY=your_api_key_here
REACT_APP_API_URL=https://your-production-api-url.com
NEWS_API_KEY=your_api_key_here
```

### 4. **Deployment Checklist**

- [ ] Ensure your backend API uses HTTPS
- [ ] Set `REACT_APP_API_URL` to your HTTPS backend URL in production
- [ ] Verify News API endpoints are using HTTPS (already done in code)
- [ ] Test locally with `npm start` (uses localhost:5000)
- [ ] Build production with `npm run build`
- [ ] Deploy built files to your hosting platform

### 5. **For Popular Hosting Platforms**

**Vercel:**
```bash
vercel env add REACT_APP_API_URL https://your-api.com
```

**Netlify:**
Add in Site Settings → Build & Deploy → Environment:
- `REACT_APP_API_URL=https://your-api.com`

**AWS/Azure/Others:**
Add environment variables in your deployment configuration.

## Testing

1. After deployment, open browser DevTools (F12)
2. Go to Network tab
3. Check that API calls use HTTPS
4. Verify no 426 errors appear
5. Articles should load successfully

## Additional Notes

- All News API calls already use HTTPS
- The issue was with the proxy pointing to HTTP
- Make sure your backend is configured for HTTPS
- Certificate must be valid (not self-signed for production)
