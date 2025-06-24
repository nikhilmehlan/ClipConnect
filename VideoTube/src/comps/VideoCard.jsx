import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const VideoCard = ({ video }) => {
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

  return (
    <div className="flex mb-4 bg-black overflow-hidden gap-4">
      <Link to={`/video/${video._id}`} className="w-1/4">
        <img
          src={video.thumbnail.url}
          alt={video.title}
          className="h-[210px] object-cover w-full"
        />
      </Link>
      <div className="w-3/4">
        <Link to={`/video/${video._id}`} className="block">
          <h2 className="text-white font-bold mb-2 text-2xl">{video.title}</h2>
        </Link>
        <p className="text-white text-sm mb-2">
          {`${video.views}  `} Views •{" "}
          <span className="ml-2">{getTimeDifference(video.createdAt)}</span>
        </p>
        <Link to={`/${video.ownerDetails.username}`} className="block">
          <div className="flex items-center mb-3 gap-2">
            <Avatar className="h-10 w-10 hover:border-2 border-purple-500">
              <AvatarImage src={video.ownerDetails.avatar} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="text-white text-base font-semibold hover:text-purple-500 hover:underline hover:underline-offset-4 hover:decoration-purple-500">
              {video.ownerDetails.username}
            </p>
          </div>
        </Link>
        <p className="text-white mb-2">{video.description}</p>
      </div>
    </div>
  );
};

export default VideoCard;
