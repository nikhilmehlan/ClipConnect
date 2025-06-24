import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import defaultuser from "../assets/defuser.jpg";
import coverImg from "../assets/coverimage.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoCloudUploadOutline } from "react-icons/io5";
import { Outlet, useParams, Link, useLocation } from "react-router-dom";
import CoverImageDialog from "@/comps/CoverImageDialog";
import AvatarImageDialog from "@/comps/AvatarImageDialog";

const SettingsPage = () => {
  const location = useLocation();
  const { avatar, coverImage, fullName, username } = useSelector(
    (state) => state.userInfo
  );
  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (path === "settings") setActiveTab("My Details");
    else setActiveTab("Password");
  }, [location]);
  const [activeTab, setActiveTab] = useState("My Details");
  return (
    <div className="">
      {/* Cover Image */}
      <div className="relative h-[240px]">
        <img
          src={coverImage ? coverImage : coverImg}
          alt="Cover"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50">
          <CoverImageDialog />
        </div>
      </div>

      <div className="flex justify-between items-center bg-black p-4">
        <div className="flex items-center">
          <div className="relative -mt-12">
            <Avatar className="w-24 h-24 border-4 border-purple-500">
              <AvatarImage src={avatar ? avatar : defaultuser} alt="Avatar" />
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 rounded-full">
              <AvatarImageDialog />
            </div>
          </div>

          {/* Profile Information */}
          <div className="ml-4">
            <h2 className="text-2xl text-white font-bold">{fullName}</h2>
            <p className="text-gray-400">@{username}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center bg-black gap-2 pb-2 px-4 border-b-2 border-white">
        <Link
          to=""
          className={`flex-1 text-center py-2 cursor-pointer font-bold transition duration-300 ${
            activeTab === "My Details"
              ? "text-purple-500 border-b-2 border-purple-500 bg-white"
              : "text-white hover:text-green-700 hover:border-b-2 hover:border-green-700 hover:bg-white"
          }`}
          onClick={() => setActiveTab("My Details")}
        >
          My Details
        </Link>
        <Link
          to="password"
          className={`flex-1 text-center py-2 cursor-pointer font-bold transition duration-300 ${
            activeTab === "Password"
              ? "text-purple-500 border-b-2 border-purple-500 bg-white"
              : "text-white hover:text-green-700 hover:border-b-2 hover:border-green-700 hover:bg-white"
          }`}
          onClick={() => setActiveTab("Password")}
        >
          Password
        </Link>
      </div>
      <Outlet />
    </div>
  );
};

export default SettingsPage;
