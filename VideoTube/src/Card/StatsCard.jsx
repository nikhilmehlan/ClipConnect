import React, { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { server } from "@/constants";
import VideoDelete from "@/alerts/VideoDelete";
import { Link } from "react-router-dom";
import EditVideoDialog from "@/comps/EditVideoDialog";
import { MdModeEdit } from "react-icons/md";

const StatsCard = ({ video, handleDelete }) => {
  const [isPublished, setIsPublished] = useState(video.isPublished);
  const [videoInfo, setVideoInfo] = useState({
    _id: video._id,
    likes: video.likes,
    views: video.views,
    createdAt: video.createdAt,
    title: video.title,
  });

  const handleChange = async () => {
    try {
      setIsPublished((prevState) => !prevState);
      await axios.patch(
        `${server}/videos/toggle/publish/${video._id}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
    }
  };

  const handleEdit = ({ video }) => {
    setVideoInfo((prevInfo) => ({
      ...prevInfo,
      title: video.title,
    }));
  };

  return (
    <TableRow className="border-t border-white">
      <TableCell className="flex items-center justify-center px-6">
        <Switch checked={isPublished} onCheckedChange={handleChange} />
      </TableCell>
      <TableCell
        className={`text-center px-6 ${
          isPublished ? "text-green-600" : "text-orange-600"
        }`}
      >
        {isPublished ? "Published" : "Unpublished"}
      </TableCell>
      <TableCell className="text-center px-6 ">
        <Link
          to={`/video/${videoInfo._id}`}
          className="hover:text-purple-500 hover:font-bold"
        >
          {videoInfo.title}
        </Link>
      </TableCell>
      <TableCell className="text-center px-6">
        {videoInfo.views} views / {videoInfo.likes} likes
      </TableCell>
      <TableCell className="text-center px-6">
        {new Date(videoInfo.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-center px-6">
        <div className="flex justify-center gap-x-3">
          <VideoDelete _id={videoInfo._id} handleChange={handleDelete} />
          <EditVideoDialog
            _id={videoInfo._id}
            onUploadComplete={handleEdit}
            triggerComponent={<MdModeEdit size={20} />}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default StatsCard;
