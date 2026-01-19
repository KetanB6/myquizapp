"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// 1. Import toast
import toast, { Toaster } from 'react-hot-toast';

const Form = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [userName, setUserName] = useState("");

    const [signupData, setSignupData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if (token) {
            setIsAuth(true);
            if (user) {
                try {
                    const parsedUser = JSON.parse(user);
                    setUserName(parsedUser.name || "User");
                } catch (e) {
                    setUserName("User");
                }
            }
        }
    }, []);

    const handleSignupChange = (e) => {
        setSignupData({
            ...signupData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLoginChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...signupData }),
            });
            let data;
            try {
                data = await res.json();
            } catch (err) {
                toast.error("Invalid server response");
                console.error(err);
                return;
            }
            if (!res.ok) {
                // 2. Replace alert with toast
                toast.error(data.message || "Signup failed");
                return;
            }
            toast.success("Signup successful 🎉 Please log in.");
        } catch (error) {
            console.error(error);
            toast.error("Server error");
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });
            const contentType = res.headers.get("content-type");
            let data = {};

            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                // If it's not JSON, it's likely an HTML error page (404 or 500)
                const textError = await res.text();
                console.error("Server returned non-JSON:", textError);
                toast.error("Server configuration error. Check console.");
                return;
            }

            if (!res.ok) {
                toast.error(data.message || "Login failed");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setIsAuth(true);
            setUserName(data.user?.name || "User");
            toast.success("Login successful 🎉");

            // Optional delay before redirect to let user see toast
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);

        } catch (error) {
            console.error(error);
            toast.error("Server error");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuth(false);
        setLoginData({ email: "", password: "" });
        toast.success("Logged out successfully");

        setTimeout(() => {
            window.location.href = "/";
        }, 1000);
    };

    const handleDashboardClick = () => {
        toast("Navigating to Dashboard...", { icon: '🚀' });
    };

    return (
        <StyledWrapper>
            {/* 3. Add the Toaster container */}
            <Toaster position="top-center" reverseOrder={false} />

            <div className="wrapper">
                {isAuth ? (
                    <div className="profile-card">
                        <div className="profile-header">
                            <div className="avatar">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="title">Hello, {userName}!</h2>
                        </div>
                        <div className="profile-actions">
                            <button className="flip-card__btn" onClick={handleDashboardClick}>
                                Dashboard
                            </button>
                            <button className="flip-card__btn logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="card-switch">
                        <label className="switch">
                            <input className="toggle" type="checkbox" />
                            <span className="slider" />
                            <span className="card-side" />
                            <div className="flip-card__inner">
                                <div className="flip-card__front">
                                    <div className="title">Log in</div>
                                    <form onSubmit={handleLoginSubmit} className="flip-card__form">
                                        <input type="email" placeholder="Email" name="email" className="flip-card__input" value={loginData.email}
                                            onChange={handleLoginChange} />
                                        <input type="password" placeholder="Password" name="password" className="flip-card__input" value={loginData.password}
                                            onChange={handleLoginChange} />
                                        <button className="flip-card__btn">Let's go!</button>
                                    </form>
                                </div>
                                <div className="flip-card__back">
                                    <div className="title">Sign up</div>
                                    <form onSubmit={handleSignupSubmit} className="flip-card__form">
                                        <input type="text" placeholder="Name" name='name' className="flip-card__input" value={signupData.name} onChange={handleSignupChange} />
                                        <input type="email" placeholder="Email" name="email" className="flip-card__input" value={signupData.email} onChange={handleSignupChange} />
                                        <input type="password" placeholder="Password" name="password" className="flip-card__input" value={signupData.password} onChange={handleSignupChange} />
                                        <button type='submit' className="flip-card__btn">Confirm!</button>
                                    </form>
                                </div>
                            </div>
                        </label>
                    </div>
                )}
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  /* (Your existing CSS remains exactly the same) */
  .wrapper {
    --input-focus: #2d8cf0;
    --font-color: #fefefe;
    --font-color-sub: #7e7e7e;
    --main-color: #fefefe;
    --logout-color: #ff4b4b;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 64px);
  }

  .profile-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    width: 300px;
    padding: 30px 20px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
  }

  .profile-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
  }

  .avatar {
      width: 60px;
      height: 60px;
      background: var(--input-focus);
      border: 2px solid var(--main-color);
      box-shadow: 4px 4px var(--main-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: bold;
      color: var(--font-color);
  }

  .profile-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
      align-items: center;
  }

  .logout-btn {
      margin-top: 0;
      border-color: var(--logout-color);
      box-shadow: 4px 4px var(--logout-color);
      color: var(--logout-color);
  }
  
  .logout-btn:active {
      box-shadow: 0px 0px var(--logout-color);
      transform: translate(3px, 3px);
  }

  .switch {
    transform: translateY(-200px);
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    width: 50px;
    height: 20px;
  }

  .card-side::before {
    position: absolute;
    content: 'Log in';
    left: -70px;
    top: 0;
    width: 100px;
    text-decoration: underline;
    color: var(--font-color);
    font-weight: 600;
  }

  .card-side::after {
    position: absolute;
    content: 'Sign up';
    left: 70px;
    top: 0;
    width: 100px;
    text-decoration: none;
    color: var(--font-color);
    font-weight: 600;
  }

  .toggle {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    box-sizing: border-box;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--bg-color);
    transition: 0.3s;
  }

  .slider:before {
    box-sizing: border-box;
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    border: 2px solid var(--main-color);
    border-radius: 5px;
    left: -2px;
    bottom: 2px;
    background-color: var(--bg-color);
    box-shadow: 0 3px 0 var(--main-color);
    transition: 0.3s;
  }

  .toggle:checked + .slider {
    background-color: var(--input-focus);
  }

  .toggle:checked + .slider:before {
    transform: translateX(30px);
  }

  .toggle:checked ~ .card-side:before {
    text-decoration: none;
  }

  .toggle:checked ~ .card-side:after {
    text-decoration: underline;
  }

  .flip-card__inner {
    width: 300px;
    height: 350px;
    position: relative;
    background-color: transparent;
    perspective: 1000px;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  .toggle:checked ~ .flip-card__inner {
    transform: rotateY(180deg);
  }

  .toggle:checked ~ .flip-card__front {
    box-shadow: none;
  }

  .flip-card__front, .flip-card__back {
    padding: 20px;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    background: var(--bg-color);
    gap: 20px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
  }

  .flip-card__back {
    width: 100%;
    transform: rotateY(180deg);
  }

  .flip-card__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .title {
    margin: 20px 0 20px 0;
    font-size: 25px;
    font-weight: 900;
    text-align: center;
    color: var(--main-color);
  }

  .flip-card__input {
    width: 250px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 15px;
    font-weight: 600;
    color: var(--font-color);
    padding: 5px 10px;
    outline: none;
  }

  .flip-card__input::placeholder {
    color: var(--font-color-sub);
    opacity: 0.8;
  }

  .flip-card__input:focus {
    border: 2px solid var(--input-focus);
  }

  .flip-card__btn:active, .button-confirm:active {
    box-shadow: 0px 0px var(--main-color);
    transform: translate(3px, 3px);
  }

  .flip-card__btn {
    margin: 20px 0 20px 0;
    width: 120px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 17px;
    font-weight: 600;
    color: var(--font-color);
    cursor: pointer;
  }
`;

export default Form;