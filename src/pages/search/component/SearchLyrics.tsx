import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import ChangeWordColor from "./ChangeWordColor";

interface IArtist {
  id: number;
  name: string;
}

interface IAlbum {
  id: number;
  name: string;
}

interface IRange {
  first: number;
  second: number;
}

interface ILyrics {
  txt: string;
  range: IRange[];
}

interface ISearchSong {
  id: number;
  name: string;
  artists: IArtist[];
  album: IAlbum;
  duration: number;
  transNames: string[];
  lyrics: ILyrics;
}

interface ISearchLyricsProps {
  value: string;
  type: number; //type: 搜索类型；默认为 1 即单曲 ,
  //取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
  songCount: number;
  songs: Array<ISearchSong>;
}

interface ILiricProps {
  index: number;
  song: ISearchSong;
  value: string;
}

function Liric(props: ILiricProps) {
  const [isFolded, setIsFolded] = useState(true);
  return (
    <li
      key={props.index}
      className={
        isFolded ? "search-res-lyric search-res-lyric-fold" : "search-res-lyric"
      }
    >
      <div className={"search-lyric-header"}>
        <div>
          <span>
            {("0" + (props.index + 1)).substring(
              ("0" + (props.index + 1)).length - 2
            )}
          </span>
          <span className="iconfont">&#xe670;</span>
          <span className="iconfont">&#xe66e;</span>
        </div>
        <div>
          <p>
            <ChangeWordColor str={props.song.name} word={props.value} />
            {props.song.transNames === undefined ? (
              <></>
            ) : (
              <span>&nbsp;(&nbsp;{props.song.transNames[0]}&nbsp;)&nbsp;</span>
            )}
          </p>
        </div>
        <div>
          <a href="#">{props.song.artists[0].name}</a>
        </div>
        <div>
          <a href="#">{props.song.album.name}</a>
        </div>
        <div>
          <p>
            {("0" + Math.floor(props.song.duration / 1000 / 60)).substring(
              ("0" + Math.floor(props.song.duration / 1000 / 60)).length - 2
            ) +
              ":" +
              (Math.floor(props.song.duration / 1000) % 60)}
          </p>
        </div>
        <div>
          <span></span>
        </div>
      </div>
      <div
        className={
          isFolded
            ? "search-lyric-body search-lyric-body-fold"
            : "search-lyric-body"
        }
      >
        <div className="search-lyric">
          {props.song.lyrics.txt
            .slice(props.song.lyrics.range[0].first)
            .split("\n")
            .map((str, index) => {
              return (
                <p>
                  <ChangeWordColor str={str} word={props.value} />
                </p>
              );
            })}
        </div>
        {isFolded ? (
          <span
            onClick={() => {
              setIsFolded(!isFolded);
            }}
          >
            展开歌词
          </span>
        ) : (
          <span
            onClick={() => {
              setIsFolded(!isFolded);
            }}
          >
            收起歌词
          </span>
        )}
        <span>复制歌词</span>
        <span
          className={isFolded ? "hide" : ""}
          onClick={() => {
            setIsFolded(!isFolded);
          }}
        >
          收起歌词
        </span>
        <span className={isFolded ? "hide" : ""}>复制歌词</span>
      </div>
    </li>
  );
}

function SearchLyrics(props: ISearchLyricsProps) {
  return (
    <div className="search-res-lyrics">
      <div className="search-res-lyrics-title">
        <div></div>
        <div>音乐标题</div>
        <div>歌手</div>
        <div>专辑</div>
        <div>时长</div>
        <div>热度</div>
      </div>
      <ul>
        {props.songs.map((song, index) => {
          return <Liric index={index} song={song} value={props.value} />;
        })}
      </ul>
    </div>
  );
}

export default SearchLyrics;
