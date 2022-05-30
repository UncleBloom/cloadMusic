// import React, { useContext, useState } from "react";
// import ReactDOM from "react-dom";
import ChangeWordColor from "./ChangeWordColor";

interface ISearchArtist {
  name: string;
  id: number;
  alias: string[];
  accountId?: bigint;
  picUrl?: string;
}

interface ISearchSingersProps {
  value: string;
  type: number; //type: 搜索类型；默认为 1 即单曲 ,
  //取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
  artistCount: number;
  artists: Array<ISearchArtist>;
}

function SearchSingers(props: ISearchSingersProps) {
  return (
    <div className="search-res-singers">
      <ul>
        {props.artists.map((artist, index) => {
          return (
            <li className="search-res-singer" key={index}>
              <img src={artist.picUrl}></img>
              <p>
                <ChangeWordColor str={artist.name} word={props.value} />
                &nbsp;
                <ChangeWordColor
                  str={
                    artist.alias.length === 0
                      ? ""
                      : " ( " + artist.alias[0] + " ) "
                  }
                  word={props.value}
                />
                {/* {index} */}
              </p>
              {artist.accountId ? (
                <span className="iconfont">&#xe6fd;</span>
              ) : (
                <></>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SearchSingers;
