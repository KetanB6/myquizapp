"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Clock, CheckCircle, AlertCircle, 
  Plus, Loader2, ChevronDown, ChevronUp, 
  Mail, Fingerprint, Eye, HelpCircle 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const QuizCardComponent = ({ quiz, primaryColor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [fetchingQuestions, setFetchingQuestions] = useState(false);

  const toggleQuestions = async () => {
    if (!isOpen) {
      try {
        setFetchingQuestions(true);
        const response = await fetch(`https://noneditorial-professionally-serena.ngrok-free.dev/Logged/Preview/${quiz.quizId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setQuestions(data.questions || []);
          setIsOpen(true);
        } else {
          toast.error("Could not load questions");
        }
      } catch (err) {
        toast.error("Network error fetching questions");
      } finally {
        setFetchingQuestions(false);
      }
    } else {
      setIsOpen(false);
    }
  };

  return (
    // Removed 'layout' prop here to stop other cards from moving/opening glitchily
    <StyledCard 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="card-header">
        <div className="icon-bg">
          <BookOpen size={20} color={primaryColor} />
        </div>
        <StatusBadge $isActive={quiz.status === "true" || quiz.status === true}>
          {(quiz.status === "true" || quiz.status === true) ? <CheckCircle size={12}/> : <AlertCircle size={12}/>}
          {(quiz.status === "true" || quiz.status === true) ? "Active" : "Draft"}
        </StatusBadge>
      </div>
      
      <h3 className="quiz-title">{quiz.quizTitle || "Untitled Quiz"}</h3>
      
      <DataGrid>
        <div className="data-item">
          <Clock size={14} />
          <span>{quiz.duration} mins</span>
        </div>
        <div className="data-item">
          <Fingerprint size={14} />
          <span>ID: {quiz.quizId}</span>
        </div>
      </DataGrid>

      <SeeQuestionBtn onClick={toggleQuestions} $isOpen={isOpen} $primary={primaryColor}>
        {fetchingQuestions ? (
          <Loader2 size={16} className="spinner" />
        ) : (
          <Eye size={16} />
        )}
        <span>{isOpen ? "Hide Questions" : "See Questions"}</span>
        {isOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
      </SeeQuestionBtn>

      <AnimatePresence>
        {isOpen && (
          <QuestionsList
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {questions.length > 0 ? (
              questions.map((q, index) => (
                <QuestionItem 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="q-label">
                    <HelpCircle size={12} /> Question {q.qno}
                  </div>
                  <p className="q-text">{q.question}</p>
                  <div className="options-mini-grid">
                    <span className={q.correctOpt === 'opt1' ? 'correct' : ''}>A: {q.opt1}</span>
                    <span className={q.correctOpt === 'opt2' ? 'correct' : ''}>B: {q.opt2}</span>
                    <span className={q.correctOpt === 'opt3' ? 'correct' : ''}>C: {q.opt3}</span>
                    <span className={q.correctOpt === 'opt4' ? 'correct' : ''}>D: {q.opt4}</span>
                  </div>
                </QuestionItem>
              ))
            ) : (
              <p className="no-questions">No questions available.</p>
            )}
          </QuestionsList>
        )}
      </AnimatePresence>
      
      <div className="card-footer">
        <span className="user-tag"><Mail size={12}/> {quiz.createdBy}</span>
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
        if (parsedUser?.email) {
          setUserEmail(parsedUser.email);
          fetchUserQuizzes(parsedUser.email);
        }
      } catch (e) { setLoading(false); }
    } else { setLoading(false); }
  }, []);

  const fetchUserQuizzes = async (email) => {
    try {
      setLoading(true);
      const response = await fetch(`https://noneditorial-professionally-serena.ngrok-free.dev/Logged?email=${email}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }
      });
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      }
    } catch (error) { toast.error("Database connection failed"); } 
    finally { setLoading(false); }
  };

  return (
    <DashboardWrapper>
      <Toaster />
      <header className="main-header">
        <div className="user-info">
          <h1>My Dashboard</h1>
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
        </EmptyState>
      )}
    </DashboardWrapper>
  );
};

/* --- Styled Components --- */

const DashboardWrapper = styled.div` max-width: 1200px; margin: 0 auto; padding: 60px 20px; color: #f8fafc; .main-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 50px; h1 { font-size: 2.5rem; font-weight: 800; color: #fff; } p { color: #64748b; } .highlight { color: #3b82f6; font-weight: 600; } } `;
const QuizGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 25px; align-items: start; `; // Added align-items: start
const StyledCard = styled(motion.div)` background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 24px; backdrop-filter: blur(10px); position: relative; height: fit-content; .card-header { display: flex; justify-content: space-between; margin-bottom: 15px; .icon-bg { padding: 10px; background: rgba(37, 99, 235, 0.1); border-radius: 12px; } } .quiz-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 18px; color: #fff; } `;
const DataGrid = styled.div` display: flex; gap: 10px; margin-bottom: 20px; .data-item { display: flex; align-items: center; gap: 8px; color: #94a3b8; font-size: 0.85rem; background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; } `;
const SeeQuestionBtn = styled.button` width: 100%; background: ${props => props.$isOpen ? props.$primary : 'rgba(255,255,255,0.05)'}; color: ${props => props.$isOpen ? '#fff' : '#94a3b8'}; padding: 12px; border-radius: 12px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; font-weight: 600; transition: all 0.2s; &:hover { background: ${props => props.$primary}dd; color: white; } .spinner { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } } `;
const QuestionsList = styled(motion.div)` overflow: hidden; margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px; `;
const QuestionItem = styled(motion.div)` background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; margin-bottom: 10px; border-left: 3px solid transparent; &:hover { border-left-color: #3b82f6; } .q-label { font-size: 0.7rem; font-weight: 800; color: #3b82f6; display: flex; align-items: center; gap: 5px; text-transform: uppercase; margin-bottom: 8px; } .q-text { font-size: 0.9rem; color: #e2e8f0; margin-bottom: 10px; line-height: 1.4; } .options-mini-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; span { font-size: 0.75rem; color: #64748b; padding: 4px 8px; border-radius: 4px; background: rgba(255,255,255,0.02); } .correct { color: #10b981; background: rgba(16, 185, 129, 0.1); font-weight: 700; border: 1px solid rgba(16, 185, 129, 0.2); } } `;
const StatusBadge = styled.span` display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 100px; font-size: 0.7rem; font-weight: 700; background: ${props => props.$isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; color: ${props => props.$isActive ? '#10b981' : '#f87171'}; `;
const CreateBtn = styled(motion.a)` display: flex; align-items: center; gap: 10px; background: ${props => props.$primary}; padding: 14px 28px; border-radius: 16px; text-decoration: none; color: white; font-weight: 700; `;
const LoadingState = styled.div` text-align: center; padding: 120px 0; .spinner { animation: spin 1s linear infinite; } p { color: #94a3b8; margin-top: 20px; } `;
const EmptyState = styled.div` text-align: center; padding: 100px 40px; color: #fff; .icon-box { font-size: 3rem; opacity: 0.3; } `;

export default UserDashboard;