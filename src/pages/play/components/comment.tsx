import * as React from "react";
import IComment from "../types/comment";
import { Comment as CommentAntd, Avatar } from "antd";

interface ICommentProps {
  comment: IComment;
}

function Comment(params: ICommentProps) {
  const replies = params.comment.beReplied.map((value, index) => {
    return (
      <CommentAntd
        content={value.content}
        author={
          <span style={{ color: "#4f7dad", cursor: "pointer" }}>
            {value.user.nickname}
          </span>
        }
        avatar={<Avatar src={(value.user.avatarUrl)} />}
        key={index}
      ></CommentAntd>
    );
  });
  return (
    <CommentAntd
      content={params.comment.content}
      author={<span style={{color: "#4f7dad", cursor: "pointer"}}>{params.comment.user.nickname}</span>}
      avatar={<Avatar src={params.comment.user.avatarUrl} />}
    >
      {replies}
    </CommentAntd>
  );
}

export default Comment;
