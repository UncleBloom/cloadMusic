import axios, { AxiosResponse } from "axios";
import { type } from "os";
import React, { useContext, useState } from "react";
import ReactDOM from "react-dom";

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
//搜索单曲返回结果的数据接口定义start
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
  type: number; //type: 搜索类型；默认为 1 即单曲 ,
  //取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
  songCount: number;
  songs: Array<ISearchSong>;
}

interface IResponseResultSong {
  code: number;
  result: ISearchSongsProps;
}
//搜索单曲返回结果的数据接口定义end

interface ISearchProps {
  host: string; // http://localhost:3001
  url: string; // 例如 /search
  param: ISearchResProps;
}

async function getSearchDataSong(
  props: ISearchProps
): Promise<IResponseResultSong> {
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
  return data.data;
}

export default getSearchDataSong;
export type { ISearchSongsProps };
