import * as React from "react";
import { useState } from "react";
import axios from "axios";
import PlayBar from "../play-bar/index";
import IPlayList, { EmptyList } from "../../api/types/playList";
import PlayPattern from "../../api/types/playPattern";
import ISongInfo, { EmptySongInfo } from "../../api/types/songInfo";
import serverHost from "../../api/serverHost";
import { message } from "antd";
import Play from "../../pages/play/index";

interface IPlayControllerState {
  songPlaying: ISongInfo;
  playList: IPlayList;
  currentTime: number;
  playPause: boolean;
  playPattern: PlayPattern;
  playListVisible: boolean;
  playingSongUrl: string;
}

interface IPlayControllerParams {}

interface ISongInfoResponse {
  code: number;
  songs: ISongInfo[];
}
interface ISongUrlResponse {
  code: number;
  data: {
    id: number;
    url: string;
  };
}

function PlayController(params: IPlayControllerParams) {
  const [playing, setPlaying] = useState<ISongInfo>(EmptySongInfo); // 歌曲信息
  const [plist, setPlist] = useState<IPlayList>(EmptyList); // 播放队列
  const [currentTime, setCurrentTime] = useState<number>(0); // 当前时间
  const [playPause, setPlayPause] = useState<boolean>(false); // 播放:暂停
  const [pattern, setPattern] = useState<PlayPattern>(PlayPattern.Loop); // 播放模式
  const [plistVisible, setPlistVisible] = useState<boolean>(false); // 是否显示播放列表
  const [url, setUrl] = useState<string>(""); // 是否显示播放列表

  /**
   * 播放 playlist 中序号为 index 的歌曲
   * @param index 序号
   * @param append 追加模式?将 index 加入播放历史尾部(播放下一首/播放指定首):将播放历史队列指针前移一位(播放上一首)
   * @returns 设置成功?true:false
   */
  const changePlaying = (index: number, append: boolean = true): boolean => {
    let nextPlist = plist;
    if (plist.songs.length === 0) {
      message.warning("播放队列为空", 1);
      return false;
    }
    nextPlist.playing = index;
    if (pattern === PlayPattern.Random) {
      // 如果是随机播放状态则加入播放历史
      if (append) {
        // 追加状态:将 index 加入播放历史队尾
        nextPlist.history.splice(nextPlist.historyPointer + 1);
        nextPlist.history.push(index);
        nextPlist.historyPointer++;
      } else {
        // 非追加状态:指针前移 1 位
        if (nextPlist.historyPointer) {
          // 指针不指向队列首位:指针自减
          nextPlist.historyPointer--;
        } else {
          // 指针指向队列首位:在队列首位增加 index ，且指针仍指向首位
          nextPlist.history.unshift(index);
        }
      }
    }
    return true;
  };

  /**
   * 播放下一首歌
   * @param replayCallback 从头播放歌曲的回调函数
   * @returns 设置成功
   */
  const playNextSong = (replayCallback: () => {}): boolean => {
    switch (pattern) {
      case PlayPattern.Loop:
        // 列表循环
        return changePlaying((plist.playing + 1) % plist.songs.length);
      case PlayPattern.Single:
        // 单曲循环
        replay(replayCallback);
        return true;
      case PlayPattern.Random:
        // 随机播放
        return changePlaying(
          generateRandomNumber(plist.songs.length, plist.playing)
        );
    }
  };

  /**
   * 播放上一首歌
   * @param replayCallback 从头播放歌曲的回调函数
   * @returns 设置成功
   */
  const playLastSong = (replayCallback: () => {}): boolean => {
    switch (pattern) {
      case PlayPattern.Loop:
        // 列表循环
        const nextPlaying: number =
          (plist.playing - 1 + plist.songs.length) % plist.songs.length;
        return changePlaying(nextPlaying, false);
      case PlayPattern.Single:
        // 单曲循环
        replay(replayCallback);
        return true;
      case PlayPattern.Random:
        return changePlaying(
          generateRandomNumber(plist.songs.length, plist.playing),
          false
        );
    }
  };

  /**
   * 添加指定歌曲至播放列表
   * @param id 歌曲 id
   * @param andPlay
   */
  const addToPlayList = async (id: number, andPlay: boolean = false) => {
    let nextPlist = plist;
    const info = (await fetchSongInfo(id)).songs[0];
    nextPlist.songs.push(info);
    if (andPlay || nextPlist.songs.length === 1) {
      nextPlist.playing = nextPlist.songs.length;
      if (pattern === PlayPattern.Random) {
        nextPlist.history.splice(nextPlist.historyPointer + 1);
        nextPlist.history.push(nextPlist.songs.length - 1);
        nextPlist.historyPointer++;
      }
    }
    setPlist(nextPlist);
  };

  const deleteSong = (index: number) => {
    let nextPlist = plist;
    nextPlist.songs.splice(index, 1);
    nextPlist.history.forEach((value: number, index: number) => {
      // TODO
    });
  };

  /**
   * 从头播放这首歌
   * @param callback 子组件从头播放歌曲的回调函数
   */
  const replay = (callback: () => {}) => {
    callback();
  };

  /**
   * 更新播放进度（子组件应当在播放进度更新时主动调用此函数）
   * @param value 当前播放进度
   */
  const renewCurrentTime = (value: number) => {
    setCurrentTime(value);
  };
}

/**
 * 从后端获得 id 对应歌曲的信息
 * @param Id  歌曲 id
 * @returns  歌曲信息
 */
const fetchSongInfo = async (Id: number): Promise<ISongInfoResponse> => {
  const data = await axios.get(serverHost + "/song/detail", {
    params: {
      ids: Id,
    },
  });
  return data.data;
};

// 从后端获得 id 对应歌曲播放 url
const fetchSongUrl = async (Id: number): Promise<ISongUrlResponse> => {
  const data = await axios.get(serverHost + "/song/url", {
    params: {
      id: Id,
    },
  });
  return data.data;
};

/**
 * 生成一个在[0,range)内的随机整数，且保证不为 index
 * @param range 范围
 * @param index (range!==1时)结果不为 index
 * @returns 随机数
 */
function generateRandomNumber(range: number, index: number) {
  if (range === 1) {
    return 1;
  }
  let result = Math.floor(Math.random() * (range - 2));
  if (result === index) {
    result = range - 1;
  }
  return result;
}

// class PlayController extends React.Component<
//   IPlayControllerProps,
//   IPlayControllerState
// > {
//   constructor(props: IPlayControllerProps) {
//     super(props);
//     this.state = {
//       songPlaying: EmptySongInfo,
//       // playList: EmptyList,
//       playList: testSongList,
//       currentTime: 0,
//       playPause: false,
//       playPattern: PlayPattern.Loop,
//       playListVisible: false,
//       playingSongUrl: "",
//     };
//   }
//   /**
//    * 获取歌曲详情
//    * @param songId 歌曲Id
//    * @returns 歌曲详情
//    */
//   getSongInfo = async (songId: number): Promise<ISongInfoResponse> => {
//     const data = await axios.get(serverHost + "/song/detail", {
//       params: {
//         ids: songId,
//       },
//     });
//     return data.data;
//   };
//   /**
//    * 获取歌曲url
//    * @param songId 歌曲Id
//    * @returns 歌曲url
//    */
//   getSongUrl = async (songId: number): Promise<ISongUrlResponse> => {
//     const data = await axios.get(serverHost + "/song/url", {
//       params: {
//         id: songId,
//       },
//     });
//     return data.data;
//   };
//   /**
//    * 设置当前播放音乐
//    * @param songInfo 歌曲信息
//    */
//   setSongPlaying = (songInfo: ISongInfo) => {
//     this.setState({ songPlaying: songInfo });
//     if (songInfo === EmptySongInfo) {
//       this.setState({ playPause: false, currentTime: 0, playingSongUrl: "" });
//     } else {
//       this.getSongUrl(songInfo.id).then((Response) => {
//         this.setState({ playingSongUrl: Response.data.url });
//       });
//     }
//   };
//   /**
//    * 改变播放模式
//    */
//   setPlayPattern = () => {
//     this.setState((state) => {
//       return { playPattern: (state.playPattern + 1) % 3 };
//     });
//   };
//   setPlay = () => {
//     if (this.state.songPlaying === EmptySongInfo) {
//       if (this.PlayNextSong()) {
//         this.setState({ playPause: true });
//       }
//     } else {
//       this.setState({ playPause: true });
//     }
//   };
//   setPause = () => {
//     this.setState({ playPause: false });
//   };
//   /**
//    * 获得当前播放时间
//    */
//   getCurrentTime: React.ReactEventHandler<HTMLAudioElement> = (event) => {
//     this.setState({ currentTime: event.currentTarget.currentTime });
//   };
//   /**
//    * 设置播放列表
//    * @param list 歌曲信息的列表
//    * @param startPlay 设置后是否立即开始播放.默认开始播放
//    */
//   setPlayList = (list: ISongInfo[], startPlay: boolean = true) => {
//     this.setState((state) => {
//       return {
//         playList: { playing: -1, songs: list, history: [], historyPointer: -1 },
//       };
//     });
//     this.PlayNextSong();
//     this.setState({ playPause: startPlay });
//   };
//   /**
//    * 加入一首歌曲至播放队列
//    * @param song 歌曲的详情(建议)或Id
//    * @param andPlay 是否在加入播放队列时开始播放
//    */
//   addToPlayList = async (
//     song: ISongInfo | number,
//     andPlay: boolean = false
//   ) => {
//     let newPlayList = this.state.playList;
//     if (typeof song === "number") {
//       let Info: ISongInfo = EmptySongInfo;
//       const Response = await this.getSongInfo(song);

//       Info = Response.songs[0];
//       newPlayList.songs.push(Info);

//       if (andPlay || newPlayList.songs.length === 1) {
//         this.setSongPlaying(newPlayList.songs[newPlayList.songs.length - 1]);
//         newPlayList.playing = newPlayList.songs.length - 1;
//       }
//       this.setState({ playList: newPlayList });
//     } else {
//       newPlayList.songs.push(song);
//       if (andPlay || newPlayList.songs.length === 1) {
//         this.setSongPlaying(newPlayList.songs[-1]);
//         newPlayList.playing = newPlayList.songs.length - 1;
//       }
//       this.setState({ playList: newPlayList });
//     }
//   };
//   /**
//    * 根据播放模式播放下一首歌曲
//    * @returns 是否成功播放下一首歌曲
//    */
//   PlayNextSong = (): boolean => {
//     if (this.state.playList.songs.length === 0) {
//       message.warning("播放列表为空", 1);
//       this.setSongPlaying(EmptySongInfo);
//       return false;
//     }
//     let nextPlayNum: number;
//     let playList: IPlayList = this.state.playList;
//     switch (this.state.playPattern) {
//       case PlayPattern.Loop:
//         // 列表循环
//         nextPlayNum = (playList.playing + 1) % playList.songs.length;
//         this.setSongPlaying(playList.songs[nextPlayNum]);
//         this.setState((state) => {
//           let newPlayList = playList;
//           newPlayList.playing = nextPlayNum;
//           return { playList: newPlayList };
//         });
//         break;
//       case PlayPattern.Random:
//         // 随机播放
//         if (playList.historyPointer === playList.history.length - 1) {
//           nextPlayNum = Math.floor(Math.random() * playList.songs.length);
//           let newPlayList = playList;
//           newPlayList.playing = nextPlayNum;
//           newPlayList.history.push(nextPlayNum);
//           newPlayList.historyPointer++;
//           this.setState((state) => {
//             return { playList: newPlayList };
//           });
//         } else {
//           nextPlayNum = playList.history[++playList.historyPointer];
//           let newPlayList = playList;
//           newPlayList.playing = nextPlayNum;
//           this.setState((state) => {
//             return { playList: newPlayList };
//           });
//         }
//         this.setSongPlaying(playList.songs[nextPlayNum]);
//         break;
//       case PlayPattern.Single:
//         // 单曲循环
//         if (playList.playing < 0 || playList.playing > playList.songs.length) {
//           nextPlayNum = 0;
//         } else {
//           nextPlayNum = playList.playing;
//         }
//         this.setSongPlaying(playList.songs[nextPlayNum]);
//         break;
//     }
//     this.setPlay();
//     return true;
//   };
//   /**
//    * 根据播放模式和播放历史(随机模式下)播放上一首歌
//    * @returns 是否成功播放上一首歌曲
//    */
//   playPreviousSong = (): boolean => {
//     if (this.state.playList.songs.length === 0) {
//       message.warning("播放列表为空", 1);
//       this.setSongPlaying(EmptySongInfo);
//       return false;
//     }
//     let nextPlayNum: number;
//     let playList: IPlayList = this.state.playList;
//     switch (this.state.playPattern) {
//       case PlayPattern.Loop:
//         // 列表循环
//         nextPlayNum =
//           playList.playing <= 0
//             ? playList.songs.length - 1
//             : playList.playing - 1;
//         this.setSongPlaying(playList.songs[nextPlayNum]);
//         this.setState((state) => {
//           let newPlayList = state.playList;
//           newPlayList.playing = nextPlayNum;
//           return { playList: newPlayList };
//         });
//         break;
//       case PlayPattern.Random:
//         // 随机播放
//         if (playList.historyPointer <= 0) {
//           nextPlayNum = Math.floor(Math.random() * playList.songs.length);
//           let newPlayList = playList;
//           newPlayList.playing = nextPlayNum;
//           newPlayList.history.unshift(nextPlayNum);
//           newPlayList.historyPointer = 0;
//           this.setState({
//             playList: newPlayList,
//           });
//         } else {
//           nextPlayNum = playList.history[--playList.historyPointer];
//           let newPlayList = playList;
//           newPlayList.playing = nextPlayNum;
//           this.setState({ playList: newPlayList });
//         }
//         this.setSongPlaying(playList.songs[nextPlayNum]);
//         break;
//       case PlayPattern.Single:
//         // 单曲循环
//         nextPlayNum = playList.playing;
//         this.setSongPlaying(playList.songs[nextPlayNum]);
//         break;
//     }
//     this.setPlay();
//     return true;
//   };

//   /**
//    * 从播放列表中删除索引为 index 的歌曲
//    * @param index 歌曲索引值
//    */
//   deleteSongFromList = (index: number): void => {
//     let nextList = this.state.playList;
//     nextList.songs.splice(index, 1);
//     nextList.history.map((value, i) => {
//       if (value === index) {
//         nextList.history.splice(i, 1);
//         nextList.historyPointer--;
//       } else if (value > index) {
//         nextList.history[index]--;
//       }
//     });
//     if (index === nextList.playing) {
//       nextList.playing = -1;
//     } else if (index > nextList.playing) {
//       nextList.playing--;
//     }
//     this.setState(() => {
//       return { playList: nextList };
//     });
//     if (this.state.playList.playing === -1) {
//       this.PlayNextSong();
//     }
//   };

//   render(): React.ReactNode {
//     return (
//       <>
//         <PlayBar
//           playList={this.state.playList}
//           songInfo={this.state.songPlaying}
//           currentTime={this.state.currentTime}
//           playPause={this.state.playPause}
//           pattern={this.state.playPattern}
//           changePattern={this.setPlayPattern}
//           setPlay={this.setPlay}
//           setPause={this.setPause}
//           getCurrentTime={this.getCurrentTime}
//           playNextSong={this.PlayNextSong}
//           playPreviousSong={this.playPreviousSong}
//           deleteSong={this.deleteSongFromList}
//         ></PlayBar>
//         <Play
//           song={this.state.songPlaying}
//           currentTime={this.state.currentTime}
//           playPause={this.state.playPause}
//         />
//       </>
//     );
//   }
// }

export default PlayController;

const testSongList: IPlayList = {
  songs: [
    {
      name: "火车驶向云外，梦安魂于九霄",
      id: 528272281,
      dt: 326414,
      al: {
        id: 37174106,
        name: "火车驶向云外，梦安魂于九霄",
        picUrl:
          "https://p1.music.126.net/VSRib9gDrSXJEq_1gTfYiw==/109951163102691938.jpg",
      },
      ar: [
        {
          id: 11238,
          name: "刺猬",
        },
      ],
    },
    {
      name: "霓虹甜心",
      id: 1329719698,
      dt: 271039,
      al: {
        id: 74632127,
        name: "劲歌热舞",
        picUrl:
          "https://p2.music.126.net/5k_BRr3vUfjJq97LQaj3jQ==/109951166583357991.jpg",
      },
      ar: [
        {
          id: 12328,
          name: "马赛克",
        },
      ],
    },
    {
      name: "生活因你而火热",
      id: 406737702,
      dt: 291186,
      al: {
        id: 34555329,
        name: "生活因你而火热",
        picUrl:
          "https://p2.music.126.net/w4J5DXSUimF5P0iDEzqy9w==/1393081236950048.jpg",
      },
      ar: [
        {
          id: 13282,
          name: "新裤子",
        },
      ],
    },
  ],
  playing: -1,
  history: [],
  historyPointer: -1,
};
