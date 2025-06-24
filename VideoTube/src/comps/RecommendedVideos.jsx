import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "@/constants";
import { Card } from "@/components/ui/card";

const RecommendedVideos = () => {
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
          params: { page: page, limit: 10 },
          withCredentials: true,
        });
        const res = response.data;
        setVideos((prevVideos) => {
          const newVideos = res.data.videos.filter(
            (newVideo) =>
              !prevVideos.some((video) => video._id === newVideo._id)
          );
          return [...prevVideos, ...newVideos];
        });
        setHasMore(res.data.nextPage !== null);
      } catch (error) {
        console.error("Failed to fetch videos", error);
      }
    };

    getVideos();
  }, [page]);

  return (
    <div className="h-full">
      <h2 className="text-white text-xl font-bold mb-4">Recommended Videos</h2>
      <ul className="grid grid-cols-1 gap-4">
        {videos.map((video, index) => (
          <li
            key={video._id}
            ref={videos.length === index + 1 ? lastVideoElementRef : null}
            className="mb-4"
          >
            <Link to={`/video/${video._id}`} className="block">
              <Card className="bg-black text-white flex mx-2 rounded-none border-2">
                <img
                  src={video.thumbnail.url}
                  alt={video.title}
                  className="w-40 h-[120px] object-cover "
                />
                <div className="pl-2 py-1 flex flex-col justify-between">
                  <div className="mb-2">
                    <h3 className="text-base font-bold leading-none tracking-tight  text-white">
                      {video.title}
                    </h3>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground  text-white">
                      {video.ownerDetails.username}
                    </p>
                    <p className="text-sm text-muted-foreground  text-white">
                      {video.views} Views • {getTimeDifference(video.createdAt)}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          </li>
        ))}
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

export default RecommendedVideos;
