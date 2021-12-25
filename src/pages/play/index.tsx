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
                <div className="diskBar"></div>
                <div className="disk">
                  {this.props.song === EmptySongInfo ? (
                    <img src="../../asset/images/emptyAlbumPic.jpeg" alt="" />
                  ) : (
                    <img src={this.props.song.al.picUrl} alt="" />
                  )}
                </div>
              </div>
              {/* <img
                src="../../asset/images/Tonearm.png"
                height={200}
                width={293}
                alt=""
              />
              {this.props.song === EmptySongInfo ? (
                <img
                  src="../../asset/images/emptyAlbumPic.jpeg"
                  height={200}
                  width={200}
                  alt=""
                />
              ) : (
                <img
                  src={this.props.song.al.picUrl}
                  height={200}
                  width={200}
                  alt=""
                />
              )}
              <img
                src="../../asset/images/Disk.png"
                height={310}
                width={310}
                alt=""
              /> */}
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
