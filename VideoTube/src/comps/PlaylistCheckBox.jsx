import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { AiOutlineCheck } from "react-icons/ai";
import axios from "axios";
import { server } from "@/constants";

const PlaylistCheckbox = ({ playlist, videoId }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const getVideoStatus = async () => {
      try {
        const response = await axios.get(
          `${server}/playlist/add/${videoId}/${playlist._id}`,
          { withCredentials: true }
        );
        const res = response.data;
        setIsChecked(res.data.inPlaylist);
      } catch (error) {
        console.log("Unable to fetch video status");
      }
    };
    getVideoStatus();
  }, [videoId, playlist._id]);

  const handleCheckboxChange = async () => {
    try {
      const curState = !isChecked;
      setIsChecked(curState);
      const url = curState
        ? `${server}/playlist/add/${videoId}/${playlist._id}`
        : `${server}/playlist/remove/${videoId}/${playlist._id}`;
      const response = await axios.patch(url, {}, { withCredentials: true });
      const res = response.data;
      console.log(res);
      setShowMessage(true);

      setTimeout(() => {
        setShowMessage(false);
      }, 2000);
    } catch (error) {
      console.log("Unable to perform add/remove operation");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={playlist._id}
        checked={isChecked}
        onCheckedChange={handleCheckboxChange}
        className="w-5 h-5 bg-white border rounded flex items-center justify-center"
      >
        {isChecked && <AiOutlineCheck className="text-purple-500" />}
      </Checkbox>
      <div className="flex flex-col">
        <label htmlFor={playlist._id} className="text-white">
          {playlist.name}
        </label>
        {showMessage && (
          <span className="text-xs text-gray-400 ml-1">
            {isChecked
              ? "Video added to playlist"
              : "Video removed from playlist"}
          </span>
        )}
      </div>
    </div>
  );
};

export default PlaylistCheckbox;
