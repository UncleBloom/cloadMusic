import React from 'react';
import Banners from './components/Banners/Banners'
import PlaylistRecommended from './components/PlaylistRecommended/PlaylistRecommended';
import "./Home.scss"

function Home() {

  return (
    <div className="Home">
      <div className="HomeMiddle">
        <div className="user">

        </div>
        <div className="finding">
          <Banners />
          <PlaylistRecommended />
        </div>
      </div>

    </div>
  )

}

export default Home;