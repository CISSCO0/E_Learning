"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import './global.css';


import './public/quizzes.css';
import axios from "axios";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
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
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <div>
          {/* Header */}
          <header className="header">
            <div className="header-container">
              {/* Logo Section */}
              <div className="flex items-center">
                <button 
                  onClick={toggleSidebar} 
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  aria-label="Toggle menu"
                >
                  <i className="fa-solid fa-bars text-neutral-600 hover:text-red-600"></i>
                </button>
                {/* { <a
                  href="/"
                  className="logo-container"
                  onClick={(e) => {
                    e.preventDefault()
                    navigateTo("/")
                  }}
                >
                  <div className="logo-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h1 className="logo-text">GIU </h1>
                </a> }*/}
              </div> 

              {/* Search Section */}
              <div className="search-section">
                <div className="search-bar">
                  <div className="search-container">
                    <i className="fa-solid fa-magnifying-glass search-icon"></i>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search courses, instructors, topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearch}
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="nav-actions">
                <button className="nav-button" onClick={handleNotificationClick} aria-label="Notifications">
                  <i className="fa-solid fa-bell"></i>
                  <span className="notification-badge"></span>
                </button>

                <div className="dropdown-container" ref={dropdownRef}>
                  <button className="nav-button" onClick={toggleDropdown} aria-label="User menu">
                    <i className="fa-solid fa-user-circle"></i>
                  </button>

                  <div className={`dropdown ${dropdownVisible ? "visible" : ""}`}>
                    <ul>
                      <li>
                        <a onClick={() => navigateTo("/dashboard")}>
                          <i className="fa-solid fa-tachometer-alt dropdown-icon"></i>
                          Dashboard
                        </a>
                      </li>
                      <li>
                        <a onClick={() => navigateTo("/profile")}>
                          <i className="fa-solid fa-user dropdown-icon"></i>
                          Profile
                        </a>
                      </li>
                      <li>
                        <a onClick={() => navigateTo("/settings")}>
                          <i className="fa-solid fa-cog dropdown-icon"></i>
                          Settings
                        </a>
                      </li>
                      <li>
                        <a onClick={() => navigateTo("auth/login")}>
                          <i className="fa-solid fa-sign-in-alt dropdown-icon"></i>
                          Login
                        </a>
                      </li>
                      <li>
                        <a onClick={() => navigateTo("auth/signUp")}>
                          <i className="fa-solid fa-user-plus dropdown-icon"></i>
                          Sign Up
                        </a>
                      </li>
                      <li>
                        <a onClick={handleLogout}>
                          <i className="fa-solid fa-sign-out-alt dropdown-icon"></i>
                          Logout
                        </a>
                      </li>
                      <li>
                        <a onClick={handleDeleteAccount} className="danger">
                          <i className="fa-solid fa-trash dropdown-icon"></i>
                          Delete Account
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Sidebar */}
          <nav className={`sidebar ${sidebarVisible ? "visible" : ""}`}>
            <div className="sidebar-content">
              <ul className="sidebar-nav">
                <li>
                  <a onClick={() => navigateTo("/")}>
                    <i className="fa-solid fa-home sidebar-icon"></i>
                    Home
                  </a>
                </li>
                <li>
                  <a onClick={() => navigateTo("/courses")}>
                    <i className="fa-solid fa-book sidebar-icon"></i>
                    Courses
                  </a>
                </li>
                <li>
                  <a onClick={() => navigateTo("/dashboard")}>
                    <i className="fa-solid fa-tachometer-alt sidebar-icon"></i>
                    Dashboard
                  </a>
                </li>
                <li>
                  <a onClick={handleNotificationClick}>
                    <i className="fa-solid fa-bell sidebar-icon"></i>
                    Notifications
                  </a>
                </li>
                <li>
                  <a onClick={() => navigateTo("/reports")}>
                    <i className="fa-solid fa-chart-bar sidebar-icon"></i>
                    Reports
                  </a>
                </li>
                <li>
                  <a onClick={() => navigateTo("/profile")}>
                    <i className="fa-solid fa-user sidebar-icon"></i>
                    Profile
                  </a>
                </li>
                <li>
                  <a onClick={() => navigateTo("/settings")}>
                    <i className="fa-solid fa-cog sidebar-icon"></i>
                    Settings
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          {/* Sidebar Overlay */}
          <div
            className={`sidebar-overlay ${sidebarVisible ? "visible" : ""}`}
            onClick={() => setSidebarVisible(false)}
          ></div>

          {/* Main Content */}
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  )
}