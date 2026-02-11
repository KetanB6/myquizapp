"use client";
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Play, Globe, PlusCircle, Sparkles, Radio, Loader2, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const QuickActions = () => {
  const router = useRouter();
  const [loadingIndex, setLoadingIndex] = useState(null);
  
  const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem("token");

  const actions = [
    { title: "PLAY QUIZ", desc: "Enter a room code, play instantly, and check your score right away.", icon: <Play size={20} />, onClick: () => router.push('/play') },
    { title: "CREATE QUIZ", desc: "Build personalized quiz, add timer, and host your own quiz.", icon: <PlusCircle size={20} />, onClick: () => !isLoggedIn ? router.push('/login') : router.push('/create') },
    { title: "QUIZ BY AI", desc: "Just choose a topic, and AI will generate a quiz for you.", icon: <Sparkles size={20} />, onClick: () => router.push('/generate-ai') },
    { title: "AI-ASSISTED QUIZ", desc: "Automatically build quiz from AI-created question data in seconds.", icon: <Sparkles size={20} />, onClick: () => router.push('/quick-quiz-maker') },
    { title: "PUBLIC GALLERY", desc: "Explore a wide collection of public quizzes created by others.", icon: <Globe size={20} />, onClick: () => router.push('/public-library') },
    { title: "GLOBAL TOPICS", desc: "Discover global topics and test your knowledge in different areas.", icon: <Radio size={20} />, onClick: () => router.push('/browseQuizzes') },
  ];

  const handleAction = (action, index) => {
    setLoadingIndex(index);
    setTimeout(() => action.onClick(), 400);
  };

  // Staggered Animation Logic
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }
    }
  };

  return (
    <Wrapper>
      <SectionHeader
        as={motion.div}
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <div className="header-label">02 — ACTIONS</div>
        <h2>CHOOSE YOUR<br />PATH</h2>
      </SectionHeader>

      <GridContainer
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {actions.map((action, index) => (
          <BrutalistCard 
            as={motion.div}
            variants={cardVariants}
            key={index} 
            onClick={() => handleAction(action, index)}
          >
            {/* The Internal Grid Effect (Restored) */}
            <div className="hover-grid-bg" />
            
            <CardNumber>/{String(index + 1).padStart(2, '0')}</CardNumber>
            
            <IconSection className="icon-box">
              {action.icon}
            </IconSection>
            
            <CardContent>
              <CardTitle>{action.title}</CardTitle>
              <CardDesc>{action.desc}</CardDesc>
            </CardContent>

            <CardFooter>
              {loadingIndex === index ? (
                <LoadingState>
                  <Loader2 className="spinner" size={18} />
                  <span>EXECUTING...</span>
                </LoadingState>
              ) : (
                <ActionButton className="action-btn">
                  <span>EXECUTE_PROTOCOL</span>
                  <ArrowUpRight size={18} />
                </ActionButton>
              )}
            </CardFooter>

            {/* Brutalist Thick Borders (Restored) */}
            <TopBorder className="t-border" />
            <BottomBorder className="b-border" />
          </BrutalistCard>
        ))}
      </GridContainer>
    </Wrapper>
  );
};

/* --- STYLES --- */

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
  width: 100%;
  padding: 80px 20px;
  background: #000;
  
  @media (min-width: 768px) { padding: 120px 40px; }
`;

const SectionHeader = styled.div`
  max-width: 1400px;
  margin: 0 auto 60px;
  .header-label {
    font-size: 0.75rem;
    color: #ff0033;
    margin-bottom: 20px;
    letter-spacing: 0.6em;
    font-weight: 900;
  }
  h2 {
    font-size: clamp(2.5rem, 7vw, 5rem);
    font-weight: 900;
    line-height: 0.95;
    color: #fff;
    text-transform: uppercase;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px; /* Spacious cards */
  max-width: 1400px;
  margin: 0 auto;
  
  @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); gap: 40px; }
`;

const BrutalistCard = styled.div`
  position: relative;
  background: #0a0a0a;
  padding: 80px 35px 35px;
  min-height: 400px;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  /* THE HOVER GRID EFFECT */
  .hover-grid-bg {
    position: absolute;
    inset: 0;
    /* Increased opacity to .15 and line weight to 1.5px for maximum visibility */
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.15) 1.5px, transparent 1.5px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1.5px, transparent 1.5px);
    background-size: 30px 30px; /* Slightly larger grid feels cleaner with bolder lines */
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    z-index: 1;
    
    /* This adds a subtle glow to the lines to make them feel "whiter" */
    filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.2));
  }
  &:hover {
    transform: translateY(-12px);
    border-color: #fff;
    box-shadow: 0 20px 40px rgba(255, 255, 255, 0.2);

    .hover-grid-bg { opacity: 1; }
    
    .icon-box {
      background: #fff;
      color: #000;
      transform: rotate(8deg) scale(1.1);
    }

    .t-border, .b-border { width: 100%; }
    
    .action-btn {
      border-top: 1px solid #fff;
      svg { transform: translate(4px, -4px); }
    }
  }
`;

const IconSection = styled.div`
  position: relative;
  z-index: 2;
  width: 70px;
  height: 70px;
  border: 3px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  color: #fff;
  margin-bottom: 35px;
  transition: all 0.4s ease;
  svg { stroke-width: 2.5; }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 2;
  flex: 1;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  color: #fff;
  margin-bottom: 18px;
  text-transform: uppercase;
`;

const CardDesc = styled.p`
  font-size: 0.85rem;
  color: #777;
  line-height: 1.7;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

const ActionButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 20px 0 5px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  span {
    font-size: 0.75rem;
    font-weight: 900;
    letter-spacing: 0.25em;
    color: #fff;
  }
`;

const CardNumber = styled.div`
  position: absolute;
  top: 30px;
  left: 30px;
  font-size: 0.85rem;
  font-weight: 900;
  color: #444;
  z-index: 2;
`;

const CardFooter = styled.div`
  position: relative;
  z-index: 2;
  margin-top: auto;
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 900;
  .spinner { animation: ${spin} 1s linear infinite; }
`;

const TopBorder = styled.div`
  position: absolute; top: 0; left: 0; height: 4px; width: 0;
  background: #fff; transition: width 0.4s ease; z-index: 5;
`;

const BottomBorder = styled.div`
  position: absolute; bottom: 0; right: 0; height: 4px; width: 0;
  background: #fff; transition: width 0.4s ease; z-index: 5;
`;

export default QuickActions;