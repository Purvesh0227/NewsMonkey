import React, { Component } from 'react'
import './Navbar.css'

export class Navbar extends Component {
  constructor(){
    super();
    this.state = {
      showContact: false
    }
  }

  toggleContact = () => {
    this.setState({ showContact: !this.state.showContact });
  }

  closeContact = () => {
    this.setState({ showContact: false });
  }

  render() {
    return (
      <>
        <nav className="navbar-custom">
          <div className="navbar-content">
            <a className="navbar-logo" href="/">
              <span className="logo-icon">📰</span>
              <span className="logo-text">NewsMonkey</span>
            </a>
            <div className="nav-links">
              <a href="/" className="nav-link active">Home</a>
              <button onClick={this.toggleContact} className="nav-link contact-btn">Connect Me</button>
            </div>
          </div>
        </nav>

        {/* Contact Us Modal */}
        {this.state.showContact && (
          <div className='contact-modal-overlay' onClick={this.closeContact}>
            <div className='contact-modal' onClick={(e) => e.stopPropagation()}>
              <button className='close-btn' onClick={this.closeContact}>✕</button>
              <div className='contact-content'>
                <h2>🤝 Connect With Me</h2>
                <div className='contact-card'>
                  <div className='contact-item'>
                    <span className='contact-icon'>👤</span>
                    <div>
                      <h4>Name</h4>
                      <p>Purvesh Mohite</p>
                    </div>
                  </div>
                  <div className='contact-item'>
                    <span className='contact-icon'>📧</span>
                    <div>
                      <h4>Email</h4>
                      <a href="mailto:purvesh0207@gmail.com">purvesh0207@gmail.com</a>
                    </div>
                  </div>
                  <div className='contact-item'>
                    <span className='contact-icon'>📱</span>
                    <div>
                      <h4>Phone</h4>
                      <a href="tel:+919373140697">+91 9373140697</a>
                    </div>
                  </div>
                  <div className='contact-item'>
                    <span className='contact-icon'>💼</span>
                    <div>
                      <h4>LinkedIn</h4>
                      <a href="https://www.linkedin.com/in/purvesh-mohite-616818325/" target="_blank" rel="noopener noreferrer">Visit Profile →</a>
                    </div>
                  </div>
                  <div className='contact-item'>
                    <span className='contact-icon'>🐙</span>
                    <div>
                      <h4>GitHub</h4>
                      <a href="https://github.com/Purvesh0227" target="_blank" rel="noopener noreferrer">Visit Profile →</a>
                    </div>
                  </div>
                  <div className='contact-item'>
                    <span className='contact-icon'>💡</span>
                    <div>
                      <h4>About</h4>
                      <p>Building awesome web experiences with React & modern technologies!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }
}

export default Navbar
