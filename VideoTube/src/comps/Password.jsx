import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { server } from "@/constants";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast";

const Password = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm();

  const watchedFields = watch(["password", "newPassword"]);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const [password, newPassword] = watchedFields;
    setIsFormValid(password && newPassword && newPassword.length >= 8);
  }, [watchedFields]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.patch(
        `${server}/users/change-password`,
        { oldPassword: data.password, newPassword: data.newPassword },
        { withCredentials: true }
      );
      showToast("Password updated successfully", "custom");
      reset();
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <ToastProvider>
      <div className="p-4 space-y-8 flex justify-between mx-20">
        {/* Portion 1: Text Display */}
        <div className="p-4 rounded-lg w-1/3 flex flex-col mt-4">
          <h2 className="text-lg font-semibold">Change Password</h2>
          <p className="text-gray-600">Update your account password.</p>
        </div>

        {/* Portion 2: Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 border border-white p-4 rounded-lg bg-black w-2/3"
        >
          <div className="flex flex-col space-y-4">
            <div className="relative w-full">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", { required: true })}
                className="mt-1 block w-full bg-black text-white border-gray-700"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  Password is required.
                </p>
              )}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-9 right-0 pr-3 flex "
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <div className="relative w-full">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-300"
              >
                New Password
              </label>
              <Input
                id="newPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("newPassword", {
                  required: true,
                  minLength: 8,
                })}
                className="mt-1 block w-full bg-black text-white border-gray-700"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.type === "minLength"
                    ? "New password must be at least 8 characters."
                    : "New password is required."}
                </p>
              )}
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-9 right-0 pr-3 flex "
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variants="destructive"
            className="hover:bg-white hover:text-black disabled:bg-gray-500 disabled:text-gray-400"
            disabled={!isFormValid}
          >
            Update Password
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

export default Password;
