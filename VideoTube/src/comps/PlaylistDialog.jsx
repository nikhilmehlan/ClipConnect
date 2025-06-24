import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { server } from "@/constants";
import { useSelector } from "react-redux";
import PlaylistCheckbox from "./PlaylistCheckBox";
import { AiOutlineSave } from "react-icons/ai";

const PlaylistDialog = ({
  videoId,
  presentCheckBox,
  customTrigger,
  onChange,
}) => {
  const username = useSelector((state) => state.userInfo.username);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const getAllPlaylist = async () => {
    try {
      const response = await axios.get(`${server}/playlist/user/${username}`, {
        withCredentials: true,
      });
      const res = response.data;
      setPlaylists(res.data);
    } catch (error) {
      console.log("Unable to fetch playlists");
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      const response = await axios.post(
        `${server}/playlist`,
        {
          name: playlistName,
          description: playlistDescription,
        },
        { withCredentials: true }
      );
      const res = response.data;
      setPlaylistName("");
      setPlaylistDescription("");
      if (presentCheckBox) {
        setPlaylists((prevPlaylists) => [...prevPlaylists, res.data]);
      }
      onChange();
      if (!presentCheckBox) {
        setIsOpen(false); // Close the dialog if presentCheckBox is false
      }
    } catch (error) {
      console.log("Could not create a playlist");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(isOpen);
        if (isOpen && presentCheckBox) {
          getAllPlaylist();
        }
      }}
    >
      <DialogTrigger>
        {customTrigger ? (
          customTrigger
        ) : (
          <Button variant="secondary" className="ml-4">
            <AiOutlineSave className="mr-2" size={18} />
            <span className="font-bold">Save</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-black w-80 h-auto p-4">
        <DialogHeader>
          <DialogTitle>Save To Playlist</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {playlists.length > 0 &&
            playlists.map((playlist) => (
              <PlaylistCheckbox
                key={playlist._id}
                playlist={playlist}
                videoId={videoId}
              />
            ))}
        </div>
        <div className="mt-2">
          <label className="block mb-2 text-white">Name</label>
          <Input
            type="text"
            placeholder="Enter playlist name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className="w-full border border-gray-300 rounded bg-gray-800 text-white"
          />
        </div>
        {playlistName && (
          <div className="mt-2">
            <label className="block mb-2 text-white">Description</label>
            <Input
              type="text"
              placeholder="Enter playlist description"
              value={playlistDescription}
              onChange={(e) => setPlaylistDescription(e.target.value)}
              className="w-full border border-gray-300 rounded bg-gray-800 text-white"
            />
          </div>
        )}
        <DialogFooter>
          <Button
            onClick={handleCreatePlaylist}
            className="mt-4 bg-purple-500 text-white w-full"
          >
            Create new Playlist
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistDialog;
