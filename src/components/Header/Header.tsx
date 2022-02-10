import * as React from "react";
import "./Header.scss";
import Search from "./Search";
import { HashRouter as Router, Link } from "react-router-dom";
import { useEffect, useState } from "react";

interface IHeaderParams {
  initiateSearchRequest: (content: string) => void;
}

function Header(params: IHeaderParams) {
  const [pageIndex, setPageIndex] = useState<number>(0);

  useEffect(() => {
    const updatePage = (e: HashChangeEvent) => {
      if (!e.newURL.includes("#")) {
        setPageIndex(1);
        return;
      }
      let newHash: string = e.newURL.substring(e.newURL.indexOf("#"));
      switch (newHash) {
        case "#/":
          setPageIndex(1);
          break;
        default:
          setPageIndex(0);
          break;
      }
    };
    window.addEventListener("hashchange", updatePage, false);
    return () => {
      window.removeEventListener("hashchange", updatePage, false);
    };
  }, [pageIndex]);

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
          <div
            className="backIconContainer"
            onClick={() => {
              window.history.back();
            }}
          >
            <div className="iconfont">&#xe779;</div>
          </div>
          <div
            className="forwardIconContainer"
            onClick={() => {
              window.history.forward();
            }}
          >
            <div className="iconfont">&#xe775;</div>
          </div>
        </div>
      </div>
      <div className="HeaderRight">
        <div className="findingPages">
          <div
            className={
              pageIndex === 1 || window.location.hash === ""
                ? "currentPage"
                : "pageItem"
            }
            onClick={() => (window.location.hash = "/")}
          >
            个性推荐
          </div>
          <div
            className="pageItem"
            onClick={() => (window.location.hash = "/404")}
          >
            歌单
          </div>
          <div
            className="pageItem"
            onClick={() => (window.location.hash = "/404")}
          >
            主播电台
          </div>
          <div
            className="pageItem"
            onClick={() => (window.location.hash = "/404")}
          >
            排行榜
          </div>
          <div
            className="pageItem"
            onClick={() => (window.location.hash = "/404")}
          >
            歌手
          </div>
          <div
            className="pageItem"
            onClick={() => (window.location.hash = "/404")}
          >
            最新音乐
          </div>
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
                rel="noreferrer"
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
