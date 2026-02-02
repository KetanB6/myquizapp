"use client";
import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

// We use a variable fragment count based on screen size for performance
const DESKTOP_COUNT = 25;
const MOBILE_COUNT = 12;

export default function AppBackground() {
  const containerRef = useRef(null);
  const [fragments, setFragments] = useState([]);

  useEffect(() => {
    // Zolvi uses abstract symbols and letters instead of shapes
    const symbols = ["01", "LX", "QUIZ", "//", "KRIDA", "•", "K", "+", "—"];
    
    // Check if we are on mobile to reduce fragment load
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? MOBILE_COUNT : DESKTOP_COUNT;

    const generated = Array.from({ length: count }).map(() => {
      return {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        fontSize: isMobile 
          ? `${Math.random() * (0.8 - 0.5) + 0.5}rem` // Smaller fonts for mobile
          : `${Math.random() * (1.2 - 0.6) + 0.6}rem`,
        duration: `${15 + Math.random() * 20}s`,
        delay: `${Math.random() * -20}s`, 
        speed: isMobile ? 5 + Math.random() * 10 : 15 + Math.random() * 40, // Slower parallax for mobile
        opacity: 0.05 + Math.random() * 0.2, // Slightly subtler
      };
    });

    setFragments(generated);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      // Avoid expensive parallax calculations on small touch screens if needed,
      // but here we just ensure the math is relative to screen size.
      const { innerWidth, innerHeight } = window;
      const mx = e.clientX / innerWidth - 0.5;
      const my = e.clientY / innerHeight - 0.5;

      // Update the grid parallax
      container.style.setProperty("--grid-x", `${mx * 30}px`);
      container.style.setProperty("--grid-y", `${my * 30}px`);

      // Update fragment parallax
      container.querySelectorAll(".zolvi-fragment").forEach((el) => {
        const speed = el.dataset.speed;
        // Use translate3d for hardware acceleration
        el.style.transform = `translate3d(${mx * speed}px, ${my * speed}px, 0)`;
      });
    };

    // Only apply mousemove if it's not a touch-only device (optional performance check)
    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <StyledBackground ref={containerRef}>
      {/* The Architectural Grid */}
      <div className="zolvi-grid" />
      
      {/* Floating Knowledge Fragments */}
      {fragments.map((f, i) => (
        <span
          key={i}
          className="zolvi-fragment"
          data-speed={f.speed}
          style={{
            left: f.left,
            top: f.top,
            fontSize: f.fontSize,
            opacity: f.opacity,
            animationDuration: f.duration,
            animationDelay: f.delay,
          }}
        >
          {f.symbol}
        </span>
      ))}

      {/* Modern Gradient Overlay for depth */}
      <div className="vignette-overlay" />
    </StyledBackground>
  );
}

// --- Styles ---

const float = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(10px, -20px) rotate(2deg); }
  66% { transform: translate(-10px, 15px) rotate(-2deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`;

const StyledBackground = styled.div`
  position: fixed;
  inset: 0;
  z-index: -10;
  overflow: hidden;
  background-color: #000;
  color: #fff;

  .zolvi-grid {
    position: absolute;
    /* Larger inset for mobile to ensure swipe movements don't show edges */
    inset: -150px; 
    background-image: 
      linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    
    /* Smaller grid size for mobile devices */
    background-size: 40px 40px; 
    @media (min-width: 768px) {
      background-size: 80px 80px;
    }

    transform: translate(var(--grid-x, 0), var(--grid-y, 0));
    transition: transform 0.15s ease-out; /* Slightly smoother transition */
    mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
  }

  .zolvi-fragment {
    position: absolute;
    font-family: var(--font-mono), monospace; /* More industrial feel */
    font-weight: 900;
    letter-spacing: 0.1em;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
    animation: ${float} linear infinite;
    /* Hardware acceleration is key for mobile smoothness */
    will-change: transform; 
  }

  .vignette-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      transparent 0%,
      rgba(0, 0, 0, 0.4) 40%,
      rgba(0, 0, 0, 1) 100%
    );
    pointer-events: none;
  }
`;