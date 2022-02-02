import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import ChangeWordColor from "./ChangeWordColor";

interface IDj {
  userId: number;
  nickname: string;
}

interface ISearchDjRadio {
  name: string;
  id: number;
  picUrl: string;
  dj: IDj;
}

interface ISearchDjRadiosProps {
  value: string;
  type: number; //type: 搜索类型；默认为 1 即单曲 ,
  //取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
  djRadiosCount: number;
  djRadios: Array<ISearchDjRadio>;
}

function SearchDjRadios(props: ISearchDjRadiosProps) {
  return (
    <div className="search-res-djRadios">
      <ul>
        {props.djRadios.map((djRadio, index) => {
          return (
            <li key={index} className="search-res-djRadio">
              <img src={djRadio.picUrl}></img>
              <p>
                <a>
                  <ChangeWordColor str={djRadio.name} word={props.value} />
                </a>
              </p>
              <p>
                by&nbsp;&nbsp;<a>{djRadio.dj.nickname}</a>
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SearchDjRadios;
