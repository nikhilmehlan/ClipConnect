import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { ClipLoader } from "react-spinners";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { IoCloudUploadOutline } from "react-icons/io5";
import axios from "axios";
import { server } from "../constants.js";
import { useDispatch } from "react-redux";
import { setAvatar } from "@/store/UserSlice.js";

const AvatarImageDialog = () => {
  const [imageFileName, setImageFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false); // Ensure dialogOpen state is correctly initialized
  const dispatch = useDispatch();

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();

  const image = watch("image");

  const onDropImage = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setImageFileName(acceptedFiles[0].name);
      setValue("image", acceptedFiles[0]);
    }
  };

  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
  } = useDropzone({
    onDrop: onDropImage,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/gif": [".gif"],
      "image/svg+xml": [".svg"],
    },
    multiple: false,
  });

  const onSubmit = async (data) => {
    try {
      setIsUploading(true);

      let avatar = {};
      if (data.image) {
        const imageUploadResponse = await uploadToCloudinary(data.image);
        avatar = {
          url: imageUploadResponse.secure_url,
          public_id: imageUploadResponse.public_id,
        };
      }

      const formData = {
        avatar: avatar.url,
      };

      const response = await axios.patch(
        `${server}/users/avatar`,
        formData,
        {
          withCredentials: true,
        }
      );

      dispatch(setAvatar(response.data.data.avatar));

      reset();
      setImageFileName("");
      setIsUploading(false);
      setDialogOpen(false);
    } catch (error) {
      console.log(error);
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <button onClick={() => setDialogOpen(true)}>
          <IoCloudUploadOutline size={30} className="text-gray-800" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-black text-white">
        <DialogTitle className="text-white">Edit Avatar Image</DialogTitle>
        <DialogDescription className="text-gray-400">
          Upload a new avatar image for your profile.
        </DialogDescription>
        {isUploading && (
          <div className="flex justify-center mt-4">
            <ClipLoader color={"#ffffff"} loading={isUploading} size={50} />
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <label className="block text-sm font-medium text-gray-400 w-24">
            Avatar Image:
          </label>
          <div className="mt-2 flex items-center">
            <div
              {...getImageRootProps()}
              className={`w-full h-24 border-2 ${
                isImageDragActive
                  ? "border-blue-500"
                  : "border-dashed border-gray-300"
              } rounded cursor-pointer flex items-center justify-center hover:bg-gray-800`}
            >
              <input {...getImageInputProps()} />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center w-full h-full cursor-pointer"
              >
                {imageFileName ? (
                  imageFileName
                ) : (
                  <div className="flex flex-col items-center">
                    <IoCloudUploadOutline size={25} className="text-white" />
                    <p>Click to upload or drag and drop image</p>
                  </div>
                )}
              </label>
            </div>
          </div>
          {errors.image && (
            <span className="text-red-500">{errors.image.message}</span>
          )}
          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              className="bg-gray-500 text-white font-bold hover:bg-gray-600 mr-2"
              onClick={() => {
                reset();
                setImageFileName("");
                setDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-500 text-white font-bold hover:bg-purple-600"
              disabled={!image}
            >
              Edit
            </Button>
          </div>
        </form>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};

export default AvatarImageDialog;
