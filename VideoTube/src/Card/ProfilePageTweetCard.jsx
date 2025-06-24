import React, { useState } from "react";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiFillLike,
  AiFillDislike,
} from "react-icons/ai";
import defuser from "../assets/defuser.jpg";
import axios from "axios";
import { server } from "@/constants";
import TweetDelete from "@/alerts/TweetDelete";
import { useSelector } from "react-redux";

const ProfilePageTweetCard = ({
  username,
  avatar,
  content,
  published,
  initialLikes,
  initialIsLiked,
  _id,
  delTweet
}) => {
  const curuser = useSelector((state) => state.userInfo.username);
  const [isLiked, setIsLiked] = useState(initialIsLiked || 0);
  const [likes, setLikes] = useState(initialLikes || false);
  const [disLike, setDisLike] = useState(false);

  const toggleLike = async () => {
    try {
      const response = await axios.post(
        `${server}/likes/toggle/t/${_id}`,
        {},
        { withCredentials: true }
      );
      const res = response.data;
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
      if (isLiked === false) setDisLike(false);
    } catch (error) {
      console.error("Failed to toggle like", error);
    }
  };

  const toggleDisLike = () => {
    if (!disLike === true && isLiked === true) {
      toggleLike();
    }
    setDisLike((prev) => !prev);
  };

  return (
    <div className="bg-black text-white p-4 mb-4 border-b border-white mx-10">
      <div className="flex items-start">
        <img
          src={avatar || defuser}
          alt="User avatar"
          className="w-12 h-12 rounded-full mr-4"
        />
        <div className="flex-grow">
          <div className="flex items-center mb-2">
            <span className="font-bold mr-2">{username}</span>
            <span className="text-gray-500">
              {getTimeDifference(published)}
            </span>
          </div>
          <div className="mb-4">{content}</div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <button className="flex items-center" onClick={toggleLike}>
                {isLiked ? (
                  <AiFillLike
                    className="mr-1"
                    size={20}
                    style={{ color: "#ff00ff" }}
                  />
                ) : (
                  <AiOutlineLike
                    className="mr-1"
                    size={20}
                    style={{ color: "#ff00ff" }}
                  />
                )}
                <span>{likes === 0 ? "" : likes}</span>
              </button>
            </div>
            <div className="flex items-center">
              <button className="flex items-center" onClick={toggleDisLike}>
                {disLike ? (
                  <AiFillDislike className="mr-1" size={20} />
                ) : (
                  <AiOutlineDislike className="mr-1" size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
        {curuser === username ? (
          <div className="mr-10">
            <TweetDelete _id={_id} delTweet ={delTweet}/>
          </div>
        ) : null}
      </div>
    </div>
  );
};

const getTimeDifference = (date) => {
  const now = new Date();
  const tweetDate = new Date(date);
  const diffInSeconds = Math.floor((now - tweetDate) / 1000);

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

export default ProfilePageTweetCard;
