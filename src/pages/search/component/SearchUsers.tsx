import axios, { AxiosResponse } from "axios";
import { type } from "os";
import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";
import ChangeWordColor from "./ChangeWordColor";

interface ISearchResProps {
  keywords: string;
  limit?: number;
  offset?: number;
  type?: number;
  //limit : 返回数量 , 默认为 30
  //offset : 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
  //type: 搜索类型；默认为 1 即单曲 ,
  //取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
}
//搜索歌手返回结果的数据接口定义start

interface ISearchUser {
  nickname: string;
  signature: string;
  userId: number;
  avatarUrl: string;
  userType: number;
  gender: number;
}

interface ISearchUsersProps {
  value: string;
  type: number; //type: 搜索类型；默认为 1 即单曲 ,
  //取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
  userprofileCount: number;
  userprofiles: Array<ISearchUser>;
}

function SearchUsers(props: ISearchUsersProps) {
  return (
    <div className="search-res-users">
      <ul>
        {props.userprofiles.map((user, index) => {
          //   console.log(user);

          return (
            <li className="search-res-user" key={index}>
              <a>
                <div>
                  <img src={user.avatarUrl}></img>
                  {user.userType === 4 ? <span></span> : <></>}
                </div>
                <p>
                  <span>
                    <ChangeWordColor str={user.nickname} word={props.value} />
                  </span>
                  {user.gender === 1 ? (
                    <span className="iconfont man">&#xe646;</span>
                  ) : (
                    <span className="iconfont woman">&#xe644;</span>
                  )}
                </p>
                <p className="user-state">
                  {user.userType === 4 ? "网易音乐人" : user.signature}
                </p>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SearchUsers;
