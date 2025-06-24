import React, { useEffect, useState, useContext } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
} from "@/components/ui/table";
import VideoUploadDialog from "@/comps/VideoUploadDialog";
import axios from "axios";
import { server } from "@/constants";
import { useSelector } from "react-redux";
import { FaRegEye } from "react-icons/fa6";
import { SlUserFollowing } from "react-icons/sl";
import { GrLike } from "react-icons/gr";
import StatsCard from "@/Card/StatsCard";
import { SidebarContext } from "../App.jsx";

const StatsPage = () => {
  const fullName = useSelector((state) => state.userInfo.fullName);
  const [stats, getStats] = useState();
  const [videos, setVidoes] = useState([]);
  const isExpanded = useContext(SidebarContext);

  const handleDelete = (_id) => {
    const newvideo = videos.filter((v) => v._id !== _id);
    setVidoes(newvideo);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${server}/dashboard/stats`, {
          withCredentials: true,
        });
        const res = response.data;
        getStats(res.data);
        setVidoes(res.data.videos);
      } catch (error) {
        console.log("Unable to fetch channel stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {fullName}</h1>
          <p>Track, manage and forecast your customers and orders.</p>
        </div>
        <div className="mr-2">
          <VideoUploadDialog />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-4 ml-4">
        <div className="border-2 p-4 rounded-none">
          <FaRegEye size={30} className="mb-4" />
          <p>Total Views</p>
          <h2 className="text-4xl">{stats ? stats.videoViews : 0}</h2>
        </div>
        <div className="border-2 p-4 rounded-none">
          <SlUserFollowing size={30} className="mb-4" />
          <p>Total Subscriber</p>
          <h2 className="text-4xl">{stats ? stats.subscriberCount : 0}</h2>
        </div>
        <div className="border-2 p-4 rounded-none">
          <GrLike className="mb-4" size={30} />
          <p>Total Likes</p>
          <h2 className="text-4xl">{stats ? stats.likesCount : 0}</h2>
        </div>
      </div>
      <div className="border border-white mt-6 ml-4">
        <Table className="rounded-lg">
          <TableHeader>
            <TableRow className="border-none">
              <TableHead className="text-white px-6">Status</TableHead>
              <TableHead className="text-white px-6">
                Published Status
              </TableHead>
              <TableHead className="text-white px-6">Uploaded</TableHead>
              <TableHead className="text-white px-6">Rating</TableHead>
              <TableHead className="text-white px-6">Date uploaded</TableHead>
              <TableHead className="text-white px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.length !== 0 &&
              videos.map((video) => (
                <StatsCard
                  key={video._id}
                  video={video}
                  handleDelete={handleDelete}
                />
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StatsPage;
