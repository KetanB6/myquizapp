"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { ChevronLeft, HelpCircle, Clock, Book, Mail, Zap } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const QuizPreviewPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullQuiz = async () => {
      try {
        const response = await fetch(`https://quiz-krida.onrender.com/Logged/Preview/${id}`, {
          method: 'GET',
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          toast.error("Failed to load quiz details");
        }
      } catch (err) {
        toast.error("Server connection error");
      } finally {
        setLoading(false);
      }
    };
    fetchFullQuiz();
  }, [id]);

  if (loading) return (
    <PageLoader>
      <Zap className="spinner" size={32} />
      <p>Synchronizing Arena Data...</p>
    </PageLoader>
  );

  if (!data) return <PageLoader>No session data found.</PageLoader>;

  return (
    <PageWrapper initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Toaster toastOptions={{ style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' } }} />
      
      <nav className="top-nav">
        <button onClick={() => router.back()} className="back-btn">
          <ChevronLeft size={18} /> Back to Dashboard
        </button>
      </nav>

      <HeaderSection>
        <div className="badge">Preview Mode</div>
        <h1>{data.quiz.quizTitle}</h1>
        <div className="meta-grid">
          <div className="meta-item"><Clock size={14}/> {data.quiz.duration} Mins</div>
          <div className="meta-item"><Book size={14}/> {data.questions.length} Questions</div>
          <div className="meta-item"><Mail size={14}/> {data.quiz.createdBy}</div>
        </div>
      </HeaderSection>

      <QuestionsContainer>
        {data.questions.map((q, index) => (
          <QuestionCard 
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="q-header">
              <span className="q-num">Question {index + 1}</span>
            </div>
            <p className="question-text">{q.question}</p>
            
            <OptionsGrid>
              {['opt1', 'opt2', 'opt3', 'opt4'].map((optKey, i) => (
                <OptionItem 
                  key={optKey} 
                  $isCorrect={data.questions[index].correctOpt === optKey}
                >
                  <div className="indicator">
                    {data.questions[index].correctOpt === optKey ? <Zap size={12} fill="currentColor"/> : String.fromCharCode(65 + i)}
                  </div>
                  <span className="opt-text">{q[optKey]}</span>
                </OptionItem>
              ))}
            </OptionsGrid>
          </QuestionCard>
        ))}
      </QuestionsContainer>
    </PageWrapper>
  );
};

/* --- Styled Components (Zolvi Aligned) --- */

const spin = keyframes` from { transform: rotate(0deg); } to { transform: rotate(360deg); } `;

const PageWrapper = styled(motion.div)`
  min-height: 100vh;
  background-color: #09090b;
  background-image: 
    radial-gradient(at 0% 0%, rgba(79, 70, 229, 0.08) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(124, 58, 237, 0.05) 0px, transparent 50%);
  color: #fafafa;
  padding: 60px 20px;
  font-family: 'Plus Jakarta Sans', sans-serif;

  .top-nav { max-width: 800px; margin: 0 auto 40px; }
  .back-btn { 
    background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #a1a1aa; 
    padding: 8px 16px; border-radius: 12px; cursor: pointer;
    display: flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 600;
    transition: 0.2s;
    &:hover { color: #fff; border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); }
  }
`;

const HeaderSection = styled.div`
  max-width: 800px;
  margin: 0 auto 60px;
  text-align: center;
  .badge { background: rgba(99, 102, 241, 0.1); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.2); padding: 6px 14px; border-radius: 100px; display: inline-block; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; }
  h1 { font-size: 2.75rem; font-weight: 800; letter-spacing: -0.04em; margin-bottom: 24px; color: #fff; }
  .meta-grid { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
  .meta-item { display: flex; align-items: center; gap: 8px; color: #71717a; font-size: 0.85rem; font-weight: 500; background: rgba(255,255,255,0.03); padding: 6px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }
`;

const QuestionsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const QuestionCard = styled(motion.div)`
  background: rgba(24, 24, 27, 0.4);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 40px;
  border-radius: 32px;
  backdrop-filter: blur(10px);
  .q-header { margin-bottom: 16px; }
  .q-num { color: #6366f1; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
  .question-text { font-size: 1.35rem; font-weight: 600; line-height: 1.5; margin-bottom: 32px; color: #f4f4f5; }
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const OptionItem = styled.div`
  padding: 18px 20px;
  border-radius: 18px;
  background: ${props => props.$isCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(0, 0, 0, 0.2)'};
  border: 1px solid ${props => props.$isCorrect ? '#10b981' : 'rgba(255,255,255,0.05)'};
  color: ${props => props.$isCorrect ? '#34d399' : '#a1a1aa'};
  display: flex;
  align-items: center;
  gap: 16px;
  transition: 0.3s;
  
  .indicator {
    width: 24px; height: 24px; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; font-weight: 800;
    background: ${props => props.$isCorrect ? '#10b981' : 'rgba(255,255,255,0.05)'};
    color: ${props => props.$isCorrect ? '#fff' : '#71717a'};
  }

  .opt-text { font-size: 0.95rem; font-weight: ${props => props.$isCorrect ? '600' : '500'}; }
`;

const PageLoader = styled.div`
  height: 100vh; display: flex; flex-direction: column; gap: 16px; align-items: center; justify-content: center; background: #09090b; color: #71717a; font-family: 'Plus Jakarta Sans', sans-serif;
  .spinner { animation: ${spin} 2s linear infinite; color: #6366f1; }
  p { font-weight: 600; font-size: 0.9rem; }
`;

export default QuizPreviewPage;