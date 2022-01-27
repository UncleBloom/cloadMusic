import * as React from "react";
import ICommentResponse from "../types/commentResponse";
import IComment from "../types/comment";
import {List, Pagination} from "antd";
import Comment from "./comment";
import {useState, useEffect} from "react";
import axios from "axios";
import serverHost from "../../../api/serverHost";
import {EmptySongInfo} from "../../../api/types/songInfo";
import "./commentsBar.scss"

interface ICommentsBarProps {
  songId: number;
}

function CommentsBar(params: ICommentsBarProps) {
  const [page, setPage] = useState(1);
  const [hotCmts, setHotCmts] = useState<IComment[]>();
  const [comments, setComments] = useState<ICommentResponse>({
    comments: [],
    hotComments: [],
    total: 0,
  });

  useEffect(() => {
    // 获取评论
    const fetchComments = async (songId: number): Promise<ICommentResponse> => {
      const data = await axios.get(serverHost + "/comment/music", {
        params: {
          id: songId,
          limit: 10,
          offset: (page - 1) * 10,
        },
      });
      return data.data;
    };
    if (params.songId === EmptySongInfo.id) {
      setComments({
        comments: [],
        hotComments: [],
        total: 0,
      });
      setHotCmts([]);
    }
    fetchComments(params.songId).then((Response) => {
      setComments(Response);
      if (Response.hotComments && Response.hotComments.length > 0) {
        setHotCmts(Response.hotComments);
      }
    });
  }, [params, page]);

  let latestCmts = comments.comments;
  const timeNow: Date = new Date();
  return (
      <div className = "commentsDisplay">
        <div className = "Comments">
          <div className = "commentType">精彩评论</div>
          <List
              dataSource = {hotCmts}
              itemLayout = "horizontal"
              renderItem = {(item) => {
                return <Comment comment = {item} timeNow = {timeNow} />;
              }}
          />
        </div>
        <div className = "Comments">
          <div className = "commentType">最新评论({comments.total})</div>
          <List
              dataSource = {latestCmts}
              itemLayout = "horizontal"
              renderItem = {(item) => {
                return <Comment comment = {item} timeNow = {timeNow} />;
              }}
          />
          <Pagination
              current = {page}
              total = {comments.total}
              onChange = {(value) => {
                setPage(value);
              }}
              showSizeChanger = {false}
          />
        </div>
      </div>
  );
}

export default CommentsBar;
