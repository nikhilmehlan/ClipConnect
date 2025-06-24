import React, { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Picker from "@emoji-mart/react";
import emojiData from "@emoji-mart/data";
import { Button } from "@/components/ui/button";
import { server } from "@/constants";
import axios from "axios";
import DOMPurify from "dompurify";

const TweetEditor = ({ addTweet }) => {
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const quillRef = useRef(null);

  const handleEmojiSelect = (emoji) => {
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection(true);
    if (!range) {
      quill.insertText(content.length, emoji.native);
      quill.setSelection(content.length + emoji.native.length);
    } else {
      quill.insertText(range.index, emoji.native);
      quill.setSelection(range.index + emoji.native.length);
    }
  };

  const handleEmojiButtonClick = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleSubmit = async () => {
    try {
      const cleanContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
      const response = await axios.post(
        `${server}/tweets/`,
        { content: cleanContent },
        { withCredentials: true }
      );
      const res = response.data;
      setContent("");
      addTweet({tweet:res.data});
    } catch (error) {
      console.error("Failed to add tweet", error);
    }
  };

  return (
    <div className="my-5 mx-10 relative">
      <div className="relative">
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={setContent}
          placeholder="Write a tweet..."
          modules={{
            toolbar: false, // Disable default toolbar
          }}
          formats={["emoji"]} // Add emoji format
          style={{
            height: "125px",
            color: "white",
            background: "black",
            fontSize: "20px",
            fontWeight: "bold", // Bold font
          }} // Styling for dark mode and larger text
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-1">
          <Button className="bg-white" onClick={handleEmojiButtonClick}>
            {showEmojiPicker ? "Close" : "😊"}
          </Button>
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            onClick={handleSubmit}
          >
            Send
          </button>
        </div>
        {showEmojiPicker && (
          <div className="absolute bottom-14 right-2 z-10">
            <Picker
              data={emojiData}
              onEmojiSelect={handleEmojiSelect}
              theme="dark" // Dark theme for emoji picker
              title="Pick your emoji..."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TweetEditor;
