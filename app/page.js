"use client";
import React from 'react';
import LandingPage from './component/LandingPage';
import styled from 'styled-components';

/**
 * Main Entry Page
 * Optimized for Zolvi Monochrome Aesthetics
 */
const PageWrapper = styled.main`
  background-color: #000000;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  /* Ensures content starts below the navbar if it's fixed, 
     otherwise maintains a clean start */
  position: relative;
  overflow-x: hidden;
`;

const Page = () => {
  return (
    <PageWrapper>
      {/* SEO Tip: Adding a hidden H1 here if the LandingPage 
          doesn't have one helps search engines identify the 
          site's primary purpose immediately.
      */}
      <h1 className="sr-only">Quizक्रिडा - AI Powered Multiple Choice Quiz Engine</h1>
      
      <LandingPage />
    </PageWrapper>
  );
};

export default Page;