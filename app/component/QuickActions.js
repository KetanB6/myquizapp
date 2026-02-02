"use client";
import React, { useState } from 'react';
import styled from 'styled-components';
import { Play, Globe, PlusCircle, Sparkles, Radio, Loader2, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const QuickActions = () => {
  const router = useRouter();
  const [loadingIndex, setLoadingIndex] = useState(null);
  
  // Logic remains untouched
  const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem("token");

  const handleAction = (action, index) => {
    setLoadingIndex(index);
    setTimeout(() => {
      action.onClick();
    }, 400);
  };

  const actions = [
    { title: "PLAY QUIZ", desc: "Enter a room code, play instantly, and check your score right away.", icon: <Play size={20} />, onClick: () => router.push('/play') },
    { title: "CREATE QUIZ", desc: "Build personalized quiz, add timer, and host your own quiz.", icon: <PlusCircle size={20} />, onClick: () => !isLoggedIn ? router.push('/login') : router.push('/create') },
    { title: "QUIZ BY AI", desc: "Just choose a topic, and AI will generate a quiz for you. Attend it and get your score instantly.", icon: <Sparkles size={20} />, onClick: () => router.push('/generate-ai') },
    { title: "AI-ASSISTED QUIZ", desc: "Automatically build quiz from AI-created question data in seconds.", icon: <Sparkles size={20} />, onClick: () => router.push('/quick-quiz-maker') },
    { title: "PUBLIC GALLERY", desc: "Explore a wide collection of public quizzes created by others, or create your own anytime.", icon: <Globe size={20} />, onClick: () => router.push('/public-library') },
    { title: "GLOBAL TOPICS", desc: "Discover global topics and test your knowledge in different areas.", icon: <Radio size={20} />, onClick: () => router.push('/browseQuizzes') },
  ];

  return (
    <Wrapper>
      <GridContainer>
        {actions.map((action, index) => (
          <ZolviCard 
            key={index} 
            onClick={() => handleAction(action, index)}
          >
            {/* Background High-Tech Accents */}
            <div className="bg-grid" />
            <div className="glow-point" />
            
            <div className="card-inner">
              <div className="card-header">
                <div className="status-indicator">
                  <div className="dot" />
                  <span className="index-num">SYSTEM_0{index + 1}</span>
                </div>
                <div className="icon-wrap">{action.icon}</div>
              </div>
              
              <div className="card-body">
                <h3>{action.title}</h3>
                <p>{action.desc}</p>
              </div>

              <div className="card-footer">
                {loadingIndex === index ? (
                  <div className="loading-state">
                    <Loader2 className="spinner" size={16} />
                    <span>LINKING...</span>
                  </div>
                ) : (
                  <div className="action-trigger">
                    <span className="action-text">INITIALIZE_PROCEDURE</span>
                    <div className="arrow-box">
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* The "Liquid/Laser" Border Scan */}
            <div className="scan-line" />
            <div className="corner-accent top-right" />
            <div className="corner-accent bottom-left" />
          </ZolviCard>
        ))}
      </GridContainer>
    </Wrapper>
  );
};

/* --- STYLED COMPONENTS --- */

const Wrapper = styled.div`
  width: 100%;
  padding: 20px;
  @media (min-width: 768px) { padding: 60px 20px; }
`;

const GridContainer = styled.div`
  display: grid;
  /* Modern Responsive Grid Logic */
  grid-template-columns: 1fr;
  @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
  
  gap: 1px; 
  background: rgba(255, 255, 255, 0.07); 
  border: 1px solid rgba(255, 255, 255, 0.07);
  max-width: 1400px;
  margin: 0 auto;
  box-shadow: 0 0 40px rgba(0,0,0,0.5);
`;

const ZolviCard = styled.div`
  position: relative;
  background: #000;
  padding: 30px;
  height: 280px;
  @media (min-width: 768px) {
    padding: 45px;
    height: 340px;
  }
  cursor: pointer;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  -webkit-tap-highlight-color: transparent;

  /* Cyber Grid Background */
  .bg-grid {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.3;
    transition: opacity 0.5s ease;
  }

  .glow-point {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.8s ease;
  }

  .card-inner {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    z-index: 5;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
      .dot {
        width: 4px;
        height: 4px;
        background: #fff;
        border-radius: 50%;
        box-shadow: 0 0 8px #fff;
      }
    }

    .index-num {
      font-size: 10px;
      color: #444;
      font-weight: 800;
      letter-spacing: 0.25em;
    }

    .icon-wrap {
      color: #fff;
      opacity: 0.3;
      transform: scale(0.9);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
  }

  h3 {
    font-size: 1.1rem;
    @media (min-width: 768px) { font-size: 1.4rem; }
    font-weight: 900;
    letter-spacing: 0.15em;
    color: #fff;
    margin-bottom: 12px;
    text-transform: uppercase;
  }

  p {
    font-size: 0.85rem;
    color: #666;
    line-height: 1.6;
    max-width: 90%;
    transition: color 0.4s ease;
  }

  .card-footer {
    .action-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      opacity: 0.4;
      transition: all 0.4s ease;
    }

    .action-text {
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.2em;
      color: #fff;
    }

    .arrow-box {
      width: 32px;
      height: 32px;
      border: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s ease;
    }

    .loading-state {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 10px;
      letter-spacing: 0.2em;
      color: #fff;
    }
  }

  /* High-Tech Accents */
  .corner-accent {
    position: absolute;
    width: 10px;
    height: 10px;
    border: 1px solid rgba(255,255,255,0.2);
    opacity: 0;
    transition: all 0.4s ease;
  }
  .top-right { top: 15px; right: 15px; border-left: none; border-bottom: none; }
  .bottom-left { bottom: 15px; left: 15px; border-right: none; border-top: none; }

  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #fff, transparent);
    opacity: 0;
    z-index: 10;
  }

  /* --- HOVER EFFECTS --- */
  @media (hover: hover) {
    &:hover {
      background: #080808;
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.8);

      .bg-grid { opacity: 0.8; }
      .glow-point { opacity: 1; }

      .icon-wrap {
        opacity: 1;
        transform: scale(1.1) rotate(-5deg);
        color: #fff;
      }

      .card-footer .action-trigger {
        opacity: 1;
      }

      .arrow-box {
        background: #fff;
        color: #000;
        border-color: #fff;
      }

      p { color: #aaa; }

      .corner-accent { opacity: 1; }
      
      .scan-line {
        animation: scanLine 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
    }
  }

  /* --- MOBILE ACTIVE --- */
  &:active {
    transform: scale(0.98);
    background: #111;
  }

  @keyframes scanLine {
    0% { top: 0%; opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }

  .spinner { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default QuickActions;