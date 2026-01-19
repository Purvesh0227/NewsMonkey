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
      console.error('[PROXY] No URL provided');
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    const decodedUrl = decodeURIComponent(url);
    console.log('[PROXY] Requesting:', decodedUrl.split('&apiKey=')[0] + '&apiKey=***');

    const response = await fetch(decodedUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'NewsMonkey/1.0',
        'Accept': 'application/json'
      }
    });

    console.log('[PROXY] Response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('[PROXY] Error response:', error);
      return res.status(response.status).json({ 
        error: 'API returned error',
        status: response.status,
        details: error
      });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('[PROXY] Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch from News API',
      message: error.message 
    });
  }
}
