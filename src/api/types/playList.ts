import ISongInfo from "./songInfo";

export default interface IPlayList {
  playing: number; // 正在播放歌曲在队列中的序号
  songs: Array<ISongInfo>;
  history: Array<number>; // 保存随机播放时的播放记录
  historyPointer: number;
}

export const EmptyList: IPlayList = {
  playing: -1,
  songs: [],
  history: [],
  historyPointer: -1,
};
