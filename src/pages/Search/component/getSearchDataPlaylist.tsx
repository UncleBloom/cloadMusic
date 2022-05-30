import axios, { AxiosResponse } from "axios";
// import { type } from "os";
// import React, { useContext, useState } from "react";
// import ReactDOM from "react-dom";

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
  type: number; //type: 搜索类型；默认为 1 即单曲 ,
  //取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
  playlistCount: number;
  playlists: Array<ISearchPlaylist>;
}

interface IResponseResultPlaylist {
  code: number;
  result: ISearchPlaylistsProps;
}
//搜索歌手返回结果的数据接口定义end

interface ISearchProps {
  host: string; // http://localhost:3001
  url: string; // 例如 /Search
  param: ISearchResProps;
}

async function getSearchDataPlaylist(
  props: ISearchProps
): Promise<IResponseResultPlaylist> {
  const data = await axios({
    method: "get",
    url: props.host + props.url,
    params: {
      keywords: props.param.keywords,
      type: props.param.type,
      limit: props.param.limit,
      offset: props.param.offset,
    },
  });
  //   console.log(data.data);

  return data.data;
}

export default getSearchDataPlaylist;
export type { ISearchPlaylistsProps };
