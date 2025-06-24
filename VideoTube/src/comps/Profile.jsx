import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import coverImg from "../assets/coverimage.jpg";
import axios from "axios";
import { server } from "@/constants";
import {
  Outlet,
  useParams,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import defaultuser from "../assets/defuser.jpg";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { SlUserFollowing } from "react-icons/sl";
import { LiaUserEditSolid } from "react-icons/lia";

const Profile = () => {
  const navigate = useNavigate();
  const curUsername = useSelector((state) => state.userInfo.username);
  const { profile } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Videos");
  const [subCount, setSubCount] = useState(0);
  const [subChannelCount, setSubChannelCount] = useState(0);
  const [username, setUsername] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [fullName, setFullName] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const dashboard = async () => {
      try {
        const response = await axios.get(`${server}/dashboard/${profile}`);
        const res = await response.data;
        console.log(res);
        setSubChannelCount(res.data.subscribedChannelCount);
        setSubCount(res.data.subscriberCount);
        setUsername(res.data.username);
        setCoverImage(res.data.coverImage);
        setAvatar(res.data.avatar);
        setFullName(res.data.fullName);
      } catch (error) {
        console.error("Error fetching profile data", error);
      }
    };
    const checkSubscription = async () => {
      try {
        const response = await axios.get(`${server}/subscriptions/${profile}`, {
          withCredentials: true,
        });
        const res = response.data;
        setIsSubscribed(res.data.status);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    dashboard();
    if (profile !== curUsername) checkSubscription();

    let path = location.pathname.split("/").pop();
    path = path.replace("%20", " ");

    if (path === profile) {
      setActiveTab("Videos");
    } else {
      setActiveTab(path.charAt(0).toUpperCase() + path.slice(1));
    }
  }, [profile, location.pathname]);

  const toggleSubscription = async () => {
    try {
      const response = await axios.post(
        `${server}/subscriptions/c/${profile}`,
        {},
        { withCredentials: true }
      );
      console.log(response.data);
      setIsSubscribed(!isSubscribed);
    } catch (error) {}
  };

  const toSettings = () => {
    navigate("/settings");
  };
  return (
    <div className="w-full h-full">
      {/* Cover Image */}
      <div className="relative h-[240px]">
        <img
          src={coverImage ? coverImage : coverImg}
          alt="Cover"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Profile Section */}
      <div className="flex justify-between items-center bg-black p-4">
        <div className="flex items-center">
          <div className="relative -mt-12">
            <Avatar className="w-24 h-24 border-4 border-purple-500">
              <AvatarImage src={avatar ? avatar : defaultuser} alt="Avatar" />
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Information */}
          <div className="ml-4">
            <h2 className="text-2xl text-white font-bold">{fullName}</h2>
            <p className="text-gray-400">@{username}</p>
            <p className="text-gray-400">
              {subCount} Subscribers • {subChannelCount} Subscribed
            </p>
          </div>
        </div>

        <div className="mr-8 font-semibold">
          {profile === curUsername ? (
            <Button
              className="text-white bg-purple-500 hover:bg-purple-700"
              onClick={toSettings}
            >
              {<LiaUserEditSolid className="mr-2" size={20} />} Edit
            </Button>
          ) : !isSubscribed ? (
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
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center bg-black gap-2 pb-2 px-4 border-b-2 border-white">
        <Link
          to=""
          className={`flex-1 text-center py-2 cursor-pointer font-bold transition duration-300 ${
            activeTab === "Videos"
              ? "text-purple-500 border-b-2 border-purple-500 bg-white"
              : "text-white hover:text-green-700 hover:border-b-2 hover:border-green-700 hover:bg-white"
          }`}
          onClick={() => setActiveTab("Videos")}
        >
          Videos
        </Link>
        <Link
          to="playlist"
          className={`flex-1 text-center py-2 cursor-pointer font-bold transition duration-300 ${
            activeTab === "Playlist"
              ? "text-purple-500 border-b-2 border-purple-500 bg-white"
              : "text-white hover:text-green-700 hover:border-b-2 hover:border-green-700 hover:bg-white"
          }`}
          onClick={() => setActiveTab("Playlist")}
        >
          Playlist
        </Link>
        <Link
          to="tweet"
          className={`flex-1 text-center py-2 cursor-pointer font-bold transition duration-300 ${
            activeTab === "Tweet"
              ? "text-purple-500 border-b-2 border-purple-500 bg-white"
              : "text-white hover:text-green-700 hover:border-b-2 hover:border-green-700 hover:bg-white"
          }`}
          onClick={() => setActiveTab("Tweet")}
        >
          Tweets
        </Link>
        <Link
          to="following"
          className={`flex-1 text-center py-2 cursor-pointer font-bold transition duration-300 ${
            activeTab === "Following"
              ? "text-purple-500 border-b-2 border-purple-500 bg-white"
              : "text-white hover:text-green-700 hover:border-b-2 hover:border-green-700 hover:bg-white"
          }`}
          onClick={() => setActiveTab("Following")}
        >
          Following
        </Link>
      </div>

      {/* Render the nested routes */}
      <Outlet />
    </div>
  );
};

export default Profile;
