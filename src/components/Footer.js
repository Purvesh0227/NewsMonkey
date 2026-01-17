import React, { Component } from 'react'
import './Footer.css'

export class Footer extends Component {
  render() {
    const currentYear = new Date().getFullYear();
    
    return (
      <footer className='footer'>
        <div className='footer-content'>
          <div className='footer-section'>
            <h4>📰 NewsMonkey</h4>
            <p>Your daily news companion. Get the latest headlines instantly!</p>
          </div>
          
          <div className='footer-section'>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>

          <div className='footer-section'>
            <h4>Categories</h4>
            <ul>
              <li><a href="#general">General</a></li>
              <li><a href="#sports">Sports</a></li>
              <li><a href="#technology">Technology</a></li>
              <li><a href="#business">Business</a></li>
            </ul>
          </div>

          <div className='footer-section'>
            <h4>Get In Touch</h4>
            <p>Email: <a href="mailto:purvesh0207@gmail.com">purvesh0207@gmail.com</a></p>
            <p>Phone: <a href="tel:+919373140697">+91 9373140697</a></p>
          </div>
        </div>

        <div className='footer-bottom'>
          <p>&copy; {currentYear} <strong>NewsMonkey</strong> • Created by <strong>Purvesh Mohite</strong> • All Rights Reserved</p>
          <p className='footer-thanks'>Made with ❤️ for News Enthusiasts</p>
        </div>
      </footer>
    )
  }
}

export default Footer
