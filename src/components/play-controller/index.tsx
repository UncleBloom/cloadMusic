import * as React from "react";
import axios from "axios";
import PlayBar from "../play-bar/index";
import IPlayList, { EmptyList } from "../../api/types/playList";
import PlayPattern from "../../api/types/playPattern";
import ISongInfo, { EmptySongInfo } from "../../api/types/songInfo";
import serverHost from "../../api/serverHost";
import { message } from "antd";
import PlayListDisplay from "../playlist-display/index";
import Play from "../../pages/play/index";

interface IPlayControllerState {
  songPlaying: ISongInfo; //歌曲信息
  playList: IPlayList; //播放队列
  currentTime: number; //当前时间
  playPause: boolean; //播放:暂停
  playPattern: PlayPattern; //播放模式
  volume: number; //音量
  mute: boolean; //静音
  playListVisible: boolean; //是否显示播放列表
  showPlayPage: boolean; // 是否展示播放页
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
      volume: 70,
      mute: false,
      playListVisible: false,
      showPlayPage: false,
    };
    // this.setSongPlaying(347230);
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
    let playingUrl: string;
    this.getSongUrl(songInfo.id).then((Response) => {
      playingUrl = Response.data.url;
    });
    //TODO: 创建播放器 state.playPause?开始播放:停在开头;
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
   * 设置音量
   * @param value 音量值
   */
  setVolume = (value: number) => {
    this.setState({
      volume: value,
      mute: value === 0 ? true : false,
    });
  };

  /**设置当前播放时间
   * @param value 当前播放时间
   */
  setCurrentTime = (value: number) => {
    this.setState({ currentTime: value });
  };

  /**
   * 设置开关静音
   */
  setMute = () => {
    this.setState((state) => {
      return {
        mute: !state.mute,
        volume: state.volume === 0 ? 1 : state.volume,
      };
    });
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
   * 打开播放列表页
   */
  showPlayList = () => {
    this.setState({ playListVisible: true });
  };
  /**
   * 关闭播放列表页
   */
  closePlayList = () => {
    this.setState({ playListVisible: false });
  };
  /**
   * 加入一首歌曲至播放队列
   * @param song 歌曲的详情(建议)或Id
   * @param andPlay 是否在加入播放队列时开始播放
   */
  addToPlayList = (song: ISongInfo | number, andPlay: boolean = false) => {
    let newPlayList = this.state.playList;
    if (typeof song === "number") {
      let Info: ISongInfo;
      this.getSongInfo(song).then((Response) => {
        Info = Response.songs[0];
        newPlayList.songs.push(Info);
        if (andPlay) {
          this.setSongPlaying(newPlayList.songs[-1]);
          newPlayList.playing = newPlayList.songs.length;
        }
        this.setState({ playList: newPlayList });
      });
    } else {
      newPlayList.songs.push(song);
      if (andPlay) {
        this.setSongPlaying(newPlayList.songs[-1]);
        newPlayList.playing = newPlayList.songs.length;
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
        nextPlayNum = playList.playing;
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

  render(): React.ReactNode {
    return (
      <>
        <PlayListDisplay
          playList={this.state.playList}
          visible={this.state.playListVisible}
          onClose={this.closePlayList}
        />
        <PlayBar
          songInfo={this.state.songPlaying}
          currentTime={this.state.currentTime}
          playPause={this.state.playPause}
          pattern={this.state.playPattern}
          volume={this.state.mute ? 0 : this.state.volume}
          playListVisible={this.state.playListVisible}
          changePattern={this.setPlayPattern}
          setPlay={this.setPlay}
          setPause={this.setPause}
          setVolume={this.setVolume}
          setMute={this.setMute}
          setCurrentTime={this.setCurrentTime}
          playNextSong={this.PlayNextSong}
          playPreviousSong={this.playPreviousSong}
          showPlayList={this.showPlayList}
          hidePlayList={this.closePlayList}
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
          "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
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
          "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
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
          "https://p2.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
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
