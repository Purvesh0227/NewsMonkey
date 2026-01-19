export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    const decodedUrl = decodeURIComponent(url);
    console.log('[PROXY] Requesting:', decodedUrl.split('&apiKey=')[0] + '&apiKey=***');

    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'NewsMonkey/1.0'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('[PROXY] Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch from News API',
      message: error.message 
    });
  }
}
