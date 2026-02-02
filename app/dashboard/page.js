"use client";
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Loader2, Edit3, Save, Trash2, FileText, X, QrCode, 
  Search, MoreVertical, ChevronLeft, Download, ExternalLink, Activity
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/* --- ANIMATIONS --- */
const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

/* --- COMPONENTS --- */

const QRModal = ({ quizId, quizTitle, onClose }) => {
  const quizLink = `https://myquizapp-psi.vercel.app/play?id=${quizId}`;
  return (
    <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h3>SYSTEM_ACCESS_KEY</h3>
          <button onClick={onClose}><X size={18} /></button>
        </div>
        <div className="qr-container">
          <QRCodeSVG value={quizLink} size={250} bgColor="#FFFFFF" fgColor="#000000" level="H" includeMargin={true} />
        </div>
        <div className="info-bits">
          <span>UID: {quizId}</span>
          <span>PROTOCOL: HTTPS</span>
        </div>
        <PrimaryButton onClick={() => {
            navigator.clipboard.writeText(quizLink);
            toast.success("ACCESS_LINK_COPIED");
        }} style={{ width: '100%', marginTop: '20px' }}>COPY_URL</PrimaryButton>
      </ModalContent>
    </ModalOverlay>
  );
};

const ResultModal = ({ quizId, quizTitle, onClose }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://quiz-krida.onrender.com/Logged/Result/${quizId}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
    .then(res => res.json())
    .then(data => setResults(Array.isArray(data) ? data : [data]))
    .finally(() => setLoading(false));
  }, [quizId]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`QUIZ_DATA_LOG: ${quizTitle}`, 10, 10);
    autoTable(doc, {
      head: [['SUBJECT', 'SCORE', 'PERCENTAGE']],
      body: results.map(r => [r.name, `${r.score}/${r.outOf}`, `${((r.score/r.outOf)*100).toFixed(0)}%`]),
    });
    doc.save(`LOG_${quizId}.pdf`);
  };

  return (
    <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h3>DATA_EXTRACTION_LOGS</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={downloadPDF} className="icon-text-btn"><Download size={14} /> EXPORT</button>
            <button onClick={onClose}><X size={18} /></button>
          </div>
        </div>
        {loading ? <Centered><Loader2 className="spinner" /></Centered> : (
          <ScrollArea>
            <ResultTable>
              <thead><tr><th>OPERATOR_ID</th><th>RAW_SCORE</th><th>EFFICIENCY</th></tr></thead>
              <tbody>
                {results.map((res, i) => (
                  <tr key={i}>
                    <td>{res.name}</td>
                    <td>{res.score}/{res.outOf}</td>
                    <td className="success">{((res.score / res.outOf) * 100).toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </ResultTable>
          </ScrollArea>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

const EditQuizModule = ({ quizId, onBack }) => {
  const [quizInfo, setQuizInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletedQnos, setDeletedQnos] = useState([]);

  useEffect(() => {
    fetch(`https://quiz-krida.onrender.com/Logged/Preview/${quizId}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    })
    .then(res => res.json())
    .then(data => {
      setQuizInfo(data);
      setQuestions(data.questions || []);
      setLoading(false);
    });
  }, [quizId]);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      quiz: {
        quiz: { ...quizInfo, quizId: parseInt(quizId), status: String(quizInfo.status).toLowerCase() === "true" },
        questions: questions.map(q => ({ ...q, qno: q.isLocalOnly ? 0 : q.qno, quizId: parseInt(quizId) }))
      },
      questionNos: deletedQnos
    };
    const res = await fetch(`https://quiz-krida.onrender.com/Logged/Edit`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    if (res.ok) { toast.success("SYSTEM_RECONFIGURED"); onBack(); }
    setSaving(false);
  };

  if (loading) return <Centered><Loader2 className="spinner" /></Centered>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SubHeader>
        <button className="back-btn" onClick={onBack}><ChevronLeft size={16}/> RETURN_TO_BASE</button>
        <div className="actions">
          <GhostButton onClick={() => setQuestions([...questions, { qno: Date.now(), question: "", opt1: "", opt2: "", opt3: "", opt4: "", correctOpt: "opt1", isLocalOnly: true }])}>
            + ADD_NODE
          </GhostButton>
          <PrimaryButton onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="spinner" size={14}/> : "COMMIT_DATA"}
          </PrimaryButton>
        </div>
      </SubHeader>
      
      <SectionCard>
        <div className="grid">
          <FormGroup>
            <label>ARENA_TITLE</label>
            <input value={quizInfo?.quizTitle} onChange={e => setQuizInfo({...quizInfo, quizTitle: e.target.value})} />
          </FormGroup>
          <FormGroup>
            <label>DURATION (SEC/Q)</label>
            <input type="number" value={quizInfo?.timePerQ} onChange={e => setQuizInfo({...quizInfo, timePerQ: e.target.value})} />
          </FormGroup>
        </div>
      </SectionCard>

      {questions.map((q, idx) => (
        <QuestionBox key={idx}>
          <div className="q-head">
            <span className="tag">NODE_INDEX: 0{idx+1}</span>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
               <label style={{ fontSize: '10px' }}>CORRECT_OPT:</label>
               <select value={q.correctOpt} onChange={e => {
                   const copy = [...questions]; copy[idx].correctOpt = e.target.value; setQuestions(copy);
               }}>
                 <option value="opt1">A</option><option value="opt2">B</option><option value="opt3">C</option><option value="opt4">D</option>
               </select>
               <button className="del-btn" onClick={() => {
                 if(!q.isLocalOnly) setDeletedQnos([...deletedQnos, q.qno]);
                 setQuestions(questions.filter((_, i) => i !== idx));
               }}><Trash2 size={14}/></button>
            </div>
          </div>
          <textarea value={q.question} onChange={e => {
             const copy = [...questions]; copy[idx].question = e.target.value; setQuestions(copy);
          }} placeholder="SYSTEM_PROMPT_ENTRY..." />
          <div className="options-grid">
            {['opt1','opt2','opt3','opt4'].map((o, i) => (
              <div key={o} className="opt-input">
                <label>{String.fromCharCode(65+i)}</label>
                <input value={q[o]} onChange={e => {
                  const copy = [...questions]; copy[idx][o] = e.target.value; setQuestions(copy);
                }} />
              </div>
            ))}
          </div>
        </QuestionBox>
      ))}
    </motion.div>
  );
};

/* --- MAIN DASHBOARD --- */

const UserDashboard = () => {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editQuizId, setEditQuizId] = useState(null);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [viewQRId, setViewQRId] = useState(null);
  const [viewResultId, setViewResultId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [switchingStatusId, setSwitchingStatusId] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const { email } = JSON.parse(userData);
      setUserEmail(email);
      fetch(`https://quiz-krida.onrender.com/Logged?email=${email}`, { headers: { 'ngrok-skip-browser-warning': 'true' }})
        .then(res => res.json())
        .then(data => setQuizzes(data))
        .finally(() => setLoading(false));
    }
    const close = () => setActiveMenuId(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  const handleStatus = async (e, id, current) => {
    e.stopPropagation();
    setSwitchingStatusId(id);
    const res = await fetch(`https://quiz-krida.onrender.com/Logged/SwitchStatus/${id}`, { headers: { 'ngrok-skip-browser-warning': 'true' }});
    if (res.ok) {
      setQuizzes(quizzes.map(q => q.quizId === id ? {...q, status: String(current) === "true" ? "false" : "true"} : q));
      toast.success("STATE_TOGGLED");
    }
    setSwitchingStatusId(null);
  };

  const filtered = quizzes.filter(q => q.quizTitle?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Container>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#000', color: '#fff', borderRadius: '0px', border: '1px solid #333', fontSize: '12px' }}} />
      
      <AnimatePresence>
        {viewQRId && <QRModal quizId={viewQRId} onClose={() => setViewQRId(null)} />}
        {viewResultId && <ResultModal quizId={viewResultId} quizTitle={quizzes.find(q=>q.quizId===viewResultId)?.quizTitle} onClose={() => setViewResultId(null)} />}
      </AnimatePresence>

      {editQuizId ? (
        <EditQuizModule quizId={editQuizId} onBack={() => setEditQuizId(null)} />
      ) : selectedQuizId ? (
        <FullPreview quizId={selectedQuizId} onBack={() => setSelectedQuizId(null)} />
      ) : (
        <>
          <Header>
            <div className="brand">
              <div className="status-tag">CORE_SYSTEM_v2.06</div>
              <h1>OPERATOR_DASHBOARD</h1>
              <p><Activity size={10} /> CONNECTED: {userEmail}</p>
            </div>
            <PrimaryButton onClick={() => router.push('/create')}>+ INITIALIZE_MODULE</PrimaryButton>
          </Header>

          <SearchContainer>
            <Search size={18} />
            <input placeholder="SCAN_DATABASE_INDEX..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </SearchContainer>

          {loading ? <Centered><Loader2 className="spinner" /></Centered> : (
            <Grid>
              {filtered.map(quiz => (
                <QuizCard key={quiz.quizId} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="card-top">
                    <div className="status-indicator">
                        <StatusDot $active={String(quiz.status) === "true"} />
                        <span>{String(quiz.status) === "true" ? "LIVE_ON_GRID" : "OFFLINE_STANDBY"}</span>
                    </div>
                    <div className="menu-anchor">
                      <button className="icon-btn" onClick={(e) => { e.stopPropagation(); setActiveMenuId(quiz.quizId); }}>
                        <MoreVertical size={16} />
                      </button>
                      <AnimatePresence>
                        {activeMenuId === quiz.quizId && (
                          <Dropdown initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                            <button onClick={() => setViewQRId(quiz.quizId)}><QrCode size={14}/> ACCESS_QR</button>
                            <button onClick={() => setEditQuizId(quiz.quizId)}><Edit3 size={14}/> RECONFIGURE</button>
                            <button onClick={() => setViewResultId(quiz.quizId)}><FileText size={14}/> VIEW_LOGS</button>
                            <button className="danger" onClick={() => {
                                if(confirm("DESTRUCT_DATA_PERMANENTLY?")) {
                                    fetch(`https://quiz-krida.onrender.com/Logged/Delete/${quiz.quizId}`, { method: 'DELETE' })
                                    .then(() => setQuizzes(quizzes.filter(q => q.quizId !== quiz.quizId)));
                                }
                            }}><Trash2 size={14}/> WIPE_NODE</button>
                          </Dropdown>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  
                  <h2 className="title">{quiz.quizTitle?.toUpperCase() || "NULL_ENTITY"}</h2>
                  
                  <div className="meta">
                    <div className="meta-item"><span>ID</span> {quiz.quizId}</div>
                    <div className="meta-item"><span>T_LIMIT</span> {quiz.timePerQ || 0}S</div>
                    <div className="meta-item"><span>TYPE</span> {quiz.isPrivate ? "PRIVATE" : "PUBLIC"}</div>
                  </div>

                  <div className="footer-btns">
                    <GhostButton onClick={() => setSelectedQuizId(quiz.quizId)}>PREVIEW</GhostButton>
                    <PrimaryButton onClick={(e) => handleStatus(e, quiz.quizId, quiz.status)}>
                      {switchingStatusId === quiz.quizId ? "..." : (String(quiz.status) === "true" ? "DEACTIVATE" : "ACTIVATE")}
                    </PrimaryButton>
                  </div>
                </QuizCard>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

const FullPreview = ({ quizId, onBack }) => {
    const [qs, setQs] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch(`https://quiz-krida.onrender.com/Logged/Preview/${quizId}`, { headers: {'ngrok-skip-browser-warning': 'true'} })
        .then(r => r.json()).then(d => { setQs(d.questions || []); setLoading(false); });
    }, [quizId]);

    return (
        <div style={{ paddingBottom: '50px' }}>
            <SubHeader><button className="back-btn" onClick={onBack}><ChevronLeft size={16}/> EXIT_PREVIEW</button></SubHeader>
            {loading ? <Centered><Loader2 className="spinner" /></Centered> : qs.map((q, i) => (
                <QuestionBox key={i} style={{ opacity: 0.9 }}>
                    <div className="q-head"><span className="tag">READ_ONLY: NODE_0{i+1}</span></div>
                    <p style={{ margin: '20px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>{q.question}</p>
                    <div className="options-grid">
                        {[q.opt1, q.opt2, q.opt3, q.opt4].map((o, idx) => (
                            <div key={idx} className={`opt-preview ${q.correctOpt === `opt${idx+1}` ? 'correct' : ''}`}>
                                <span className="p-tag">{String.fromCharCode(65+idx)}</span> {o}
                            </div>
                        ))}
                    </div>
                </QuestionBox>
            ))}
        </div>
    );
};

/* --- STYLES (ZOLVI BRUTALIST NOIR) --- */

const Container = styled.div`
  max-width: 1200px; margin: 0 auto; padding: 40px 20px; min-height: 100vh;
  background: #000; color: #fff; font-family: 'JetBrains Mono', 'Courier New', monospace;
`;

const Header = styled.header`
  display: flex; flex-direction: column; gap: 20px; margin-bottom: 50px;
  @media (min-width: 768px) { flex-direction: row; justify-content: space-between; align-items: flex-end; }
  
  .brand {
    .status-tag { font-size: 10px; color: #555; letter-spacing: 2px; margin-bottom: 5px; }
    h1 { font-size: 1.8rem; font-weight: 900; letter-spacing: -1px; }
    p { color: #737373; font-size: 11px; display: flex; align-items: center; gap: 5px; }
  }
`;

const SearchContainer = styled.div`
  display: flex; align-items: center; background: #080808; border: 1px solid #1a1a1a; 
  padding: 15px 20px; margin-bottom: 40px; position: relative;
  overflow: hidden;

  input { background: transparent; border: none; color: #fff; width: 100%; outline: none; margin-left: 15px; font-family: inherit; font-size: 14px; }
  color: #444;

  &::after {
    content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 2px;
    background: #fff; opacity: 0.1; animation: ${scanline} 3s linear infinite;
  }
`;

const Grid = styled.div` 
  display: grid; 
  grid-template-columns: 1fr; 
  gap: 20px; 
  @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1100px) { grid-template-columns: repeat(3, 1fr); }
`;

const QuizCard = styled(motion.div)`
  background: #050505; border: 1px solid #1a1a1a; padding: 30px; 
  display: flex; flex-direction: column; transition: 0.3s;
  &:hover { border-color: #444; transform: translateY(-2px); }

  .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
  .status-indicator { display: flex; align-items: center; gap: 8px; font-size: 10px; color: #555; font-weight: 800; letter-spacing: 1px; }
  .title { font-size: 1.4rem; font-weight: 900; margin-bottom: 20px; min-height: 40px; line-height: 1.2; }
  
  .meta { 
    display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 30px; padding: 15px 0; border-top: 1px solid #111; border-bottom: 1px solid #111;
    .meta-item { font-size: 10px; color: #fff; font-weight: 800; span { color: #444; margin-right: 5px; } }
  }

  .footer-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .icon-btn { background: none; border: none; color: #444; cursor: pointer; &:hover { color: #fff; } }
`;

const StatusDot = styled.div` width: 8px; height: 8px; border-radius: 50%; background: ${p => p.$active ? "#00FF41" : "#FF4444"}; box-shadow: 0 0 10px ${p => p.$active ? "#00FF4155" : "#FF444455"}; `;

const PrimaryButton = styled.button`
  background: #fff; color: #000; border: none; padding: 12px 24px; font-weight: 900; 
  cursor: pointer; font-size: 11px; font-family: inherit; letter-spacing: 1px; text-transform: uppercase;
  &:hover { background: #bbb; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const GhostButton = styled.button`
  background: transparent; color: #fff; border: 1px solid #222; padding: 12px 24px; 
  font-weight: 900; cursor: pointer; font-size: 11px; font-family: inherit; letter-spacing: 1px;
  &:hover { border-color: #fff; background: #fff; color: #000; }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: #000; border: 1px solid #222; padding: 30px; width: 100%; position: relative;
  .modal-header { 
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; 
    h3 { font-size: 12px; font-weight: 900; letter-spacing: 2px; }
    button { background: none; border: none; color: #555; cursor: pointer; &:hover { color: #fff; } }
  }
  .qr-container { background: #fff; padding: 20px; display: flex; justify-content: center; margin-bottom: 20px; }
  .info-bits { display: flex; justify-content: space-between; font-size: 10px; color: #444; font-weight: 900; }
  .icon-text-btn { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 900; background: #111; border: 1px solid #222; color: #fff; padding: 5px 15px; cursor: pointer; &:hover { border-color: #fff; } }
`;

const Dropdown = styled(motion.div)`
  position: absolute; right: 0; top: 35px; background: #fff; border: 1px solid #000; padding: 5px; z-index: 50; width: 180px; box-shadow: 10px 10px 0 #000;
  button { 
    width: 100%; text-align: left; padding: 12px; background: transparent; border: none; font-family: inherit; font-size: 11px; font-weight: 900; cursor: pointer; display: flex; align-items: center; gap: 10px; color: #000;
    &:hover { background: #000; color: #fff; }
    &.danger { color: #ff0000; &:hover { background: #ff0000; color: #fff; } }
  }
`;

const QuestionBox = styled.div`
  border: 1px solid #1a1a1a; padding: 30px; margin-bottom: 20px; background: #050505;
  .q-head { 
    display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px;
    @media (min-width: 600px) { flex-direction: row; justify-content: space-between; align-items: center; }
    .tag { font-size: 10px; font-weight: 800; background: #111; padding: 4px 10px; color: #fff; }
    select { background: #000; color: #fff; border: 1px solid #222; padding: 5px 10px; font-family: inherit; font-size: 12px; outline: none; }
    .del-btn { background: #111; border: 1px solid #222; color: #ff4444; padding: 6px; cursor: pointer; &:hover { background: #ff4444; color: #fff; } }
  }
  textarea { width: 100%; background: #000; border: 1px solid #1a1a1a; color: #fff; padding: 20px; margin-bottom: 20px; font-family: inherit; font-size: 15px; outline: none; min-height: 100px; &:focus { border-color: #444; } }
  .options-grid { 
    display: grid; grid-template-columns: 1fr; gap: 10px; 
    @media (min-width: 700px) { grid-template-columns: 1fr 1fr; }
    .opt-input { 
      display: flex; align-items: center; background: #000; border: 1px solid #1a1a1a; padding: 5px 15px;
      label { width: 20px; font-weight: 900; color: #444; font-size: 12px; }
      input { background: transparent; border: none; color: #fff; width: 100%; padding: 12px; font-family: inherit; outline: none; font-size: 14px; }
      &:focus-within { border-color: #444; }
    }
    .opt-preview { 
        padding: 15px; border: 1px solid #1a1a1a; font-size: 14px; color: #888; display: flex; align-items: center; gap: 10px;
        .p-tag { font-size: 10px; font-weight: 900; color: #444; }
        &.correct { border-color: #fff; background: #fff; color: #000; font-weight: 900; .p-tag { color: #888; } } 
    }
  }
`;

const SectionCard = styled.div`
  border: 1px solid #1a1a1a; padding: 30px; margin-bottom: 30px; background: #050505;
  .grid { display: grid; grid-template-columns: 1fr; gap: 20px; @media (min-width: 600px) { grid-template-columns: 1fr 1fr; } }
`;

const FormGroup = styled.div`
  label { display: block; font-size: 10px; color: #444; font-weight: 800; margin-bottom: 10px; letter-spacing: 1px; }
  input { width: 100%; background: #000; border: 1px solid #1a1a1a; padding: 14px; color: #fff; font-family: inherit; outline: none; &:focus { border-color: #444; } }
`;

const SubHeader = styled.div`
  display: flex; flex-direction: column; gap: 20px; margin-bottom: 40px;
  @media (min-width: 768px) { flex-direction: row; justify-content: space-between; align-items: center; }
  .back-btn { background: none; border: none; color: #fff; font-weight: 900; cursor: pointer; font-family: inherit; display: flex; align-items: center; gap: 10px; font-size: 11px; letter-spacing: 1px; &:hover { color: #777; } }
  .actions { display: flex; gap: 15px; }
`;

const ResultTable = styled.table`
  width: 100%; border-collapse: collapse; min-width: 500px;
  th, td { text-align: left; padding: 15px; border-bottom: 1px solid #111; font-size: 12px; }
  th { color: #444; text-transform: uppercase; letter-spacing: 1px; font-weight: 900; }
  .success { color: #00FF41; font-weight: 900; }
`;

const ScrollArea = styled.div` overflow-x: auto; margin-top: 20px; border: 1px solid #111; `;

const Centered = styled.div` display: flex; align-items: center; justify-content: center; min-height: 300px; .spinner { animation: ${spin} 1s linear infinite; } `;

export default UserDashboard;