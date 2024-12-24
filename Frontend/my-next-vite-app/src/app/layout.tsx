"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import './global.css';
import './all.css';
import './public/quizzes.css';
import axios from "axios";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleNotificationClick = async () => {
    router.push(`/notifications`);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setDropdownVisible(false);
    setSidebarVisible(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/auth/logout", {}, { withCredentials: true });
      alert("Logged out successfully!");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmation) {
      try {
        await axios.delete("http://localhost:5000/users", { withCredentials: true });
        alert("Account deleted successfully!");
        router.push("/");
      } catch (error) {
        console.error("Account deletion failed:", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  return (
    <html lang="en">
      <head></head>
      <body>
        <div className="header">
          <i className="fa-solid fa-bars menu-icon" onClick={toggleSidebar}></i>

          <div className="search-bar">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <i className="fa-solid fa-bell bell-icon" onClick={handleNotificationClick}></i>

          <i className="fa-solid fa-list menu-icon" onClick={toggleDropdown}></i>

          {dropdownVisible && (
            <div className="dropdown">
              <ul>
                <li><a onClick={() => navigateTo('/dashboard')}>Account</a></li>
                <li><a onClick={() => navigateTo('/auth/login')}>Login</a></li>
                <li><a onClick={() => navigateTo('/auth/signUp')}>SignUp</a></li>
                <li><a onClick={handleLogout}>Logout</a></li>
                <li><a onClick={handleDeleteAccount}>Delete Account</a></li>
              </ul>
            </div>
          )}

          <div className={`sidebar ${sidebarVisible ? "visible" : ""}`}>
            <ul>
              <li><a onClick={() => navigateTo('/')}>Home</a></li>
              <li><a onClick={() => navigateTo('/courses')}>Courses</a></li>
              <li><a onClick={handleNotificationClick}>Notification</a></li>
            </ul>
          </div>
        </div>

        <div className="content">{children}</div>
      </body>
    </html>
  );
}
