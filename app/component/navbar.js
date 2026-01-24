"use client";
import React, { useState, useEffect } from "react";
import Button from "./loginbutton"; // Your existing Login Modal trigger
import ButtonHome from "./homeButton";
import Link from "next/link";
import Logo from "./Logo";
import Profileee from "./profileButton";
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();
  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuth(true);
    }
  }, []);

  // Handle Navigation to Profile (Login Page)
  const handleProfileClick = () => {
    // Redirects to /login where the 'Form' component handles the Dashboard/Logout view
   // window.location.href = "/login";
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 mb-7 backdrop-blur-md shadow-md ">
      <div className="mx-auto px-4">

        {/* DESKTOP GRID */}
        <div className="hidden justify-between md:grid h-16 grid-cols-2 items-center">

          {/* LEFT: Logo */}
          <Logo />

          {/* RIGHT: Home + Auth Buttons */}
          <div className="flex justify-end items-center gap-6">
            {/* Home Button (Always Visible) */}
            <Link
              href="/"
              className="text-gray-600 font-semibold hover:text-blue-600 transition-colors duration-200"
            >
              <ButtonHome />
            </Link>

            {isAuth ? (
              // --- LOGGED IN VIEW: Profile Button ---
              <button
                onClick={handleProfileClick}
                className="px-5 py-2  text-white font-bold rounded-lg  transition-all shadow-md hover:shadow-lg"
              >
                <Profileee />
              </button>
            ) : (
              // --- LOGGED OUT VIEW: Login Modal Button ---
              <Button />
            )}
          </div>
        </div>

        {/* MOBILE FLEX */}
        <div className="flex md:hidden h-16 items-center justify-between">

          {/* LEFT: Logo */}
          <div className="flex   items-center gap-3 group cursor-pointer" onClick={() => window.location.href = '/'}>

            <svg width="260" height="80" viewBox="0 0 260 80" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="grad_quiz" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="50%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#e0f2fe" />
                </linearGradient>
              </defs>

              <text
                x="0"
                y="55"
                fontSize="32"
                fontWeight="800"
                fill="url(#grad_quiz)"
                fontFamily="Poppins, sans-serif"
              >
                Quizक्रिडा
              </text>
            </svg>

          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3">


            {isAuth ? (
              // --- Mobile Profile Button ---
              <button
                onClick={handleProfileClick}
                className="px-3 py-1.5  text-white font-bold rounded-md text-xs"
              >
                <Profileee />
              </button>
            ) : (
              <Button />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;