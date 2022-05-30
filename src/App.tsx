import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import SearchRes from "./pages/Search/SearchRes";
import BackTop from "./components/BackTop/BackTop";
import ISongInfo, { EmptySongInfo } from "./api/types/songInfo";
import PlayPattern from "./api/types/playPattern";
import axios from "axios";
import serverHost from "./api/serverHost";
import { audioRef, PlayBar } from "./components/PlayBar/PlayBar";
import { message } from "antd";
import Play from "./pages/Play/Play";
import Page404 from "./pages/404/404";
// import { config } from "react-transition-group";

interface ISongInfoResponse {
  code: number;
  songs: ISongInfo[];
}

interface IPlaylistTrackAllResponse {
  code: number;
  message?: string;
  songs?: ISongInfo[];
}

function App() {
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const [songList, setSongList] = useState<ISongInfo[]>([]); // 播放列表
  const [ptPlaying, setPtPlaying] = useState<number>(-1); // 指向播放列表中正在播放的歌的序号
  const [playHistory, setPlayHistory] = useState<number[]>([]); // 播放历史
  const [ptHistory, setPtHistory] = useState<number>(-1); // 播放历史的指针

  const [currentTime, setCurrentTime] = useState<number>(0); // 当前播放进度
  const [playPause, setPlayPause] = useState<boolean>(false); // 播放暂停
  const [playPattern, setPlayPattern] = useState<PlayPattern>(PlayPattern.Loop); // 播放循环方式

  const handleSetPlay = () => {
    if (ptPlaying === -1) {
      if (playNextSong()) {
        setPlayPause(true);
      }
    } else {
      setPlayPause(true);
    }
  };

  /**
   * 设置播放时间为 0
   */
  const setCurrentTimeZero = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  /**
   * 播放 songList 中序号为 index 的歌曲
   * @param index
   */
  const changePlaying = (index: number) => {
    if (playPattern === PlayPattern.Random) {
      let nextHistory = playHistory;
      nextHistory.splice(ptHistory);
      setPlayHistory(nextHistory);
    }
    setPtPlaying(index);
    setCurrentTimeZero();
  };

  /**
   * 根据播放模式播放下一首歌曲
   * @returns 是否成功播放下一首歌曲
   */
  const playNextSong = (): boolean => {
    if (songList.length === 0) {
      message.warning("播放列表为空", 1);
      return false;
    }
    switch (playPattern) {
      case PlayPattern.Single:
        if (ptPlaying === -1) {
          changePlaying(0);
        } else {
          setCurrentTimeZero();
        }
        return true;
      case PlayPattern.Loop:
        changePlaying((ptPlaying + 1) % songList.length);
        return true;
      case PlayPattern.Random:
        if (ptHistory === playHistory.length - 1) {
          const nextPlayIndex = generateRandomNumber(
            songList.length,
            ptPlaying
          );
          let nextHistory = playHistory;
          nextHistory.push(nextPlayIndex);
          setPlayHistory(nextHistory);
          setPtHistory(ptHistory + 1);
          setPtPlaying(nextPlayIndex);
        } else {
          setPtPlaying(playHistory[ptHistory + 1]);
          setPtHistory(ptHistory + 1);
        }
        return true;
    }
  };

  /**
   * 根据播放模式和播放历史(随机模式下)播放上一首歌
   * @returns 是否成功播放上一首歌曲
   */
  const playPrevSong = (): boolean => {
    if (songList.length === 0) {
      message.warning("播放列表为空", 1);
      return false;
    }
    switch (playPattern) {
      case PlayPattern.Single:
        if (ptPlaying === -1) {
          changePlaying(songList.length - 1);
        } else {
          setCurrentTimeZero();
        }
        return true;
      case PlayPattern.Loop:
        changePlaying((ptPlaying - 1 + songList.length) % songList.length);
        return true;
      case PlayPattern.Random:
        if (ptHistory === 0) {
          const nextPlayIndex = generateRandomNumber(
            songList.length,
            ptPlaying
          );
          let nextPlayHistory = playHistory;
          nextPlayHistory.unshift(nextPlayIndex);
          setPlayHistory(nextPlayHistory);
          setPtPlaying(nextPlayIndex);
        } else {
          setPtPlaying(playHistory[ptHistory - 1]);
          setPtHistory(ptHistory - 1);
        }
        return true;
    }
  };

  /**
   * 加入一首歌曲至播放队列
   * @param id 歌曲的Id
   * @param andPlay 是否在加入播放队列时开始播放
   */
  const addToSongList = async (id: number, andPlay: boolean = false) => {
    if (
      songList.length !== 0 &&
      songList.map((value) => value.id).includes(id)
    ) {
      message.warning("播放队列中已有当前歌曲", 1);
      return;
    }
    const info: ISongInfo = (await fetchSongInfo(id)).songs[0];
    let nextSongList = songList;
    nextSongList.push(info);
    setSongList(nextSongList);
    if (andPlay) {
      changePlaying(nextSongList.length - 1);
    }
  };

  /**
   * 将歌单歌曲设置为播放列表
   * @param id 歌单的id
   */
  const addSongsFromList = async (id: number) => {
    const response = await fetchSongListAllTrack(id);
    if (response.code !== 200) {
      message.warning(response.message, 1);
      return;
    } else {
      setSongList(response.songs as ISongInfo[]);
      setPtPlaying(-1);
      setPlayHistory([]);
      setPtHistory(-1);
      playNextSong();
    }
  };

  /**
   * 从播放列表中删除索引为 index 的歌曲
   * @param index 歌曲索引值
   */
  const deleteSong = (index: number) => {
    setPtHistory(-1);
    setPlayHistory([]);
    if (songList.length === 1) {
      setPtPlaying(-1);
      setSongList([]);
      return;
    }
    let nextSongList = songList,
      nextPtPlaying = ptPlaying;
    nextSongList.splice(index, 1);
    if (nextPtPlaying > index) {
      nextPtPlaying--;
    }
    setSongList(nextSongList);
    setPtPlaying(nextPtPlaying);
  };

  let playingInfo = ptPlaying === -1 ? EmptySongInfo : songList[ptPlaying];

  return (
    <div className="App">
      <Header
        initiateSearchRequest={(content: string) => {
          setSearchKeyword(content);
          if (content === "") {
            message.warning("搜索栏为空", 1);
          } else {
            window.location.hash = "/search";
          }
        }}
      />

      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                addToPlaylist={addToSongList}
                resetPlaylistBySongList={addSongsFromList}
              />
            }
          />
          <Route
            path="/search"
            element={
              <SearchRes
                keywords={searchKeyword}
                addToSongList={addToSongList}
              />
            }
          />
          <Route
            path="/play"
            element={
              <Play
                currentTime={currentTime}
                playPause={playPause}
                song={playingInfo}
              />
            }
          />
          <Route path="/404" element={<Page404 />} />
        </Routes>
      </Router>

      <PlayBar
        songList={songList}
        playingIndex={ptPlaying}
        songInfo={playingInfo}
        playPause={playPause}
        pattern={playPattern}
        setPlay={handleSetPlay}
        setPause={() => setPlayPause(false)}
        changePattern={() => {
          setPlayPattern((playPattern + 1) % 3);
        }}
        fetchCurrentTime={(value) => {
          setCurrentTime(value);
        }}
        playNextSong={playNextSong}
        playPreviousSong={playPrevSong}
        changePlaying={changePlaying}
        deleteSong={deleteSong}
      />
      <BackTop />
    </div>
  );
}

export default App;

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
 * 从后端获得 id 对应歌单的全部歌曲信息
 * @param id 歌单 id
 */
const fetchSongListAllTrack = async (
  id: number
): Promise<IPlaylistTrackAllResponse> => {
  const data = await axios.get(serverHost + "/playlist/track/all", {
    params: {
      id: id,
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
