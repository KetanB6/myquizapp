"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Clock, CheckCircle, AlertCircle, 
  Plus, Loader2, Mail, Fingerprint, Eye, 
  HelpCircle, ChevronLeft 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

/* --- New Sub-component for the Full Question Page --- */
const FullQuizPreview = ({ quizId, onBack, primaryColor }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`https://noneditorial-professionally-serena.ngrok-free.dev/Logged/Preview/${quizId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }
        });
        if (response.ok) {
          const data = await response.json();
          setQuestions(data.questions || []);
        } else {
          toast.error("Could not load questions");
        }
      } catch (err) {
        toast.error("Network error fetching questions");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [quizId]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <BackButton onClick={onBack}>
        <ChevronLeft size={20} /> Back to Dashboard
      </BackButton>
      
      {loading ? (
        <LoadingState>
          <div className="center-content">
            <Loader2 className="spinner" size={40} color={primaryColor} />
            <p>Loading questions...</p>
          </div>
        </LoadingState>
      ) : (
        <QuestionsContainer>
          <h2 className="preview-header">Quiz Preview (ID: {quizId})</h2>
          {questions.length > 0 ? (
            questions.map((q, index) => (
              <FullQuestionItem key={index}>
                <div className="q-label"><HelpCircle size={14} /> Question {q.qno}</div>
                <p className="q-text">{q.question}</p>
                <div className="options-grid">
                  <span className={q.correctOpt === 'opt1' ? 'correct' : ''}>A: {q.opt1}</span>
                  <span className={q.correctOpt === 'opt2' ? 'correct' : ''}>B: {q.opt2}</span>
                  <span className={q.correctOpt === 'opt3' ? 'correct' : ''}>C: {q.opt3}</span>
                  <span className={q.correctOpt === 'opt4' ? 'correct' : ''}>D: {q.opt4}</span>
                </div>
              </FullQuestionItem>
            ))
          ) : (
            <EmptyState><h3>No questions found for this quiz.</h3></EmptyState>
          )}
        </QuestionsContainer>
      )}
    </motion.div>
  );
};

const UserDashboard = () => {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState(null); 
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
      
      <AnimatePresence mode="wait">
        {!selectedQuizId ? (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <header className="main-header">
              <div className="user-info">
                <h1>My Dashboard</h1>
                <p>Logged in as <span className="highlight">{userEmail}</span></p>
              </div>
              <CreateBtn className='cursor-pointer' onClick={() => router.push("/create")} $primary={primaryColor} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Plus size={20} /> New Quiz
              </CreateBtn>
            </header>

            {loading ? (
              <LoadingState>
                <div className="center-content">
                  <Loader2 className="spinner" size={40} color={primaryColor} />
                  <p>Syncing with server...</p>
                </div>
              </LoadingState>
            ) : quizzes.length > 0 ? (
              <QuizGrid>
                {quizzes.map((quiz, index) => (
                  <StyledCard key={quiz.quizId || index}>
                    <div className="card-header">
                      <div className="icon-bg"><BookOpen size={20} color={primaryColor} /></div>
                      <StatusBadge $isActive={quiz.status === "true" || quiz.status === true}>
                        {(quiz.status === "true" || quiz.status === true) ? "Active" : "Draft"}
                      </StatusBadge>
                    </div>
                    <h3 className="quiz-title">{quiz.quizTitle || "Untitled Quiz"}</h3>
                    <DataGrid>
                      <div className="data-item"><Clock size={14} /> {quiz.duration}m</div>
                      <div className="data-item"><Fingerprint size={14} /> {quiz.quizId}</div>
                    </DataGrid>
                    <SeeQuestionBtn onClick={() => setSelectedQuizId(quiz.quizId)} $primary={primaryColor}>
                      <Eye size={16} /> See Questions
                    </SeeQuestionBtn>
                  </StyledCard>
                ))}
              </QuizGrid>
            ) : (
              <EmptyState><div className="icon-box">📂</div><h3>No Data Available</h3></EmptyState>
            )}
          </motion.div>
        ) : (
          <FullQuizPreview 
            key="preview"
            quizId={selectedQuizId} 
            onBack={() => setSelectedQuizId(null)} 
            primaryColor={primaryColor} 
          />
        )}
      </AnimatePresence>
    </DashboardWrapper>
  );
};

/* --- Styled Components --- */

const DashboardWrapper = styled.div` 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 60px 20px; 
  color: #f8fafc; 
  
  .main-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: 50px; 
    gap: 20px;
    
    @media (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
    }

    h1 { font-size: 2.5rem; font-weight: 800; @media (max-width: 600px) { font-size: 2rem; } } 
    p { color: #64748b; } 
    .highlight { color: #3b82f6; font-weight: 600; } 
  } 
`;

const QuizGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px; `;

const StyledCard = styled(motion.div)` 
  background: rgba(30, 41, 59, 0.5); 
  border: 1px solid rgba(255, 255, 255, 0.08); 
  border-radius: 20px; 
  padding: 24px; 
  backdrop-filter: blur(10px); 
  .card-header { display: flex; justify-content: space-between; margin-bottom: 15px; .icon-bg { padding: 10px; background: rgba(37, 99, 235, 0.1); border-radius: 12px; } } 
  .quiz-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 18px; } 
`;

const DataGrid = styled.div` display: flex; gap: 10px; margin-bottom: 20px; .data-item { color: #94a3b8; font-size: 0.85rem; background: rgba(255,255,255,0.03); padding: 8px 12px; border-radius: 8px; display: flex; align-items: center; gap: 6px; } `;

const SeeQuestionBtn = styled.button` width: 100%; background: rgba(255,255,255,0.05); color: #94a3b8; padding: 12px; border-radius: 12px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; font-weight: 600; transition: all 0.2s; &:hover { background: ${props => props.$primary}; color: white; } `;

const StatusBadge = styled.span` padding: 6px 12px; border-radius: 100px; font-size: 0.7rem; font-weight: 700; background: ${props => props.$isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; color: ${props => props.$isActive ? '#10b981' : '#f87171'}; `;

const CreateBtn = styled(motion.a)` 
  display: flex; 
  align-items: center; 
  justify-content: center;
  gap: 10px; 
  background: ${props => props.$primary}; 
  padding: 14px 28px; 
  border-radius: 16px; 
  text-decoration: none; 
  color: white; 
  font-weight: 700;
  white-space: nowrap;
  @media (max-width: 600px) { width: 100%; }
`;

const BackButton = styled.button` background: none; border: none; color: #3b82f6; display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer; margin-bottom: 30px; &:hover { text-decoration: underline; } `;

const QuestionsContainer = styled.div` max-width: 800px; margin: 0 auto; .preview-header { margin-bottom: 30px; font-size: 1.8rem; } `;

const FullQuestionItem = styled.div` 
  background: rgba(30, 41, 59, 0.5); 
  border: 1px solid rgba(255, 255, 255, 0.08); 
  backdrop-filter: blur(10px); 
  padding: 25px; 
  border-radius: 20px; 
  margin-bottom: 20px; 
  height: auto;
  /* Prevents the card itself from being pushed wide by long content */
  overflow: hidden; 

  .q-label { color: #3b82f6; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; } 
  
  .q-text { 
    font-size: 1.1rem; 
    margin-bottom: 20px; 
    line-height: 1.5; 
    /* Essential for long strings in questions */
    word-break: break-word; 
    overflow-wrap: anywhere; 
  } 

  .options-grid { 
    display: grid; 
    /* Use minmax(0, 1fr) to prevent columns from expanding past 50% */
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); 
    gap: 12px; 

    @media (max-width: 650px) { 
      grid-template-columns: minmax(0, 1fr); 
    } 

    span { 
      padding: 14px; 
      background: rgba(255,255,255,0.03); 
      border-radius: 10px; 
      color: #e2e8f0; 
      border: 1px solid transparent; 
      font-size: 0.95rem;
      line-height: 1.4;
      
      /* KEY FIX: Forces text to wrap even if there are no spaces */
      word-break: break-all; 
      overflow-wrap: anywhere; 
      white-space: normal;
      display: block;
      width: 100%;
      box-sizing: border-box;
    } 

    .correct { 
      background: rgba(16, 185, 129, 0.1); 
      border-color: #10b981; 
      color: #10b981; 
      font-weight: 700; 
    } 
  } 
`;

const LoadingState = styled.div` 
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh; 
  text-align: center;
  .spinner { animation: spin 1s linear infinite; margin: 0 auto; } 
  @keyframes spin { to { transform: rotate(360deg); } } 
  p { color: #94a3b8; margin-top: 20px; } 
`;

const EmptyState = styled.div` text-align: center; padding: 100px 40px; .icon-box { font-size: 3rem; opacity: 0.3; } `;

export default UserDashboard;