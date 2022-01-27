import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { ILyricResponse } from "../types/lyric";
import axios from "axios";
import serverHost from "../../../api/serverHost";
import { EmptySongInfo } from "../../../api/types/songInfo";
import "./lyricBar.scss";

const LYRIC_LINE_HEIGHT: number = 35;
const REVERSED_HEIGHT: number = 200;

interface ILyricBarParams {
  songId: number;
  currentTime: number;
}

function LyricBar(params: ILyricBarParams) {
  const [lyric, setLyric] = useState<string[]>(["正在获取歌词"]);
  const [times, setTimes] = useState<number[]>([0]);
  const [lineIndex, setLineIndex] = useState<number>(0);
  const lrcWindowRef = useRef<HTMLDivElement>(null);

  /**
   * 获取歌词
   */
  useEffect(() => {
    // 从服务器获取歌词
    const fetchLyric = async (songId: number): Promise<ILyricResponse> => {
      const data = await axios.get(serverHost + "/lyric", {
        params: {
          id: songId,
        },
      });
      return data.data;
    };
    // 处理 .lrc 格式歌词文件，并将内容和时间分别存储为两个数组
    const parseLyric = (text: string): void => {
      let lyric = text.split("\n");
      let lrc = new Array<[number, string]>();
      for (const line of lyric) {
        // 使用正则表达式匹配时间与歌词
        let lineContent = line.replace(/\[(\d+:.+?)\]/g, "");
        let lineTimes = line.match(/\[(\d+:.+?)\]/g);
        if (lineTimes) {
          for (const timeStr of lineTimes) {
            let [min, sec] = timeStr
              .substring(1, timeStr.length - 1)
              .split(":");
            const time = parseInt(min) * 60 + parseFloat(sec);
            lrc.push([time, lineContent]);
          }
        }
      }
      // 对处理后的歌词和时间进行排序
      lrc.sort(function (a, b) {
        return a[0] - b[0];
      });
      // 将歌词和对应时间分别存入两个数组
      let lrcSeq: string[] = [];
      let timeSeq: number[] = [];
      for (const line of lrc) {
        timeSeq.push(line[0]);
        lrcSeq.push(line[1]);
      }
      setTimes(timeSeq);
      setLyric(lrcSeq);
    };

    if (params.songId === EmptySongInfo.id) {
      setLyric(["当前没有播放歌曲"]);
      setTimes([0]);
    } else {
      fetchLyric(params.songId)
        .then((Response) => {
          parseLyric(Response.lrc.lyric);
          // setLyric(readLyricLines(parseLyric(Response.lrc.lyric)));
        })
        .catch(() => {
          setLyric(["当前歌曲没有歌词"]);
        });
    }
  }, [params.songId]);

  // 更新当前歌词
  useEffect(() => {
    const lineIndex = times.findIndex((time, index) => {
      const nextTime = index + 1 <= times.length ? times[index + 1] : Infinity;
      return time <= params.currentTime && params.currentTime < nextTime;
    });
    if (lineIndex >= 0) {
      setLineIndex(lineIndex);
    }
  }, [params.currentTime, times]);

  // lineIndex 更新时，歌词窗口滚动
  useEffect(() => {
    let scrollTop: number = lineIndex * LYRIC_LINE_HEIGHT - REVERSED_HEIGHT;
    lrcWindowRef.current?.scroll({
      top: scrollTop < 0 ? 0 : scrollTop,
      behavior: "smooth",
    });
  }, [lineIndex]);

  const listItems = lyric.map((sentence, index) => (
    <div
      className={index === lineIndex ? "currentLine" : "sentence"}
      key={index}
    >
      {sentence}
    </div>
  ));

  return (
    <div className="lyrics" ref={lrcWindowRef}>
      {listItems}
    </div>
  );
}

export default LyricBar;
