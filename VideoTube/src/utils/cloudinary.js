import axios from "axios";

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "clipconnect"); // use the appropriate preset name
  formData.append("cloud_name", "dskidhlid"); // your cloud name

  const response = await axios.post(
    "https://api.cloudinary.com/v1_1/dskidhlid/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
