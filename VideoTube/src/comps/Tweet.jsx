import React, { useEffect, useState, useRef, useCallback } from "react";
import TweetEditor from "../editor/TweetEditor";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "@/constants";
import ProfilePageTweetCard from "@/Card/ProfilePageTweetCard";

const Tweet = () => {
  const { profile } = useParams();
  const  username  = useSelector((state) => state.userInfo);
  const userAvatar = useSelector((state) => state.userInfo.avatar);
  const [tweets, setTweets] = useState([]);
  const [avatar, setAvatar] = useState();
  const [curUsername, setCurUsername] = useState();
  const [change, setChange] = useState(1);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const addTweet = ({ tweet }) => {
    const Tweetobj = {
      content: tweet.tweet.content,
      username,
      avatar: userAvatar,
      published: tweet.tweet.createdAt,
      _id: tweet.tweet._id,
      initialLikes: 0,
      initialIsLiked: false,
    };
    const nTweet = [Tweetobj, ...tweets];
    setTweets(nTweet);
  };

  const delTweet = ({ _id }) => {
    const nTweet = tweets.filter((tweet) => tweet._id !== _id);
    setTweets(nTweet);
  };

  const lastTweetElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, change]
  );

  useEffect(() => {
    const getAllTweets = async () => {
      try {
        const response = await axios.get(`${server}/tweets/user/${profile}`, {
          params: {
            page: page,
            limit: 4,
          },
          withCredentials: true,
        });
        const res = response.data;
        setTweets((prevTweets) => [...prevTweets, ...res.data.tweets.docs]);
        setAvatar(res.data.avatar);
        setCurUsername(res.data.username);
        setHasMore(res.data.tweets.docs.length > 0);
      } catch (error) {
        console.error("Failed to fetch tweets", error);
      }
    };

    getAllTweets();
  }, [profile, page, change]);

  return (
    <div className="w-full h-full bg-black">
      {username === profile ? <TweetEditor addTweet={addTweet} /> : null}
      {tweets.length > 0
        ? tweets.map((tweet, index) => {
            if (tweets.length === index + 1) {
              return (
                <div ref={lastTweetElementRef} key={tweet._id}>
                  <ProfilePageTweetCard
                    username={curUsername}
                    avatar={avatar}
                    content={tweet.content}
                    published={tweet.createdAt}
                    initialLikes={tweet.likeCount}
                    initialIsLiked={tweet.isLiked}
                    _id={tweet._id}
                    delTweet={delTweet}
                  />
                </div>
              );
            } else {
              return (
                <ProfilePageTweetCard
                  key={tweet._id}
                  username={curUsername}
                  avatar={avatar}
                  content={tweet.content}
                  published={tweet.createdAt}
                  initialLikes={tweet.likeCount}
                  initialIsLiked={tweet.isLiked}
                  _id={tweet._id}
                  delTweet={delTweet}
                />
              );
            }
          })
        : null}
    </div>
  );
};

export default Tweet;
