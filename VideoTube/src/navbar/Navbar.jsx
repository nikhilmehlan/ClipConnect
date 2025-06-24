import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "@/comps/Login";
import Signup from "@/comps/Signup";
import defaultuser from "../assets/defuser.jpg";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import Logout from "@/alerts/Logout";
import { Button } from "@/components/ui/button";
import { CiSearch } from "react-icons/ci";
import { RxCross1 } from "react-icons/rx";
import { Input } from "@/components/ui/input";
import CCLogo from "../assets/CCLogo.png"

const Navbar = () => {
  const { isLoggedIn, avatar, username } = useSelector(
    (state) => state.userInfo
  );

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (searchTerm.trim() === "") navigate("/");
      else navigate(`/find/${searchTerm}`);
    }
  };

  const handleSubmit = () => {
    if (searchTerm.trim() === "") {
      navigate("/");
    } else navigate(`/find/${searchTerm}`);
  };

  const clearAll = () => {
    setSearchTerm("");
  };

  return (
    <nav className="bg-black text-white flex items-center justify-between p-4 border-b border-white">
      <div className="flex items-center space-x-4">
        <img src={CCLogo} alt="Logo" className="h-[40px]" />
      </div>
      <div className="flex-grow flex justify-center items-center">
        <div className="relative w-full max-w-md flex">
          <Input
            type="text"
            className="bg-gray-800 text-white w-full pl-4 pr-10 rounded-l-full border-2"
            placeholder="Explore"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ outline: "none", boxShadow: "none" }} // Remove focus outline and box shadow
          />
          <button
            className="absolute right-14 top-1/2 transform -translate-y-1/2 text-white"
            onClick={clearAll}
          >
            <RxCross1 size={15} className="mr-2" />
          </button>
          <Button
            onClick={handleSubmit}
            className="bg-gray-800 text-white px-4 rounded-r-full border-y-2 border-r-2 border-white hover:bg-white hover:text-black"
          >
            <CiSearch size={20} />
          </Button>
        </div>
      </div>
      {!isLoggedIn ? (
        <div className="flex items-center space-x-2">
          <Login />
          <Signup />
        </div>
      ) : (
        <div className="flex gap-4">
          <Link to={`/${username}`}>
            <Avatar>
              <AvatarImage src={avatar ? avatar : defaultuser} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <Logout />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
