// import React, { useContext, useState } from "react";
// import ReactDOM from "react-dom";
import ChangeWordColor from "./ChangeWordColor";

interface ISearchVideo {
  title: string;
  id: number;
  durationms: number;
  //   accountId?: bigint;
  //   alias: string[];
  coverUrl: string;
  creator: { userId: number; userName: string }[];
  playTime: number;
  type: number;
}

interface ISearchVideosProps {
  value: string;
  type: number; //type: 搜索类型；默认为 1 即单曲 ,
  //取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
  videoCount: number;
  videos: Array<ISearchVideo>;
}

function SearchVideos(props: ISearchVideosProps) {
  return (
    <div className="search-res-videos">
      <ul>
        {props.videos.map((video, index) => {
          return (
            <li className="search-res-video" key={index}>
              <a href="#">
                <img src={video.coverUrl}></img>
                <span className="play-time iconfont">
                  &#xe6cf;&nbsp;&nbsp;
                  {video.playTime > 100000
                    ? Math.floor(video.playTime / 10000) + "万"
                    : video.playTime}
                </span>
                <span className="durationms">
                  {("0" + Math.floor(video.durationms / 1000 / 60)).substring(
                    ("0" + Math.floor(video.durationms / 1000 / 60)).length - 2
                  ) +
                    ":" +
                    (Math.floor(video.durationms / 1000) % 60)}
                </span>
              </a>
              <div className="video-title">
                {video.type === 0 ? (
                  <span className="icon2 video-mv-icon"></span>
                ) : (
                  <></>
                )}
                <ChangeWordColor str={video.title} word={props.value} />
              </div>
              <span className="video-creator">
                {video.type === 0 ? "" : "by " + video.creator[0].userName}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SearchVideos;
