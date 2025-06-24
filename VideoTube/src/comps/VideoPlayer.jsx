import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "@/constants";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import PlayerDetail from "./PlayerDetails";
import { FaRegPlayCircle } from "react-icons/fa";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const VideoPlayer = () => {
  const { videoId } = useParams();
  const defaultVideoUrl = "default_video_url.mp4";
  const [video, setVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnail, setThumbnail] = useState();

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axios.get(`${server}/videos/${videoId}`);
        const res = response.data;
        setVideo(res.data);
        setThumbnail(res.data.thumbnail.url);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchVideoData();
  }, [videoId]);

  const handleThumbnailClick = () => {
    setIsPlaying(true);
  };

  const onChange = (updatedThumbnail) => {
    setThumbnail(updatedThumbnail);
  };

  return (
    <div className="bg-black shadow-lg">
      <AspectRatio ratio={16 / 9}>
        {!isPlaying ? (
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={handleThumbnailClick}
          >
            <img
              src={thumbnail ? thumbnail : "default_thumbnail.png"}
              alt="Thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="text-white text-4xl">
                <FaRegPlayCircle size={75} />
              </button>
            </div>
          </div>
        ) : (
          <ReactPlayer
            url={video ? video.videoFile.url : defaultVideoUrl}
            controls
            width="100%"
            height="100%"
            playing={true}
            className="absolute inset-0 bg-black"
          />
        )}
      </AspectRatio>
      {video && <PlayerDetail video={video} onChange={onChange} />}
    </div>
  );
};

export default VideoPlayer;
