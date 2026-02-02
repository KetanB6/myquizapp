"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, ChevronLeft, ChevronRight, Save, Layout, 
  Clock, CheckCircle, ArrowRight, Loader2, User, Eye, EyeOff, Timer 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const CreatePage = () => {
  const [phase, setPhase] = useState(0);
  const [loading, setLoading] = useState(false);

  const [quizInfo, setQuizInfo] = useState({
    quizId: null,
    duration: 0,
    email: "",
    quizTitle: "",
    authorName: "", 
    isPrivate: false, 
    status: false,
    timeLimit: false,
    questionPerMin: "" 
  });

  const [questions, setQuestions] = useState([
    {
      quizId: null,
      question: "",
      a: "",
      b: "",
      c: "",
      d: "",
      correct: "a"
    }
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setQuizInfo(prev => ({ 
          ...prev, 
          email: parsedUser?.email || "",
          authorName: parsedUser?.name || "" 
        }));
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  const handleInfoChange = (field, value) => {
    setQuizInfo({ ...quizInfo, [field]: value });
  };

  const validateAndProceed = async () => {
    const title = quizInfo.quizTitle?.trim();
    const author = quizInfo.authorName?.trim();
    const email = quizInfo.email?.trim();

    if (!title || !author || !email) {
      toast.error("MISSING_CRITICAL_DATA: Fill all fields");
      return;
    }

    if (quizInfo.timeLimit && (!quizInfo.questionPerMin || quizInfo.questionPerMin <= 0)) {
      toast.error("TIMER_NOT_SET: Define seconds per question");
      return;
    }

    setLoading(true);

    const step1Payload = {
      duration: 0, 
      createdBy: email,
      quizTitle: title,
      author: author,
      status: false,
      timer: Boolean(quizInfo.timeLimit),   
      private: Boolean(quizInfo.isPrivate), 
      isPrivate: Boolean(quizInfo.isPrivate),
      timePerQ: quizInfo.timeLimit ? parseInt(quizInfo.questionPerMin) : 0 
    };

    try {
      const response = await fetch('https://quiz-krida.onrender.com/Create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' 
        },
        body: JSON.stringify(step1Payload)
      });

      if (response.ok) {
        const savedQuizFromServer = await response.json();
        setQuizInfo(prev => ({ ...prev, quizId: savedQuizFromServer }));
        setQuestions(prevQuestions =>
          prevQuestions.map(q => ({ ...q, quizId: savedQuizFromServer }))
        );
        toast.success(`SYSTEM_INITIALIZED: Quiz ID ${savedQuizFromServer}`);
        setPhase(1);
      } else {
        toast.error(`SERVER_REJECTED: Check constraints`);
      }
    } catch (error) {
      toast.error("NETWORK_FAILURE");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim() || !q.a.trim() || !q.b.trim() || !q.c.trim() || !q.d.trim()) {
        setCurrentSlide(i);
        toast.error(`INCOMPLETE_CONTENT: Question ${i + 1}`);
        return;
      }
    }

    setLoading(true);
    const payload = questions.map((q) => ({
      quizId: quizInfo.quizId,
      question: q.question,
      opt1: q.a,
      opt2: q.b,
      opt3: q.c,
      opt4: q.d,
      correctOpt: `opt${q.correct.toLowerCase() === 'a' ? '1' : q.correct.toLowerCase() === 'b' ? '2' : q.correct.toLowerCase() === 'c' ? '3' : '4'}`
    }));

    try {
      const response = await fetch('https://quiz-krida.onrender.com/Questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success("COMMIT_SUCCESSFUL");
        window.location.href = "/dashboard";
      } else {
        toast.error(`COMMIT_FAILED: ${response.status}`);
      }
    } catch (error) {
      toast.error("CONNECTION_INTERRUPTED");
    } finally {
      setLoading(false);
    }
  };

  const addSlide = () => {
    setQuestions([...questions, { quizId: quizInfo.quizId, question: "", a: "", b: "", c: "", d: "", correct: "a" }]);
    setCurrentSlide(questions.length);
  };

  const removeSlide = (index) => {
    if (questions.length === 1) {
      toast.error("MINIMUM_REQUIREMENT: 1 Question");
      return;
    }
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    setCurrentSlide(Math.max(0, index - 1));
  };

  const updateQuestion = (field, value) => {
    const newQuestions = [...questions];
    newQuestions[currentSlide][field] = value;
    setQuestions(newQuestions);
  };

  return (
    <PageWrapper>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#000',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '0px',
            fontSize: '11px',
            letterSpacing: '1px'
          }
        }}
      />

      <ContentHeader initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="header-top">
          <div className="status-tag">0{phase + 1} // {phase === 0 ? "ARENA_CONFIG" : "DATA_ENTRY"}</div>
          <h2>{phase === 0 ? "INITIALIZE_NEW_ARENA" : quizInfo.quizTitle.toUpperCase() || "UNTITLED_ARENA"}</h2>
        </div>

        {phase === 1 && (
          <div className="progress-container">
            <div className="meta-stats">
              NODE_INDEX: <span>{currentSlide + 1}</span> / {questions.length}
            </div>
            <ProgressBar>
              <motion.div 
                className="fill" 
                animate={{ width: `${((currentSlide + 1) / questions.length) * 100}%` }} 
              />
              <div className="scan-line" />
            </ProgressBar>
          </div>
        )}
      </ContentHeader>

      <MainContainer>
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <SlideCard key="info-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="grid-layout">
                <FormGroup>
                  <label><Layout size={12} /> ARENA_TITLE</label>
                  <input
                    type="text"
                    className="zolvi-input"
                    placeholder="INPUT TITLE..."
                    value={quizInfo.quizTitle}
                    onChange={(e) => handleInfoChange('quizTitle', e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <label><User size={12} /> OPERATOR_ID</label>
                  <input
                    type="text"
                    className="zolvi-input"
                    placeholder="ENTER NAME..."
                    value={quizInfo.authorName}
                    onChange={(e) => handleInfoChange('authorName', e.target.value)}
                  />
                </FormGroup>

                <div className="dual-grid">
                  <FormGroup>
                    <label><Timer size={12} /> TEMPORAL_LIMIT</label>
                    <BinaryToggle>
                      <button className={quizInfo.timeLimit ? "active" : ""} onClick={() => handleInfoChange('timeLimit', true)}>YES</button>
                      <button className={!quizInfo.timeLimit ? "active" : ""} onClick={() => handleInfoChange('timeLimit', false)}>NO</button>
                    </BinaryToggle>
                  </FormGroup>

                  {quizInfo.timeLimit && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <FormGroup>
                        <label><Clock size={12} /> SEC_PER_NODE</label>
                        <input
                          type="number"
                          className="zolvi-input"
                          value={quizInfo.questionPerMin}
                          onChange={(e) => handleInfoChange('questionPerMin', e.target.value)}
                          placeholder="30"
                        />
                      </FormGroup>
                    </motion.div>
                  )}
                </div>

                <FormGroup>
                  <label>{quizInfo.isPrivate ? <EyeOff size={12} /> : <Eye size={12} />} ACCESS_PROTOCOL</label>
                  <BinaryToggle>
                    <button className={!quizInfo.isPrivate ? "active" : ""} onClick={() => handleInfoChange('isPrivate', false)}>PUBLIC</button>
                    <button className={quizInfo.isPrivate ? "active" : ""} onClick={() => handleInfoChange('isPrivate', true)}>ENCRYPTED</button>
                  </BinaryToggle>
                </FormGroup>

                <div className="action-row">
                  <PrimaryBtn onClick={validateAndProceed} disabled={loading}>
                    {loading ? <Loader2 className="spin" size={18} /> : <>BOOT_SYSTEM <ArrowRight size={18} /></>}
                  </PrimaryBtn>
                </div>
              </div>
            </SlideCard>
          )}

          {phase === 1 && (
            <div key="questions-wrapper">
              <NavHeader>
                <button onClick={() => setPhase(0)} className="nav-icon-btn"><ChevronLeft size={20} /></button>
                <div className="slide-nav">
                  <button onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))} disabled={currentSlide === 0}><ChevronLeft size={16} /></button>
                  <span className="counter">{currentSlide + 1}</span>
                  <button onClick={() => setCurrentSlide(Math.min(questions.length - 1, currentSlide + 1))} disabled={currentSlide === questions.length - 1}><ChevronRight size={16} /></button>
                </div>
                <button onClick={() => removeSlide(currentSlide)} className="nav-icon-btn delete"><Trash2 size={18} /></button>
              </NavHeader>

              <SlideCard initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <FormGroup>
                  <label>DATA_NODE_CONTENT</label>
                  <textarea
                    className="zolvi-textarea"
                    value={questions[currentSlide].question}
                    onChange={(e) => updateQuestion('question', e.target.value)}
                    placeholder="ENTER QUESTION DATA..."
                  />
                </FormGroup>

                <div className="options-matrix">
                  {['a', 'b', 'c', 'd'].map((letter) => {
                    const isSelected = questions[currentSlide].correct === letter;
                    return (
                      <OptionNode key={letter} $active={isSelected}>
                        <div className="node-prefix">{letter.toUpperCase()}</div>
                        <input
                          value={questions[currentSlide][letter]}
                          onChange={(e) => updateQuestion(letter, e.target.value)}
                          placeholder="ADD OPTION..."
                        />
                        <input 
                          type="radio" 
                          name={`correct-${currentSlide}`} 
                          checked={isSelected} 
                          onChange={() => updateQuestion('correct', letter)} 
                        />
                      </OptionNode>
                    );
                  })}
                </div>
              </SlideCard>

              <ActionArea>
                <SecondaryBtn onClick={addSlide} disabled={loading}>+ ADD_NODE</SecondaryBtn>
                <PrimaryBtn onClick={handlePublish} disabled={loading}>
                  {loading ? <Loader2 className="spin" size={18} /> : <>COMMIT_TO_DATABASE <Save size={18} /></>}
                </PrimaryBtn>
              </ActionArea>
            </div>
          )}
        </AnimatePresence>
      </MainContainer>
    </PageWrapper>
  );
};

/* --- STYLES --- */

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
  font-family: 'JetBrains Mono', monospace;
  padding: 60px 15px;
  @media (min-width: 768px) { padding: 80px 20px; }
  
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const ContentHeader = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto 30px;
  @media (min-width: 768px) { margin-bottom: 50px; }

  .header-top {
    border-left: 2px solid #fff;
    padding-left: 15px;
    margin-bottom: 20px;
    @media (min-width: 768px) { border-left-width: 3px; padding-left: 20px; margin-bottom: 30px; }

    .status-tag { font-size: 9px; color: #666; letter-spacing: 2px; font-weight: 800; margin-bottom: 8px; }
    h2 { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; @media (min-width: 768px) { font-size: 32px; } }
  }
  
  .progress-container {
    .meta-stats { font-size: 9px; color: #444; margin-bottom: 10px; span { color: #fff; } }
  }
`;

const ProgressBar = styled.div`
  width: 100%; height: 2px; background: #111; position: relative; overflow: hidden;
  .fill { height: 100%; background: #fff; transition: width 0.3s ease; }
  .scan-line {
    position: absolute; top: 0; left: 0; width: 100px; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: scan 2s linear infinite;
  }
  @keyframes scan { from { transform: translateX(-100px); } to { transform: translateX(800px); } }
`;

const MainContainer = styled.div` max-width: 800px; margin: 0 auto; `;

const SlideCard = styled(motion.div)`
  background: #050505;
  border: 1px solid rgba(255,255,255,0.05);
  padding: 25px;
  @media (min-width: 768px) { padding: 40px; }

  .dual-grid { 
    display: grid; 
    grid-template-columns: 1fr; 
    gap: 0;
    @media (min-width: 600px) { grid-template-columns: 1fr 1fr; gap: 20px; }
  }

  .options-matrix { 
    display: grid; 
    grid-template-columns: 1fr; 
    gap: 1px; 
    background: #222; 
    margin-top: 25px; 
    border: 1px solid #222; 
    @media (min-width: 700px) { grid-template-columns: 1fr 1fr; margin-top: 30px; }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
  @media (min-width: 768px) { margin-bottom: 30px; }

  label { 
    display: flex; 
    align-items: center; 
    gap: 8px;
    font-size: 9px; 
    font-weight: 800; 
    letter-spacing: 1.5px; 
    color: #555; 
    margin-bottom: 10px; 
  }

  .zolvi-input, .zolvi-textarea {
    width: 100%; background: #000; border: 1px solid #222; padding: 14px; color: #fff;
    font-size: 14px; outline: none; transition: 0.2s;
    &:focus { border-color: #fff; }
    &::placeholder { color: #333; }
  }

  .zolvi-textarea { 
    min-height: 100px; 
    border: none; 
    border-bottom: 1px solid #222; 
    padding-left: 0; 
    font-size: 16px; 
    @media (min-width: 768px) { font-size: 18px; min-height: 120px; }
  }
`;

const BinaryToggle = styled.div`
  display: flex; gap: 1px; background: #222;
  button {
    flex: 1; padding: 12px; border: none; background: #080808; color: #444;
    font-size: 10px; font-weight: 900; cursor: pointer; transition: 0.2s;
    &.active { background: #fff; color: #000; }
  }
`;

const OptionNode = styled.div`
  background: #000; 
  padding: 15px; 
  display: flex; 
  align-items: center; 
  gap: 12px;
  border: ${props => props.$active ? '1px solid #fff' : '1px solid transparent'};
  
  .node-prefix { font-size: 10px; font-weight: 900; color: ${props => props.$active ? '#fff' : '#333'}; }
  
  input[type="text"] { 
    background: transparent; border: none; color: #fff; flex: 1; font-size: 13px; outline: none; 
    &::placeholder { color: #222; }
  }
  
  input[type="radio"] { 
    accent-color: #fff; 
    transform: scale(1.1);
    cursor: pointer; 
    -webkit-tap-highlight-color: transparent;
  }
`;

const NavHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;
  
  .nav-icon-btn { 
    background: transparent; border: 1px solid #222; color: #444; padding: 8px; cursor: pointer; 
    display: flex; align-items: center; justify-content: center;
    &:hover { color: #fff; border-color: #fff; } 
    &.delete:hover { border-color: #ef4444; color: #ef4444; } 
  }

  .slide-nav {
    display: flex; align-items: center; gap: 15px; background: #080808; border: 1px solid #111; padding: 4px 10px;
    button { background: transparent; border: none; color: #fff; cursor: pointer; &:disabled { opacity: 0.2; } }
    .counter { font-size: 11px; font-weight: 900; width: 25px; text-align: center; }
  }
`;

const ActionArea = styled.div` 
  margin-top: 20px; 
  display: flex; 
  flex-direction: column; 
  gap: 10px; 
  @media (min-width: 600px) { flex-direction: row; }
`;

const PrimaryBtn = styled.button`
  flex: 2; padding: 18px; background: #fff; color: #000; border: none; font-weight: 900;
  letter-spacing: 1px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
  text-transform: uppercase;
  font-size: 12px;
  &:disabled { opacity: 0.5; }
  &:hover:not(:disabled) { background: #ccc; }
  -webkit-tap-highlight-color: transparent;
`;

const SecondaryBtn = styled.button`
  flex: 1; padding: 18px; background: transparent; border: 1px solid #222; color: #fff;
  font-weight: 900; letter-spacing: 1px; cursor: pointer;
  text-transform: uppercase;
  font-size: 12px;
  &:hover { border-color: #fff; }
  -webkit-tap-highlight-color: transparent;
`;

export default CreatePage;