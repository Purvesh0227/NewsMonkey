const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Determine target based on environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  const target = isDevelopment 
    ? 'http://localhost:5000' 
    : process.env.REACT_APP_API_URL || 'https://api.example.com';

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
};
