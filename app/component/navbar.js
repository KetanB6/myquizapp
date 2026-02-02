"use client";
import React, { useState, useEffect } from "react";
import Button from "./loginbutton"; 
import ButtonHome from "./homeButton";
import Link from "next/link";
import Logo from "./Logo";
import Profileee from "./profileButton";
import { useRouter } from 'next/navigation';
import styled from "styled-components";

const Navbar = () => {
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsAuth(!!token);
    };

    checkToken();
    window.addEventListener("storage", checkToken);
    const interval = setInterval(checkToken, 1000);

    return () => {
      window.removeEventListener("storage", checkToken);
      clearInterval(interval);
    };
  }, []);

  return (
    <NavContainer>
      <div className="nav-inner">
        
        {/* LEFT: Logo Section */}
        <div className="logo-section" onClick={() => router.push("/")}>
          <Logo />
        </div>

        {/* RIGHT: Navigation Actions */}
        <div className="actions-section">
          {/* Desktop Links - Optimized for high-end spacing */}
          <div className="desktop-links">
            <Link href="/">
              <ButtonHome />
            </Link>
          </div>

          <div className="auth-zone">
            {isAuth ? (
                <Profileee className="profile-trigger" />
            ) : (
              <Button />
            )}
          </div>
        </div>
      </div>
    </NavContainer>
  );
};

// --- Zolvi-Inspired Styled Components ---

const NavContainer = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1000; /* Higher z-index to stay above all content */
  width: 100%;
  
  /* Dark mode glassmorphism */
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px); /* Safari support */
  
  /* Thin industrial border */
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  
  /* Responsive padding */
  padding: 0 1rem;
  @media (min-width: 768px) {
    padding: 0 2.5rem;
  }

  .nav-inner {
    max-width: 1400px;
    margin: 0 auto;
    
    /* Variable height for mobile vs desktop */
    height: 64px; 
    @media (min-width: 768px) {
      height: 85px; 
    }
    
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .logo-section {
    cursor: pointer;
    flex-shrink: 0; /* Prevents logo from squishing on small screens */
    transition: opacity 0.3s ease;
    
    &:hover {
      opacity: 0.8;
    }

    /* Scaling the logo wrapper to ensure it fits mobile */
    max-width: 140px;
    @media (min-width: 768px) {
      max-width: none;
    }
  }

  .actions-section {
    display: flex;
    align-items: center;
    /* Tighter gap on mobile to fit Home + Login buttons */
    gap: 0.75rem;
    @media (min-width: 768px) {
      gap: 1.5rem;
    }
  }

  .desktop-links {
    display: flex;
    align-items: center;
    
    /* On extremely small devices (< 400px), we hide the Home text 
       to prevent the Login button from being pushed off.
    */
    @media (max-width: 400px) {
      display: none;
    }
  }

  .profile-trigger {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    
    &:hover {
      transform: translateY(-2px);
    }
  }

  .auth-zone {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
`;

export default Navbar;