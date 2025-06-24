import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VideoCard } from "@/comps/Compiled";
import defaultuser from "../assets/defuser.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SlUserFollowing } from "react-icons/sl";
import { server } from "@/constants";
import axios from "axios";

const SearchPageCard = ({ user }) => {
  const [isSubscribed, setIsSubscribed] = useState(user.isSubscribed);

  const toggleSubscription = async () => {
    try {
      const response = await axios.post(
        `${server}/subscriptions/c/${user.username}`,
        {},
        { withCredentials: true }
      );
      const res = response.data
      setIsSubscribed(!isSubscribed);
    } catch (error) {}
  };

  return (
    <div className="p-4 mx-5 mb-4">
      <div className="flex items-center justify-between pb-6 mb-4 border-b border-white">
        <Link to={`/${user.username}`}>
          <Avatar className="h-20 w-20 hover:border-4 border-purple-500 transition-all">
            <AvatarImage src={user.avatar || defaultuser} />
            <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 px-4">
          <Link to={`/${user.username}`}>
            <h2 className="text-white text-2xl font-bold hover:text-purple-500 hover:underline hover:underline-offset-4 hover:decoration-purple-500">
              {user.username}
            </h2>
            <p className="text-gray-400 hover:text-purple-500 hover:underline hover:underline-offset-4 hover:decoration-purple-500">
              @{user.fullName}
            </p>
          </Link>
          <p className="text-gray-400">{user.subscriberCount}•subscribers</p>
        </div>
        {!isSubscribed ? (
          <Button
            className="text-white bg-purple-500 hover:bg-purple-700"
            onClick={toggleSubscription}
          >
            {<SlUserFollowing className="mr-2" />} Subscribe
          </Button>
        ) : (
          <Button
            className="text-white bg-purple-700  hover:bg-purple-500"
            onClick={toggleSubscription}
          >
            {<SlUserFollowing className="mr-2" />} Subscribed
          </Button>
        )}
      </div>
      <div
        className={
          user.recentVideos.length > 0 ? `border-b border-white pb-2` : ""
        }
      >
        {user.recentVideos.length > 0
          ? user.recentVideos.map((video) => (
              <VideoCard
                key={video._id}
                video={{
                  ...video,
                  ownerDetails: {
                    username: user.username,
                    avatar: user.avatar,
                  },
                }}
              />
            ))
          : null}
      </div>
    </div>
  );
};

export default SearchPageCard;
