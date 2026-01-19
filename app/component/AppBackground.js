"use client";
import React, { useEffect, useRef, useState } from "react";

const BALL_COUNT = 40;

export default function AppBackground() {
  const containerRef = useRef(null);
  const [balls, setBalls] = useState([]);

  // Generate random balls ONLY on client
  useEffect(() => {
    const generated = Array.from({ length: BALL_COUNT }).map(() => {
      const size = 20 + Math.random() * 80;
      return {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${size}px`,
        duration: `${12 + Math.random() * 20}s`,
        delay: `${Math.random() * 10}s`,
        speed: 20 + Math.random() * 60,
      };
    });

    setBalls(generated);
  }, []);

  // Cursor interaction
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const mx = e.clientX / innerWidth - 0.5;
      const my = e.clientY / innerHeight - 0.5;

      container.querySelectorAll(".glow-ball").forEach((ball) => {
        const speed = ball.dataset.speed;
        ball.style.setProperty("--mx", `${mx * speed}px`);
        ball.style.setProperty("--my", `${my * speed}px`);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden bg-black"
    >
      {balls.map((b, i) => (
        <span
          key={i}
          className="glow-ball"
          data-speed={b.speed}
          style={{
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            animationDuration: b.duration,
            animationDelay: b.delay,
          }}
        />
      ))}

      {/* readability overlay */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
