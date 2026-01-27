"use client";
import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { Zap, Loader2, Trophy, RefreshCcw, User, Hash, Play, CheckCircle2, XCircle, Clock, ChevronRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AIGenerator = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60); 

    const [joinData, setJoinData] = useState({
        participantName: '',
        quizId: ''
    });

    const handleSubmitExam = useCallback(async (finalAnswers = userAnswers) => {
        if (isSubmitted) return;
        setIsLoading(true);
        
        const questions = quizData.questions;
        let currentScore = 0;
        
        questions.forEach((q, idx) => {
            const correctKey = q.correctOpt; 
            const correctTextValue = q[correctKey]; 
            if (finalAnswers[idx] === correctTextValue) {
                currentScore++;
            }
        });

        const finalSubmission = {
            quizId: parseInt(joinData.quizId),
            participantName: joinData.participantName,
            score: currentScore.toString(),
            outOf: questions.length.toString()
        };

        try {
            const response = await fetch('https://noneditorial-professionally-serena.ngrok-free.dev/Play/Submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '69420',
                },
                body: JSON.stringify(finalSubmission)
            });

            if (response.ok) {
                setScore(currentScore);
                setIsSubmitted(true);
                toast.success("Exam Submitted Successfully!");
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                throw new Error("Failed to save results on server.");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            setScore(currentScore);
            setIsSubmitted(true);
            toast.error("Network error. Results shown locally.");
        } finally {
            setIsLoading(false);
        }
    }, [quizData, userAnswers, joinData, isSubmitted]);

    // --- FIXED NAVIGATION LOGIC ---
    const handleNextQuestion = useCallback(() => {
        if (!quizData) return;
        if (currentIndex < quizData.questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setTimeLeft(60); 
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            handleSubmitExam();
        }
    }, [currentIndex, quizData, handleSubmitExam]);

    // --- FIXED TIMER EFFECT ---
    useEffect(() => {
        let timer;
        if (quizData && !isSubmitted) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleNextQuestion();
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [quizData, isSubmitted, handleNextQuestion]);

    const handleJoinQuiz = async () => {
        if (!joinData.participantName || !joinData.quizId) {
            toast.error("Please enter both Name and Quiz ID");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`https://noneditorial-professionally-serena.ngrok-free.dev/Play/${joinData.quizId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': '69420',
                },
            });

            if (!response.ok) throw new Error(`Quiz not Started Yet`);
            const data = await response.json();
            setQuizData(data);
            setCurrentIndex(0); // Reset index on new quiz
            setTimeLeft(60); 
            toast.success(`Joined: ${data.quiz.quizTitle}`);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectOption = (questionIdx, optionText) => {
        if (isSubmitted) return;
        setUserAnswers(prev => ({ ...prev, [questionIdx]: optionText }));
    };

    return (
        <PageContainer>
            <Toaster position="top-center" />
            
            {!quizData ? (
                <GlassCard>
                    <Header>
                        <div className="icon-badge"><Play size={20} /></div>
                        <div>
                            <h2>Join Session</h2>
                            <p>60s per question</p>
                        </div>
                    </Header>

                    <FormGrid>
                        <InputGroup>
                            <label><User size={12} /> Name</label>
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                value={joinData.participantName}
                                onChange={(e) => setJoinData({...joinData, participantName: e.target.value})}
                            />
                        </InputGroup>

                        <InputGroup>
                            <label><Hash size={12} /> Quiz ID</label>
                            <input 
                                type="number" 
                                placeholder="ID" 
                                value={joinData.quizId}
                                onChange={(e) => setJoinData({...joinData, quizId: e.target.value})}
                            />
                        </InputGroup>

                        <PrimaryButton onClick={handleJoinQuiz} disabled={isLoading}>
                            {isLoading ? <Loader2 className="spinner" /> : "Start Quiz"}
                        </PrimaryButton>
                    </FormGrid>
                </GlassCard>
            ) : (
                <ResultContainer>
                    <ResultHeader>
                        <div className="title-area">
                            <div className={isSubmitted ? "score-badge" : "timer-badge"}>
                                {isSubmitted ? <Trophy size={16} /> : <Clock size={16} />}
                                {isSubmitted 
                                    ? `Final Score: ${score} / ${quizData.questions.length}` 
                                    : `${timeLeft}s Remaining`}
                            </div>
                            <h2>
                                {isSubmitted 
                                    ? "Exam Summary" 
                                    : `Question ${currentIndex + 1} of ${quizData.questions.length}`}
                            </h2>
                        </div>
                        
                        {!isSubmitted && (
                            <TimerTrack>
                                <TimerFill $width={(timeLeft / 60) * 100} />
                            </TimerTrack>
                        )}

                        {isSubmitted && (
                            <button className="reset-btn" onClick={() => window.location.reload()}>
                                <RefreshCcw size={16} /> New Quiz
                            </button>
                        )}
                    </ResultHeader>
                    
                    <QuestionGrid>
                        {quizData.questions.map((q, idx) => {
                            if (!isSubmitted && idx !== currentIndex) return null;

                            return (
                                <QuestionCard key={idx}>
                                    <div className="q-num">Question {idx + 1}</div>
                                    <h3>{q.question}</h3>
                                    <div className="options-list">
                                        {["opt1", "opt2", "opt3", "opt4"].map((optKey) => {
                                            const optValue = q[optKey];
                                            const isSelected = userAnswers[idx] === optValue;
                                            const isCorrect = optValue === q[q.correctOpt];
                                            
                                            let statusClass = "";
                                            if (isSubmitted) {
                                                if (isCorrect) statusClass = "correct";
                                                else if (isSelected && !isCorrect) statusClass = "wrong";
                                            } else if (isSelected) {
                                                statusClass = "selected";
                                            }

                                            return (
                                                <div 
                                                    key={optKey} 
                                                    className={`opt ${statusClass}`}
                                                    onClick={() => handleSelectOption(idx, optValue)}
                                                >
                                                    <div className="checkbox">
                                                        {isSelected && <div className="inner-dot" />}
                                                    </div>
                                                    <span className="opt-text">{optValue}</span>
                                                    {isSubmitted && isCorrect && <CheckCircle2 size={18} className="status-icon" />}
                                                    {isSubmitted && isSelected && !isCorrect && <XCircle size={18} className="status-icon" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </QuestionCard>
                            );
                        })}
                    </QuestionGrid>

                    {!isSubmitted && (
                        <StickyFooter>
                            <SubmitButton onClick={handleNextQuestion} disabled={isLoading}>
                                {currentIndex === quizData.questions.length - 1 ? "Finish Exam" : "Save & Next"}
                                <ChevronRight size={18} />
                            </SubmitButton>
                        </StickyFooter>
                    )}
                </ResultContainer>
            )}
        </PageContainer>
    );
};

// --- Updated Styled Components ---

const spin = keyframes` from { transform: rotate(0deg); } to { transform: rotate(360deg); } `;
const springUp = keyframes` from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } `;

const PageContainer = styled.div`
    min-height: 100vh; padding: 20px 15px; display: flex; justify-content: center; align-items: flex-start;
    color: #e2e2e2; font-family: 'Inter', sans-serif; background: transparent; position: relative; 
    overflow-x: hidden;
`;

const GlassCard = styled.div`
    width: 100%; max-width: 400px; background: rgba(255, 255, 255, 0.03); 
    backdrop-filter: blur(40px) saturate(150%); border: 1px solid rgba(255, 255, 255, 0.1); 
    border-radius: 24px; padding: 20px; animation: ${springUp} 0.5s ease-out;
    margin-top: 5vh;
`;

const Header = styled.div`
    display: flex; align-items: center; gap: 15px; margin-bottom: 20px;
    .icon-badge { 
        width: 45px; height: 45px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); 
        border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; 
    }
    h2 { margin: 0; font-size: 1.3rem; font-weight: 800; color: #fff; }
    p { margin: 0; color: #a1a1aa; font-size: 0.85rem; }
`;

const FormGrid = styled.div` display: flex; flex-direction: column; gap: 15px; `;

const InputGroup = styled.div`
    display: flex; flex-direction: column; gap: 6px;
    label { color: #a1a1aa; font-size: 0.7rem; font-weight: 700; display: flex; align-items: center; gap: 6px; }
    input { 
        background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); 
        border-radius: 12px; padding: 12px; color: #fff; font-size: 0.95rem; 
        &:focus { outline: none; border-color: #4f46e5; }
    }
`;

const PrimaryButton = styled.button`
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; 
    border: none; padding: 14px; border-radius: 12px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 5px;
    &:disabled { opacity: 0.5; }
    .spinner { animation: ${spin} 1s linear infinite; }
`;

const ResultContainer = styled.div` width: 100%; max-width: 700px; padding-bottom: 140px; `;

const ResultHeader = styled.div`
    display: flex; flex-direction: column; gap: 12px; margin-bottom: 30px;
    .timer-badge { background: rgba(79, 70, 229, 0.15); color: #818cf8; border: 1px solid rgba(79, 70, 229, 0.3); padding: 6px 14px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 8px; align-self: flex-start;}
    .score-badge { background: rgba(234, 179, 8, 0.15); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.3); padding: 6px 14px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 8px; align-self: flex-start;}
    h2 { margin: 0; font-size: 1.8rem; color: #fff; }
    .reset-btn { align-self: flex-start; background: rgba(255,255,255,0.05); color: #fff; padding: 8px 16px; border-radius: 10px; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 8px;}
`;

const TimerTrack = styled.div`
    width: 100%; height: 5px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; overflow: hidden; margin-top: 5px;
`;

const TimerFill = styled.div`
    height: 100%; background: linear-gradient(90deg, #4f46e5, #7c3aed); 
    width: ${props => props.$width}%; transition: width 1s linear;
`;

const QuestionGrid = styled.div` display: flex; flex-direction: column; gap: 20px; `;

const QuestionCard = styled.div`
    background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(30px); border: 1px solid rgba(255, 255, 255, 0.08); 
    padding: 25px; border-radius: 24px; animation: ${springUp} 0.5s ease-out forwards;
    .q-num { color: #818cf8; font-size: 0.75rem; font-weight: 800; margin-bottom: 10px; }
    h3 { font-size: 1.2rem; color: #fff; line-height: 1.5; margin-bottom: 25px; }
    .options-list { display: flex; flex-direction: column; gap: 10px; }
    .opt { 
        padding: 15px 18px; border-radius: 16px; background: rgba(0, 0, 0, 0.2); 
        border: 1px solid rgba(255, 255, 255, 0.05); color: #d1d1d6; display: flex; align-items: center; gap: 14px; cursor: pointer;
        &.selected { border-color: #4f46e5; background: rgba(79, 70, 229, 0.1); color: #fff; }
        &.correct { border-color: #22c55e; background: rgba(34, 197, 94, 0.15); color: #4ade80; }
        &.wrong { border-color: #ef4444; background: rgba(239, 68, 68, 0.15); color: #f87171; }
        .checkbox { width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; }
        .inner-dot { width: 10px; height: 10px; border-radius: 50%; background: #4f46e5; }
        .status-icon { margin-left: auto; }
    }
`;

const StickyFooter = styled.div`
    position: fixed; bottom: 0; left: 0; width: 100%; padding: 25px 15px;
    background: linear-gradient(to top, rgba(0,0,0,0.9) 60%, transparent); backdrop-filter: blur(10px);
    display: flex; justify-content: center; z-index: 10;
`;

const SubmitButton = styled(PrimaryButton)` width: 100%; max-width: 400px; border-radius: 100px; `;

export default AIGenerator;