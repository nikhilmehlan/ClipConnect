import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast";

export default function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const { username, email } = useSelector((state) => state.userInfo);
  const [toast, setToast] = useState({
    message: "",
    variant: "default",
    isOpen: false,
  });

  const showToast = (message, variant) => {
    setToast({ message, variant, isOpen: true });
    setTimeout(() => {
      setToast((prevToast) => ({ ...prevToast, isOpen: false }));
    }, 3000);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("access_key", import.meta.env.VITE_WEB3_FORMS_API_KEY);
    formData.append("name", username);
    formData.append("email", email);
    formData.append("message", message);

    try {
      const response = await axios.post(
        "https://api.web3forms.com/submit",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        showToast(
          "Submitted Successfully! Thank you for your feedback.",
          "custom"
        );
        setMessage("");
      } else {
        console.error("Error", response.data);
        showToast(response.data.message, "destructive");
      }
    } catch (error) {
      console.error("Error", error);
      showToast("An error occurred. Please try again.", "destructive");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ToastProvider>
      <div className="p-6">
        <div className="text-white flex flex-col">
          <h2 className="text-4xl font-sans mb-8 mx-auto">
            Share Your Feedback
          </h2>
          <form onSubmit={onSubmit} className="space-y-6 mx-[40px]">
            <div>
              <label
                htmlFor="message"
                className="block text-lg font-medium text-white"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="8"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="mt-1 block w-full p-2 bg-black text-white border border-white rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting || !message}
                className={`bg-purple-500 text-white py-2 px-4 rounded-md shadow-sm ${
                  isSubmitting || !message
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                }`}
              >
                Submit
              </button>
            </div>
          </form>
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
        </div>
      </div>
    </ToastProvider>
  );
}
