import * as React from "react";
import ISongInfo from "../../api/types/songInfo";
import { Popover, Slider } from "antd";
import { StepBackwardOutlined, StepForwardOutlined } from "@ant-design/icons";
import "./index.css";
import PlayPattern from "../../api/types/playPattern";
import { EmptySongInfo } from "../../api/types/songInfo";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import serverHost from "../../api/serverHost";

interface ISongUrlResponse {
  code: number;
  data: {
    id: number;
    url: string;
  }[];
}

interface IPlayBarProps {
  songInfo: ISongInfo; // 歌曲信息
  currentTime: number; // 已播放时长
  playPause: boolean; // 播放/暂停
  pattern: PlayPattern; // 播放模式
  playListVisible: boolean;
  setPlay: () => void;
  setPause: () => void;
  changePattern: () => void; // 改变播放模式的回调函数
  getCurrentTime: React.ReactEventHandler<HTMLAudioElement>; // 获得当前播放时间
  playNextSong: () => boolean; // 播放下一首歌曲
  playPreviousSong: () => boolean; // 播放上一首歌曲
  showPlayList: () => void;
  hidePlayList: () => void;
}

function PlayBar(props: IPlayBarProps) {
  const [isFolded, setIsFolded] = React.useState(true);
  const info: ISongInfo = props.songInfo;
  const [volume, setVolume] = useState<number>(70);
  const [drag, setDrag] = useState<boolean>(false);
  const [progressDotX, setProgressDotX] = useState<number>(0);
  const [songUrl, setSongUrl] = useState<string>("");
  const songAudio = useRef<HTMLAudioElement>(null);
  const audioNode = songAudio.current;

  // 格式化时间输出
  const formatDuration = (time: number) => {
    const minute = Math.floor(time / 60000),
      second = Math.round(time / 1000) % 60;
    return `${minute < 10 ? "0" + minute.toString() : minute}:${
      second < 10 ? "0" + second.toString() : second
    }`;
  };
  const formatCurrentTime = (time: number) => {
    const minute = Math.floor(time / 60),
      second = Math.round(time % 60);
    return `${minute < 10 ? "0" + minute.toString() : minute}:${
      second < 10 ? "0" + second.toString() : second
    }`;
  };

  /**
   * 修改音量
   */
  useEffect(() => {
    if (audioNode) {
      audioNode.volume = volume / 100;
    }
  }, [audioNode, volume]);

  useEffect(() => {
    if (audioNode) {
      props.playPause ? audioNode.play() : audioNode.pause();
    }
  }, [audioNode, props.playPause]);

  useEffect(() => {
    setProgressDotX((props.currentTime / (info.dt / 1000)) * window.innerWidth);
  }, [info.dt, props.currentTime]);

  useEffect(() => {
    const getSongUrl = async (songId: number): Promise<ISongUrlResponse> => {
      const data = await axios.get(serverHost + "/song/url", {
        params: {
          id: songId,
        },
      });
      return data.data;
    };
    getSongUrl(info.id).then((Response) => {
      setSongUrl(Response.data[0].url);
    });
  }, [info.id]);

  /**
   * 鼠标点击进度条时改变当前播放时间
   * @param event 鼠标点击事件
   */
  const handleClickLine: React.MouseEventHandler<HTMLDivElement> = (
    event: React.MouseEvent
  ) => {
    setProgressDotX(event.clientX);
    const timeToSet = ((event.clientX / window.innerWidth) * info.dt) / 1000;
    (audioNode as HTMLAudioElement).currentTime = timeToSet;
  };
  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (
    event: React.MouseEvent
  ) => {
    setDrag(true);
  };
  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (
    event: React.MouseEvent
  ) => {
    if (drag) {
      setProgressDotX(event.clientX);
      const timeToSet = ((event.clientX / window.innerWidth) * info.dt) / 1000;
      (audioNode as HTMLAudioElement).currentTime = timeToSet;
    }
  };
  const handleMouseUp: React.MouseEventHandler<HTMLDivElement> = (
    event: React.MouseEvent
  ) => {
    setDrag(false);
  };

  const playedLineCss: React.CSSProperties = {
    width: progressDotX,
  };
  const progressDotCss: React.CSSProperties = {
    left: progressDotX,
  };

  return (
    <div
      className="playBar"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <audio
        ref={songAudio}
        src={songUrl}
        autoPlay
        onTimeUpdate={props.getCurrentTime}
        onEnded={props.playNextSong}
        onPlay={props.setPlay}
        onPause={props.setPause}
      ></audio>
      <div className="progressBar">
        <div className="progressBarLine" onClick={handleClickLine}>
          <div className="progressBarPlayedLine" style={playedLineCss}></div>
          <div
            className="progressBarDot"
            onMouseDown={handleMouseDown}
            style={progressDotCss}
          ></div>
        </div>
      </div>
      <div className="playBarContent">
        <span className="infoDisplayPlayBar">
          {info === EmptySongInfo ? (
            <img alt="" className="emptyImg" />
          ) : (
            <img
              src={info.al.picUrl}
              alt=""
              onClick={() => {
                window.scrollTo(0, 0);
                if (isFolded) {
                  window.location.hash = "/play-page";
                  document
                    .querySelector(".playPage")
                    ?.setAttribute("class", "playPage");
                } else {
                  window.history.back();
                  document
                    .querySelector(".playPage")
                    ?.setAttribute("class", "playPage hide");
                }
                setIsFolded(!isFolded);
              }}
            />
          )}
          <div>
            <div className="nameAndArtist">
              <span className="name">{info.name}</span>
              <span className="artistName">{`  - ${info.ar[0].name}`}</span>
            </div>
            <div className="duration">{`${formatCurrentTime(
              props.currentTime
            )} / ${formatDuration(info.dt)}`}</div>
          </div>
        </span>
        <span className="playController">
          <StepBackwardOutlined
            style={{ fontSize: 30, color: "#d43a31" }}
            onClick={props.playPreviousSong}
          />
          <span
            className="playPauseButton"
            onClick={props.playPause ? props.setPause : props.setPlay}
          >
            {props.playPause ? (
              <span
                className="iconfont"
                style={{ fontSize: 40, color: "#d43a31" }}
              >
                &#xea81;
              </span>
            ) : (
              <span
                className="iconfont"
                style={{ fontSize: 40, color: "#d43a31" }}
              >
                &#xea82;
              </span>
            )}
          </span>
          <StepForwardOutlined
            style={{ fontSize: 30, color: "#d43a31" }}
            onClick={props.playNextSong}
          />
        </span>
        <span className="listController">
          <span className="patternButton" onClick={props.changePattern}>
            {(() => {
              switch (props.pattern) {
                case PlayPattern.Random:
                  return <span className="iconfont">&#xea76;</span>;
                case PlayPattern.Loop:
                  return <span className="iconfont">&#xea75;</span>;
                case PlayPattern.Single:
                  return <span className="iconfont">&#xea77;</span>;
              }
            })()}
          </span>
          <span
            className="iconfont"
            onClick={
              props.playListVisible ? props.hidePlayList : props.showPlayList
            }
            style={props.playListVisible ? { color: "#d43a31" } : {}}
          >
            &#xea83;
          </span>
          <Popover
            content={
              <Slider
                style={{
                  display: "inline-block",
                  height: 100,
                }}
                className="volumeSlider"
                min={0}
                max={100}
                vertical={true}
                value={volume}
                onChange={setVolume}
              />
            }
            placement="top"
            trigger="hover"
          >
            <span
              className="iconfont"
              onClick={() => {
                volume === 0 ? setVolume(1) : setVolume(0);
              }}
            >
              {volume === 0 ? (
                <>&#xea0c;</>
              ) : volume <= 33 ? (
                <>&#xea0e;</>
              ) : volume <= 67 ? (
                <>&#xea0f;</>
              ) : (
                <>&#xea0d;</>
              )}
            </span>
          </Popover>
        </span>
      </div>
    </div>
  );
}

export default PlayBar;
