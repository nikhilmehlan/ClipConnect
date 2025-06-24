import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { ClipLoader } from "react-spinners";
import { uploadToCloudinary } from "@/utils/cloudinary";
import axios from "axios";
import { server } from "../constants.js";

const EditVideoDialog = ({ _id, onUploadComplete, triggerComponent }) => {
  const [imageFileName, setImageFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm();

  const title = watch("title");
  const description = watch("description");
  const image = watch("image");

  useEffect(() => {
    setIsFormValid(!!title || !!description || !!image);
  }, [title, description, image]);

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

      let thumbnail = {};
      if (data.image) {
        const thumbnailUploadResponse = await uploadToCloudinary(data.image);
        thumbnail = {
          url: thumbnailUploadResponse.secure_url,
          public_id: thumbnailUploadResponse.public_id,
        };
      }

      const formData = {
        title: data.title,
        description: data.description,
        thumbnail: thumbnail,
      };

      const response = await axios.patch(`${server}/videos/${_id}`, formData, {
        withCredentials: true,
      });

      console.log(response.data);

      reset();
      setImageFileName("");
      setIsUploading(false);
      setDialogOpen(false);
      onUploadComplete({ video: response.data.data });
    } catch (error) {
      console.log(error);
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      <DialogContent className="bg-black text-white">
        <DialogTitle className="text-white">Edit Video</DialogTitle>
        <DialogDescription className="text-gray-400">
          Edit the video details
        </DialogDescription>
        {isUploading && (
          <div className="flex justify-center mt-4">
            <ClipLoader color={"#ffffff"} loading={isUploading} size={50} />
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <label className="block text-sm font-medium text-gray-400 w-24">
            Thumbnail:
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
                {imageFileName
                  ? imageFileName
                  : "Click to upload or drag and drop image"}
              </label>
            </div>
          </div>
          {errors.image && (
            <span className="text-red-500">{errors.image.message}</span>
          )}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-400">
              Title
            </label>
            <Input
              className="mt-1 bg-black text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="What is your title?"
              {...register("title")}
            />
            {errors.title && (
              <span className="text-red-500">{errors.title.message}</span>
            )}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-400">
              Description
            </label>
            <textarea
              className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-black text-white"
              placeholder="e.g. I joined Stripe’s Customer Success team to help them scale their checkout product. I focused mainly on onboarding new customers and resolving complaints."
              {...register("description")}
            />
            {errors.description && (
              <span className="text-red-500">{errors.description.message}</span>
            )}
          </div>
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
              disabled={!isFormValid}
            >
              Finish
            </Button>
          </div>
        </form>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
};

export default EditVideoDialog;
