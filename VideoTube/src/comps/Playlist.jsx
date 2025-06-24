import { server } from "@/constants";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RiPlayListAddFill } from "react-icons/ri";
import PlaylistCard from "@/Card/PlaylistCard";
import { Button } from "@/components/ui/button";
import PlaylistDialog from "./PlaylistDialog";
import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";

const Playlist = () => {
  const { profile } = useParams();
  const username = useSelector((state) => state.userInfo.username);
  const [playlists, setPlaylists] = useState([]);
  const [prev, setPrev] = useState(1);

  useEffect(() => {
    const getAllPlaylist = async () => {
      try {
        const response = await axios.get(`${server}/playlist/user/${profile}`, {
          withCredentials: true,
        });
        const res = response.data;
        console.log(res.data);
        setPlaylists(res.data);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };
    getAllPlaylist();
  }, [profile, prev]);

  const onChange = () => {
    const newPrev = prev + 1;
    setPrev(newPrev);
  };

  return (
    <div className="p-4">
      {username === profile ? (
        <PlaylistDialog
          presentCheckBox={false}
          customTrigger={
            <Button className="bg-purple-500 text-white font-bold flex items-center hover:bg-purple-700 mb-4">
              <FaPlus className="mr-2" />
              Add Playlist
            </Button>
          }
          onChange={onChange}
        />
      ) : null}
      {playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-[100px]">
          <RiPlayListAddFill size={100} />
          <h1 className="mt-4 text-2xl font-bold">No Playlists created</h1>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist._id}
              playlist={playlist}
              onChange={onChange}
              del={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlist;
