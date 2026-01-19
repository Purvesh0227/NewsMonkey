const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Only set up proxy for local development
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    const target = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    app.use(
      '/api',
      createProxyMiddleware({
        target: target,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        },
        onError: (err, req, res) => {
          console.error('Proxy error:', err);
          res.status(426).json({ error: 'Upgrade Required or Connection Error' });
        }
      })
    );
  }
  // In production, the app makes direct HTTPS calls to newsapi.org, no proxy needed
};
