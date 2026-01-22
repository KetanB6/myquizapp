"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, CheckCircle, AlertCircle, Plus, Loader2, Database, ChevronDown, ChevronUp, Mail, Fingerprint } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// --- Sub-component for each card to keep state independent ---
const QuizCardComponent = ({ quiz, primaryColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <StyledCard 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout // Framer motion layout prop handles the expansion animation smoothly
    >
      <div className="card-header">
        <div className="icon-bg">
          <BookOpen size={20} color={primaryColor} />
        </div>
        <StatusBadge $isActive={quiz.status === "true"}>
          {quiz.status === "true" ? <CheckCircle size={12}/> : <AlertCircle size={12}/>}
          {quiz.status === "true" ? "Active" : "Inactive"}
        </StatusBadge>
      </div>
      
      <h3 className="quiz-title">{quiz.quizTitle || "Untitled Quiz"}</h3>
      
      <DataGrid>
        <div className="data-item">
          <Clock size={14} />
          <span>{quiz.duration} mins</span>
        </div>
        <div className="data-item">
          <Mail size={14} />
          <span>{quiz.createdBy}</span>
        </div>
        <div className="data-item">
          <Fingerprint size={14} />
          <span>ID: {quiz.quizId}</span>
        </div>
      </DataGrid>

      <RawToggle onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        <Database size={14} /> 
        <span>{isOpen ? "Hide Server Response" : "View Server Response"}</span>
        {isOpen ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
      </RawToggle>

      <AnimatePresence>
        {isOpen && (
          <RawJsonBox
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <pre>{JSON.stringify(quiz, null, 2)}</pre>
          </RawJsonBox>
        )}
      </AnimatePresence>
      
      <div className="card-footer">
        <span className="node-status">System: Verified</span>
        <span className="db-sync">DB Synced</span>
      </div>
    </StyledCard>
  );
};

const UserDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const primaryColor = "#2563eb";

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        const email = parsedUser?.email;
        if (email) {
          setUserEmail(email);
          fetchUserQuizzes(email);
        }
      } catch (e) {
        console.error("Error parsing user data", e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserQuizzes = async (email) => {
    try {
      setLoading(true);
      const response = await fetch(`https://noneditorial-professionally-serena.ngrok-free.dev/Logged?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      } else {
        toast.error("Failed to load your quizzes");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Could not connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardWrapper>
      <Toaster />
      <header className="main-header">
        <div className="user-info">
          <motion.h1 initial={{ x: -20 }} animate={{ x: 0 }}>My Dashboard</motion.h1>
          <p>Logged in as <span className="highlight">{userEmail}</span></p>
        </div>
        <CreateBtn href="/create" $primary={primaryColor} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Plus size={20} /> New Quiz
        </CreateBtn>
      </header>

      {loading ? (
        <LoadingState>
          <Loader2 className="spinner" size={40} color={primaryColor} />
          <p>Syncing with server...</p>
        </LoadingState>
      ) : quizzes.length > 0 ? (
        <QuizGrid>
          {quizzes.map((quiz, index) => (
            <QuizCardComponent key={quiz.quizId || index} quiz={quiz} primaryColor={primaryColor} />
          ))}
        </QuizGrid>
      ) : (
        <EmptyState>
          <div className="icon-box">📂</div>
          <h3>No Data Available</h3>
          <p>You haven't generated any quizzes yet. Click 'New Quiz' to start.</p>
        </EmptyState>
      )}
    </DashboardWrapper>
  );
};

// --- Styled Components (Updated for better UI) ---

const DashboardWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  color: #f8fafc;

  .main-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 50px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 20px;

    h1 { font-size: 2.5rem; font-weight: 800; background: linear-gradient(to right, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p { color: #64748b; font-size: 0.95rem; }
    .highlight { color: #3b82f6; font-weight: 600; }
  }
`;

const QuizGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 25px;
  align-items: start;
`;

const StyledCard = styled(motion.div)`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    
    .icon-bg {
      padding: 10px;
      background: rgba(37, 99, 235, 0.1);
      border-radius: 12px;
    }
  }

  .quiz-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 18px;
    color: #fff;
    line-height: 1.4;
  }
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-bottom: 20px;

  .data-item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #94a3b8;
    font-size: 0.85rem;
    background: rgba(255,255,255,0.03);
    padding: 8px 12px;
    border-radius: 8px;
  }
`;

const RawToggle = styled.button`
  width: 100%;
  background: ${props => props.$isOpen ? 'rgba(37, 99, 235, 0.1)' : 'rgba(255,255,255,0.03)'};
  border: 1px solid ${props => props.$isOpen ? '#2563eb' : 'transparent'};
  color: ${props => props.$isOpen ? '#3b82f6' : '#94a3b8'};
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 12px;
  transition: all 0.2s;

  &:hover { background: rgba(37, 99, 235, 0.15); color: #3b82f6; }
`;

const RawJsonBox = styled(motion.div)`
  overflow: hidden;
  background: #020617;
  border-radius: 12px;
  margin-bottom: 15px;
  border: 1px solid rgba(255,255,255,0.05);
  pre {
    padding: 15px;
    font-size: 0.75rem;
    color: #10b981;
    margin: 0;
    white-space: pre-wrap;
    font-family: 'Fira Code', monospace;
  }
`;

const StatusBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${props => props.$isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.$isActive ? '#10b981' : '#f87171'};
  border: 1px solid ${props => props.$isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
`;

const CreateBtn = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${props => props.$primary};
  padding: 14px 28px;
  border-radius: 16px;
  text-decoration: none;
  color: white;
  font-weight: 700;
  box-shadow: 0 10px 20px -5px ${props => props.$primary}88;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 120px 0;
  .spinner { animation: spin 1s linear infinite; margin-bottom: 20px; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  p { color: #94a3b8; letter-spacing: 1px; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 100px 40px;
  background: rgba(255,255,255,0.02);
  border-radius: 30px;
  border: 2px dashed rgba(255,255,255,0.05);
  .icon-box { font-size: 4rem; margin-bottom: 20px; opacity: 0.5; }
  h3 { font-size: 1.5rem; margin-bottom: 10px; color: #fff; }
  p { color: #64748b; max-width: 300px; margin: 0 auto; }
`;

export default UserDashboard;