import * as React from "react";
import IComment from "../types/comment";
import { Comment as CommentAntd, Popover } from "antd";
import { LikeTwoTone } from "@ant-design/icons";
import { useState } from "react";

interface ICommentProps {
  comment: IComment;
  timeNow: Date;
}

function Comment(params: ICommentProps) {
  let [liked, setLiked] = useState<boolean>(false);

  const action = [
    <div className="action">
      <span className="timeString">
        {timeString(new Date(params.comment.time), params.timeNow)}
      </span>
      <LikeTwoTone
        className="likeIcon"
        twoToneColor={liked ? "#d43a31" : "rgba(192, 192, 192, 0.8)"}
        onClick={() => {
          setLiked(!liked);
        }}
      />
      <span
        className="likedCount"
        style={{ color: liked ? "#d43a31" : "rgba(192, 192, 192, 0.8)" }}
      >
        {params.comment.likedCount + (liked ? 1 : 0)}
      </span>
    </div>,
  ];

  const replies = params.comment.beReplied.map((value, index) => {
    return (
      <CommentAntd
        className="repliedComment"
        content={value.content}
        author={<span>{value.user.nickname}</span>}
        key={index}
      />
    );
  });

  return (
    <CommentAntd
      content={params.comment.content}
      author={
        <span >
          {params.comment.user.nickname}
        </span>
      }
      avatar={<img alt="avatar" src={params.comment.user.avatarUrl} />}
    >
      {action}
      {replies}
    </CommentAntd>
  );
}

function timeString(past: Date, now: Date): string {
  const minuteLength: number = (now.getTime() - past.getTime()) / 60_000;
  if (minuteLength < 1) {
    return `刚刚`;
  } else if (minuteLength < 60) {
    return `${Math.floor(minuteLength)}分钟前`;
  } else if (minuteLength < 1440) {
    return `${Math.floor(minuteLength / 60)}小时前`;
  } else {
    const minute: number = past.getMinutes();
    const hour: number = past.getHours();
    return `${past.getFullYear()}年${past.getMonth()}月${past.getDate()}日 
    ${hour < 10 ? "0" : ""}${hour.toString()}:${
      minute < 10 ? "0" : ""
    }${minute.toString()}`;
  }
}

export default Comment;
