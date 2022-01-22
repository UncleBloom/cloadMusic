import * as React from "react";
import ICommentResponse from "../types/commentResponse";
import IComment from "../types/comment";
import { List, Pagination } from "antd";
import Comment from "./comment";
import { useState, useEffect } from "react";
import axios from "axios";
import serverHost from "../../../api/serverHost";

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

    fetchComments(params.songId).then((Response) => {
      setComments(Response);
      if (Response.hotComments && Response.hotComments.length > 0) {
        setHotCmts(Response.hotComments);
      }
    });
  }, [params, page]);

  let latestCmts = comments.comments;
  return (
    <div className="commentsDisplay">
      <div className="Comments">
        <h3>精彩评论</h3>
        <List
          dataSource={hotCmts}
          itemLayout="horizontal"
          renderItem={
            (item) => {
              return <Comment comment={item}/>
            }
          }
        />
      </div>
      <div className="Comments">
        <h3>最新评论({comments.total})</h3>
        <List
          dataSource={latestCmts}
          itemLayout="horizontal"
          renderItem={(item) => {
            return <Comment comment={item}></Comment>;
          }}
        />
        <Pagination
          current={page}
          total={comments.total}
          onChange={(value) => {
            setPage(value);
          }}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}

export default CommentsBar;
