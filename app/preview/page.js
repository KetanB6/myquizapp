"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ChevronLeft, HelpCircle, Clock, Book, Mail } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const QuizPreviewPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullQuiz = async () => {
      try {
        const response = await fetch(`https://noneditorial-professionally-serena.ngrok-free.dev/Logged/Preview/${id}`, {
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

  if (loading) return <PageLoader>Loading Quiz Content...</PageLoader>;
  if (!data) return <PageLoader>No data found.</PageLoader>;

  return (
    <PageWrapper initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Toaster />
      <nav className="top-nav">
        <button onClick={() => router.back()} className="back-btn">
          <ChevronLeft size={20} /> Back to Dashboard
        </button>
      </nav>

      <HeaderSection>
        <div className="badge">Quiz Preview</div>
        <h1>{data.quiz.quizTitle}</h1>
        <div className="meta-grid">
          <span><Clock size={16}/> {data.quiz.duration} Mins</span>
          <span><Book size={16}/> {data.questions.length} Questions</span>
          <span><Mail size={16}/> {data.quiz.createdBy}</span>
        </div>
      </HeaderSection>

      <QuestionsContainer>
        {data.questions.map((q, index) => (
          <QuestionCard 
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="q-header">
              <HelpCircle size={18} color="#3b82f6" />
              <span>Question {q.qno}</span>
            </div>
            <p className="question-text">{q.question}</p>
            
            <OptionsGrid>
              {['opt1', 'opt2', 'opt3', 'opt4'].map((optKey, i) => (
                <OptionItem 
                  key={optKey} 
                  $isCorrect={data.questions[index].correctOpt === optKey}
                >
                  <span className="label">{String.fromCharCode(65 + i)}</span>
                  {q[optKey]}
                </OptionItem>
              ))}
            </OptionsGrid>
          </QuestionCard>
        ))}
      </QuestionsContainer>
    </PageWrapper>
  );
};

/* --- Styled Components --- */

const PageWrapper = styled(motion.div)`
  min-height: 100vh;
  color: white;
  padding: 40px 20px;
  .top-nav { max-width: 800px; margin: 0 auto 30px; }
  .back-btn { 
    background: none; border: none; color: #94a3b8; cursor: pointer;
    display: flex; align-items: center; gap: 8px; font-weight: 500;
    &:hover { color: #fff; }
  }
`;

const HeaderSection = styled.div`
  max-width: 800px;
  margin: 0 auto 50px;
  text-align: center;
  .badge { background: rgba(59, 130, 246, 0.1); color: #3b82f6; padding: 6px 15px; border-radius: 20px; display: inline-block; font-size: 0.8rem; font-weight: 700; margin-bottom: 15px; }
  h1 { font-size: 2.5rem; margin-bottom: 20px; }
  .meta-grid { display: flex; justify-content: center; gap: 25px; color: #64748b; font-size: 0.9rem; }
`;

const QuestionsContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const QuestionCard = styled(motion.div)`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255,255,255,0.05);
  padding: 30px;
  border-radius: 24px;
  .q-header { display: flex; align-items: center; gap: 10px; color: #3b82f6; font-weight: 700; margin-bottom: 15px; }
  .question-text { font-size: 1.2rem; line-height: 1.6; margin-bottom: 25px; color: #e2e8f0; }
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const OptionItem = styled.div`
  padding: 15px 20px;
  border-radius: 12px;
  background: ${props => props.$isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.03)'};
  border: 1px solid ${props => props.$isCorrect ? '#10b981' : 'rgba(255,255,255,0.05)'};
  color: ${props => props.$isCorrect ? '#10b981' : '#94a3b8'};
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: ${props => props.$isCorrect ? '600' : '400'};
  .label { opacity: 0.5; font-size: 0.8rem; }
`;

const PageLoader = styled.div`
  height: 100vh; display: flex; align-items: center; justify-content: center; background: #0f172a; color: #94a3b8;
`;

export default QuizPreviewPage;