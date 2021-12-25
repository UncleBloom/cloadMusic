import * as React from "react";
import ISongInfo from "../../api/types/songInfo";
import { Popover, Slider } from "antd";
import { StepBackwardOutlined, StepForwardOutlined } from "@ant-design/icons";
import "./index.css";
import PlayPattern from "../../api/types/playPattern";
import { EmptySongInfo } from "../../api/types/songInfo";
import { Link } from "react-router-dom";

// export const isPlay = React.createContext<{ isPlaying: boolean }>({
//   isPlaying: true,
// });

interface IPlayBarProps {
  songInfo: ISongInfo; // 歌曲信息
  currentTime: number; // 已播放时长
  playPause: boolean; // 播放/暂停
  pattern: PlayPattern; // 播放模式
  volume: number; // 音量
  playListVisible: boolean;
  setPlay: () => void;
  setPause: () => void;
  changePattern: () => void; // 改变播放模式的回调函数
  setVolume: (value: number) => void; // 设置音量的回调函数
  setMute: () => void; // 开关静音的回调函数
  setCurrentTime: (value: number) => void; // 设置当前播放时间
  playNextSong: () => boolean; // 播放下一首歌曲
  playPreviousSong: () => boolean; // 播放上一首歌曲
  showPlayList: () => void;
  hidePlayList: () => void;
}

function PlayBar(props: IPlayBarProps) {
  const [isFolded, setIsFolded] = React.useState(true);
  const info: ISongInfo = props.songInfo;

  // 格式化时间输出
  const formatTime = (time: number) => {
    const minute = Math.floor(time / 60000),
      second = Math.round(time / 1000) % 60;
    return `${minute < 10 ? "0" + minute.toString() : minute}:${
      second < 10 ? "0" + second.toString() : second
    }`;
  };

  // React.useEffect(() => {
  //   if (window.location.hash !== "#/play-page") {
  //     setIsFolded(true);
  //     document
  //       .querySelector(".playPage")
  //       ?.setAttribute("class", "playPage hide");
  //   }
  // }, [window.location.hash]);

  // 左侧歌曲信息展示
  let infoDisplayPlayBar: React.ReactNode = (
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
        <div className="duration">{`${formatTime(
          props.currentTime
        )} / ${formatTime(info.dt)}`}</div>
      </div>
    </span>
  );

  //中间播放控制按钮
  const playController: React.ReactNode = (
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
          <span className="iconfont" style={{ fontSize: 40, color: "#d43a31" }}>
            &#xea81;
          </span>
        ) : (
          <span className="iconfont" style={{ fontSize: 40, color: "#d43a31" }}>
            &#xea82;
          </span>
        )}
      </span>
      <StepForwardOutlined
        style={{ fontSize: 30, color: "#d43a31" }}
        onClick={props.playNextSong}
      />
    </span>
  );

  // 右侧播放列表,循环模式,音量
  const listController: React.ReactNode = (
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
            value={props.volume}
            onChange={props.setVolume}
          />
        }
        placement="top"
        trigger="hover"
      >
        <span className="iconfont" onClick={props.setMute}>
          {props.volume === 0 ? (
            <>&#xea0c;</>
          ) : props.volume <= 33 ? (
            <>&#xea0e;</>
          ) : props.volume <= 67 ? (
            <>&#xea0f;</>
          ) : (
            <>&#xea0d;</>
          )}
        </span>
      </Popover>
    </span>
  );
  return (
    <div className="playBar">
      <div className="playBarContent">
        {infoDisplayPlayBar /* 左侧歌曲信息展示 */}
        {playController /* 中间播放控制按钮 */}
        {listController /* 右侧播放列表,循环模式,音量 */}
      </div>
    </div>
  );
}

export default PlayBar;
