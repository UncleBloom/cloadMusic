import IAlbumInfo from "./albumInfo";
import IArtist from "./artist";

export default interface ISongInfo {
  name: string; // 歌曲名
  id: number; // 歌曲id
  dt: number; // 歌曲时长 duration
  al: IAlbumInfo; // 专辑 album
  ar: Array<IArtist>; // 艺术家 artists
  alias?: string;
  alia?: string;
}

// 当songInfo为此值时表示当前没有播放任务
export const EmptySongInfo: ISongInfo = {
  name: " ",
  id: 0,
  dt: 0,
  al: {
    id: 0,
    name: "  ",
    picUrl: "error",
  },
  ar: [
    {
      id: 0,
      name: " ",
    },
  ],
};
