export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { category = 'general', page = 1, pageSize = 12, sortBy = 'publishedAt', country = 'us', searchQuery = '' } = req.query;
  
  const API_KEY = process.env.NEWS_API_KEY;
  
  if (!API_KEY) {
    console.error('[API] NEWS_API_KEY not configured');
    return res.status(500).json({ 
      error: 'API Key not configured',
      status: 'error'
    });
  }

  try {
    let url;
    
    // For cricket category, use search endpoint instead of top-headlines
    if (category === 'cricket' || searchQuery) {
      const query = searchQuery || 'cricket';
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=${sortBy}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    } else if (country === 'world') {
      // For world news, search for top headlines globally
      url = `https://newsapi.org/v2/everything?q=news&sortBy=${sortBy}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    } else {
      // For other categories, use top-headlines with country
      url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&apiKey=${API_KEY}`;
    }
    
    const safeUrl = url.split('&apiKey=')[0] + '&apiKey=***';
    console.log(`[API] Requesting: ${safeUrl}`);
    console.log(`[API] Category: ${category}, Country: ${country}, Page: ${page}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'NewsMonkeyApp/1.0'
      }
    });
    
    const contentType = response.headers.get('content-type') || 'unknown';
    console.log(`[API] Response status: ${response.status}, Content-Type: ${contentType}`);
    
    // If we get HTML, it's an error response
    if (contentType.includes('text/html')) {
      const htmlText = await response.text();
      console.error('[API] Received HTML instead of JSON. Status:', response.status);
      console.error('[API] First 300 chars:', htmlText.substring(0, 300));
      
      let errorMessage = 'Failed to fetch news';
      if (response.status === 401) {
        errorMessage = 'Invalid or expired API key';
      } else if (response.status === 429) {
        errorMessage = 'API rate limit exceeded. Please try again later.';
      } else if (response.status === 400) {
        errorMessage = 'Invalid request. Please check your parameters.';
      }
      
      return res.status(response.status).json({ 
        error: errorMessage,
        status: 'error',
        statusCode: response.status,
        message: `Received ${contentType} instead of JSON`
      });
    }
    
    // Try to parse as JSON
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('[API] Failed to parse JSON:', parseError.message);
      return res.status(500).json({ 
        error: `Invalid response from NewsAPI. Unable to parse response.`,
        status: 'error',
        statusCode: response.status,
        contentType: contentType
      });
    }
    
    // Check if the API returned an error
    if (data.status === 'error') {
      console.error('[API] NewsAPI Error:', data);
      return res.status(response.status || 500).json({ 
        error: data.message || 'API Error',
        code: data.code || 'UNKNOWN_ERROR',
        status: 'error'
      });
    }
    
    if (!response.ok) {
      console.error('[API] HTTP Error:', response.status, data);
      return res.status(response.status).json({ 
        error: data.message || `HTTP Error ${response.status}`,
        status: 'error'
      });
    }
    
    if (!data.articles) {
      console.warn('[API] No articles in response');
      return res.status(200).json({ 
        articles: [],
        totalResults: 0,
        status: 'ok'
      });
    }
    
    console.log(`[API] Success: ${data.articles.length} articles returned`);
    res.status(200).json(data);
  } catch (error) {
    console.error('[API] Unexpected error:', error.message);
    console.error('[API] Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Server error: ' + error.message,
      type: error.constructor.name,
      status: 'error'
    });
  }
}
