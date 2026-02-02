"use client";
import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";

const Button = () => {
    const router = useRouter();
    
    return (
        <StyledWrapper>
            <div
                aria-label="Navigate Home"
                tabIndex={0}
                role="button"
                className="zolvi-nav-btn"
                onClick={() => router.push("/")}
                onKeyDown={(e) => e.key === "Enter" && router.push("/")}
            >
                <div className="btn-content">
                    <Home size={16} strokeWidth={2.5} className="home-icon" />
                    <span className="btn-text">HOME</span>
                </div>
                {/* Premium Liquid Fill effect */}
                <div className="btn-fill" />
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  /* Center the button wrapper slightly or align it depending on parent */
  display: inline-block;

  .zolvi-nav-btn {
    position: relative;
    /* Responsive width: slightly larger on mobile for better touch target */
    width: 120px;
    height: 44px;
    
    @media (min-width: 768px) {
      width: 110px;
      height: 40px;
    }

    background: #000; /* Pure black background base */
    border: 1px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    
    /* Ensure no weird blue highlights on mobile tap */
    -webkit-tap-highlight-color: transparent;
  }

  .btn-content {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #ffffff;
    font-size: 10px;
    
    @media (min-width: 768px) {
      font-size: 11px;
      gap: 12px;
    }

    font-weight: 900;
    letter-spacing: 0.2em;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .home-icon {
    flex-shrink: 0;
  }

  .btn-fill {
    position: absolute;
    top: 100%; /* Hidden below by default */
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 1;
    will-change: top;
  }

  /* --- DESKTOP HOVER STATES --- */
  @media (hover: hover) {
    .zolvi-nav-btn:hover {
      border-color: #ffffff;
    }

    .zolvi-nav-btn:hover .btn-fill {
      top: 0;
    }

    .zolvi-nav-btn:hover .btn-content {
      color: #000000;
      transform: translateY(-1px);
    }
  }

  /* --- MOBILE ACTIVE STATES (Tapping) --- */
  .zolvi-nav-btn:active {
    transform: scale(0.95);
    border-color: #ffffff;
    
    /* On mobile, we show the fill briefly on tap */
    .btn-fill {
      top: 0;
    }
    
    .btn-content {
      color: #000000;
    }
  }

  /* Focus for Accessibility */
  .zolvi-nav-btn:focus-visible {
    outline: none;
    border-color: #ffffff;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
  }
`;

export default Button;