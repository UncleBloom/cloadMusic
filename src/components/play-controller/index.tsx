import * as React from "react";
import axios from "axios";
import PlayBar from "../play-bar/index";
import IPlayList, { EmptyList } from "../../api/types/playList";
import PlayPattern from "../../api/types/playPattern";
import ISongInfo, { EmptySongInfo } from "../../api/types/songInfo";
import serverHost from "../../api/serverHost";
import { message } from "antd";
import Play from "../../pages/play/index";

interface IPlayControllerState {
  songPlaying: ISongInfo; //歌曲信息
  playList: IPlayList; //播放队列
  currentTime: number; //当前时间
  playPause: boolean; //播放:暂停
  playPattern: PlayPattern; //播放模式
  playListVisible: boolean; //是否显示播放列表
  playingSongUrl: string;
}

interface IPlayControllerProps {}

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

class PlayController extends React.Component<
  IPlayControllerProps,
  IPlayControllerState
> {
  constructor(props: IPlayControllerProps) {
    super(props);
    this.state = {
      songPlaying: EmptySongInfo,
      // playList: EmptyList,
      playList: testSongList,
      currentTime: 0,
      playPause: false,
      playPattern: PlayPattern.Loop,
      playListVisible: false,
      playingSongUrl: "",
    };
  }
  /**
   * 获取歌曲详情
   * @param songId 歌曲Id
   * @returns 歌曲详情
   */
  getSongInfo = async (songId: number): Promise<ISongInfoResponse> => {
    const data = await axios.get(serverHost + "/song/detail", {
      params: {
        ids: songId,
      },
    });
    return data.data;
  };
  /**
   * 获取歌曲url
   * @param songId 歌曲Id
   * @returns 歌曲url
   */
  getSongUrl = async (songId: number): Promise<ISongUrlResponse> => {
    const data = await axios.get(serverHost + "/song/url", {
      params: {
        id: songId,
      },
    });
    return data.data;
  };
  /**
   * 设置当前播放音乐
   * @param songInfo 歌曲信息
   */
  setSongPlaying = (songInfo: ISongInfo) => {
    this.setState({ songPlaying: songInfo });
    if (songInfo === EmptySongInfo) {
      this.setState({ playPause: false, currentTime: 0, playingSongUrl: "" });
    } else {
      this.getSongUrl(songInfo.id).then((Response) => {
        this.setState({ playingSongUrl: Response.data.url });
      });
    }
  };
  /**
   * 改变播放模式
   */
  setPlayPattern = () => {
    this.setState((state) => {
      return { playPattern: (state.playPattern + 1) % 3 };
    });
  };
  setPlay = () => {
    if (this.state.songPlaying === EmptySongInfo) {
      if (this.PlayNextSong()) {
        this.setState({ playPause: true });
      }
    } else {
      this.setState({ playPause: true });
    }
  };
  setPause = () => {
    this.setState({ playPause: false });
  };
  /**
   * 获得当前播放时间
   */
  getCurrentTime: React.ReactEventHandler<HTMLAudioElement> = (event) => {
    this.setState({ currentTime: event.currentTarget.currentTime });
  };
  /**
   * 设置播放列表
   * @param list 歌曲信息的列表
   * @param startPlay 设置后是否立即开始播放.默认开始播放
   */
  setPlayList = (list: ISongInfo[], startPlay: boolean = true) => {
    this.setState((state) => {
      return {
        playList: { playing: -1, songs: list, history: [], historyPointer: -1 },
      };
    });
    this.PlayNextSong();
    this.setState({ playPause: startPlay });
  };
  /**
   * 加入一首歌曲至播放队列
   * @param song 歌曲的详情(建议)或Id
   * @param andPlay 是否在加入播放队列时开始播放
   */
  addToPlayList = async (
    song: ISongInfo | number,
    andPlay: boolean = false
  ) => {
    let newPlayList = this.state.playList;
    if (typeof song === "number") {
      let Info: ISongInfo = EmptySongInfo;
      const Response = await this.getSongInfo(song);

      Info = Response.songs[0];
      newPlayList.songs.push(Info);

      if (andPlay || newPlayList.songs.length === 1) {
        this.setSongPlaying(newPlayList.songs[newPlayList.songs.length - 1]);
        newPlayList.playing = newPlayList.songs.length-1;
      }
      this.setState({ playList: newPlayList });
    } else {
      newPlayList.songs.push(song);
      if (andPlay || newPlayList.songs.length === 1) {
        this.setSongPlaying(newPlayList.songs[-1]);
        newPlayList.playing = newPlayList.songs.length-1;
      }
      this.setState({ playList: newPlayList });
    }
  };
  /**
   * 根据播放模式播放下一首歌曲
   * @returns 是否成功播放下一首歌曲
   */
  PlayNextSong = (): boolean => {
    if (this.state.playList.songs.length === 0) {
      message.warning("播放列表为空", 1);
      this.setSongPlaying(EmptySongInfo);
      return false;
    }
    let nextPlayNum: number;
    let playList: IPlayList = this.state.playList;
    switch (this.state.playPattern) {
      case PlayPattern.Loop:
        // 列表循环
        nextPlayNum = (playList.playing + 1) % playList.songs.length;
        this.setSongPlaying(playList.songs[nextPlayNum]);
        this.setState((state) => {
          let newPlayList = state.playList;
          newPlayList.playing = nextPlayNum;
          return { playList: newPlayList };
        });
        break;
      case PlayPattern.Random:
        // 随机播放
        if (playList.historyPointer === playList.history.length - 1) {
          nextPlayNum = Math.floor(Math.random() * playList.songs.length);
          let newPlayList = playList;
          newPlayList.playing = nextPlayNum;
          newPlayList.history.push(nextPlayNum);
          newPlayList.historyPointer++;
          this.setState({ playList: newPlayList });
        } else {
          nextPlayNum = playList.history[++playList.historyPointer];
          let newPlayList = playList;
          newPlayList.playing = nextPlayNum;
          this.setState({ playList: newPlayList });
        }
        this.setSongPlaying(playList.songs[nextPlayNum]);
        break;
      case PlayPattern.Single:
        // 单曲循环
        if (playList.playing < 0 || playList.playing > playList.songs.length) {
          nextPlayNum = 0;
        } else {
          nextPlayNum = playList.playing;
        }
        this.setSongPlaying(playList.songs[nextPlayNum]);
        break;
    }
    return true;
  };
  /**
   * 根据播放模式和播放历史(随机模式下)播放上一首歌
   * @returns 是否成功播放上一首歌曲
   */
  playPreviousSong = (): boolean => {
    if (this.state.playList.songs.length === 0) {
      message.warning("播放列表为空", 1);
      return false;
    }
    let nextPlayNum: number;
    let playList: IPlayList = this.state.playList;
    switch (this.state.playPattern) {
      case PlayPattern.Loop:
        // 列表循环
        nextPlayNum =
          playList.playing <= 0
            ? playList.songs.length - 1
            : playList.playing - 1;
        this.setSongPlaying(playList.songs[nextPlayNum]);
        this.setState((state) => {
          let newPlayList = state.playList;
          newPlayList.playing = nextPlayNum;
          return { playList: newPlayList };
        });
        break;
      case PlayPattern.Random:
        // 随机播放
        if (playList.historyPointer <= 0) {
          nextPlayNum = Math.floor(Math.random() * playList.songs.length);
          let newPlayList = playList;
          newPlayList.playing = nextPlayNum;
          newPlayList.history.unshift(nextPlayNum);
          newPlayList.historyPointer = 0;
          this.setState({
            playList: newPlayList,
          });
        } else {
          nextPlayNum = playList.history[--playList.historyPointer];
          let newPlayList = playList;
          newPlayList.playing = nextPlayNum;
          this.setState({ playList: newPlayList });
        }
        this.setSongPlaying(playList.songs[nextPlayNum]);
        break;
      case PlayPattern.Single:
        // 单曲循环
        nextPlayNum = playList.playing;
        this.setSongPlaying(playList.songs[nextPlayNum]);
        break;
    }
    return true;
  };
  /**
   * 从播放列表中删除索引为 index 的歌曲
   * @param index 歌曲索引值
   */
  deleteSongFromList = (index: number): void => {
    let nextList = this.state.playList;
    nextList.songs.splice(index, 1);
    nextList.history.map((value, i) => {
      if (value === index) {
        nextList.history.splice(i, 1);
        nextList.historyPointer--;
      } else if (value > index) {
        nextList.history[index]--;
      }
    });
    if (index === nextList.playing) {
      nextList.playing = -1;
    } else if (index > nextList.playing) {
      nextList.playing--;
    }
    this.setState(() => {
      return { playList: nextList };
    });
    if (this.state.playList.playing === -1) {
      this.PlayNextSong();
    }
  };

  render(): React.ReactNode {
    return (
      <>
        <PlayBar
          playList={this.state.playList}
          songInfo={this.state.songPlaying}
          currentTime={this.state.currentTime}
          playPause={this.state.playPause}
          pattern={this.state.playPattern}
          changePattern={this.setPlayPattern}
          setPlay={this.setPlay}
          setPause={this.setPause}
          getCurrentTime={this.getCurrentTime}
          playNextSong={this.PlayNextSong}
          playPreviousSong={this.playPreviousSong}
          deleteSong={this.deleteSongFromList}
        ></PlayBar>
        <Play
          song={this.state.songPlaying}
          currentTime={this.state.currentTime}
          playPause={this.state.playPause}
        />
      </>
    );
  }
}

export default PlayController;

const testSongList: IPlayList = {
  songs: [
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
