import * as React from "react";
import IPlayList from "../../api/types/playList";
import { Drawer } from "antd";
import "./index.css";

interface IPlayListDisplayProps {
  playList: IPlayList;
  visible: boolean;
  onClose: () => void;
}

function PlayListDisplay(params: IPlayListDisplayProps) {
  
  const formatTime = (time: number) => {
    const minute = Math.floor(time / 60000),
      second = Math.round(time / 1000) % 60;
    return `${minute < 10 ? "0" + minute.toString() : minute}:${
      second < 10 ? "0" + second.toString() : second
    }`;
  };
  const listItems = params.playList.songs.map((song, index) => (
    <div className="playListItem" key={index}>
      <span className="playListItemName">{song.name}</span>
      <span className="playListItemArtist">{song.ar[0].name}</span>
      <span className="playListItemDuration">{formatTime(song.dt)}</span>
    </div>
  ));

  return (
    <Drawer
      style={{ zIndex: "9", paddingLeft: "0", paddingRight: "0" }}
      title="播放列表"
      visible={params.visible}
      placement="right"
      mask={false}
      closable={false}
      onClose={params.onClose}
    >
      {listItems}
    </Drawer>
  );
}

export default PlayListDisplay;
