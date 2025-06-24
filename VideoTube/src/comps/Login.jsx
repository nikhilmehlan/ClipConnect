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
import { server } from "../constants.js";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setEverything } from "@/store/UserSlice.js";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { control, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const username = useWatch({ control, name: "username" });
  const password = useWatch({ control, name: "password" });
  const [toasts, setToasts] = useState([]);

  const showToast = (message, variant = "default") => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, message, variant }]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const login = async (data) => {
    try {
      const response = await axios.post(`${server}/users/login`, data, {
        withCredentials: true,
      });
      const res = await response.data;
      console.log(res);
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

  const isButtonDisabled = !username || !password;

  return (
    <ToastProvider>
      <div>
        <Dialog isOpen={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" onClick={() => setIsOpen(true)}>
              Log in
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-md p-4 bg-black text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Login</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(login)} className="space-y-4">
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
                  Login
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

export default Login;
