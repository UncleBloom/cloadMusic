import * as React from "react";
import IPlayList from "../../api/types/playList";
import { Drawer } from "antd";
import "./index.scss";

interface IPlayListDisplayProps {
  playList: IPlayList;
  visible: boolean;
  onClose: () => void;
  deleteSong: (index: number) => void;
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
    <div
      className={
        index === params.playList.playing ? "playingItem" : "playListItem"
      }
      key={index}
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
      title="播放列表"
      headerStyle={{ border: 0, fontSize: "20px" }}
      bodyStyle={{ padding: 0 }}
      visible={params.visible}
      placement="right"
      mask={true}
      maskClosable={true}
      closable={false}
      onClose={params.onClose}
    >
      {listItems}
    </Drawer>
  );
}

export default PlayListDisplay;
