import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import ChangeWordColor from "./ChangeWordColor";

interface ISearchArtist {
  name: string;
  id: number;
  alias: string[];
  accountId?: bigint;
  picUrl?: string;
}

interface ISearchAlbum {
  name: string;
  id: number;
  alias: string[];
  picUrl?: string;
  artist: ISearchArtist;
}

interface ISearchAlbumsProps {
  value: string;
  type: number; //type: 搜索类型；默认为 1 即单曲 ,
  //取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
  albumCount: number;
  albums: Array<ISearchAlbum>;
}

function SearchAlbums(props: ISearchAlbumsProps) {
  return (
    <div className="search-res-albums">
      <ul>
        {props.albums.map((album, index) => {
          return (
            <li className="search-res-album" key={index}>
              <img src={album.picUrl}></img>
              <p>
                <ChangeWordColor str={album.name} word={props.value} />
                &nbsp;
                <ChangeWordColor
                  str={
                    album.alias.length === 0
                      ? ""
                      : " ( " + album.alias[0] + " ) "
                  }
                  word={props.value}
                />
                {/* {index} */}
              </p>
              <p>
                <ChangeWordColor str={album.artist.name} word={props.value} />
                &nbsp;
                <ChangeWordColor
                  str={
                    album.artist.alias.length === 0
                      ? ""
                      : " ( " + album.artist.alias[0] + " ) "
                  }
                  word={props.value}
                />
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SearchAlbums;
