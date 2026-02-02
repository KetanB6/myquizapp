"use client";
import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

const Button = () => {
  const router = useRouter();
  
  return (
    <StyledWrapper>
      <button
        aria-label="User Login"
        className="zolvi-auth-btn"
        onClick={() => router.push("/login")}
      >
        <div className="content-box">
          <User size={15} strokeWidth={2.5} className="auth-icon" />
          <span className="text">LOG IN</span>
        </div>
        <div className="hover-mask" />
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: inline-block;

  .zolvi-auth-btn {
    all: unset; /* Reset default button styles */
    position: relative;
    
    /* Responsive sizing: larger target for mobile tap */
    width: 130px;
    height: 44px;
    
    @media (min-width: 768px) {
      width: 120px;
      height: 42px;
    }

    cursor: pointer;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    
    /* Disable blue tap highlight on mobile */
    -webkit-tap-highlight-color: transparent;
  }

  .content-box {
    position: relative;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    
    @media (min-width: 768px) {
      gap: 10px;
    }

    color: #ffffff;
    font-size: 10px;
    
    @media (min-width: 768px) {
      font-size: 11px;
    }

    font-weight: 900;
    letter-spacing: 0.2em;
    transition: color 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }

  /* The Zolvi "Slide" Effect */
  .hover-mask {
    position: absolute;
    top: 0;
    left: -100%; /* Start off-screen to the left */
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    transition: left 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 1;
    will-change: left;
  }

  /* --- DESKTOP HOVER LOGIC --- */
  @media (hover: hover) {
    .zolvi-auth-btn:hover {
      border-color: #ffffff;
    }

    .zolvi-auth-btn:hover .hover-mask {
      left: 0;
    }

    .zolvi-auth-btn:hover .content-box {
      color: #000000;
    }
  }

  /* --- MOBILE & INTERACTION LOGIC --- */
  .zolvi-auth-btn:active {
    transform: scale(0.96);
    
    .hover-mask {
      left: 0;
    }
    
    .content-box {
      color: #000000;
    }
  }

  /* Focus for Accessibility */
  .zolvi-auth-btn:focus-visible {
    border-color: #ffffff;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
  }

  .text {
    margin: 0;
    padding-top: 1px; /* Optical alignment for heavy caps */
  }

  .auth-icon {
    flex-shrink: 0;
  }
`;

export default Button;