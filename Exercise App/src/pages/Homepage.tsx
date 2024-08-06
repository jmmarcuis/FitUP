import React, { Component } from 'react';
import "./Homepage.scss";
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default class Homepage extends Component {
  render() {
    return (
      <div className="homepage">
        <Header />
        <div className="homepage__content">
          Insert Content Here:
        </div>
        <Footer />
      </div>
    );
  }
}
