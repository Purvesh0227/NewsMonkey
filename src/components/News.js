import React, { Component } from 'react'
import NewsItem from './NewsItem'
import './News.css'

export class News extends Component {

  constructor(){
    super();
    this.state ={
      articles : [],
      loading  : false,
      page: 1,
      pageSize: 12,
      category: 'general',
      totalResults: 0,
      error: null,
      sortBy: 'publishedAt',
      country: 'us'
    }
  }

  componentDidMount(){
    this.fetchNews();
  }

  fetchNews = () => {
    const { page, pageSize, category, sortBy, country } = this.state;
    this.setState({ loading: true, error: null });
    
    const API_KEY = process.env.REACT_APP_NEWS_API_KEY || '941d1650e227436ba8f3d99df2acd643';
    
    let url;
    
    // Build the API URL based on country and category
    if (category === 'cricket') {
      // Cricket: Search specifically for cricket news globally
      url = `https://newsapi.org/v2/everything?q=cricket&sortBy=${sortBy}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    } else if (country === 'us') {
      // US: Use top-headlines with country and category filters
      url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&apiKey=${API_KEY}`;
    } else if (country === 'in') {
      // India: Search for news with India filter and category
      const categoryQuery = category === 'general' ? 'India' : `India ${category}`;
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(categoryQuery)}&sortBy=${sortBy}&page=${page}&pageSize=${pageSize}&language=en&apiKey=${API_KEY}`;
    } else if (country === 'world') {
      // World: Search for category news globally without country restriction
      const categoryQuery = category === 'general' ? 'news' : category;
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(categoryQuery)}&sortBy=${sortBy}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`;
    } else {
      // Default fallback
      url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&apiKey=${API_KEY}`;
    }
    
    console.log('Fetching from:', url.split('&apiKey=')[0] + '&apiKey=***');
    console.log('Country:', country, 'Category:', category);
    
    fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => {
        console.log('Response status:', response.status);
        
        if (response.status === 426) {
          throw new Error('Upgrade Required: The server requires HTTPS. Please ensure you are using a secure connection.');
        }
        
        if (response.status === 403 || response.status === 401) {
          throw new Error('API Key Error: Please check your NEWS_API_KEY configuration.');
        }
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
        
        const contentType = response.headers.get('content-type');
        
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response type: Expected JSON but got ' + contentType);
        }
        
        return response.json();
      })
      .then(data => {
        console.log('Fetched articles:', data.articles?.length || 0);
        
        if (data.status === 'error') {
          throw new Error(data.message || 'API Error');
        }
        
        if (data.articles && Array.isArray(data.articles) && data.articles.length > 0) {
          this.setState({
            articles: data.articles,
            totalResults: data.totalResults || 0,
            loading: false,
            error: null
          });
        } else {
          this.setState({ 
            articles: [],
            loading: false,
            error: 'No articles found for this selection'
          });
        }
      })
      .catch(error => {
        console.error("Error fetching news:", error);
        this.setState({ 
          articles: [],
          loading: false,
          error: error.message || 'Failed to fetch news. Please try again.'
        });
      })
  }

  handleCategoryChange = (category) => {
    this.setState({ category, page: 1, subCategory: null }, this.fetchNews);
  }

  handleCountryChange = (country) => {
    this.setState({ country, page: 1 }, this.fetchNews);
  }

  handleSortChange = (sortBy) => {
    this.setState({ sortBy, page: 1 }, this.fetchNews);
  }

  handleNextPage = () => {
    const { page, pageSize, totalResults } = this.state;
    if (page * pageSize < totalResults) {
      this.setState({ page: page + 1 }, this.fetchNews);
    }
  }

  handlePrevPage = () => {
    if (this.state.page > 1) {
      this.setState({ page: this.state.page - 1 }, this.fetchNews);
    }
  }

  render() {
    const { articles, loading, page, pageSize, totalResults, category, error, sortBy, country } = this.state;
    const categories = ['general', 'business', 'technology', 'health', 'sports', 'entertainment'];
    
    return (
      <div className='news-container'>
        {/* Header */}
        <div className='header-section'>
          <h1 className='main-title'>📰 Latest News</h1>
          <p className='subtitle'>Stay updated with the latest headlines</p>
        </div>

        {/* Country Filter */}
        <div className='country-section'>
          <div className='country-buttons'>
            <button 
              className={`country-btn ${country === 'us' ? 'active' : ''}`}
              onClick={() => this.handleCountryChange('us')}
            >
              🇺🇸 United States
            </button>
            <button 
              className={`country-btn ${country === 'in' ? 'active' : ''}`}
              onClick={() => this.handleCountryChange('in')}
            >
              🇮🇳 India
            </button>
            <button 
              className={`country-btn ${country === 'world' ? 'active' : ''}`}
              onClick={() => this.handleCountryChange('world')}
            >
              🌍 World
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className='category-section'>
          <div className='category-buttons'>
            {categories.map(cat => (
              <button 
                key={cat}
                className={`category-btn ${category === cat ? 'active' : ''}`}
                onClick={() => this.handleCategoryChange(cat)}
              >
                {cat === 'sports' ? '⚽' : cat === 'technology' ? '💻' : cat === 'business' ? '💼' : cat === 'health' ? '🏥' : cat === 'entertainment' ? '🎬' : '📰'} {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className='sort-section'>
          <label>Sort by: </label>
          <select value={sortBy} onChange={(e) => this.handleSortChange(e.target.value)} className='sort-select'>
            <option value="publishedAt">Latest</option>
            <option value="relevancy">Relevancy</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className='loading-container'>
            <div className='spinner'></div>
            <p>Loading news...</p>
          </div>
        )}

        {/* Error Message */}
        {error && !loading && (
          <div className='error-container'>
            <p className='error-message'>⚠️ {error}</p>
            <button className='retry-btn' onClick={this.fetchNews}>Try Again</button>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && articles.length > 0 && (
          <>
            <div className="articles-grid">
              {articles.map((element, index) =>(
                <div key={element.url + index} className="article-wrapper">
                  <NewsItem 
                    title={element.title} 
                    description={element.description} 
                    iurl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source ? element.source.name : 'Unknown'}
                    content={element.content}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className='pagination-section'>
              <button 
                className='pagination-btn prev-btn'
                onClick={this.handlePrevPage}
                disabled={page === 1}
              >
                ← Previous
              </button>
              <span className='page-info'>Page <strong>{page}</strong> of <strong>{Math.ceil(totalResults / pageSize)}</strong></span>
              <button 
                className='pagination-btn next-btn'
                onClick={this.handleNextPage}
                disabled={page * pageSize >= totalResults}
              >
                Next →
              </button>
            </div>
          </>
        )}

        {/* No Articles Found */}
        {!loading && articles.length === 0 && !error && (
          <div className='no-articles'>
            <p>No articles found for this category. Try another one!</p>
          </div>
        )}
      </div>
    )
  }
}

export default News
