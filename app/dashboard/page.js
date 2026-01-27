"use client";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Clock, CheckCircle, AlertCircle, 
  Plus, Loader2, Mail, Fingerprint, Eye, 
  HelpCircle, ChevronLeft, Edit3, Save, Trash2,
  Inbox 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

/* --- 1. EDIT COMPONENT (FULL DATA EDITING) --- */
const EditQuizModule = ({ quizId, onBack, primaryColor, userEmail }) => {
  const [quizInfo, setQuizInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [originalQnos, setOriginalQnos] = useState(new Set());
  
  // NEW: Track deleted question numbers locally
  const [deletedQnos, setDeletedQnos] = useState([]);

  useEffect(() => {
    if (!quizId) return;
    const fetchForEdit = async () => {
      try {
        const response = await fetch(`https://noneditorial-professionally-serena.ngrok-free.dev/Logged/Preview/${quizId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }
        });
        if (response.ok) {
          const data = await response.json();
          setQuizInfo({
            quizId: data.quizId,
            quizTitle: data.quizTitle,
            duration: data.duration,
            status: data.status,
            createdBy: data.createdBy
          });
          const qs = data.questions || [];
          setQuestions(qs);
          setOriginalQnos(new Set(qs.map(q => q.qno)));
          // Reset deleted tracking on fresh fetch
          setDeletedQnos([]); 
        } else {
          toast.error("Quiz not found (404)");
        }
      } catch (err) {
        toast.error("Network error fetching quiz data");
      } finally {
        setLoading(false);
      }
    };
    fetchForEdit();
  }, [quizId]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const addNewQuestion = () => {
    const nextQNo = questions.length > 0 ? Math.max(...questions.map(q => q.qno)) + 1 : 1;
    const newBlankQuestion = {
      qno: nextQNo,
      question: "",
      opt1: "",
      opt2: "",
      opt3: "",
      opt4: "",
      correctOpt: "opt1",
      quizId: parseInt(quizId),
      isLocalOnly: true 
    };
    setQuestions([...questions, newBlankQuestion]);
    toast.success("New question block added!");
  };

  // UPDATED: No API call here. Just track the ID for deletion later.
  const handleDeleteQuestion = (qno, index) => {
    if(!window.confirm("Delete this question?")) return;

    // If it was an original question (in DB), add to deletedQnos list
    if (!questions[index].isLocalOnly && originalQnos.has(qno)) {
        setDeletedQnos(prev => [...prev, qno]);
    }

    // Update UI immediately
    setQuestions(questions.filter((_, i) => i !== index));
    toast.success("Question removed (click Save to apply)");
  };

  const handleSave = async () => {
    if (!quizInfo?.quizTitle?.trim() || !quizInfo?.duration) {
      toast.error("Quiz title and duration are required");
      return;
    }

    const firstInvalidIndex = questions.findIndex(q => 
        !q.question?.trim() || 
        !q.opt1?.trim() || 
        !q.opt2?.trim() || 
        !q.opt3?.trim() || 
        !q.opt4?.trim()
    );

    if (firstInvalidIndex !== -1) {
        toast.error(`Question ${firstInvalidIndex + 1} has empty fields!`);
        return;
    }

    setSaving(true);

    // UPDATED: New Nested Structure
    const payload = { 
      quiz: {
          quiz: {
            quizId: parseInt(quizId),
            quizTitle: quizInfo.quizTitle,
            duration: parseInt(quizInfo.duration),
            status: String(quizInfo.status).toLowerCase() === "true", 
            createdBy: quizInfo.createdBy || userEmail
          }, 
          questions: questions.map(q => ({
            qno: q.isLocalOnly ? 0 : q.qno,
            question: q.question, 
            opt1: q.opt1,
            opt2: q.opt2,
            opt3: q.opt3,
            opt4: q.opt4,
            correctOpt: q.correctOpt,
            quizId: parseInt(quizId) 
          }))
      },
      questionNos: deletedQnos // Send the array of IDs to delete
    };

    try {
      const response = await fetch(`https://noneditorial-professionally-serena.ngrok-free.dev/Logged/Edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        toast.success("Quiz updated successfully!");
        onBack(); 
      } else {
        toast.error("Server error. Please check all fields.");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState><Loader2 className="spinner" size={40} color={primaryColor} /><p>Loading...</p></LoadingState>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <EditHeaderSection>
        <div className="left">
          <BackButton onClick={onBack}><ChevronLeft size={20} /> Cancel</BackButton>
          <h2>Editing: {quizInfo?.quizTitle}</h2>
        </div>
        <div className="action-btns">
          <AddQuestionBtn type="button" onClick={addNewQuestion}>
            <Plus size={18} /> <span className="btn-text">Add Question</span>
          </AddQuestionBtn>
          <SaveBtn onClick={handleSave} disabled={saving} $primary={primaryColor}>
            {saving ? <Loader2 className="spinner" size={18} /> : <Save size={18} />} <span className="btn-text">Save All</span>
          </SaveBtn>
        </div>
      </EditHeaderSection>

      <EditLayout>
        <ConfigCard>
          <h3>Quiz Settings</h3>
          <div className="form-grid">
            <div className="field">
              <label>Quiz Title</label>
              <input value={quizInfo?.quizTitle || ''} onChange={(e) => setQuizInfo({...quizInfo, quizTitle: e.target.value})} />
            </div>
            <div className="field">
              <label>Duration (min)</label>
              <input type="number" value={quizInfo?.duration || ''} onChange={(e) => setQuizInfo({...quizInfo, duration: e.target.value})} />
            </div>
          </div>
        </ConfigCard>

        {questions.length === 0 ? (
          <EmptyState>
            <Inbox size={48} />
            <p>No questions added yet.</p>
          </EmptyState>
        ) : (
          questions.map((q, idx) => (
            <QuestionEditBox key={idx}>
              <div className="q-top">
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <span>Q {idx + 1}</span>
                  <DeleteSmallBtn onClick={() => handleDeleteQuestion(q.qno, idx)}><Trash2 size={14} /></DeleteSmallBtn>
                </div>
                <div className="correct-select">
                  <label>Correct:</label>
                  <select value={q.correctOpt} onChange={(e) => handleQuestionChange(idx, 'correctOpt', e.target.value)}>
                    <option value="opt1">A</option><option value="opt2">B</option><option value="opt3">C</option><option value="opt4">D</option>
                  </select>
                </div>
              </div>
              <textarea 
                className="q-input" 
                placeholder="Type your question here..."
                value={q.question} 
                onChange={(e) => handleQuestionChange(idx, 'question', e.target.value)} 
              />
              <div className="options-grid-edit">
                {['opt1', 'opt2', 'opt3', 'opt4'].map((opt, i) => (
                  <div key={opt} className="opt-field">
                    <span className="opt-label">{String.fromCharCode(65+i)}</span>
                    <input 
                      value={q[opt]} 
                      onChange={(e) => handleQuestionChange(idx, opt, e.target.value)} 
                      placeholder={`Option ${String.fromCharCode(65+i)}`} 
                    />
                  </div>
                ))}
              </div>
            </QuestionEditBox>
          ))
        )}
      </EditLayout>
    </motion.div>
  );
};
/* --- 2. PREVIEW COMPONENT --- */
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
        }
      } finally { setLoading(false); }
    };
    fetchQuestions();
  }, [quizId]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <BackButton onClick={onBack}><ChevronLeft size={20} /> Back</BackButton>
      {loading ? <LoadingState><Loader2 className="spinner" size={40} color={primaryColor} /></LoadingState> : (
        <QuestionsContainer>
          <h2 className="preview-header">Quiz Preview</h2>
          {questions.length === 0 ? (
            <EmptyState><AlertCircle size={48} /><p>No questions found.</p></EmptyState>
          ) : (
            questions.map((q, index) => (
              <FullQuestionItem key={index}>
                <div className="q-label"><HelpCircle size={14} /> Question {index + 1}</div>
                <p className="q-text">{q.question}</p>
                <div className="options-grid">
                  <span className={q.correctOpt === 'opt1' ? 'correct' : ''}>A: {q.opt1}</span>
                  <span className={q.correctOpt === 'opt2' ? 'correct' : ''}>B: {q.opt2}</span>
                  <span className={q.correctOpt === 'opt3' ? 'correct' : ''}>C: {q.opt3}</span>
                  <span className={q.correctOpt === 'opt4' ? 'correct' : ''}>D: {q.opt4}</span>
                </div>
              </FullQuestionItem>
            ))
          )}
        </QuestionsContainer>
      )}
    </motion.div>
  );
};

/* --- 3. MAIN DASHBOARD --- */
const UserDashboard = () => {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [editQuizId, setEditQuizId] = useState(null);
  const primaryColor = "#2563eb";

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUserEmail(parsedUser.email);
      fetchUserQuizzes(parsedUser.email);
    }
  }, []);

  const fetchUserQuizzes = async (email) => {
    if (!email) return;
    setLoading(true);
    try {
      const response = await fetch(`https://noneditorial-professionally-serena.ngrok-free.dev/Logged?email=${email}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }
      });
      if (response.ok) setQuizzes(await response.json());
    } finally { setLoading(false); }
  };

  const handleToggleStatus = async (quizId) => {
    const response = await fetch(`https://noneditorial-professionally-serena.ngrok-free.dev/Logged/SwitchStatus/${quizId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }
    });
    if (response.ok) {
      setQuizzes(prev => prev.map(q => q.quizId === quizId ? { ...q, status: String(q.status) === "true" ? "false" : "true" } : q));
      toast.success("Status updated");
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if(!window.confirm("Delete this entire quiz?")) return;
    try {
      const response = await fetch(`https://noneditorial-professionally-serena.ngrok-free.dev/Logged/Delete/${quizId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }
      });
      if (response.ok) {
        setQuizzes(prev => prev.filter(q => q.quizId !== quizId));
        toast.success("Quiz deleted");
      }
    } catch (err) { toast.error("Network error"); }
  };

  return (
    <DashboardWrapper>
      <Toaster position="bottom-right" />
      <AnimatePresence mode="wait">
        {editQuizId ? (
          <EditQuizModule 
            quizId={editQuizId} primaryColor={primaryColor} userEmail={userEmail}
            onBack={() => { setEditQuizId(null); fetchUserQuizzes(userEmail); }} 
          />
        ) : selectedQuizId ? (
          <FullQuizPreview quizId={selectedQuizId} onBack={() => setSelectedQuizId(null)} primaryColor={primaryColor} />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <header className="main-header">
              <div className="user-info">
                <h1>My Dashboard</h1>
                <p>Logged in as <span className="highlight">{userEmail}</span></p>
              </div>
              <CreateBtn onClick={() => router.push("/create")} $primary={primaryColor} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Plus size={20} /> <span>New Quiz</span>
              </CreateBtn>
            </header>
            {loading ? <LoadingState><Loader2 className="spinner" size={40} color={primaryColor} /></LoadingState> : (
              <>
                {quizzes.length === 0 ? (
                  <EmptyState><Inbox size={64} /><h2>No Quizzes</h2><p>Start by creating your first quiz.</p></EmptyState>
                ) : (
                  <QuizGrid>
                    {quizzes.map((quiz) => (
                      <StyledCard key={quiz.quizId} whileHover={{ y: -5 }}>
                        <div className="card-header">
                          <div className="icon-bg"><BookOpen size={20} color={primaryColor} /></div>
                          <div style={{display:'flex', gap: '8px'}}>
                            <StatusBadge as="button" onClick={() => handleToggleStatus(quiz.quizId)} $isActive={String(quiz.status) === "true"}>
                              {String(quiz.status) === "true" ? "Active" : "Inactive"}
                            </StatusBadge>
                            <EditIconButton onClick={() => setEditQuizId(quiz.quizId)}><Edit3 size={16} /></EditIconButton>
                            <DeleteIconButton onClick={() => handleDeleteQuiz(quiz.quizId)}><Trash2 size={16} /></DeleteIconButton>
                          </div>
                        </div>
                        <h3 className="quiz-title">{quiz.quizTitle || "Untitled"}</h3>
                        <DataGrid>
                          <div className="data-item"><Clock size={14} /> {quiz.duration}m</div>
                          <div className="data-item"><Fingerprint size={14} /> ID: {quiz.quizId}</div>
                        </DataGrid>
                        <SeeQuestionBtn onClick={() => setSelectedQuizId(quiz.quizId)} $primary={primaryColor}><Eye size={16} /> See Questions</SeeQuestionBtn>
                      </StyledCard>
                    ))}
                  </QuizGrid>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardWrapper>
  );
};

/* --- STYLED COMPONENTS --- */
const DashboardWrapper = styled.div` max-width: 1200px; margin: 0 auto; padding: 40px 20px; color: #f8fafc; .main-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; @media (max-width: 768px) { flex-direction: column; align-items: flex-start; gap: 20px; } h1 { font-size: 2.2rem; font-weight: 800; @media (max-width: 480px) { font-size: 1.8rem; } } .highlight { color: #3b82f6; } } `;
const QuizGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; @media (max-width: 480px) { grid-template-columns: 1fr; } `;
const EditHeaderSection = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; gap: 15px; @media (max-width: 768px) { flex-direction: column; align-items: flex-start; } .left h2 { margin-top: 10px; font-size: 1.5rem; } .action-btns { display: flex; gap: 10px; @media (max-width: 480px) { width: 100%; .btn-text { display: none; } button { flex: 1; justify-content: center; } } } `;
const StyledCard = styled(motion.div)` background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 20px; backdrop-filter: blur(10px); .card-header { display: flex; justify-content: space-between; margin-bottom: 15px; } .icon-bg { padding: 8px; background: rgba(37, 99, 235, 0.1); border-radius: 10px; } .quiz-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 15px; color: white; } `;

const QuestionEditBox = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 18px;
  margin-bottom: 15px;
  .q-top { display: flex; justify-content: space-between; margin-bottom: 12px; color: #3b82f6; font-weight: 700; }
  .q-input { 
    width: 100%; 
    background: transparent; 
    border: 1px solid #334155; 
    padding: 12px; 
    border-radius: 10px; 
    color: white; 
    margin-bottom: 12px; 
    font-family: inherit; 
    &:focus { border-color: #3b82f6; outline: none; }
  }
  .options-grid-edit { 
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px; 
    @media (max-width: 600px) { grid-template-columns: 1fr; }
    .opt-field { 
      display: flex; 
      align-items: center; 
      gap: 10px; 
      background: transparent; 
      border: 1px solid #334155;
      padding: 10px; 
      border-radius: 10px; 
      input { background: none; border: none; color: white; width: 100%; outline: none; }
      &:focus-within { border-color: #3b82f6; }
    }
  }
`;

/* UPDATED FOR PERFECT CENTERING */
const EmptyState = styled.div` 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center;
  text-align: center; 
  padding: 60px 20px; 
  color: #64748b; 
  width: 100%;
  h2, p { margin-top: 10px; }
`;

const CreateBtn = styled(motion.button)` display: flex; align-items: center; gap: 10px; background: ${p => p.$primary}; padding: 12px 24px; border-radius: 12px; color: white; border: none; font-weight: 700; cursor: pointer; @media (max-width: 768px) { width: 100%; justify-content: center; } `;
const SaveBtn = styled.button` background: ${p => p.$primary}; color: white; padding: 12px 20px; border-radius: 12px; border: none; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; &:disabled { opacity: 0.6; cursor: not-allowed; } `;
const AddQuestionBtn = styled.button` background: none; border: 1px solid #3b82f6; color: #3b82f6; padding: 12px 20px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; `;
const BackButton = styled.button` background: none; border: none; color: #3b82f6; cursor: pointer; display: flex; align-items: center; gap: 5px; font-weight: 600; `;
const DeleteSmallBtn = styled.button` background: none; border: none; color: #ef4444; cursor: pointer; `;
const StatusBadge = styled.button` padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; border: none; font-weight: 700; background: ${p => p.$isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; color: ${p => p.$isActive ? '#10b981' : '#f87171'}; cursor: pointer; `;
const EditIconButton = styled.button` background: rgba(255,255,255,0.05); border: none; color: white; padding: 8px; border-radius: 8px; cursor: pointer; &:hover { background: #3b82f6; } `;
const DeleteIconButton = styled.button` background: rgba(255,255,255,0.05); border: none; color: #f87171; padding: 8px; border-radius: 8px; cursor: pointer; &:hover { background: #ef4444; color: white; } `;
const LoadingState = styled.div` display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh; .spinner { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } } `;
const DataGrid = styled.div` display: flex; gap: 10px; margin-bottom: 15px; .data-item { font-size: 0.75rem; color: #94a3b8; background: rgba(255,255,255,0.05); padding: 4px 8px; border-radius: 6px; display: flex; align-items: center; gap: 4px; } `;
const SeeQuestionBtn = styled.button` width: 100%; background: rgba(255,255,255,0.05); color: #94a3b8; padding: 10px; border-radius: 10px; border: none; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; &:hover { background: ${p => p.$primary}; color: white; } `;
const EditLayout = styled.div` max-width: 800px; margin: 0 auto; `;
const ConfigCard = styled.div` background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 20px; margin-bottom: 20px; h3 { margin-bottom: 15px; font-size: 1rem; } .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; @media (max-width: 600px) { grid-template-columns: 1fr; } .field { display: flex; flex-direction: column; gap: 5px; label { font-size: 0.75rem; color: #94a3b8; } input { background: transparent; border: 1px solid #334155; padding: 10px; border-radius: 8px; color: white; &:focus { border-color: #3b82f6; outline: none; } } } } `;
const QuestionsContainer = styled.div` max-width: 800px; margin: 0 auto; `;
const FullQuestionItem = styled.div` background: rgba(30, 41, 59, 0.5); padding: 20px; border-radius: 15px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.05); .q-label { color: #3b82f6; font-size: 0.8rem; font-weight: 700; margin-bottom: 10px; display: flex; align-items: center; gap: 5px; } .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; @media (max-width: 600px) { grid-template-columns: 1fr; } span { padding: 10px; background: rgba(255,255,255,0.03); border-radius: 8px; font-size: 0.9rem; } .correct { border: 1px solid #10b981; color: #10b981; background: rgba(16, 185, 129, 0.05); } } `;

export default UserDashboard;