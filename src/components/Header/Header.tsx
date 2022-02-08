import * as React from "react";
import "./Header.scss";
import Search from "./Search";

interface IHeaderParams {
  initiateSearchRequest: (content: string) => void;
}

function Header(params: IHeaderParams) {
  return (
    <div className="Header">
      <div className="HeaderLeft">
        <div className="windowController">
          <div className="closeIconContainer">
            <div className="iconfont">&#xe6d5;</div>
          </div>
          <div className="minimizeIconContainer">
            <div className="iconfont">&#xe65a;</div>
          </div>
          <div className="fullscreenIconContainer">
            <div className="iconfont">&#xe629;</div>
          </div>
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
          <div className="searchContainer">
            <Search launchRequestCallback={params.initiateSearchRequest} />
          </div>
          <div className="aboutIcons">
            <div className="settingIconContainer">
              <div className="iconfont">&#xf021b;</div>
            </div>
            <div className="mailIconContainer">
              <div className="iconfont">&#xe63e;</div>
            </div>
            <div className="themeIconContainer">
              <div className="iconfont">&#xe593;</div>
            </div>
            <div className="githubIconContainer">
              <a
                href="https://github.com/UncleBloom/cloudMusic"
                target="_blank"
              >
                <div className="iconfont">&#xe63a;</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
