import * as React from "react";
import IPlayList from "../../api/types/playList";
import { Drawer } from "antd";
import "./PlayListDisplay.scss";

interface IPlayListDisplayProps {
  playList: IPlayList;
  visible: boolean;
  onClose: () => void;
  deleteSong: (index: number) => void;
  changePlaying: (index: number) => void;
}

function PlayListDisplay(params: IPlayListDisplayProps) {
  const title = (
    <div className="title">
      <span className="titleName">播放列表</span>
      <span className="count">
        （{params.playList.songs.length.toString()}首）
      </span>
    </div>
  );

  const listItems = params.playList.songs.map((song, index) => (
    <div
      className={
        index === params.playList.playing ? "playingItem" : "playListItem"
      }
      key={index}
      onDoubleClick={() => params.changePlaying(index)}
    >
      <span className="playListItemName">{song.name}</span>
      <span className="playListItemArtist">{song.ar[0].name}</span>
      <span className="playListItemDuration">{formatTime(song.dt)}</span>

      <span
        className="deleteIcon"
        onClick={() => {
          params.deleteSong(index);
        }}
      >
        &#xe6d5;
      </span>
    </div>
  ));

  return (
    <Drawer
      style={{ zIndex: "9" }}
      bodyStyle={{ padding: 0 }}
      visible={params.visible}
      placement="right"
      mask={true}
      maskClosable={true}
      closable={false}
      onClose={params.onClose}
    >
      {title}
      {listItems}
    </Drawer>
  );
}

export default PlayListDisplay;
const formatTime = (time: number) => {
  const minute = Math.floor(time / 60000),
    second = Math.round(time / 1000) % 60;
  return `${minute < 10 ? "0" + minute.toString() : minute}:${
    second < 10 ? "0" + second.toString() : second
  }`;
};
