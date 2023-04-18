import React from 'react';

// css
import './index.scss';

// img
import img1 from '@/assets/images/home.jpg';
import img2 from '@/assets/images/left-nav-icon.png';

const HomePage = () => {
  return (
    <>
      <div className="back-white"></div>
      {/*<div className="background-photo" style={{ backgroundImage: `url(${img1})` }}>*/}
      {/* <div className="background-photo">
        <div className="home-tag-wrapper">
          <div className="home-tag-icon" style={{ backgroundImage: `url(${img2})` }}></div>
          <div className="home-tag">Criik-Blog</div>
          <div className="home-allegory">Always Be Yourself and Never Compromise to the Life</div>
        </div>
      </div> */}
    </>
  );
};

export default HomePage;
