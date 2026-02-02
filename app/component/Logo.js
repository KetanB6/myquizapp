"use client";
import React from 'react';
import styled from 'styled-components';

const Logo = () => {
  return (
    <LogoWrapper>
      <svg 
        viewBox="0 0 280 65" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        className="zolvi-logo-svg"
      >
        <defs>
          <linearGradient id="zolvi-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#888888" />
          </linearGradient>
        </defs>

        {/* QUIZ - Bold, Brutalist Typography */}
        <text
          x="0"
          y="45"
          className="logo-main"
        >
          QUIZ
                  </text>

        {/* KRIDA - Sophisticated Outline/Thin contrast */}
        <text
          x="115"
          y="45"
          className="logo-sub"
        >
        KRIDA
        </text>

        {/* Decorative Underline - Zolvi style signature line */}
        <rect x="0" y="58" width="40" height="2" fill="white" className="line-anim" />
      </svg>
    </LogoWrapper>
  );
};

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  
  /* Container scaling */
  width: 180px; /* Mobile width */
  @media (min-width: 768px) {
    width: 240px; /* Desktop width */
  }

  .zolvi-logo-svg {
    width: 100%;
    height: auto;
    filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.05));
    overflow: visible;
  }

  .logo-main {
    font-family: 'Inter', 'Helvetica', sans-serif;
    font-size: 44px;
    font-weight: 900;
    letter-spacing: -0.05em;
    fill: #ffffff;
    /* Improves rendering on mobile browsers */
    text-rendering: optimizeLegibility;
  }

  .logo-sub {
    font-family: 'Inter', sans-serif;
    font-size: 44px;
    font-weight: 200;
    letter-spacing: 0.05em;
    fill: transparent;
    stroke: rgba(255, 255, 255, 0.5);
    stroke-width: 1px;
    text-rendering: optimizeLegibility;
  }

  .line-anim {
    transition: width 0.8s cubic-bezier(0.23, 1, 0.32, 1);
    will-change: width;
  }

  /* Desktop Hover Effect */
  @media (hover: hover) {
    &:hover .line-anim {
      width: 275px; 
    }
    
    &:hover .logo-sub {
      stroke: rgba(255, 255, 255, 1);
      transition: stroke 0.4s ease;
    }
  }

  /* Mobile Active/Tap Effect */
  &:active .line-anim {
    width: 275px;
    transition: width 0.4s ease;
  }

  /* Ensure the logo doesn't get "grayed out" by mobile tap highlights */
  -webkit-tap-highlight-color: transparent;
`;

export default Logo;