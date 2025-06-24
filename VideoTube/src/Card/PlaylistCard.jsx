import React, { useEffect, useState } from "react";
import defPlaylist from "../assets/defPlaylist.png";
import axios from "axios";
import { server } from "../constants.js";
import { RiPlayListAddFill } from "react-icons/ri";
import PlaylistDelete from "@/alerts/PlaylistDelete";
import { Link } from "react-router-dom";

const PlaylistCard = ({ playlist, onChange, del }) => {
  const [coverImage, setCoverImage] = useState();

  useEffect(() => {
    const getCoverImage = async () => {
      try {
        const response = await axios.get(
          `${server}/videos/${playlist.videos[0]}`
        );
        const res = response.data;
        setCoverImage(res.data.thumbnail.url);
      } catch (error) {
        console.log("Failed to fetch cover image", error);
      }
    };

    if (playlist.videos.length !== 0) getCoverImage();
  }, [playlist.videos]);

  return (
    <div className="relative w-full h-60 overflow-hidden bg-gray-600">
      <Link to={`/playlist/${playlist._id}`} className="block h-full">
        <img src={coverImage || defPlaylist} alt="playlist cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/40 to-transparent p-4">
          <div className="text-white">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">{playlist.name}</h2>
              <RiPlayListAddFill size={20} />
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>{getTimeDifference(playlist.createdAt)}</span>
              <span>{playlist.videos.length} videos</span>
            </div>
          </div>
        </div>
      </Link>
      {del && (
        <div className="absolute top-2 right-2 z-10">
          <PlaylistDelete _id={playlist._id} onChange={onChange} />
        </div>
      )}
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

export default PlaylistCard;
