export default async function handler(req, res) {
  const { category = 'general', page = 1, pageSize = 12, sortBy = 'publishedAt' } = req.query;
  
  const API_KEY = process.env.NEWS_API_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'API Key not configured' });
  }

  try {
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&apiKey=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || 'API Error' });
    }
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
