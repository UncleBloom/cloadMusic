import React from "react";
import "./index.css";
import ISongInfo from "../../api/types/songInfo";
import CommentsBar from "./components/commentsBar";
import LyricBar from "./components/lyricBar";
import { EmptySongInfo } from "../../api/types/songInfo";

interface IPlayProps {
  song: ISongInfo;
  playPause: boolean;
  currentTime: number;
}

interface IPlayState {}

class Play extends React.Component<IPlayProps, IPlayState> {
  constructor(props: IPlayProps) {
    super(props);
    this.state = {};
  }

  render(): React.ReactNode {
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
                    this.props.playPause
                      ? "diskBar diskBarAfter"
                      : "diskBar diskBarOrigin"
                  }
                ></div>
                <div className="disk">
                  {this.props.song === EmptySongInfo ? (
                    <img src="../../asset/images/emptyAlbumPic.jpeg" alt="" />
                  ) : (
                    <img
                      src={this.props.song.al.picUrl}
                      alt=""
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="playPageUpRight">
              <div className="playPageSongName">{this.props.song.name}</div>
              <div className="playPageArAl">
                <span className="playPageAl">
                  <p>专辑: </p>
                  <span>{this.props.song.al.name}</span>
                </span>
                <span className="playPageAr">
                  <p>歌手: </p>
                  <span>{this.props.song.ar[0].name}</span>
                </span>
              </div>
              <LyricBar
                songId={this.props.song.id}
                currentTime={this.props.currentTime}
              />
            </div>
          </div>
          <CommentsBar songId={this.props.song.id} />
        </div>
      </div>
    );
  }
}

export default Play;
