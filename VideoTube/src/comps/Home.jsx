import React, { useState, useEffect, useRef, useCallback, useId } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { MdPlayCircleOutline } from "react-icons/md";
import { server } from "@/constants";
import VideoCard from "./VideoCard";

const Home = () => {
  const id = useId();
  const isLoggedIn = useSelector((state) => state.userInfo.isLoggedIn);
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const lastVideoElementRef = useCallback(
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

  useEffect(() => {
    const getVideos = async () => {
      try {
        const response = await axios.get(`${server}/users/videos`, {
          params: { page: page, limit: 3 }, // Correctly using query parameters
          withCredentials: true,
        });
        const res = await response.data;
        console.log(res);
        setVideos((prevVideos) => [...prevVideos, ...res.data.videos]);
        setHasMore(res.data.nextPage !== null);
      } catch (error) {
        console.error("Failed to fetch videos", error);
      }
    };

    if (isLoggedIn) {
      getVideos();
    } else {
      setVideos([]);
      setHasMore(false);
    }
  }, [isLoggedIn, page]);

  return (
    <div className="bg-black min-h-screen flex flex-col">
      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow p-4 text-center h-full">
          <MdPlayCircleOutline
            className="text-8xl mb-4"
            style={{ color: "#ff00ff" }}
          />
          <h2 className="text-2xl text-white">No videos available</h2>
          <p className="text-white">
            There are no videos here available.{" "}
            {isLoggedIn
              ? "Please try to search something else."
              : "Please log in"}
          </p>
        </div>
      ) : (
        <div className="p-3">
          {videos.map((video, index) => {
            if (videos.length === index + 1) {
              return (
                <div ref={lastVideoElementRef} key={video._id}>
                  <VideoCard video={video} />
                </div>
              );
            } else {
              return <VideoCard key={video._id} video={video} />;
            }
          })}
          {hasMore && (
            <div className="text-white text-center mt-4">
              Loading more videos...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
