import React, { useState, createContext } from "react";
import Navbar from "./navbar/Navbar.jsx";
import Sidebar from "./comps/Sidebar.jsx";
import { Outlet } from "react-router-dom";

export const SidebarContext = createContext();

function App() {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <SidebarContext.Provider value={isExpanded}>
      <div>
        <Navbar />
        <div className="flex h-screen transition-all duration-500">
          <div
            className={`transition-all duration-500 no-scrollbar overflow-y-auto ${
              isExpanded ? "w-64" : "w-20"
            }`}
          >
            <Sidebar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
          </div>
          <div className="flex-1 no-scrollbar overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

export default App;
