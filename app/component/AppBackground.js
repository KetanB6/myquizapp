"use client";
import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";

// Fragment counts for performance balancing
const DESKTOP_COUNT = 25;
const MOBILE_COUNT = 12;

export default function AppBackground() {
  const containerRef = useRef(null);
  const [fragments, setFragments] = useState([]);

  useEffect(() => {
    const symbols = ["01", "LX", "QUIZ", "//", "KRIDA", "•", "K", "+", "—"];
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? MOBILE_COUNT : DESKTOP_COUNT;

    const generated = Array.from({ length: count }).map(() => {
      return {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        fontSize: isMobile 
          ? `${Math.random() * (0.8 - 0.5) + 0.5}rem` 
          : `${Math.random() * (1.2 - 0.6) + 0.6}rem`,
        duration: `${15 + Math.random() * 20}s`,
        delay: `${Math.random() * -20}s`, 
        speed: isMobile ? 8 + Math.random() * 12 : 20 + Math.random() * 50,
        // HIGHER OPACITY for a bolder look
        opacity: 0.15 + Math.random() * 0.35, 
      };
    });

    setFragments(generated);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const mx = e.clientX / innerWidth - 0.5;
      const my = e.clientY / innerHeight - 0.5;

      container.style.setProperty("--grid-x", `${mx * 40}px`);
      container.style.setProperty("--grid-y", `${my * 40}px`);

      container.querySelectorAll(".zolvi-fragment").forEach((el) => {
        const speed = el.dataset.speed;
        el.style.transform = `translate3d(${mx * speed}px, ${my * speed}px, 0)`;
      });
    };

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

      {/* Deep Vignette Overlay */}
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
  background-color: #000; /* Pure deep black */
  color: #fff;

  .zolvi-grid {
    position: absolute;
    inset: -150px; 
    /* SHARPER GRID: Increased opacity from 0.05 to 0.12 */
    background-image: 
      linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px);
    
    background-size: 40px 40px; 
    @media (min-width: 768px) {
      background-size: 80px 80px;
    }

    transform: translate(var(--grid-x, 0), var(--grid-y, 0));
    transition: transform 0.2s cubic-bezier(0.1, 0, 0.2, 1);
    
    /* Aggressive radial mask for center focus */
    mask-image: radial-gradient(circle at center, black 15%, transparent 70%);
    -webkit-mask-image: radial-gradient(circle at center, black 15%, transparent 70%);
  }

  .zolvi-fragment {
    position: absolute;
    font-family: var(--font-mono), monospace;
    font-weight: 900;
    letter-spacing: 0.15em;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
    animation: ${float} linear infinite;
    will-change: transform;
    
    /* Glow effect for symbols */
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
  }

  .vignette-overlay {
    position: absolute;
    inset: 0;
    /* DARKER EDGES: Increased black opacity and tightened the transparent center */
    background: radial-gradient(
      circle at center,
      transparent 5%,
      rgba(0, 0, 0, 0.5) 45%,
      rgba(0, 0, 0, 1) 90%
    );
    pointer-events: none;
  }
`;