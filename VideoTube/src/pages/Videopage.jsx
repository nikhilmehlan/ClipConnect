import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { VideoPlayer, RecommendedVideos, Comments } from "@/comps/Compiled.js";
import { useDispatch, useSelector } from "react-redux";
import { setWatchHistory } from "@/store/UserSlice";

const Videopage = () => {
  const dispatch = useDispatch();
  const watchHistory = useSelector((state) => state.userInfo.watchHistory);
  const { videoId } = useParams();
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    let updatedHistory = watchHistory.filter((ele) => ele !== videoId);
    if (updatedHistory.length === 15) {
      updatedHistory.pop();
    }
    updatedHistory = [videoId, ...updatedHistory];

    dispatch(setWatchHistory(updatedHistory));
  }, [videoId]);

  return (
    <div className="bg-black px-6 py-4 flex h-full">
      <div className="main-video-container flex-1 mr-4">
        <VideoPlayer videoId={videoId} />
        <Comments videoId={videoId} className="no-scrollbar overflow-y-auto" />
      </div>
      <div
        className={`sidebar no-scrollbar overflow-y-auto transition-all duration-500 ${
          isExpanded ? "w-1/3" : "w-1/4"
        }`}
      >
        <RecommendedVideos />
      </div>
    </div>
  );
};

export default Videopage;
