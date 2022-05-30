// import React, { useContext, useState } from "react";
// import ReactDOM from "react-dom";
import ChangeWordColor from "./ChangeWordColor";

interface ICreator {
  userId: number;
  nickname: string;
}

interface ISearchPlaylist {
  name: string;
  id: number;
  durationms: number;
  //   accountId?: bigint;
  //   alias: string[];
  coverImgUrl: string;
  trackCount: number;
  playCount: number;
  bookCount: number;
  creator: ICreator;
}

interface ISearchPlaylistsProps {
  value: string;
  type: number; //type: 搜索类型；默认为 1 即单曲 ,
  //取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
  playlistCount: number;
  playlists: Array<ISearchPlaylist>;
}

function SearchPlaylists(props: ISearchPlaylistsProps) {
  return (
    <div className="search-res-playlists">
      <ul>
        {props.playlists.map((playlist, index) => {
          return (
            <li className="search-res-playlist" key={index}>
              <img src={playlist.coverImgUrl}></img>
              <p>
                <a>
                  <ChangeWordColor str={playlist.name} word={props.value} />
                </a>
              </p>
              <span>
                <span className="iconfont" title="添加到播放列表">
                  &#xe664;
                </span>
                <span className="iconfont" title="收藏">
                  &#xe656;
                </span>
                <span className="iconfont" title="分享">
                  &#xe764;
                </span>
              </span>
              <p>{playlist.trackCount}首</p>
              <p>
                by&nbsp;&nbsp;
                <a>{playlist.creator ? playlist.creator.nickname : ""}</a>
              </p>
              <p>
                收藏:&nbsp;&nbsp;
                {playlist.bookCount > 100000
                  ? Math.floor(playlist.bookCount / 10000) + "万"
                  : playlist.bookCount + ""}
              </p>
              <p>
                收听:&nbsp;&nbsp;
                {playlist.playCount > 100000
                  ? Math.floor(playlist.playCount / 10000) + "万"
                  : playlist.playCount + ""}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SearchPlaylists;
