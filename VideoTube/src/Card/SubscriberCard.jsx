import React, { useState } from "react";
import defuser from "../assets/defuser.jpg";
import { Button } from "@/components/ui/button";
import { SlUserFollowing } from "react-icons/sl";
import { Link } from "react-router-dom";
import axios from "axios";
import { server } from "@/constants";

const SubscriberCard = ({ subscriber }) => {
  const [isSubscribed, setIsSubscribed] = useState(subscriber.isSubscribed);

  const toggleSubscription = async () => {
    try {
      const response = await axios.post(
        `${server}/subscriptions/c/${subscriber.username}`,
        {},
        { withCredentials: true }
      );
      console.log(response.data);
      if (isSubscribed) subscriber.subCount -= 1;
      else {
        subscriber.subCount += 1;
      }
      setIsSubscribed(!isSubscribed);
    } catch (error) {
      console.log("unable to toggle subscription");
    }
  };

  return (
    <div className="subscriber-card flex items-center justify-between p-4 px-6">
      <Link to={`/${subscriber.username}`}>
        <div className="flex items-center">
          <img
            src={subscriber.avatar || defuser}
            alt={subscriber.username}
            className="w-12 h-12 rounded-full border hover:border-purple-500"
          />
          <div className="ml-4">
            <h4 className="text-white font-bold hover:text-purple-500 hover:underline">
              {subscriber.username}
            </h4>
            <p className="text-gray-400 text-sm">
              {subscriber.subCount} • subscribers
            </p>
          </div>
        </div>
      </Link>
      <Button
        className={`px-4 py-2 text-sm font-semibold rounded-lg ${
          isSubscribed ? "bg-purple-700 text-white" : "bg-purple-500 text-white"
        }`}
        onClick={toggleSubscription}
      >
        <SlUserFollowing className="mr-2" />
        {isSubscribed ? "Subscribed" : "Subscribe"}
      </Button>
    </div>
  );
};

export default SubscriberCard;
