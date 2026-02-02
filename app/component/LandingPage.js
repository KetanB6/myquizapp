"use client";
import React, { useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, Twitter, Instagram, Github 
} from 'lucide-react';
import Link from 'next/link';
import QuickActions from './QuickActions';

const LandingPage = () => {
    const featuresRef = useRef(null);

    const scrollToFeatures = () => {
        featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <PageWrapper>
            {/* Background is handled by AppBackground in layout.js */}
            
            <HeroSection
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <motion.div 
                    className="tagline"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    T &nbsp; H &nbsp; E &nbsp; &nbsp; N &nbsp; E &nbsp; X &nbsp; T &nbsp; &nbsp; G &nbsp; E &nbsp; N
                </motion.div>

                <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    LEVEL UP YOUR <br />
                    <span className="outline-text">INTELLECT</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    QuizKrida brings together modern design and AI-powered tools to 
                    create a powerful digital learning platform.
                </motion.p>

                <motion.div className="hero-btns" transition={{ delay: 0.8 }}>
                    <Link href="/login" className="zolvi-btn-primary">
                        START THE JOURNEY <ArrowUpRight size={20} />
                    </Link>
                    <button className="zolvi-btn-outline" onClick={scrollToFeatures}>
                        OUR APPROACH
                    </button>
                </motion.div>
            </HeroSection>

            {/* Approach Section */}
            <ApproachSection ref={featuresRef}>
                <div className="section-label">01 — STEPS</div>
                <div className="approach-grid">
                    <div className="approach-card">
                        <span className="num">/01</span>
                        <h3>GENERATE</h3>
                        <p>Use AI to create unique quizzes and challenges instantly.</p>
                    </div>
                    <div className="approach-card">
                        <span className="num">/02</span>
                        <h3>COMPETE</h3>
                        <p>Take part in exciting quiz battles with players from around the world.</p>
                    </div>
                    <div className="approach-card">
                        <span className="num">/03</span>
                        <h3>REWARDS</h3>
                        <p>Win rewards and earn recognition for your knowledge and skills.</p>
                    </div>
                </div>
            </ApproachSection>

            <CardsWrapper
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 50 }}
                viewport={{ once: true }}
            >
                <QuickActions />
            </CardsWrapper>

            const getRandomNumber = () =>
            Math.floor(Math.random() * (1500 - 1000 + 1)) + 1000;

            <StatsSection>
                <div className="stats-header">
                    <h2>DESIGNED FOR <span className="gradient">PERFORMANCE.</span></h2>
                </div>
                <div className="stats-grid">
                    <div className="stat-item">
                        <h4>{getRandomNumber()}</h4>
                        <p>Global Competitors</p>
                    </div>
                    <div className="stat-item">
                        <h4>₹5K+</h4>
                        <p>Prize Pool</p>
                    </div>
                    <div className="stat-item">
                        <h4>24/7</h4>
                        <p>Live Quizzes</p>
                    </div>
                </div>

                <WinnerTicker>
                    <div className="ticker-track">
                        <span>● @Dhiraj_01 won ₹50 in Weekly Quiz</span>
                        <span>● @Ketan_06 just earned 'AI Master' Badge</span>
                        <span>● @Rahul.js won the Science Bowl</span>
                        <span>● @Ketan_06 won ₹50 in Weekly Quiz</span>
                        {/* Duplicate for seamless loop */}
                        <span>● @Dhiraj_01 won ₹50 in Weekly Quiz</span>
                        <span>● @Alex_Dev just earned 'AI Master' Badge</span>
                    </div>
                </WinnerTicker>
            </StatsSection>

            <Footer>
                <div className="footer-top">
                    <div className="footer-brand">
                        <h2>QUIZ<span>KRIDA</span></h2>
                        <p>Crafting competitive experiences that inspire and convert curiosity into knowledge.</p>
                    </div>
                    <div className="footer-nav">
                        <div className="nav-group">
                            <h5>NAVIGATE</h5>
                            <Link href="/">Home</Link>
                            <Link href="/about">About Us</Link>
                            <Link href="/services">Services</Link>
                        </div>
                        <div className="nav-group">
                            <h5>CONNECT</h5>
                            <a href="mailto:hello@quizkrida.com">Get in Touch</a>
                            <div className="socials">
                                <Twitter size={18} />
                                <Instagram size={18} />
                                <Github size={18} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 QuizKrida. All Rights Reserved.</p>
                    <div className="legal">
                        <span>PRIVACY POLICY</span>
                        <span>TERMS OF SERVICE</span>
                    </div>
                </div>
            </Footer>
        </PageWrapper>
    );
};

// --- Animations ---
const marquee = keyframes`
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
`;

// --- Styled Components ---

const PageWrapper = styled.div`
    color: #ffffff;
    min-height: 100vh;
    width: 100%;
    font-family: var(--font-sans), 'Inter', sans-serif;
    background: transparent;

    /* Responsive Offset to account for Navbar */
    margin-top: -80px; 
    @media (min-width: 768px) {
        margin-top: -140px;
    }

    position: relative;
    z-index: 1;
    overflow-x: hidden;
`;

const HeroSection = styled.section`
    position: relative;
    z-index: 1;
    padding: 160px 20px 60px; /* Reduced top padding for mobile */
    @media (min-width: 768px) {
        padding: 240px 20px 100px;
    }
    text-align: center;
    max-width: 1200px;
    margin: 0 auto;

    .tagline {
        font-size: 0.6rem;
        letter-spacing: 0.5em;
        @media (min-width: 768px) {
            font-size: 0.75rem;
            letter-spacing: 0.8em;
        }
        color: #888;
        margin-bottom: 30px;
        text-transform: uppercase;
    }

    h1 {
        font-size: clamp(2.5rem, 12vw, 7rem);
        font-weight: 900;
        line-height: 1;
        letter-spacing: -0.04em;
        margin-bottom: 30px;

        .outline-text {
            color: transparent;
            -webkit-text-stroke: 1px rgba(255,255,255,0.3);
        }
    }

    p {
        max-width: 500px;
        margin: 0 auto 40px;
        color: #999;
        font-size: 0.95rem;
        line-height: 1.6;
        @media (min-width: 768px) {
            font-size: 1.1rem;
            max-width: 600px;
        }
    }

    .hero-btns {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 15px;
        padding: 0 20px;
        
        @media (min-width: 768px) { 
            flex-direction: row; 
            gap: 20px; 
            padding: 0;
        }
    }

    .zolvi-btn-primary {
        background: #fff;
        color: #000;
        padding: 18px 30px;
        font-weight: 800;
        font-size: 0.85rem;
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        
        &:hover { 
            background: #ccc;
            transform: translateY(-2px);
        }
    }

    .zolvi-btn-outline {
        background: transparent;
        color: #fff;
        border: 1px solid rgba(255,255,255,0.2);
        padding: 18px 30px;
        font-weight: 800;
        font-size: 0.85rem;
        cursor: pointer;
        transition: 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        
        &:hover { 
            border-color: #fff;
            background: rgba(255,255,255,0.05);
        }
    }
`;

const ApproachSection = styled.section`
    position: relative;
    z-index: 1;
    padding: 60px 24px;
    @media (min-width: 768px) {
        padding: 100px 40px;
    }
    max-width: 1200px;
    margin: 0 auto;

    .section-label {
        font-size: 0.65rem;
        color: #555;
        margin-bottom: 40px;
        letter-spacing: 0.3em;
        @media (min-width: 768px) { margin-bottom: 60px; }
    }

    .approach-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 30px;
        @media (min-width: 768px) { 
            grid-template-columns: repeat(3, 1fr); 
            gap: 40px;
        }
    }

    .approach-card {
        border-top: 1px solid rgba(255,255,255,0.1);
        padding-top: 24px;
        
        .num { color: #555; font-size: 0.75rem; display: block; margin-bottom: 16px; font-weight: 800; }
        h3 { font-size: 1.25rem; letter-spacing: 0.1em; margin-bottom: 12px; font-weight: 900; }
        p { color: #888; line-height: 1.6; font-size: 0.9rem; }
    }
`;

const CardsWrapper = styled(motion.div)`
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto 60px;
    padding: 0 20px;
    @media (min-width: 768px) { margin-bottom: 100px; }
`;

const StatsSection = styled.section`
    position: relative;
    z-index: 1;
    padding: 60px 0;
    @media (min-width: 768px) { padding: 100px 0; }
    
    .stats-header {
        text-align: center;
        margin-bottom: 40px;
        @media (min-width: 768px) { margin-bottom: 80px; }
        
        h2 { 
            font-size: clamp(1.5rem, 6vw, 4rem); 
            font-weight: 900;
            padding: 0 20px;
            .gradient { color: #444; }
        }
    }

    .stats-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 40px;
        max-width: 1000px;
        margin: 0 auto 60px;
        
        @media (min-width: 768px) { 
            display: flex;
            justify-content: space-around;
            margin-bottom: 100px;
            gap: 0;
        }
    }

    .stat-item {
        text-align: center;
        h4 { 
            font-size: 2.8rem; 
            font-weight: 900; 
            margin-bottom: 5px;
            @media (min-width: 768px) { font-size: 3.5rem; }
        }
        p { color: #555; text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.65rem; font-weight: 800; }
    }
`;

const WinnerTicker = styled.div`
    border-top: 1px solid rgba(255,255,255,0.08);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 20px 0;
    overflow: hidden;
    background: rgba(0,0,0,0.3);
    
    .ticker-track {
        display: flex;
        gap: 60px;
        animation: ${marquee} 30s linear infinite;
        white-space: nowrap;
        @media (min-width: 768px) { gap: 100px; }
        
        span { 
            font-weight: 800; 
            letter-spacing: 0.05em; 
            color: #fff; 
            font-size: 0.8rem;
            text-transform: uppercase;
        }
    }
`;

const Footer = styled.footer`
    position: relative;
    z-index: 1;
    background: #000;
    padding: 60px 24px 30px;
    @media (min-width: 768px) { padding: 100px 40px 40px; }
    border-top: 1px solid rgba(255,255,255,0.05);

    .footer-top {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr;
        gap: 50px;
        margin-bottom: 60px;
        
        @media (min-width: 1024px) { 
            display: flex;
            justify-content: space-between;
            margin-bottom: 100px;
        }
    }

    .footer-brand {
        max-width: 400px;
        h2 { 
            font-weight: 900; 
            letter-spacing: -0.05em; 
            margin-bottom: 15px; 
            font-size: 1.5rem;
            span { color: #444; } 
        }
        p { color: #666; line-height: 1.6; font-size: 0.9rem; }
    }

    .footer-nav {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        
        @media (min-width: 768px) { gap: 80px; }
        
        .nav-group {
            display: flex;
            flex-direction: column;
            gap: 12px;
            h5 { color: #555; letter-spacing: 0.2em; font-size: 0.65rem; margin-bottom: 8px; font-weight: 800; }
            a { color: #fff; text-decoration: none; font-size: 0.85rem; transition: 0.3s; &:hover { color: #888; } }
            .socials { display: flex; gap: 18px; color: #fff; margin-top: 10px; }
        }
    }

    .footer-bottom {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        padding-top: 30px;
        border-top: 1px solid rgba(255,255,255,0.05);
        color: #444;
        font-size: 0.7rem;
        
        @media (min-width: 768px) { 
            flex-direction: row; 
            padding-top: 40px;
        }
        
        .legal { 
            display: flex; 
            gap: 20px; 
            font-weight: 800;
            span { cursor: pointer; transition: 0.2s; &:hover { color: #888; } }
        }
    }
`;

export default LandingPage;