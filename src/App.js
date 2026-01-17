import './App.css';
import React, { Component } from 'react'
import Navbar from './components/Navbar';
import News from './components/News';
import Footer from './components/Footer';

export default class App extends Component {
  render() {
    return (
      <div className='app-wrapper'>
        <Navbar />
        <News />
        <Footer />
      </div>

    )
  }
}
