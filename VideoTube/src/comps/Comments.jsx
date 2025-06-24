import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { server } from "@/constants";
import { useParams, Link } from "react-router-dom";
import ConnentEditor from "../editor/CommentEditor.jsx";
import CommentDelete from "@/alerts/CommentDelete.jsx";
import { useSelector } from "react-redux";
import defuser from "../assets/defuser.jpg";

const CommentSection = () => {
  const username = useSelector((state) => state.userInfo.username);
  const { videoId } = useParams();
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const uniqueCommentIds = useRef(new Set());
  const observer = useRef();
  const [totalComments, setTotalComments] = useState(0);

  const delComments = ({ _id }) => {
    const nComments = comments.filter((comment) => comment._id !== _id);
    setComments(nComments);
  };

  const lastCommentElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  const fetchComments = useCallback(
    async (pageToFetch) => {
      try {
        const response = await axios.get(
          `${server}/comments/${videoId}?page=${pageToFetch}&limit=4`,
          { withCredentials: true }
        );
        const res = response.data;
        setTotalComments(res.data.totalDocs);
        const newComments = res.data.comments.filter(
          (comment) => !uniqueCommentIds.current.has(comment._id)
        );

        newComments.forEach((comment) =>
          uniqueCommentIds.current.add(comment._id)
        );

        setComments((prevComments) => [...prevComments, ...newComments]);

        if (newComments.length === 0) setHasMore(false);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    },
    [videoId]
  );

  useEffect(() => {
    setComments([]);
    setPage(1);
    setHasMore(true);
    uniqueCommentIds.current.clear();
    fetchComments(1);
  }, [videoId, fetchComments]);

  useEffect(() => {
    if (page > 1) {
      fetchComments(page);
    }
  }, [page, fetchComments]);

  return (
    <div className="bg-black p-4 rounded-lg border-white border-2 relative">
      <h3 className="text-white mb-4">{totalComments} Comments</h3>
      <ConnentEditor
        videoId={videoId}
        setComments={setComments}
        uniqueCommentIds={uniqueCommentIds}
      />
      <ul>
        {comments.map((comment, index) => {
          return (
            <li
              ref={comments.length === index + 1 ? lastCommentElementRef : null}
              key={comment._id}
              className="mb-4 text-white border-t border-white py-2 relative"
            >
              <Link to={`/${comment.ownerDetails.username}`}>
                <div className="flex">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <img
                        src={comment.ownerDetails.avatar || defuser}
                        alt={comment.ownerDetails.username}
                        className="w-10 h-10 rounded-full mr-2 hover:border-2 border-purple-500"
                      />
                      <div>
                        <p className="text-white font-bold hover:text-purple-500 hover:underline hover:underline-offset-4 hover:decoration-purple-500">
                          {comment.ownerDetails.fullname}
                        </p>
                        <p className="text-gray-400 text-sm hover:text-purple-500 hover:underline hover:underline-offset-4 hover:decoration-purple-500">
                          @{comment.ownerDetails.username}
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 pt-[4px] text-xs text-gray-400">
                      {getTimeDifference(comment.createdAt)}
                    </div>
                  </div>
                </div>
              </Link>
              <p className="text-white">{comment.content}</p>

              {username === comment.ownerDetails.username ? (
                <div className="absolute top-4 right-4">
                  <CommentDelete _id={comment._id} delComments = {delComments}/>
                </div>
              ) : null}
            </li>
          );
        })}
        {hasMore && (
          <div className="text-white text-center mt-4">
            Loading more comments...
          </div>
        )}
      </ul>
    </div>
  );
};

const getTimeDifference = (date) => {
  const now = new Date();
  const videoDate = new Date(date);
  const diffInSeconds = Math.floor((now - videoDate) / 1000);

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `just now`;
};

export default CommentSection;
