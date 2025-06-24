import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, Controller, useWatch } from "react-hook-form";
import axios from "axios";
import { server } from "@/constants";
import { useDispatch } from "react-redux";
import { setEverything } from "@/store/UserSlice.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast";

const Signup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const fullName = useWatch({ control, name: "fullName" });
  const email = useWatch({ control, name: "email" });
  const username = useWatch({ control, name: "username" });
  const password = useWatch({ control, name: "password" });
  const [toasts, setToasts] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    setIsButtonDisabled(!fullName || !email || !username || !password);
  }, [fullName, email, username, password]);

  const showToast = (message, variant = "default") => {
    setToasts((prevToasts) => [
      ...prevToasts,
      { id: Date.now(), message, variant },
    ]);
    setTimeout(() => {
      setToasts((prevToasts) =>
        prevToasts.filter((toast) => toast.id !== Date.now())
      );
    }, 4000);
  };

  const signup = async (data) => {
    try {
      await axios.post(`${server}/users/register`, data);
      const response = await axios.post(`${server}/users/login`, data, {
        withCredentials: true,
      });
      const res = await response.data;
      dispatch(setEverything(res.data.user));
      showToast("Welcome back", "custom");
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ToastProvider>
      <div>
        <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="solid"
              className="bg-purple-500 text-white"
              onClick={() => setIsOpen(true)}
            >
              Sign Up
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-md p-4 bg-black text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Sign Up</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(signup)} className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-300"
                >
                  Name
                </label>
                <Controller
                  name="fullName"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      className="mt-1 block w-full bg-black text-white border-gray-700"
                      {...field}
                    />
                  )}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Email
                </label>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      className="mt-1 block w-full bg-black text-white border-gray-700"
                      {...field}
                    />
                  )}
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-300"
                >
                  Username
                </label>
                <Controller
                  name="username"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      id="username"
                      type="text"
                      autoComplete="username"
                      className="mt-1 block w-full bg-black text-white border-gray-700"
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="relative ">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300"
                >
                  Password
                </label>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="mt-1 block w-full bg-black text-white border-gray-700"
                      {...field}
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-9 right-0 pr-3 flex "
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              <div className="flex justify-end">
                <Button
                  variant="default"
                  type="submit"
                  disabled={isButtonDisabled}
                  className="hover:bg-white hover:text-black"
                >
                  Sign Up
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <ToastViewport />
        {toasts.map((toast) => (
          <Toast key={toast.id} variant={toast.variant}>
            <div className="flex">
              <div>
                <ToastTitle>
                  {toast.variant === "custom" ? "Success" : "Error"}
                </ToastTitle>
                <ToastDescription>{toast.message}</ToastDescription>
              </div>
              <ToastClose />
            </div>
          </Toast>
        ))}
      </div>
    </ToastProvider>
  );
};

export default Signup;
