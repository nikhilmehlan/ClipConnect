import PlaylistCard from "@/Card/PlaylistCard";
import { server } from "@/constants";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const [playlist, setPlayList] = useState();
  const [videos, setVideos] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(0);
  const batchSize = 8;

  useEffect(() => {
    const getPlayList = async () => {
      try {
        const response = await axios.get(`${server}/playlist/${playlistId}`, {
          withCredentials: true,
        });
        const res = response.data;
        setPlayList(res.data);
      } catch (error) {
        console.error("Failed to fetch playlist", error);
      }
    };
    getPlayList();
  }, [playlistId]);

  const getVideos = useCallback(async () => {
    if (playlist && playlist.videos.length > 0) {
      try {
        const start = currentBatch * batchSize;
        const end = start + batchSize;
        const videoIdsBatch = playlist.videos.slice(start, end);
        const videoRequests = videoIdsBatch.map((videoId) =>
          axios.get(`${server}/videos/${videoId}`)
        );
        const responses = await Promise.all(videoRequests);
        const fetchedVideos = responses.map((response) => response.data.data);
        setVideos((prevVideos) => [...prevVideos, ...fetchedVideos]);
      } catch (error) {
        console.error("Failed to fetch videos", error);
      }
    }
  }, [playlist, currentBatch]);

  useEffect(() => {
    getVideos();
  }, [getVideos]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return;
    setCurrentBatch((prevBatch) => prevBatch + 1);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex p-4 gap-10">
      <div className="w-2/5">
        {playlist && (
          <>
            <PlaylistCard playlist={playlist} del={false} />
            <div className="mt-4 p-4">
              <h3 className="text-lg font-bold">Description</h3>
              <p>{playlist.description}</p>
            </div>
          </>
        )}
      </div>
      <div className="w-3/5">
        {videos.length > 0
          ? videos.map((video) => (
              <Link
                to={`/video/${video._id}`}
                className="block mb-4"
                key={video._id}
              >
                <Card className="bg-black text-white flex rounded-none border-2">
                  <img
                    src={video.thumbnail.url}
                    alt={video.title}
                    className="w-40 h-[120px] object-cover"
                  />
                  <div className="pl-2 py-1 flex flex-col justify-between">
                    <div className="mb-2">
                      <h3 className="text-base font-bold leading-none tracking-tight text-white">
                        {video.title}
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground text-white">
                        {video.ownerDetails.username}
                      </p>
                      <p className="text-sm text-muted-foreground text-white">
                        {video.views} Views •{" "}
                        {getTimeDifference(video.createdAt)}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          : null}
      </div>
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

export default PlaylistPage;
