"use client";
import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { UserCheck } from "lucide-react";

const Profileee = () => {
    const router = useRouter();
    
    return (
        <StyledWrapper>
            <button
                aria-label="View Profile"
                className="zolvi-profile-card"
                onClick={() => router.push("/login")} // Updated to /profile as it's the Profile button
            >
                <div className="status-dot" />
                <div className="card-content">
                    <UserCheck size={14} strokeWidth={2.5} className="profile-icon" />
                    <span className="label">PROFILE</span>
                </div>
                <div className="card-bg" />
            </button>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  display: inline-block;

  .zolvi-profile-card {
    all: unset;
    position: relative;
    
    /* Responsive Sizing */
    width: 120px;
    height: 44px;
    
    @media (min-width: 768px) {
      width: 110px;
      height: 40px;
    }

    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    
    /* Smooth out mobile tap highlights */
    -webkit-tap-highlight-color: transparent;
  }

  .status-dot {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 4px;
    height: 4px;
    background: #ffffff;
    border-radius: 50%;
    z-index: 4;
    box-shadow: 0 0 8px #ffffff;
    animation: pulse 2s infinite;
  }

  .card-content {
    position: relative;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 6px;
    
    @media (min-width: 768px) {
      gap: 8px;
    }

    color: #ffffff;
    font-size: 9px; /* Slightly smaller for mobile to fit the tracking */
    
    @media (min-width: 768px) {
      font-size: 10px;
    }

    font-weight: 900;
    letter-spacing: 0.2em;
    
    @media (min-width: 768px) {
      letter-spacing: 0.25em; /* Extreme tracking for desktop */
    }
    
    transition: color 0.4s ease;
  }

  .profile-icon {
    flex-shrink: 0;
  }

  .card-bg {
    position: absolute;
    inset: 0;
    background: #ffffff;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 1;
    will-change: transform;
  }

  /* --- DESKTOP HOVER --- */
  @media (hover: hover) {
    .zolvi-profile-card:hover {
      border-color: #ffffff;
    }

    .zolvi-profile-card:hover .card-bg {
      transform: translateY(0);
    }

    .zolvi-profile-card:hover .card-content {
      color: #000000;
    }

    .zolvi-profile-card:hover .status-dot {
      background: #000000;
      box-shadow: none;
    }
  }

  /* --- MOBILE & INTERACTION --- */
  .zolvi-profile-card:active {
    transform: scale(0.96);
    
    .card-bg {
      transform: translateY(0);
    }
    
    .card-content {
      color: #000000;
    }
    
    .status-dot {
      background: #000000;
      box-shadow: none;
    }
  }

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.3; }
    100% { opacity: 1; }
  }

  /* Accessibility focus state */
  .zolvi-profile-card:focus-visible {
    outline: none;
    border-color: #ffffff;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
  }
`;

export default Profileee;