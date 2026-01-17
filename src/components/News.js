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
      subCategory: null,
      totalResults: 0,
      error: null,
      searchQuery: '',
      sortBy: 'publishedAt'
    }
  }

  componentDidMount(){
    this.fetchNews();
  }

  fetchNews = () => {
    const { page, pageSize, category, searchQuery, sortBy } = this.state;
    this.setState({ loading: true, error: null });
    
    // API key
    const API_KEY = 'a324eb05787840299b2686028a94dc82';
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&apiKey=${API_KEY}`;
    
    console.log('Fetching from:', url);
    
    fetch(url)
      .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched articles:', data.articles);
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
            error: 'No articles found'
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
    const { articles, loading, page, pageSize, totalResults, category, error, sortBy } = this.state;
    const categories = ['general', 'business', 'technology', 'health', 'sports', 'entertainment'];
    
    return (
      <div className='news-container'>
        {/* Header */}
        <div className='header-section'>
          <h1 className='main-title'>📰 Latest News</h1>
          <p className='subtitle'>Stay updated with the latest headlines</p>
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
