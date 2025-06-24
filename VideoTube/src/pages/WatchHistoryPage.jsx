import WatchHistoryCard from "@/Card/WatchHistoryCard";
import React from "react";
import { useSelector } from "react-redux";
import { GrHistory } from "react-icons/gr";

const WatchHistoryPage = () => {
  const watchHistory = useSelector((state) => state.userInfo.watchHistory);
  return (
    <div className="p-2">
      {watchHistory.length > 0 ? (
        watchHistory.map((videoId) => (
          <WatchHistoryCard videoId={videoId} key={videoId} />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <GrHistory size={100} />
          <h1 className="mt-4 text-2xl font-bold">No watch history</h1>
          <h2 className="mt-4 ">Press home icon to explore new clips</h2>
        </div>
      )}
    </div>
  );
};

export default WatchHistoryPage;
