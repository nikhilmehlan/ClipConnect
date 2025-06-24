// main entry file (e.g., index.js)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/Store.js";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import {
  Home,
  Profile,
  Video,
  Following,
  Tweet,
  Playlist,
  Password,
  MyDetails,
} from "./comps/Compiled";
import {
  SearchPage,
  Videopage,
  WatchHistoryPage,
  PlaylistPage,
  LikedVidoesPage,
  StatsPage,
  SettingsPage,
  SupportPage,
} from "./pages/Compiled.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path=":profile" element={<Profile />}>
        <Route index element={<Video />} />
        <Route path="following" element={<Following />} />
        <Route path="tweet" element={<Tweet />} />
        <Route path="playlist" element={<Playlist />} />
      </Route>
      <Route path="video/:videoId" element={<Videopage />} />
      <Route path="find/:user" element={<SearchPage />} />
      <Route path="watchHistory" element={<WatchHistoryPage />} />
      <Route path="playlist/:playlistId" element={<PlaylistPage />} />
      <Route path="likedVideos" element={<LikedVidoesPage />} />
      <Route path="myVidoes" element={<StatsPage />} />
      <Route path="settings" element={<SettingsPage />}>
        <Route index element={<MyDetails />} />
        <Route path="password" element={<Password />}></Route>
      </Route>
      <Route path="support" element={<SupportPage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
