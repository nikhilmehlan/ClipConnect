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

const PlaylistDelete = ({ _id ,onChange}) => {
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${server}/playlist/${_id}`, {
        withCredentials: true,
      });
      onChange();
    } catch (error) {
      console.log("Could not delete comment", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <MdDelete size={25} />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-black">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Do you want to delete this playlist?
          </AlertDialogTitle>
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

export default PlaylistDelete;
