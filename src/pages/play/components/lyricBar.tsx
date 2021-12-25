import * as React from "react";
import { useState, useEffect } from "react";
import { ILyricResponse } from "../types/lyric";
import { List } from "antd";
import axios from "axios";
import serverHost from "../../../api/serverHost";

interface ILyricBarParams {
  songId: number;
  currentTime: number;
}

function LyricBar(params: ILyricBarParams) {
  const [lyric, setLyric] = useState<string[]>(["正在获取歌词"]);

  useEffect(() => {
    const fetchLyric = async (songId: number): Promise<ILyricResponse> => {
      const data = await axios.get(serverHost + "/lyric", {
        params: {
          id: songId,
        },
      });
      return data.data;
    };

    fetchLyric(params.songId)
      .then((Response) => {
        setLyric(readLyricLines(parseLyric(Response.lrc.lyric)));
      })
      .catch(() => {
        setLyric(["当前歌曲没有歌词"]);
      });
  });

  const readLyricLines = (array: Array<[number, string]>): Array<string> => {
    let lrcLines: string[] = [];
    for (const line of array) {
      lrcLines.push(line[1]);
    }
    return lrcLines;
  };

  const parseLyric = (text: string): Array<[number, string]> => {
    let lyric = text.split("\n");
    let lrc = new Array<[number, string]>();
    for (const line of lyric) {
      let lineContent = line.replace(/\[(\d+:.+?)\]/g, "");
      let lineTimes = line.match(/\[(\d+:.+?)\]/g);
      if (lineTimes) {
        for (const timeStr of lineTimes) {
          let [min, sec] = timeStr.substring(1, timeStr.length - 1).split(":");
          const time = parseInt(min) * 60 + parseFloat(sec);
          lrc.push([time, lineContent]);
        }
      }
    }
    lrc.sort(function (a, b) {
      return a[0] - b[0];
    });
    return lrc;
  };

  return (
    <div className="lyrics">
      <List
        dataSource={lyric}
        renderItem={(line) => {
          return <div>{line}</div>;
        }}
      />
    </div>
  );
}

export default LyricBar;
