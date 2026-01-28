"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronLeft, ChevronRight, Save, Layout, Clock, Mail, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const CreatePage = () => {
  const [phase, setPhase] = useState(0);
  const [loading, setLoading] = useState(false);

  const [quizInfo, setQuizInfo] = useState({
    quizId: null,
    duration: 10,
    email: "",
    quizTitle: "",
    status: "active"
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

  const primaryColor = "#2563eb";
  const lightColor = "#e0f2fe";

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setQuizInfo(prev => ({ ...prev, email: parsedUser?.email || "Email not found" }));
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  const handleInfoChange = (field, value) => {
    setQuizInfo({ ...quizInfo, [field]: value });
  };

  const validateAndProceed = async () => {
    if (!quizInfo.quizTitle.trim()) {
      toast.error("Please enter a Quiz Title");
      return;
    }

    setLoading(true);
    const step1Payload = {
      duration: parseInt(quizInfo.duration),
      createdBy: quizInfo.email,
      quizTitle: quizInfo.quizTitle,
      status: "false"
    };

    try {
      const response = await fetch('https://noneditorial-professionally-serena.ngrok-free.dev/Create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(step1Payload)
      });

      if (response.ok) {
        const savedQuizFromServer = await response.json();
        if (savedQuizFromServer) {
          setQuizInfo(prev => ({ ...prev, quizId: savedQuizFromServer }));
          setQuestions(prevQuestions =>
            prevQuestions.map(q => ({ ...q, quizId: savedQuizFromServer }))
          );
          toast.success(`Quiz Registered! ID: ${savedQuizFromServer}`);
          setPhase(1);
        } else {
          toast.error("Server didn't return a Quiz ID");
        }
      } else {
        toast.error(`Backend Error: ${response.status}`);
      }
    } catch (error) {
      toast.error("Error connecting to backend.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    // --- VALIDATION LOGIC ---
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim() || !q.a.trim() || !q.b.trim() || !q.c.trim() || !q.d.trim()) {
        setCurrentSlide(i); // Move user to the problematic slide
        toast.error(`Please fill all fields for Question ${i + 1}`);
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
      const response = await fetch('https://noneditorial-professionally-serena.ngrok-free.dev/Questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success("All questions saved!");
        window.location.href = "/dashboard";
      } else {
        toast.error(`Failed: ${response.status}`);
      }
    } catch (error) {
      toast.error("Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const addSlide = () => {
    setQuestions([...questions, { quizId: quizInfo.quizId, question: "", a: "", b: "", c: "", d: "", correct: "a" }]);
    setCurrentSlide(questions.length);
    toast.success("New slide added!");
  };

  const removeSlide = (index) => {
    if (questions.length === 1) {
      toast.error("You need at least one question!");
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
    <PageWrapper $primary={primaryColor}>
      <Toaster position="top-center" reverseOrder={false} />

      <ContentHeader
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        $primary={primaryColor}
      >
        <div className="header-content">
          <h2>{phase === 0 ? "Step 1: Quiz Details" : `Step 2: Add Questions`}</h2>
          {phase === 1 && (
            <div className="mini-badge">
              <span>ID: {quizInfo.quizId}</span>
              <span className="dot">•</span>
              <span>{quizInfo.quizTitle}</span>
            </div>
          )}
        </div>

        {phase === 1 && (
          <div className="progress-container">
            <div className="progress-text">Question {currentSlide + 1} of {questions.length}</div>
            <ProgressBar $primary={primaryColor}>
              <div className="fill" style={{ width: `${((currentSlide + 1) / questions.length) * 100}%` }} />
            </ProgressBar>
          </div>
        )}
      </ContentHeader>

      <MainContainer>
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <SlideCard
              key="info-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <FormGroup $primary={primaryColor}>
                <label><Layout size={16} /> Quiz Title</label>
                <input
                  type="text"
                  className="clean-input"
                  placeholder="e.g. Java Fundamentals 101"
                  value={quizInfo.quizTitle}
                  onChange={(e) => handleInfoChange('quizTitle', e.target.value)}
                />
              </FormGroup>

              <div className="grid-2">
                <FormGroup $primary={primaryColor}>
                  <label><Clock size={16} /> Duration (Minutes)</label>
                  <input
                    type="text" // Changed to text to allow the placeholder message to be clear
                    className="clean-input disabled"
                    placeholder="1 min Per Question"
                    value="" // Keep value empty so placeholder shows
                    disabled // Prevents user interaction
                  />
                </FormGroup>

                <FormGroup $primary={primaryColor}>
                  <label><Mail size={16} /> Created By</label>
                  <input
                    type="email"
                    className="clean-input disabled"
                    value={quizInfo.email}
                    readOnly
                    disabled
                  />
                </FormGroup>
              </div>

              <ActionArea>
                <SaveBtn
                  $primary={primaryColor}
                  onClick={validateAndProceed}
                  disabled={loading}
                  whileHover={loading ? {} : { scale: 1.02 }}
                  whileTap={loading ? {} : { scale: 0.98 }}
                >
                  {loading ? <><Loader2 className="spinner" size={20} /> Saving...</> : <>Next Step <ArrowRight size={20} /></>}
                </SaveBtn>
              </ActionArea>
            </SlideCard>
          )}

          {phase === 1 && (
            <div key="questions-wrapper">
              <div className="nav-controls">
                <NavBtn onClick={() => setPhase(0)} disabled={loading}>
                  <ChevronLeft /> Edit Info
                </NavBtn>

                <div className="internal-nav">
                  <NavBtn onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))} disabled={currentSlide === 0 || loading}>
                    <ChevronLeft /> Prev
                  </NavBtn>
                  <NavBtn onClick={() => setCurrentSlide(Math.min(questions.length - 1, currentSlide + 1))} disabled={currentSlide === questions.length - 1 || loading}>
                    Next <ChevronRight />
                  </NavBtn>
                </div>
              </div>

              <SlideCard
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DeleteBtn onClick={() => removeSlide(currentSlide)} disabled={loading}>
                  <Trash2 size={18} />
                </DeleteBtn>

                <FormGroup $primary={primaryColor}>
                  <label>Question {currentSlide + 1} (Quiz ID: {quizInfo.quizId})</label>
                  <textarea
                    disabled={loading}
                    value={questions[currentSlide].question}
                    onChange={(e) => updateQuestion('question', e.target.value)}
                    placeholder="Type your question here..."
                  />
                </FormGroup>

                <div className="options-grid">
                  {['a', 'b', 'c', 'd'].map((letter) => {
                    const currentVal = questions[currentSlide][letter] || "";
                    const charCount = currentVal.length;
                    const isOverLimit = charCount >= 255;

                    return (
                      <div key={letter} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <OptionInput
                          $primary={primaryColor}
                          $light={lightColor}
                          $isCorrect={questions[currentSlide].correct === letter}
                          style={{ borderColor: isOverLimit ? '#ef4444' : '' }}
                        >
                          <span className="prefix">{letter.toUpperCase()}</span>
                          <textarea
                            disabled={loading}
                            rows="1"
                            value={currentVal}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val.length <= 255) {
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                                updateQuestion(letter, val);
                              }
                            }}
                            placeholder={`Option ${letter.toUpperCase()}`}
                          />
                          <input
                            disabled={loading}
                            type="radio"
                            name={`correct-ans-${currentSlide}`}
                            checked={questions[currentSlide].correct === letter}
                            onChange={() => updateQuestion('correct', letter)}
                          />
                        </OptionInput>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 5px' }}>
                          <span style={{ color: isOverLimit ? '#ef4444' : 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
                            {isOverLimit ? "Maximum reached" : `${charCount}/255`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SlideCard>

              <ActionArea>
                <AddBtn $primary={primaryColor} onClick={addSlide} disabled={loading}>
                  <Plus size={20} /> Add Question
                </AddBtn>
                <SaveBtn
                  $primary={primaryColor}
                  onClick={handlePublish}
                  disabled={loading}
                  whileHover={loading ? {} : { scale: 1.02 }}
                  whileTap={loading ? {} : { scale: 0.98 }}
                >
                  {loading ? <><Loader2 className="spinner" size={20} /> Publishing...</> : <><Save size={20} /> Publish Quiz</>}
                </SaveBtn>
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
  min-height: 100vh; padding: 40px 20px; color: white;
  .spinner { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

const SaveBtn = styled(motion.button)`
  flex: 1; padding: 16px; background: ${props => props.$primary}; border: none;
  color: white; border-radius: 12px; cursor: pointer; font-weight: bold;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  box-shadow: 0 10px 20px ${props => props.$primary}4d;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const ContentHeader = styled(motion.div)`
  max-width: 800px; margin: 0 auto 40px;
  .header-content { text-align: center; margin-bottom: 20px; }
  h2 { font-size: 1.8rem; margin-bottom: 10px; color: ${props => props.$primary}; }
  .mini-badge {
    display: inline-flex; gap: 10px; align-items: center;
    background: rgba(255,255,255,0.1); padding: 5px 15px; border-radius: 20px; font-size: 0.9rem;
    .dot { color: ${props => props.$primary}; }
  }
  .progress-text { font-size: 0.8rem; color: #e0f2fe; margin-bottom: 8px; text-align: center; }
`;

const ProgressBar = styled.div`
  width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden;
  .fill { height: 100%; background: ${props => props.$primary}; transition: 0.5s ease; box-shadow: 0 0 10px ${props => props.$primary}; }
`;

const MainContainer = styled.div`
  max-width: 800px; margin: 0 auto;
  .nav-controls { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .internal-nav { display: flex; gap: 10px; }
`;

const SlideCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px; padding: 40px; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  @media (max-width: 600px) { .options-grid, .grid-2 { grid-template-columns: 1fr; } }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  label { display: flex; align-items: center; gap: 8px; color: ${props => props.$primary}; font-size: 0.85rem; font-weight: bold; text-transform: uppercase; margin-bottom: 10px; }
  
  textarea, .clean-input { 
    width: 100%; 
    background: transparent; 
    border: none;
    border-bottom: 1px solid rgba(255,255,255,0.1); 
    border-radius: 0; 
    padding: 10px 0; 
    color: white; 
    font-size: 1.1rem; 
    outline: none; 
    transition: border-color 0.3s ease;
    
    &:focus { 
      border-bottom-color: ${props => props.$primary}; 
    } 
  }
  
  textarea { height: 60px; resize: none; }
  .disabled { opacity: 0.6; cursor: not-allowed; border-bottom: 1px dashed rgba(255,255,255,0.2); }
`;

const OptionInput = styled.div`
  display: flex; align-items: flex-start; gap: 10px; 
  background: transparent;
  border-bottom: 1px solid ${props => props.$isCorrect ? props.$primary : 'rgba(255,255,255,0.08)'}; 
  padding: 10px 0; 
  transition: 0.2s;
  
  .prefix { color: ${props => props.$primary}; font-weight: 900; padding-top: 2px; }
  
  textarea { 
    background: transparent; 
    border: none; 
    color: ${props => props.$light}; 
    width: 100%; 
    outline: none; 
    resize: none; 
    font-family: inherit; 
    font-size: 1rem; 
    padding: 0; 
    line-height: 1.4; 
    min-height: 24px; 
    overflow: hidden;
  }
  
  input[type="radio"] { 
    accent-color: ${props => props.$primary}; 
    cursor: pointer; 
    width: 18px; 
    height: 18px; 
    margin-top: 4px; 
  }
`;

const NavBtn = styled.button`
  background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #e0f2fe; padding: 8px 16px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px;
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`;

const ActionArea = styled.div` margin-top: 30px; display: flex; gap: 20px; `;

const AddBtn = styled(motion.button)`
  flex: 1; padding: 16px; background: rgba(255,255,255,0.05); border: 1px dashed ${props => props.$primary};
  color: ${props => props.$primary}; border-radius: 12px; cursor: pointer; font-weight: bold;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const DeleteBtn = styled(motion.button)` position: absolute; top: 20px; right: 20px; background: rgba(255, 75, 75, 0.1); border: none; color: #ff4b4b; padding: 8px; border-radius: 8px; cursor: pointer; `;

export default CreatePage;