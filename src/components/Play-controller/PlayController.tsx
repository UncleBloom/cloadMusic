import * as React from "react";
import axios from "axios";
import PlayBar from "../Play-bar/PlayBar";
import IPlayList, { EmptyList } from "../../api/types/playList";
import PlayPattern from "../../api/types/playPattern";
import ISongInfo, { EmptySongInfo } from "../../api/types/songInfo";
import serverHost from "../../api/serverHost";
import { message } from "antd";
import Play from "../../pages/Play/Play";

interface IPlayControllerState {
  playList: IPlayList;
  currentTime: number;
  playPause: boolean;
  playPattern: PlayPattern;
}

interface IPlayControllerProps {}

interface ISongInfoResponse {
  code: number;
  songs: ISongInfo[];
}

class PlayController extends React.Component<
  IPlayControllerProps,
  IPlayControllerState
> {
  constructor(props: IPlayControllerProps) {
    super(props);
    this.state = {
      // playList: EmptyList,
      playList: testSongList,
      currentTime: 0,
      playPause: false,
      playPattern: PlayPattern.Loop,
    };
  }

  handleSetPlay = () => {
    if (this.state.playList.playing === -1) {
      if (this.playNextSong()) {
        this.setState({ playPause: true });
      }
    } else {
      this.setState({ playPause: true });
    }
  };

  /**
   * 设置播放列表
   * @param list 歌曲信息的列表
   * @param startPlay 设置后是否立即开始播放.默认开始播放
   */
  setPlayList = (list: ISongInfo[], startPlay: boolean = true) => {
    this.setState(() => {
      return {
        playList: { playing: -1, songs: list, history: [], historyPointer: -1 },
      };
    });
    this.playNextSong();
    this.setState({ playPause: startPlay });
  };

  /**
   * 播放 playlist 中序号为 index 的歌曲
   * @param index 序号
   * @param append 追加模式?将 index 加入播放历史尾部(播放下一首/播放指定首):将播放历史队列指针前移一位(播放上一首)
   * @returns 设置成功?true:false
   */
  changePlaying = (index: number, append: boolean = true): boolean => {
    let nextPlist = this.state.playList;
    if (this.state.playList.songs.length === 0) {
      message.warning("播放队列为空", 1);
      return false;
    }
    if (index >= this.state.playList.songs.length) {
      message.warning("未知错误", 1);
      return false;
    }
    nextPlist.playing = index % this.state.playList.songs.length;
    if (this.state.playPattern === PlayPattern.Random) {
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
    this.setState(() => {
      return { playList: nextPlist, playPause: true };
    });
    return true;
  };

  /**
   * 加入一首歌曲至播放队列
   * @param id 歌曲的详情(建议)或Id
   * @param andPlay 是否在加入播放队列时开始播放
   */
  addToPlayList = async (id: number, andPlay: boolean = false) => {
    let newPlayList = this.state.playList;
    const info = (await fetchSongInfo(id)).songs[0];
    newPlayList.songs.push(info);

    if (andPlay || newPlayList.songs.length === 1) {
      this.setState(() => {
        return { playList: newPlayList };
      });
      this.changePlaying(this.state.playList.songs.length - 1);
    }
    this.setState({ playList: newPlayList });
  };

  /**
   * 根据播放模式播放下一首歌曲
   * @returns 是否成功播放下一首歌曲
   */
  playNextSong = (replayCallback: () => void = () => {}): boolean => {
    switch (this.state.playPattern) {
      case PlayPattern.Loop:
        // 列表循环
        return this.changePlaying(
          (this.state.playList.playing + 1) % this.state.playList.songs.length
        );
      case PlayPattern.Single:
        // 单曲循环
        if (this.state.playList.playing === -1) {
          return this.changePlaying(0);
        } else {
          this.replay(replayCallback);
          return true;
        }
      case PlayPattern.Random:
        // 随机播放
        return this.changePlaying(
          generateRandomNumber(
            this.state.playList.songs.length,
            this.state.playList.playing
          )
        );
    }
  };

  /**
   * 根据播放模式和播放历史(随机模式下)播放上一首歌
   * @returns 是否成功播放上一首歌曲
   */
  playLastSong = (replayCallback: () => void = () => {}): boolean => {
    switch (this.state.playPattern) {
      case PlayPattern.Loop:
        // 列表循环
        const nextPlaying: number =
          this.state.playList.playing === -1
            ? this.state.playList.songs.length - 1
            : (this.state.playList.playing -
                1 +
                this.state.playList.songs.length) %
              this.state.playList.songs.length;
        return this.changePlaying(nextPlaying, false);
      case PlayPattern.Single:
        // 单曲循环
        this.replay(replayCallback);
        return true;
      case PlayPattern.Random:
        return this.changePlaying(
          generateRandomNumber(
            this.state.playList.songs.length,
            this.state.playList.playing
          ),
          false
        );
    }
  };

  /**
   * 从播放列表中删除索引为 index 的歌曲
   * @param index 歌曲索引值
   */
  deleteSong = (index: number): void => {
    if (this.state.playList.songs.length === 1) {
      this.setState({ playList: EmptyList, playPause: false });
      return;
    }
    let nextList = this.state.playList;
    nextList.songs.splice(index, 1);
    nextList.history.forEach((value: number, i: number) => {
      if (value === index) {
        nextList.history.splice(i, 1);
        if (i <= index) {
          nextList.historyPointer--;
        }
      } else if (value > index) {
        nextList.history[index]--;
      }
    });
    if (index < nextList.playing) {
      nextList.playing--;
    }
    this.setState(() => {
      return { playList: nextList };
    });
  };

  replay = (callback: () => void) => {
    callback();
  };

  render(): React.ReactNode {
    let playingInfo =
      this.state.playList === EmptyList || this.state.playList.playing === -1
        ? EmptySongInfo
        : this.state.playList.songs[this.state.playList.playing];
    return (
      <>
        <PlayBar
          playList={this.state.playList}
          songInfo={playingInfo}
          playPause={this.state.playPause}
          pattern={this.state.playPattern}
          setPlay={this.handleSetPlay}
          setPause={() => {
            this.setState({ playPause: false });
          }}
          changePattern={() => {
            this.setState((state) => {
              return { playPattern: (state.playPattern + 1) % 3 };
            });
          }}
          fetchCurrentTime={(value: number) => {
            this.setState({ currentTime: value });
          }}
          playNextSong={this.playNextSong}
          playPreviousSong={this.playLastSong}
          changePlaying={this.changePlaying}
          deleteSong={this.deleteSong}
        />
        <Play
          song={playingInfo}
          currentTime={this.state.currentTime}
          playPause={this.state.playPause}
        />
      </>
    );
  }
}

export default PlayController;

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
  let result = Math.floor(Math.random() * (range - 1));
  if (result === index) {
    result = range - 1;
  }
  return result;
}

const testInfo: ISongInfo = {
  name: "心动",
  id: 1868874994,
  dt: 239097,
  al: {
    id: 131679303,
    name: "心动",
    picUrl:
      "https://p2.music.126.net/6qHEz6cFxbxhSIQwsEimrw==/109951166279509814.jpg",
  },
  ar: [
    {
      id: 1085047,
      name: "棱镜",
    },
  ],
};

const testSongList: IPlayList = {
  songs: [
    {
      name: "心动",
      id: 1868874994,
      dt: 239097,
      al: {
        id: 131679303,
        name: "心动",
        picUrl:
          "https://p2.music.126.net/6qHEz6cFxbxhSIQwsEimrw==/109951166279509814.jpg",
      },
      ar: [
        {
          id: 1085047,
          name: "棱镜",
        },
      ],
    },
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
  playing: 0,
  history: [],
  historyPointer: -1,
};
