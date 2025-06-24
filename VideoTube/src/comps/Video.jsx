import { server } from "@/constants";
import axios from "axios";
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useContext,
} from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import VideoUploadDialog from "./VideoUploadDialog";
import { useSelector } from "react-redux";
import { SidebarContext } from "@/App"; // Adjust the import path as necessary

const Video = () => {
  const isExpanded = useContext(SidebarContext);
  const username = useSelector((state) => state.userInfo.username);
  const { profile } = useParams();
  const [cur, setCur] = useState(profile);
  const [videos, setVideos] = useState([]);
  const [flag, setFlag] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const lastVideoElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  const getAllVideos = useCallback(
    async (reset = false) => {
      try {
        if (reset || cur !== profile) {
          setCur(profile);
          setPage(1);
          setVideos([]);
        }
        const isOwnProfile = profile === username;
        const response = await axios.get(
          `${server}/videos/allVideos/${
            profile.charAt(0) === ":" ? profile.substring(1) : profile
          }`,
          {
            params: {
              page: reset ? 1 : page,
              limit: 4,
              sortType: "ascending",
              isOwnProfile,
            },
          }
        );
        const res = response.data;
        setVideos((prevVideos) => {
          const newVideos = res.data.videos.filter(
            (video) =>
              !prevVideos.some((prevVideo) => prevVideo._id === video._id)
          );
          return reset ? newVideos : [...prevVideos, ...newVideos];
        });
        setHasMore(res.data.nextPage !== null);
      } catch (error) {
        console.error(error);
      }
    },
    [cur, profile, page, username]
  );

  useEffect(() => {
    setFlag(
      (profile.charAt(0) === ":" ? profile.substring(1) : profile) === username
    );
    getAllVideos(true);
  }, [profile]);

  useEffect(() => {
    if (page > 1) {
      getAllVideos();
    }
  }, [page]);

  const handleUploadComplete = () => {
    getAllVideos(true); // Reset and fetch from the first page
  };

  const getTimeDifference = (date) => {
    const now = new Date();
    const videoDate = new Date(date);
    const diffInSeconds = Math.floor((now - videoDate) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
    if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return `just now`;
  };

  return (
    <div className={`w-full px-4 bg-black text-white min-h-[50vh]`}>
      {flag && (
        <div className="flex w-full py-4">
          <VideoUploadDialog onUploadComplete={handleUploadComplete} />
        </div>
      )}

      <div
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${
          !flag ? "py-4" : ""
        }`}
      >
        {videos.map((video, index) => (
          <Link to={`/video/${video._id}`} key={video._id}>
            <Card className="bg-black text-white border-none">
              <CardHeader className="p-0">
                <img
                  src={video.thumbnail.url}
                  alt={video.title}
                  className={`w-[95%] object-cover ${
                    !isExpanded ? "h-60" : "h-40"
                  }`}
                />
              </CardHeader>
              <CardContent className="text-left p-0">
                <h3 className="text-lg font-bold my-2">{video.title}</h3>
                <p className="text-sm">
                  {video.views} Views • {getTimeDifference(video.createdAt)}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
        <div ref={lastVideoElementRef} className="text-white text-center mt-4">
          {hasMore && "Loading more videos..."}
        </div>
      </div>
    </div>
  );
};

export default Video;
