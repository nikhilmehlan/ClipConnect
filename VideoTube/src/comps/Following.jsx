import SubscriberCard from "@/Card/SubscriberCard";
import { Input } from "@/components/ui/input";
import { server } from "@/constants";
import axios from "axios";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";

const Following = () => {
  const { profile } = useParams();
  const [subscribers, setSubscribers] = useState([]);
  const [visibleSubscribers, setVisibleSubscribers] = useState([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const observer = useRef();

  useEffect(() => {
    const getSubscribers = async () => {
      try {
        const response = await axios.get(
          `${server}/subscriptions/u/${profile}`,
          { withCredentials: true }
        );
        const res = response.data;
        setSubscribers(res.data);
        setVisibleSubscribers(res.data.slice(0, 10)); // Load the first 10 subscribers
        setFilteredSubscribers(res.data);
      } catch (error) {
        console.log("Unable to fetch subscribers");
      }
    };
    getSubscribers();
  }, [profile]);

  const loadMoreSubscribers = () => {
    setVisibleSubscribers((prevVisibleSubscribers) => [
      ...prevVisibleSubscribers,
      ...filteredSubscribers.slice(page * 10, (page + 1) * 10),
    ]);
    setPage((prevPage) => prevPage + 1);
  };

  const lastSubscriberElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMoreSubscribers();
        }
      });
      if (node) observer.current.observe(node);
    },
    [filteredSubscribers, page]
  );

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = subscribers.filter((subscriber) =>
      subscriber.username.toLowerCase().startsWith(query)
    );
    setFilteredSubscribers(filtered);
    setVisibleSubscribers(filtered.slice(0, 10));
    setPage(1);
  };

  return (
    <div className="w-full">
      <div className="w-full px-6 mt-4">
        <Input
          type="text"
          placeholder="Search subscribers"
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 text-white bg-black rounded-none"
        />
      </div>
      {visibleSubscribers.map((subscriber, index) => {
        if (visibleSubscribers.length === index + 1) {
          return (
            <div ref={lastSubscriberElementRef} key={subscriber._id}>
              <SubscriberCard subscriber={subscriber} />
            </div>
          );
        } else {
          return (
            <SubscriberCard key={subscriber._id} subscriber={subscriber} />
          );
        }
      })}
    </div>
  );
};

export default Following;
