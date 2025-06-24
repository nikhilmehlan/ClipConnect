import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { server } from "@/constants";

const VideoDelete = ({ _id, handleChange }) => {
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${server}/videos/${_id}`, {
        withCredentials: true,
      });
      handleChange(_id);
    } catch (error) {
      console.log("Could not delete comment", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <MdDelete size={20} color="red" />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-black">
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to delete this video?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription></AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-white text-black">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-purple-500 hover:bg-purple-700"
            onClick={handleDelete}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default VideoDelete;
