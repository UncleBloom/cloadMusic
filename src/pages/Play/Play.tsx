import React from "react";
import "./Play.scss";
import { EmptySongInfo } from "../../api/types/songInfo";
import CommentsBar from "./components/commentsBar";
import LyricBar from "./components/lyricBar";
import { playControllerRef } from "../../App";

function Play() {
  let playingInfo = playControllerRef.current
    ? playControllerRef.current.state.playList.playing === -1
      ? EmptySongInfo
      : playControllerRef.current.state.playList.songs[
          playControllerRef.current.state.playList.playing
        ]
    : EmptySongInfo;

  return (
    <div className={"playPage"}>
      <div className="albg">
        {playingInfo === EmptySongInfo ? (
          <></>
        ) : (
          <img
            src={playingInfo.al.picUrl}
            alt="background"
            style={{ width: Math.max(window.innerWidth, window.innerHeight) }}
          />
        )}
      </div>

      <div className="playPageMiddle">
        <div className="playPageUp">
          <div className="playPageUpLeft">
            <div>
              <div
                className={
                  playControllerRef.current?.state.playPause
                    ? "diskBar diskBarAfter"
                    : "diskBar diskBarOrigin"
                }
              />
              <div className="disk">
                {playingInfo === EmptySongInfo ? (
                  <></>
                ) : (
                  <img
                    className={
                      playControllerRef.current?.state.playPause
                        ? "rotateImg"
                        : "standImg"
                    }
                    src={playingInfo.al.picUrl}
                    alt=""
                  />
                )}
              </div>
            </div>
          </div>
          <div className="playPageUpRight">
            <div className="playPageSongName">{playingInfo.name}</div>
            <div className="playPageArAl">
              <span className="playPageAl">
                <p>专辑: </p>
                <span>{playingInfo.al.name}</span>
              </span>
              <span className="playPageAr">
                <p>歌手: </p>
                <span>{playingInfo.ar[0].name}</span>
              </span>
            </div>
            <LyricBar
              songId={playingInfo.id}
              currentTime={
                playControllerRef.current
                  ? playControllerRef.current.state.currentTime
                  : 0
              }
            />
          </div>
        </div>
        <CommentsBar songId={playingInfo.id} />
      </div>
    </div>
  );
}

export default Play;
