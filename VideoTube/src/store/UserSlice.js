import { createSlice } from "@reduxjs/toolkit";

const persistedUser = JSON.parse(localStorage.getItem("user"));

const initialState = persistedUser || {
  username: "",
  email: "",
  fullName: "",
  avatar: "",
  coverImage: "",
  watchHistory: [],
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setEverything: (state, action) => {
      const { username, email, fullName, avatar, coverImage, watchHistory } =
        action.payload;
      state.username = username;
      state.email = email;
      state.fullName = fullName;
      state.avatar = avatar;
      state.coverImage = coverImage;
      state.watchHistory = watchHistory;
      state.isLoggedIn = !!username;
      // Store the updated state in local storage
      localStorage.setItem("user", JSON.stringify(state));
    },
    setUsername(state, action) {
      state.username = action.payload;
      state.isLoggedIn = !!state.username;
      localStorage.setItem("user", JSON.stringify(state));
    },
    setEmail(state, action) {
      state.email = action.payload;
      localStorage.setItem("user", JSON.stringify(state));
    },
    setFullName(state, action) {
      state.fullName = action.payload;
      localStorage.setItem("user", JSON.stringify(state));
    },
    setAvatar(state, action) {
      state.avatar = action.payload;
      localStorage.setItem("user", JSON.stringify(state));
    },
    setCoverImage(state, action) {
      state.coverImage = action.payload;
      localStorage.setItem("user", JSON.stringify(state));
    },
    setWatchHistory(state, action) {
      state.watchHistory = action.payload;
      localStorage.setItem("user", JSON.stringify(state));
    },
    logout(state) {
      state.username = "";
      state.email = "";
      state.fullName = "";
      state.avatar = "";
      state.coverImage = "";
      state.watchHistory = [];
      state.isLoggedIn = false;
      localStorage.removeItem("user");
    },
  },
});

export const {
  setEverything,
  setAvatar,
  setWatchHistory,
  setEmail,
  setCoverImage,
  setFullName,
  setUsername,
  logout,
} = userSlice.actions;

export default userSlice.reducer;
