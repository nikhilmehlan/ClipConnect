import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast";
import { server } from "@/constants";
import { useDispatch } from "react-redux";
import { setUsername, setEmail, setFullName } from "@/store/UserSlice";

const MyDetails = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset, // For resetting the form
  } = useForm();

  const dispatch = useDispatch();

  const watchedFields = watch(["username", "fullName", "email"]);
  const anyFieldFilled = watchedFields.some(
    (field) => field !== undefined && field !== ""
  );

  const onSubmit = async (data) => {
    try {
      const response = await axios.patch(
        `${server}/users/update-account`,
        { username: data.username, fullName: data.fullName, email: data.email },
        { withCredentials: true }
      );
      const res = response.data.data;
      dispatch(setEmail(res.user.email));
      dispatch(setUsername(res.user.username));
      dispatch(setFullName(res.user.fullName));

      showToast("Account details updated successfully", "custom");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.data &&
        error.response.data.data.message
      ) {
        showToast(error.response.data.data.message, "destructive");
      } else {
        showToast(
          "An unexpected error occurred. Please try again.",
          "destructive"
        );
      }
      reset(); // Clear the form
    }
  };

  const showToast = (message, variant) => {
    setToast({ message, variant, isOpen: true });
    setTimeout(() => {
      setToast((prevToast) => ({ ...prevToast, isOpen: false }));
    }, 4000);
  };

  const [toast, setToast] = React.useState({
    message: "",
    variant: "default",
    isOpen: false,
  });

  return (
    <ToastProvider>
      <div className="p-4 space-y-8 flex justify-between mx-20">
        {/* Portion 1: Text Display */}
        <div className="p-4 rounded-lg w-1/3 flex flex-col mt-4">
          <h2 className="text-lg font-semibold">Personal info</h2>
          <p className="text-gray-600">
            Update your photo and personal details.
          </p>
        </div>

        {/* Portion 2: Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 border border-white p-4 rounded-lg bg-black w-2/3"
        >
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300"
              >
                User name
              </label>
              <Input
                id="username"
                type="text"
                {...register("username")}
                className="mt-1 block w-full bg-black text-white border-gray-700"
              />
            </div>

            <div className="w-1/2">
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-300"
              >
                Full name
              </label>
              <Input
                id="fullName"
                type="text"
                {...register("fullName")}
                className="mt-1 block w-full bg-black text-white border-gray-700"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              })}
              className="mt-1 block w-full bg-black text-white border-gray-700"
            />
          </div>

          <Button
            type="submit"
            variants="destructive"
            className="hover:bg-white hover:text-black disabled:bg-gray-500 disabled:text-gray-400"
            disabled={!anyFieldFilled}
          >
            Update
          </Button>
        </form>
      </div>

      <Toast
        open={toast.isOpen}
        onOpenChange={(isOpen) => setToast({ ...toast, isOpen })}
        variant={toast.variant}
      >
        <ToastTitle>
          {toast.variant === "destructive" ? "Error" : "Success"}
        </ToastTitle>
        <ToastDescription>{toast.message}</ToastDescription>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
};

export default MyDetails;
