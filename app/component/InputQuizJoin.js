"use client";
import React from "react";
import styled from "styled-components";

const Input = () => {
  return (
    <StyledWrapper>
      <div className="input-wrapper">
        <input
          placeholder="Enter Quiz Code..."
          className="input"
          name="text"
          type="text"
        />
        <button className="join-btn">Join</button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input {
    color: white;
    border: 2px solid #8707ff;
    border-radius: 12px;
    padding: 10px 90px 10px 25px; /* space for button */
    background: transparent;
    max-width: 290px;
  }

  .input:active {
    box-shadow: 2px 2px 15px #8707ff inset;
  }

  .join-btn {
    position: absolute;
    right: 6px;
    height: calc(100% - 12px);
    padding: 0 18px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, #8707ff, #5b2cff);
    transition: all 0.3s ease;
  }

  /* Hover animation */
  .join-btn:hover {
    background: linear-gradient(135deg, #5b2cff, #8707ff);
    box-shadow: 0 0 15px rgba(135, 7, 255, 0.6);
    transform: scale(1.05);
  }

  .join-btn:active {
    transform: scale(0.95);
  }
`;

export default Input;
