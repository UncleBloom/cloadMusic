import * as React from "react";
import "./Head.scss";

function Header() {
  return (
    <div className="Header">
      <div className="HeaderLeft">
        <div className="windowController">
          <div className="closeIconContainer"></div>
          <div className="minimizeIconContainer"></div>
          <div className="fullscreenIconContainer"></div>
        </div>
        <div className="routerController">
          <div className="backIconContainer"></div>
          <div className="forwardIconContainer"></div>
        </div>
      </div>
      <div className="HeaderRight">
        <div className="findingPages">
          <div className="home pageItem">个性推荐</div>
          <div className="playlist pageItem">歌单</div>
          <div className="broadcasting pageItem">主播电台</div>
          <div className="rankList pageItem">排行榜</div>
          <div className="singer pageItem">歌手</div>
          <div className="latestMusic pageItem">最新音乐</div>
        </div>
        <div className="about">
          <div className="settingIconContainer"></div>
          <div className="mailIconContainer"></div>
          <div className="themeIconContainer"></div>
          <div className="githubIconContainer"></div>
        </div>
      </div>
    </div>
  );
}

export default Header;
