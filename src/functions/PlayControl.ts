// import ISongInfo, { EmptySongInfo } from "../api/types/songInfo";
// import { message } from "antd";
// import axios from "axios";
// import serverHost from "../api/serverHost";
//
// interface ISongInfoResponse {
//   code: number;
//   songs: ISongInfo[];
// }
//
// /**
//  * 加入一首歌曲至播放队列
//  * @param id 歌曲的Id
//  * @param prevList 原播放列表
//  * @returns 新的播放队列
//  */
// // function addToSongList(id: number, prevList: ISongInfo[]): ISongInfo[] {
// //   if (prevList.length !== 0 && prevList.map((value) => value.id).includes(id)) {
// //     // 如果播放队列中已有该歌曲，则不加入
// //     message.warning("播放队列中已有当前歌曲", 1);
// //     return prevList;
// //   }
// //   let nextList = prevList;
// //   let info: ISongInfo = EmptySongInfo;
// //
// //   fetchSongInfo(id).then((Response) => {
// //     info = Response.songs[0];
// //     nextList.push(info);
// //   });
// //
// //   if (info === EmptySongInfo) {
// //     console.log("EmptySongInfo");
// //   }
// //
// //   return nextList;
// // }
// async function addToSongList(
//   id: number,
//   prevList: ISongInfo[]
// ): Promise<ISongInfo[]> {
//   if (prevList.length !== 0 && prevList.map((value) => value.id).includes(id)) {
//     // 如果播放队列中已有该歌曲，则不加入
//     message.warning("播放队列中已有当前歌曲", 1);
//     return prevList;
//   }
//   let nextList = prevList;
//   let info: ISongInfo = (await fetchSongInfo(id)).songs[0];
//   nextList.push(info);
//   return nextList;
// }
//
// function changePlaying(index: number, prevHistory: number[]): ISongInfo {}
//
// /**
//  * 从后端获得 id 对应歌曲的信息
//  * @param Id  歌曲 id
//  * @returns  歌曲信息
//  */
// const fetchSongInfo = async (Id: number): Promise<ISongInfoResponse> => {
//   const data = await axios.get(serverHost + "/song/detail", {
//     params: {
//       ids: Id,
//     },
//   });
//   return data.data;
// };
