import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import ChangeWordColor from "./ChangeWordColor";

interface ISearchSongAlbum {
  id?: number;
  publishTime?: BigInt;
  size?: number;
  name?: string;
}

interface ISearchSongArtists {
  id?: number;
  name?: string;
}

interface ISearchSong {
  album: ISearchSongAlbum;
  artists: Array<ISearchSongArtists>;
  name: string;
  id: number;
  duration: number;
  transNames?: string[];
}

interface ISearchSongsProps {
  value: string;
  type: number; //type: 搜索类型；默认为 1 即单曲 ,
  //取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
  songCount: number;
  songs: ISearchSong[];
}

function SearchSongs(props: ISearchSongsProps) {
  return (
    <div className="search-res-songs">
      <table>
        <thead>
          <th>
            <tr>
              <td></td>
              <td>音乐标题</td>
              <td>歌手</td>
              <td>专辑</td>
              <td>时长</td>
              <td>热度</td>
            </tr>
          </th>
        </thead>
        <tbody>
          {props.songs.map((song, index) => {
            return (
              <tr>
                <td className="iconfont">
                  {("0" + (index + 1)).substring(
                    ("0" + (index + 1)).length - 2
                  )}
                  <span className="like" title="喜欢">
                    &#xe670;
                  </span>
                  <span className="download">&#xe66e;</span>
                </td>
                <td className="iconfont" title={"" + song.name}>
                  <p>
                    <ChangeWordColor str={song.name} word={props.value} />
                    {song.transNames ? (
                      <small>
                        &nbsp;(&nbsp;{song.transNames}
                        &nbsp;)&nbsp;
                      </small>
                    ) : (
                      ""
                    )}
                  </p>
                </td>
                <td
                  className="iconfont"
                  title={"" + song.artists[0].name ? song.artists[0].name : ""}
                >
                  <ChangeWordColor
                    str={song.artists[0].name ? song.artists[0].name : ""}
                    word={props.value}
                  />
                </td>
                <td
                  className="iconfont"
                  title={"" + song.album.name ? song.album.name : ""}
                >
                  <ChangeWordColor
                    str={song.album.name ? song.album.name : ""}
                    word={props.value}
                  />
                </td>
                <td className="iconfont">
                  {"" +
                    ("0" + Math.floor(song.duration / 60000)).substring(
                      ("0" + Math.floor(song.duration / 60000)).length - 2
                    ) +
                    ":" +
                    (song.duration % 60)}
                </td>
                <td className="iconfont">
                  <span />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default SearchSongs;
