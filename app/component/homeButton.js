"use client";
import React from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";

const Button = () => {
    const router = useRouter();
    return (
        <StyledWrapper>
            <div
                aria-label="User Login Button"
                tabIndex={0}
                role="button"
                className="user-profile"
                onKeyDown={(e) => e.key === "Enter" && router.push("/login")}
            >
                <div className="user-profile-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
                        <path d="M 24.960938 1.1015625 A 1.0001 1.0001 0 0 0 24.386719 1.3105469 L 1.3867188 19.210938 A 1.0001 1.0001 0 1 0 2.6132812 20.789062 L 4 19.708984 L 4 46 A 1.0001 1.0001 0 0 0 5 47 L 18.832031 47 A 1.0001 1.0001 0 0 0 19.158203 47 L 30.832031 47 A 1.0001 1.0001 0 0 0 31.158203 47 L 45 47 A 1.0001 1.0001 0 0 0 46 46 L 46 19.708984 L 47.386719 20.789062 A 1.0001 1.0001 0 1 0 48.613281 19.210938 L 40.96875 13.261719 A 1.0001 1.0001 0 0 0 41 13 L 41 7 A 1.0001 1.0001 0 0 0 40 6 L 36.099609 6 A 1.0001 1.0001 0 0 0 35.099609 7 L 35.099609 8.6933594 L 25.613281 1.3105469 A 1.0001 1.0001 0 0 0 24.960938 1.1015625 z M 25 3.3671875 L 44 18.154297 L 44 45 L 32 45 L 32 27 A 1.0001 1.0001 0 0 0 31 26 L 19 26 A 1.0001 1.0001 0 0 0 18 27.158203 L 18 45 L 6 45 L 6 18.154297 L 25 3.3671875 z M 37.099609 8 L 39 8 L 39 11.728516 L 37.099609 10.25 L 37.099609 8 z M 20 28 L 30 28 L 30 45 L 20 45 L 20 28 z"></path>
                    </svg>
                    <p>Home</p>
                </div>
            </div>
        </StyledWrapper>
    );
};

const StyledWrapper = styled.div`
  .user-profile {
    width: 96px;       /* CHANGED */
    height: 38px;      /* CHANGED */
    border-radius: 15px;
    cursor: pointer;
    transition: 0.3s ease;
    background: linear-gradient(
      to bottom right,
      #2e8eff 0%,
      rgba(46, 142, 255, 0) 30%
    );
    background-color: rgba(46, 142, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .user-profile:hover,
  .user-profile:focus {
    background-color: rgba(46, 142, 255, 0.7);
    box-shadow: 0 0 10px rgba(46, 142, 255, 0.5);
    outline: none;
  }

  .user-profile-inner {
    width: 92px;       /* CHANGED */
    height: 34px;      /* CHANGED */
    border-radius: 13px;
    background-color: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;         /* slightly reduced to fit */
    color: #fff;
    font-weight: 600;
    font-size: 13px;   /* reduced to fit */
  }

  .user-profile-inner svg {
    width: 18px;       /* CHANGED */
    height: 18px;      /* CHANGED */
    fill: #fff;
  }

  .user-profile-inner p {
    margin: 0;
    line-height: 1;
  }
`;

export default Button;
