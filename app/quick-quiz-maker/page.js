"use client";
import React, { useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import {
  Sparkles, Loader2, Trophy, RefreshCcw, Timer,
  ChevronRight, Clipboard, CheckCircle2, XCircle,
  AlertCircle, MessageSquare, Gamepad2, MousePointer2, Rocket, ExternalLink, Clock, Zap
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const GlobalStyle = createGlobalStyle`
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    background-color: #000000; 
    color: #ffffff; 
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    overflow-x: hidden;
  }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #000; }
  ::-webkit-scrollbar-thumb { background: #222; }
`;

const QuickQuizMaker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [rawJson, setRawJson] = useState('');
  const [topic, setTopic] = useState('');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [minsPerQuestion, setMinsPerQuestion] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [modal, setModal] = useState({ show: false, platform: '', url: '' });

  useEffect(() => {
    if (!quizData || isSubmitted) return;
    if (timeLeft === 0) {
      handleNextQuestion();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, quizData, isSubmitted]);

  const getPrompt = () => `Generate 10 multiple choice questions about "${topic || 'General Knowledge'}". 
Return ONLY a JSON array. Each object must have keys: "question", "opt1", "opt2", "opt3", "opt4", and "correctOpt". 
The "correctOpt" value must be the text of the correct option Base64 encoded.`;

  const handleCopyOnly = () => {
    if (!topic.trim()) return toast.error("TOPIC REQUIRED");
    navigator.clipboard.writeText(getPrompt());
    toast.success("PROMPT COPIED TO BUFFER");
  };

  const triggerAI = (platform) => {
    if (!topic.trim()) return toast.error("TOPIC REQUIRED");
    navigator.clipboard.writeText(getPrompt());
    const url = platform === 'chatgpt' ? "https://chatgpt.com/" : "https://gemini.google.com/app";
    setModal({ show: true, platform: platform === 'chatgpt' ? 'ChatGPT' : 'Gemini', url });
  };

  const handleProceedToAI = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (modal.platform === 'ChatGPT' && isMobile) {
      window.location.href = "chatgpt://";
      setTimeout(() => { window.open(modal.url, "_blank"); }, 800);
    } else {
      window.open(modal.url, "_blank");
    }
    setModal({ show: false, platform: '', url: '' });
  };

  const handleProcessPaste = () => {
    if (!rawJson.trim()) return toast.error("PASTE CODE FIRST");
    setIsLoading(true);
    try {
      const cleanJson = rawJson.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      const decodedData = parsed.map(q => ({
        ...q,
        decodedAnswer: (() => {
          try { return atob(q.correctOpt).trim(); }
          catch { return String(q.correctOpt).trim(); }
        })()
      }));
      setQuizData(decodedData);
      setIsSubmitted(false);
      setUserAnswers({});
      setCurrentQuestionIdx(0);
      setTimeLeft(minsPerQuestion * 60);
    } catch (error) {
      toast.error("DATA FORMAT CORRUPTED");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx === quizData.length - 1) {
      let currentScore = 0;
      quizData.forEach((q, idx) => {
        if (checkIsCorrect(q, userAnswers[idx])) currentScore++;
      });
      setScore(currentScore);
      setIsSubmitted(true);
    } else {
      setCurrentQuestionIdx(prev => prev + 1);
      setTimeLeft(minsPerQuestion * 60);
    }
  };

  const checkIsCorrect = (q, selected) => {
    if (!selected) return false;
    const decoded = q.decodedAnswer.toLowerCase();
    const sel = String(selected).toLowerCase().trim();
    return sel === decoded || (q[decoded] && String(q[decoded]).toLowerCase().trim() === sel);
  };

  return (
    <>
      <GlobalStyle />
      <PageContainer>
        <Toaster toastOptions={{ style: { background: '#0a0a0a', color: '#fff', border: '1px solid #222' } }} />

        {modal.show && (
          <ModalOverlay onClick={() => setModal({ show: false })}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <div className="icon-wrap"><CheckCircle2 size={32} /></div>
              <h3>PROMPT BUFFERED</h3>
              <p>PROMPT COPIED TO CLIPBOARD. INITIALIZE {modal.platform.toUpperCase()} INTERFACE NOW.</p>
              <div className="modal-actions">
                <button className="cancel" onClick={() => setModal({ show: false })}>ABORT</button>
                <button className="go" onClick={handleProceedToAI}>
                  OPEN {modal.platform.toUpperCase()} <ExternalLink size={14} />
                </button>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}

        {!quizData ? (
          <MainContent>
            <BrandingSection>
              <div className="status-pill">
                <span className="dot" /> SYSTEM ONLINE
              </div>
              <SectionTitle>NEURAL ARENA <Zap size={30} fill="#fff" /></SectionTitle>
              <p className="subtitle">TRANSFORM STATIC AI KNOWLEDGE INTO INTERACTIVE EVALUATIONS.</p>
              
              <DesktopInfoGrid>
                 <InfoItem>
                    <Timer size={20} />
                    <div>
                        <h4>TIMED EVALUATION</h4>
                        <p>Cement facts under pressure with per-question countdowns.</p>
                    </div>
                 </InfoItem>
                 <InfoItem>
                    <Rocket size={20} />
                    <div>
                        <h4>INSTANT DEPLOY</h4>
                        <p>No backend required. Copy, paste, and play in seconds.</p>
                    </div>
                 </InfoItem>
              </DesktopInfoGrid>
            </BrandingSection>

            <FormSection>
              <ZolviCard>
                <CardHeader>
                  <div className="step-count">CORE_CONFIG</div>
                  <h3>INITIALIZE ENGINE</h3>
                </CardHeader>

                <FormGrid>
                  <div className="row">
                    <InputGroup flex={2}>
                      <label><MessageSquare size={10} /> TOPIC_INPUT</label>
                      <input
                        type="text"
                        placeholder="E.G. QUANTUM COMPUTING..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      />
                    </InputGroup>
                    <InputGroup flex={1}>
                      <label><Clock size={10} /> INTERVAL</label>
                      <input
                        type="number"
                        min="1" max="3"
                        value={minsPerQuestion}
                        onChange={(e) => setMinsPerQuestion(Math.min(3, Math.max(1, parseInt(e.target.value) || 1)))}
                      />
                    </InputGroup>
                  </div>

                  <InputGroup>
                    <label>SYNC WITH PROVIDER</label>
                    <ButtonGroup>
                      <AIButton onClick={() => triggerAI('chatgpt')}>CHATGPT</AIButton>
                      <AIButton onClick={() => triggerAI('gemini')}>GEMINI</AIButton>
                      <IconButton onClick={handleCopyOnly}><Clipboard size={18} /></IconButton>
                    </ButtonGroup>
                  </InputGroup>

                  <InputGroup>
                    <label>INJECT RAW_JSON</label>
                    <textarea
                      value={rawJson}
                      onChange={(e) => setRawJson(e.target.value)}
                      placeholder='PASTE AI GENERATED CODE BLOCK HERE...'
                    />
                  </InputGroup>

                  <PrimaryButton onClick={handleProcessPaste} disabled={isLoading || !rawJson || !topic}>
                    {isLoading ? <Loader2 className="spinner" size={20} /> : "DEPLOY MISSION"}
                  </PrimaryButton>
                </FormGrid>
              </ZolviCard>
            </FormSection>
          </MainContent>
        ) : (
          <ArenaLayout>
            <ArenaHeader>
              <div className="meta">
                <span className="topic-badge">{topic.toUpperCase()}</span>
                <span className="station-count">STATION {currentQuestionIdx + 1} / {quizData.length}</span>
              </div>
              <div className="stats">
                <TimerBadge className={isSubmitted ? "score" : "active"}>
                    {isSubmitted ? `RESULT: ${score}/${quizData.length}` : `TIME: ${timeLeft}S`}
                </TimerBadge>
                {isSubmitted && (
                    <TerminateBtn onClick={() => { setQuizData(null); setRawJson(''); setTopic(''); }}>
                        TERMINATE SESSION
                    </TerminateBtn>
                )}
              </div>
            </ArenaHeader>

            <QuestionView>
              {quizData.map((q, idx) => {
                if (!isSubmitted && idx !== currentQuestionIdx) return null;
                return (
                  <motion-div key={idx} className="q-wrapper">
                    <h2 className="question-text">{q.question.toUpperCase()}</h2>
                    <OptionsGrid>
                      {[q.opt1, q.opt2, q.opt3, q.opt4].map((opt, i) => {
                        const isSelected = userAnswers[idx] === opt;
                        const correct = checkIsCorrect(q, opt);
                        let variant = isSubmitted ? (correct ? "correct" : (isSelected ? "wrong" : "idle")) : (isSelected ? "selected" : "idle");
                        return (
                          <OptionCard 
                            key={i} 
                            className={variant} 
                            onClick={() => !isSubmitted && setUserAnswers({ ...userAnswers, [idx]: opt })}
                          >
                            <span className="index">{String.fromCharCode(65 + i)}</span>
                            {opt.toUpperCase()}
                          </OptionCard>
                        );
                      })}
                    </OptionsGrid>
                    {isSubmitted && !checkIsCorrect(q, userAnswers[idx]) && (
                      <div className="feedback-bar">
                        <AlertCircle size={14} /> CORRECT_KEY: {String(q[q.decodedAnswer] || q.decodedAnswer).toUpperCase()}
                      </div>
                    )}
                  </motion-div>
                );
              })}
            </QuestionView>

            {!isSubmitted && (
              <ArenaFooter>
                <ActionButton onClick={handleNextQuestion}>
                  {currentQuestionIdx === quizData.length - 1 ? "FINISH MISSION" : "NEXT STATION"} 
                  <ChevronRight size={20} />
                </ActionButton>
              </ArenaFooter>
            )}
          </ArenaLayout>
        )}
      </PageContainer>
    </>
  );
};

// --- STYLES ---
const spin = keyframes` from { transform: rotate(0deg); } to { transform: rotate(360deg); } `;
const pulse = keyframes` 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } `;

const PageContainer = styled.div`
  min-height: 100vh; width: 100%; display: flex; justify-content: center; align-items: flex-start;
  padding: 40px 20px; background: #000;
  @media (max-width: 768px) { padding: 20px 15px; }
`;

const MainContent = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 80px; width: 100%; max-width: 1200px; align-items: center;
  @media (max-width: 1024px) { grid-template-columns: 1fr; gap: 60px; text-align: center; }
`;

const BrandingSection = styled.div`
  .status-pill {
    display: inline-flex; align-items: center; gap: 8px; background: #111; padding: 6px 12px;
    border-radius: 100px; font-size: 10px; font-weight: 900; letter-spacing: 2px; color: #666; margin-bottom: 24px;
    .dot { width: 6px; height: 6px; background: #fff; border-radius: 50%; animation: ${pulse} 2s infinite; }
  }
  .subtitle { color: #666; font-size: 0.95rem; font-weight: 500; margin-top: 15px; }
`;

const SectionTitle = styled.h1`
  font-size: clamp(2.5rem, 8vw, 4.5rem); font-weight: 900; line-height: 0.9; letter-spacing: -3px;
  display: flex; align-items: center; gap: 20px;
  @media (max-width: 1024px) { justify-content: center; }
`;

const DesktopInfoGrid = styled.div`
  display: flex; flex-direction: column; gap: 30px; margin-top: 50px;
  @media (max-width: 1024px) { display: none; }
`;

const InfoItem = styled.div`
  display: flex; gap: 20px; text-align: left;
  h4 { font-size: 0.8rem; font-weight: 900; letter-spacing: 1px; color: #fff; margin-bottom: 5px; }
  p { font-size: 0.85rem; color: #444; font-weight: 500; line-height: 1.4; }
`;

const FormSection = styled.div` width: 100%; max-width: 500px; margin: 0 auto; `;

const ZolviCard = styled.div` 
    background: #000; border: 1px solid #1a1a1a; padding: 40px; 
    @media (max-width: 600px) { padding: 25px; }
`;

const CardHeader = styled.div`
  margin-bottom: 30px;
  .step-count { font-size: 10px; font-weight: 900; color: #333; letter-spacing: 2px; margin-bottom: 5px; }
  h3 { font-size: 1.2rem; font-weight: 900; letter-spacing: 1px; }
`;

const FormGrid = styled.div` display: flex; flex-direction: column; gap: 20px; .row { display: flex; gap: 15px; } `;

const InputGroup = styled.div`
  flex: ${props => props.flex || 'none'};
  label { display: block; font-size: 9px; font-weight: 900; color: #444; margin-bottom: 10px; letter-spacing: 1.5px; }
  input, textarea {
    width: 100%; background: #080808; border: 1px solid #1a1a1a; padding: 16px; color: #fff;
    font-size: 0.9rem; transition: 0.3s;
    &:focus { border-color: #fff; outline: none; background: #000; }
  }
  textarea { height: 120px; font-family: 'JetBrains Mono', monospace; resize: none; font-size: 0.8rem; }
`;

const ButtonGroup = styled.div` display: flex; gap: 1px; background: #1a1a1a; border: 1px solid #1a1a1a; `;

const AIButton = styled.button`
  flex: 1; padding: 15px; background: #000; border: none; color: #666; font-size: 11px; font-weight: 900;
  cursor: pointer; transition: 0.2s; &:hover { color: #fff; background: #0a0a0a; }
`;

const IconButton = styled.button`
  width: 50px; background: #000; color: #333; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center; &:hover { color: #fff; }
`;

const PrimaryButton = styled.button`
  width: 100%; padding: 20px; background: #fff; color: #000; border: none; font-weight: 900;
  font-size: 0.9rem; letter-spacing: 1px; cursor: pointer; transition: 0.2s;
  &:hover:not(:disabled) { background: #ccc; }
  &:disabled { opacity: 0.1; cursor: not-allowed; }
  .spinner { animation: ${spin} 1s linear infinite; }
`;

const ArenaLayout = styled.div` width: 100%; max-width: 800px; display: flex; flex-direction: column; gap: 40px; `;

const ArenaHeader = styled.div`
  display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 20px; border-bottom: 1px solid #1a1a1a;
  .meta { display: flex; flex-direction: column; gap: 8px; }
  .topic-badge { font-size: 10px; font-weight: 900; letter-spacing: 2px; color: #444; }
  .station-count { font-size: 1.2rem; font-weight: 900; }
  .stats { text-align: right; }
  @media (max-width: 600px) { flex-direction: column; align-items: flex-start; gap: 20px; .stats { text-align: left; } }
`;

const TimerBadge = styled.div`
  font-size: 0.9rem; font-weight: 900; letter-spacing: 1px;
  &.active { color: #fff; }
  &.score { background: #fff; color: #000; padding: 6px 15px; }
`;

const TerminateBtn = styled.button`
  background: none; border: none; color: #444; font-size: 10px; font-weight: 900; cursor: pointer;
  margin-top: 10px; text-decoration: underline; &:hover { color: #fff; }
`;

const QuestionView = styled.div`
  .question-text { font-size: clamp(1.4rem, 4vw, 2.2rem); font-weight: 900; line-height: 1.1; letter-spacing: -1px; margin-bottom: 40px; }
  .q-wrapper { margin-bottom: 60px; }
  .feedback-bar { margin-top: 20px; font-size: 11px; font-weight: 900; color: #fff; background: #111; padding: 12px; display: flex; align-items: center; gap: 10px; }
`;

const OptionsGrid = styled.div` display: grid; grid-template-columns: 1fr 1fr; gap: 15px; @media (max-width: 600px) { grid-template-columns: 1fr; } `;

const OptionCard = styled.div`
  padding: 25px; border: 1px solid #1a1a1a; font-weight: 700; font-size: 0.95rem; cursor: pointer;
  display: flex; align-items: center; gap: 15px; transition: 0.2s;
  .index { width: 24px; height: 24px; border: 1px solid #222; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; color: #444; }
  
  &:hover:not(.correct):not(.wrong) { background: #080808; border-color: #333; }
  &.selected { background: #fff; color: #000; border-color: #fff; .index { border-color: #000; color: #000; } }
  &.correct { background: #fff; color: #000; border-color: #fff; font-weight: 900; .index { background: #000; color: #fff; border: none; } }
  &.wrong { border-color: #111; color: #222; .index { border-color: #111; color: #111; } }
`;

const ArenaFooter = styled.div`
  position: fixed; bottom: 0; left: 0; width: 100%; padding: 30px; background: rgba(0,0,0,0.8);
  backdrop-filter: blur(10px); border-top: 1px solid #1a1a1a; display: flex; justify-content: center;
`;

const ActionButton = styled.button`
  background: #fff; color: #000; border: none; padding: 18px 40px; font-weight: 900;
  display: flex; align-items: center; gap: 15px; cursor: pointer; font-size: 1rem;
  @media (max-width: 600px) { width: 100%; justify-content: center; }
`;

const ModalOverlay = styled.div` position: fixed; inset: 0; background: rgba(0,0,0,0.95); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; `;
const ModalContent = styled.div`
  background: #000; border: 1px solid #1a1a1a; padding: 50px; max-width: 450px; text-align: center;
  .icon-wrap { width: 60px; height: 60px; border: 1px solid #fff; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px; }
  h3 { font-size: 1.5rem; font-weight: 900; letter-spacing: -1px; margin-bottom: 10px; }
  p { color: #444; font-size: 0.85rem; font-weight: 600; line-height: 1.5; margin-bottom: 40px; }
  .modal-actions {
    display: flex; gap: 1px; background: #1a1a1a; border: 1px solid #1a1a1a;
    button { flex: 1; padding: 20px; border: none; font-weight: 900; font-size: 0.8rem; cursor: pointer; }
    .cancel { background: #000; color: #444; &:hover { color: #fff; } }
    .go { background: #fff; color: #000; }
  }
`;

export default QuickQuizMaker;