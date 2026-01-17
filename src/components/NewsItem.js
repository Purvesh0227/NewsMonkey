import React, { Component } from 'react'
import './NewsItem.css'

export class NewsItem extends Component {
  
  render() {
    let { title, description, iurl, newsUrl, author, date, source, content } = this.props;
    
    // Fallbacks for missing data
    const displayTitle = title || 'No Title Available';
    const displayDesc = description ? description.slice(0, 120) + '...' : (content ? content.slice(0, 120) + '...' : 'No description available');
    const displaySource = source || 'Unknown Source';
    const displayAuthor = author || 'Unknown Author';
    
    let displayDate = 'Unknown Date';
    if (date) {
      try {
        displayDate = new Date(date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      } catch(e) {
        displayDate = 'Unknown Date';
      }
    }
    
    const displayImage = iurl && iurl !== 'null' ? iurl : 'https://via.placeholder.com/500x300?text=No+Image';
    
    return (
      <div className='news-item-card'>
        <div className='image-wrapper'>
          <img 
            src={displayImage}
            className="news-image" 
            alt="News" 
            onError={(e) => { e.target.src = 'https://via.placeholder.com/500x300?text=No+Image'; }}
          />
          <div className='source-badge'>{displaySource}</div>
        </div>
        
        <div className='card-content'>
          <h4 className='news-title'>{displayTitle}</h4>
          <p className='news-description'>{displayDesc}</p>
          
          <div className='meta-info'>
            <span className='author'>✍️ {displayAuthor}</span>
            <span className='date'>📅 {displayDate}</span>
          </div>
          
          {newsUrl && newsUrl !== 'null' ? (
            <a 
              href={newsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="read-more-btn"
            >
              Read Full Article →
            </a>
          ) : (
            <button className="read-more-btn disabled" disabled>
              Link Not Available
            </button>
          )}
        </div>
      </div>
    )
  }
}

export default NewsItem
