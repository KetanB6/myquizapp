"use client";
import React, { useState } from 'react';
import styled from 'styled-components';
import { Loader2, CheckCircle, Save, Trash2, Cpu, Terminal } from 'lucide-react';
import toast from 'react-hot-toast';

const AIQuestionSelector = ({ quizInfo, onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  
  const [formData, setFormData] = useState({
    topic: '',
    count: 10,
    difficulty: 'Moderate',
    language: 'English'
  });

  // 1. GENERATE FROM RAILWAY AI
  const handleGenerate = async () => {
    if (!formData.topic) return toast.error("TOPIC REQUIRED");
    setIsLoading(true);
    try {
      const response = await fetch('https://quizbyaiservice-production.up.railway.app/Generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      // We map AI keys (opt1) to local keys (a, b, c, d) to match your existing logic
      const normalized = data.map((q, idx) => ({
        id: idx,
        question: q.question,
        a: q.opt1,
        b: q.opt2,
        c: q.opt3,
        d: q.opt4,
        correct: q.correctOpt.replace('opt', '') === '1' ? 'a' : 
                 q.correctOpt.replace('opt', '') === '2' ? 'b' : 
                 q.correctOpt.replace('opt', '') === '3' ? 'c' : 'd'
      }));

      setGeneratedQuestions(normalized);
      // Select all by default
      setSelectedIds(new Set(normalized.map(q => q.id)));
    } catch (error) {
      toast.error("AI SERVICE OFFLINE");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelection = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // 2. POST SELECTED TO RENDER SERVER
  const handleFinalPost = async () => {
    if (selectedIds.size === 0) return toast.error("SELECT AT LEAST ONE QUESTION");
    
    setIsSaving(true);
    const selectedQuestions = generatedQuestions.filter(q => selectedIds.has(q.id));

    // Payload mapping as per your requirement
    const payload = selectedQuestions.map((q) => ({
      quizId: quizInfo.quizId, // Ensure this is passed from parent
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success("AI QUESTIONS IMPORTED SUCCESSFULLY");
        if (onComplete) onComplete(); 
      }
    } catch (error) {
      toast.error("FAILED TO SAVE TO DATABASE");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container className="theme-card">
      {!generatedQuestions.length ? (
        <InputSection>
          <h3><Cpu size={20} /> AI_QUESTION_FORGE</h3>
          <input 
            className="theme-input"
            placeholder="Enter Topic (e.g. React Hooks)"
            value={formData.topic}
            onChange={e => setFormData({...formData, topic: e.target.value})}
          />
          <button className="theme-btn-primary" onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? <Loader2 className="spinner" /> : "GENERATE_SELECTABLE_QUESTIONS"}
          </button>
        </InputSection>
      ) : (
        <SelectionSection>
          <div className="header">
            <h4>Generated Questions ({selectedIds.size})</h4>
            <button className="theme-btn-primary" onClick={handleFinalPost} disabled={isSaving}>
              {isSaving ? <Loader2 className="spinner" /> : <><Save size={16}/> SAVE_TO_QUIZ</>}
            </button>
          </div>
          
          <ScrollArea>
            {generatedQuestions.map((q) => (
              <SelectCard 
                key={q.id} 
                className="theme-card"
                $selected={selectedIds.has(q.id)}
                onClick={() => toggleSelection(q.id)}
              >
                <div className="check-box">
                  {selectedIds.has(q.id) && <CheckCircle size={16} />}
                </div>
                <div className="content">
                  <p className="q-text">{q.question}</p>
                  <div className="options-preview">
                    <span>A: {q.a}</span> <span>B: {q.b}</span>
                  </div>
                </div>
              </SelectCard>
            ))}
          </ScrollArea>
          
          <button className="ghost-btn" onClick={() => setGeneratedQuestions([])}>
            <Trash2 size={14}/> DISCARD_ALL
          </button>
        </SelectionSection>
      )}
    </Container>
  );
};

/* --- STYLES (BRUTALIST THEME COMPATIBLE) --- */

const Container = styled.div`
  max-width: 700px;
  margin: 20px auto;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  h3 { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; }
`;

const ScrollArea = styled.div`
  max-height: 400px;
  overflow-y: auto;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 10px;
`;

const SelectCard = styled.div`
  display: flex;
  gap: 15px;
  padding: 15px !important;
  cursor: pointer;
  border-color: ${props => props.$selected ? 'var(--accent)' : 'var(--border-color)'} !important;
  opacity: ${props => props.$selected ? 1 : 0.6};
  
  .check-box {
    width: 20px; height: 20px;
    border: 2px solid var(--border-color);
    display: flex; align-items: center; justify-content: center;
    background: ${props => props.$selected ? 'var(--accent)' : 'transparent'};
    color: var(--bg);
  }

  .q-text { font-size: 0.85rem; font-weight: 700; margin-bottom: 5px; }
  .options-preview { font-size: 0.7rem; color: var(--text-muted); display: flex; gap: 10px; }
`;

const SelectionSection = styled.div`
  .header { display: flex; justify-content: space-between; align-items: center; }
  .ghost-btn { 
    background: transparent; border: none; color: var(--text-muted); 
    cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 0.7rem;
    &:hover { color: #ff4444; }
  }
`;

export default AIQuestionSelector;