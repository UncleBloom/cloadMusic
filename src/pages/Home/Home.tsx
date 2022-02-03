import React from 'react';
import Banners from './components/Banners/Banners'
import "./Home.scss"

function Home() {

  return (
    <div className="Home">
      <div className="HomeMiddle">
        <div className="user">

        </div>
        <div className="finding">
          <Banners/>
        </div>
      </div>

    </div>
  )

}

export default Home;