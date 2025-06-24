import { VideoCard } from "@/comps/Compiled";
import { server } from "@/constants";
import axios from "axios";
import React, { useEffect, useState, useRef, useCallback } from "react";
import PlaylistDialog from "@/comps/PlaylistDialog";
import { Button } from "@/components/ui/button";
import { AiOutlineSave } from "react-icons/ai";

const LikedVidoesPage = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    const getLikedVidoes = async () => {
      try {
        const response = await axios.get(`${server}/likes/videos`, {
          params: { page, limit: 6 },
          withCredentials: true,
        });
        const res = response.data.data;

        if (res.docs.length < 6) {
          setHasMore(false);
        }

        setVideos((prevVideos) => {
          // Ensure videos are unique
          const newVideos = res.docs.filter(
            (newVideo) =>
              !prevVideos.some(
                (prevVideo) => prevVideo.video._id === newVideo.video._id
              )
          );
          return [...prevVideos, ...newVideos];
        });
      } catch (error) {
        console.log("Couldn't get liked Videos");
      }
    };

    getLikedVidoes();
  }, [page]);

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

  return (
    <div className="p-4 relative w-full">
      {videos.length !== 0
        ? videos.map((video, index) => {
            if (videos.length === index + 1) {
              return (
                <div
                  className="relative mb-4"
                  ref={lastVideoElementRef}
                  key={video.video._id}
                >
                  <div className="absolute top-2 right-2 z-10">
                    <PlaylistDialog
                      videoId={video.video._id}
                      presentCheckBox={true}
                      customTrigger={
                        <Button variant="secondary" className="ml-4">
                          <AiOutlineSave size={20} />
                        </Button>
                      }
                    />
                  </div>
                  <VideoCard video={video.video} />
                </div>
              );
            } else {
              return (
                <div className="relative mb-4" key={video.video._id}>
                  <div className="absolute top-2 right-2 z-10">
                    <PlaylistDialog
                      videoId={video.video._id}
                      presentCheckBox={true}
                      customTrigger={
                        <Button variant="secondary" className="ml-4">
                          <AiOutlineSave size={20} />
                        </Button>
                      }
                    />
                  </div>
                  <VideoCard video={video.video} />
                </div>
              );
            }
          })
        : null}
    </div>
  );
};

export default LikedVidoesPage;
