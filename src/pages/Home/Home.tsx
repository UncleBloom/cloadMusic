import React from "react";
import Banners from "./components/Banners/Banners";
import NewSongRcmd from "./components/NewSongRcmd/NewSongRcmd";
import PlaylistRecommended from "./components/PlaylistRecommended/PlaylistRecommended";
import "./Home.scss";

function Home() {
  return (
    <div className="Home">
      <div className="user"></div>
      <div className="HomeMiddle">
        <div className="finding">
          <div className="findingItem bannerItem">
            <Banners />
          </div>
          <div className="findingItem playlistRecommendedItem">
            <div className="findingItemName playlistRecommendedItemName">
              推荐歌单
            </div>
            <PlaylistRecommended />
          </div>
          <div className="findingItem newSongRcmdItem">
            <div className="findingItemName newSongRcmdItemName">新歌推荐</div>
            <NewSongRcmd />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
