import React from "react";
import "./index.scss";
import ISongInfo from "../../api/types/songInfo";
import CommentsBar from "./components/commentsBar";
import LyricBar from "./components/lyricBar";
import { EmptySongInfo } from "../../api/types/songInfo";

interface IPlayParam {
  song: ISongInfo;
  playPause: boolean;
  currentTime: number;
}

function Play(params: IPlayParam) {
  return (
    <div
      className={
        window.location.hash === "#/play-page" ? "playPage" : "playPage hide"
      }
    >
      <div className="playPageMiddle">
        <div className="playPageUp">
          <div className="playPageUpLeft">
            <div>
              <div
                className={
                  params.playPause
                    ? "diskBar diskBarAfter"
                    : "diskBar diskBarOrigin"
                }
              ></div>
              <div className="disk">
                {/* <img src="" alt="" /> */}
                {params.song === EmptySongInfo ? (
                  <></>
                ) : (
                  <img
                    className={params.playPause ? "rotateImg" : "standImg"}
                    src={params.song.al.picUrl}
                    alt=""
                  />
                )}
              </div>
            </div>
          </div>
          <div className="playPageUpRight">
            <div className="playPageSongName">{params.song.name}</div>
            <div className="playPageArAl">
              <span className="playPageAl">
                <p>专辑: </p>
                <span>{params.song.al.name}</span>
              </span>
              <span className="playPageAr">
                <p>歌手: </p>
                <span>{params.song.ar[0].name}</span>
              </span>
            </div>
            <LyricBar
              songId={params.song.id}
              currentTime={params.currentTime}
            />
          </div>
        </div>
        <CommentsBar songId={params.song.id} />
      </div>
    </div>
  );
}

export default Play;
