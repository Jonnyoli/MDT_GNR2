
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Target, Warrant, IncidentReport, TargetAttachment, DigitalEvidence, Officer, NICShift, ForensicSeizure, InvestigationCase } from '../types';
import { 
  getLocalWarrants, saveWarrantLocally, updateWarrantLocally,
  getLocalReports, saveReportLocally, getLocalTargets, saveTargetLocally, updateTargetLocally,
  getLocalEvidences, saveEvidenceLocally, updateEvidenceLocally, deleteEvidenceLocally,
  getLocalNICShifts, saveNICShiftLocally, getLocalForensicSeizures, saveForensicSeizureLocally,
  deleteNICShiftLocally, getLocalCases, saveCaseLocally
} from '../services/dataService';

interface NICSectionProps {
  activeTab: string;
  currentUser: Officer | null;
}

const NICSection: React.FC<NICSectionProps> = ({ activeTab: initialTab, currentUser }) => {
  const [internalTab, setInternalTab] = useState(initialTab);
  const [reportSubTab, setReportSubTab] = useState<'form' | 'history'>('form');
  
  // Data State
  const [warrants, setWarrants] = useState<Warrant[]>([]);
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [evidences, setEvidences] = useState<DigitalEvidence[]>([]);
  const [shifts, setShifts] = useState<NICShift[]>([]);
  const [forensicSeizures, setForensicSeizures] = useState<ForensicSeizure[]>([]);
  const [cases, setCases] = useState<InvestigationCase[]>([]);

  useEffect(() => {
    const load = async () => {
      const [w, r, t, e, s, fs, c] = await Promise.all([
        getLocalWarrants(),
        getLocalReports(),
        getLocalTargets(),
        getLocalEvidences(),
        getLocalNICShifts(),
        getLocalForensicSeizures(),
        getLocalCases()
      ]);
      setWarrants(w);
      setReports(r);
      setTargets(t);
      setEvidences(e);
      setShifts(s);
      setForensicSeizures(fs);
      setCases(c);
    };
    load();
  }, []);
  
  // Selection State (Dossiers)
  const [selectedWarrant, setSelectedWarrant] = useState<Warrant | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null);
  const [selectedEvidence, setSelectedEvidence] = useState<DigitalEvidence | null>(null);
  const [selectedForensic, setSelectedForensic] = useState<ForensicSeizure | null>(null);
  const [selectedCase, setSelectedCase] = useState<InvestigationCase | null>(null);

  // Form Visiblity State
  const [showWarrantForm, setShowWarrantForm] = useState(false);
  const [showTargetForm, setShowTargetForm] = useState(false);
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);
  const [showCaseForm, setShowCaseForm] = useState(false);
  
  // Forensic UI State
  const [forensicImage, setForensicImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const forensicFileInputRef = useRef<HTMLInputElement>(null);

  // Clock State
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState('00:00:00');
  const timerRef = useRef<number | null>(null);

  const isAdmin = currentUser?.id === 'admin-root' || currentUser?.nip === '1111';

  useEffect(() => {
    if (initialTab.startsWith('nic')) {
        setInternalTab(initialTab);
    }
  }, [initialTab]);

  // Timer do Ponto NIC
  useEffect(() => {
    const updateTimer = () => {
      if (!currentUser) return;
      const activeShift = shifts.find(s => s.officerId === currentUser.id && s.status !== 'COMPLETED');
      if (activeShift && activeShift.status === 'RUNNING') {
        const now = new Date();
        const lastToggle = new Date(activeShift.lastToggleTime);
        const diffSeconds = Math.floor((now.getTime() - lastToggle.getTime()) / 1000);
        const total = activeShift.totalActiveSeconds + diffSeconds;
        const h = Math.floor(total / 3600).toString().padStart(2, '0');
        const m = Math.floor((total % 3600) / 60).toString().padStart(2, '0');
        const s = (total % 60).toString().padStart(2, '0');
        setCurrentTimeDisplay(`${h}:${m}:${s}`);
      } else {
        setCurrentTimeDisplay('00:00:00');
      }
    };
    updateTimer();
    timerRef.current = window.setInterval(updateTimer, 1000);
    return () => { if(timerRef.current) clearInterval(timerRef.current); };
  }, [shifts, currentUser]);

  // --- HANDLERS REGISTO ---

  const [newTargetData, setNewTargetData] = useState({
    name: '', level: 'MÉDIA', status: 'VIGILÂNCIA', threat: 'MÉDIA', img: '', notes: ''
  });

  const handleCreateTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    const target: Target = {
      id: `TGT-${Date.now().toString().slice(-6)}`,
      name: newTargetData.name.toUpperCase(),
      level: newTargetData.level as any,
      status: newTargetData.status,
      intel: 10,
      threat: newTargetData.threat as any,
      connections: 0,
      lastSeen: new Date().toLocaleDateString('pt-PT'),
      img: newTargetData.img || 'https://api.dicebear.com/7.x/avataaars/svg?seed=target',
      notes: newTargetData.notes,
      attachments: [],
      createdAt: new Date().toLocaleDateString('pt-PT')
    };
    setTargets(await saveTargetLocally(target));
    setShowTargetForm(false);
    setNewTargetData({ name: '', level: 'MÉDIA', status: 'VIGILÂNCIA', threat: 'MÉDIA', img: '', notes: '' });
    alert("ALVO REGISTADO NA BASE DE DADOS NIC.");
  };

  const [newEvidenceData, setNewEvidenceData] = useState({
    title: '', caseId: '', description: '', type: 'IMAGEM', fileData: ''
  });

  const handleCreateEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    const evidence: DigitalEvidence = {
      id: `EVID-${Date.now().toString().slice(-6)}`,
      title: newEvidenceData.title.toUpperCase(),
      caseId: newEvidenceData.caseId || 'GERAL',
      description: newEvidenceData.description,
      type: newEvidenceData.type as any,
      officer: currentUser?.name || 'Oficial NIC',
      timestamp: new Date().toLocaleString('pt-PT'),
      attachments: newEvidenceData.fileData ? [{
        id: `ATT-${Date.now()}`,
        name: 'Ficheiro Primário',
        type: newEvidenceData.type,
        data: newEvidenceData.fileData,
        date: new Date().toLocaleDateString('pt-PT')
      }] : []
    };
    setEvidences(await saveEvidenceLocally(evidence));
    setShowEvidenceForm(false);
    setNewEvidenceData({ title: '', caseId: '', description: '', type: 'IMAGEM', fileData: '' });
    alert("EVIDÊNCIA DIGITAL PROTOCOLADA NO COFRE S9.");
  };

  const [newCaseData, setNewCaseData] = useState({
    title: '', priority: 'MÉDIA', primarySuspect: '', summary: '', details: ''
  });

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    const nCase: InvestigationCase = {
      id: `CASE-${Date.now().toString().slice(-4)}`,
      title: newCaseData.title.toUpperCase(),
      priority: newCaseData.priority as any,
      status: 'ABERTO',
      primarySuspect: newCaseData.primarySuspect,
      summary: newCaseData.summary,
      details: newCaseData.details,
      attachments: [],
      createdAt: new Date().toLocaleDateString('pt-PT'),
      updatedAt: new Date().toLocaleDateString('pt-PT'),
      assignedAgent: currentUser?.name || 'Oficial NIC'
    };
    setCases(await saveCaseLocally(nCase));
    setShowCaseForm(false);
    setNewCaseData({ title: '', priority: 'MÉDIA', primarySuspect: '', summary: '', details: '' });
    alert("NOVA INVESTIGAÇÃO ABERTA NO TERMINAL.");
  };

  const handleFileToBase64 = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  // --- SUB-VIEWS ---

  const renderDashboard = () => (
    <div className="animate-in fade-in duration-500 space-y-10">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { l: 'Casos Ativos', v: cases.length.toString().padStart(2, '0'), c: 'text-indigo-500', i: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
            { l: 'Alvos Vigiados', v: targets.length.toString().padStart(2, '0'), c: 'text-red-500', i: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
            { l: 'Evidências', v: evidences.length.toString().padStart(2, '0'), c: 'text-blue-500', i: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 v2M7 7h10' },
            { l: 'Mandados', v: warrants.length.toString().padStart(2, '0'), c: 'text-amber-500', i: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' }
          ].map((s, i) => (
            <div key={i} className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity text-white">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={s.i}/></svg>
               </div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{s.l}</p>
               <h3 className={`text-5xl font-black italic tracking-tighter ${s.c}`}>{s.v}</h3>
            </div>
          ))}
       </div>
       <div className="bg-indigo-950/10 border border-indigo-500/20 p-16 rounded-[4rem] text-center space-y-6">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-[0_0_50px_rgba(79,70,229,0.3)]">
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.268 0 2.49.234 3.62.661m-1.756 3.39a3 3 0 00-4.632 0m4.632 0a3 3 0 011.023 3.67m-1.164 2.025a10.003 10.003 0 01-1.746 3.419m-3.374-1.213a3 3 0 114.668 0m3.115 1.004a10.025 10.025 0 01-4.459 2.082"/></svg>
          </div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Terminal Operacional NIC</h2>
          <p className="text-slate-400 italic text-sm font-medium uppercase tracking-widest max-w-2xl mx-auto">Acesso Restrito: Nível de Segurança S9. Toda a atividade é monitorizada e gravada para auditoria do Comando-Geral.</p>
       </div>
    </div>
  );

  const renderTargets = () => (
    <div className="space-y-12 animate-in fade-in duration-700">
       <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Base de Dados de Alvos</h2>
          <button onClick={() => setShowTargetForm(!showTargetForm)} className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase shadow-xl transition-all">
            {showTargetForm ? 'CANCELAR' : 'REGISTAR NOVO ALVO'}
          </button>
       </div>

       {showTargetForm && (
         <form onSubmit={handleCreateTarget} className="bg-black/40 border border-red-900/30 p-12 rounded-[3.5rem] space-y-8 animate-in slide-in-from-top-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome / Alcunha do Alvo</label>
                  <input required value={newTargetData.name} onChange={e => setNewTargetData({...newTargetData, name: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-red-600 text-xs font-black uppercase" placeholder="EX: EL PATRON" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Risco</label>
                     <select value={newTargetData.threat} onChange={e => setNewTargetData({...newTargetData, threat: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-red-600 text-xs font-black">
                        <option>BAIXA</option><option>MÉDIA</option><option>ALTA</option><option>EXTREMA</option>
                     </select>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Status</label>
                     <select value={newTargetData.status} onChange={e => setNewTargetData({...newTargetData, status: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-red-600 text-xs font-black">
                        <option>VIGILÂNCIA</option><option>PROCURADO</option><option>PRESO</option><option>DESCONHECIDO</option>
                     </select>
                  </div>
               </div>
            </div>
            <div className="space-y-3">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">URL da Imagem de Perfil (Fisga/Mugshot)</label>
               <input value={newTargetData.img} onChange={e => setNewTargetData({...newTargetData, img: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-red-600 text-xs" placeholder="https://..." />
            </div>
            <div className="space-y-3">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Informações e Notas Iniciais</label>
               <textarea required value={newTargetData.notes} onChange={e => setNewTargetData({...newTargetData, notes: e.target.value})} className="w-full bg-black border border-white/10 p-6 rounded-[2rem] text-white outline-none h-32 text-xs italic resize-none" placeholder="Descreva os motivos da vigilância..." />
            </div>
            <button type="submit" className="w-full py-5 bg-red-600 hover:bg-red-500 text-white font-black rounded-[2.5rem] uppercase tracking-widest text-xs shadow-2xl transition-all">Protocolar Alvo no Sistema S9</button>
         </form>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {targets.map(t => (
            <div key={t.id} onClick={() => setSelectedTarget(t)} className="bg-black/40 border border-white/5 rounded-[3rem] overflow-hidden group cursor-pointer hover:border-red-600/30 transition-all shadow-2xl relative">
               <div className="h-56 w-full relative overflow-hidden">
                  <img src={t.img} className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-110 transition-all duration-1000" alt="" />
                  <div className="absolute top-6 left-6">
                     <span className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                        t.threat === 'EXTREMA' ? 'bg-red-600 text-white border-red-500' : 'bg-black/80 text-white border-white/20'
                     }`}>RISCO {t.threat}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
               </div>
               <div className="p-8">
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter group-hover:text-red-500 transition-colors leading-none mb-2">{t.name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">{t.status}</p>
                  <div className="mt-8 space-y-4">
                     <div className="flex justify-between items-center text-[8px] font-black text-slate-600 uppercase">
                        <span>Nível de Intel</span>
                        <span>{t.intel}%</span>
                     </div>
                     <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.4)]" style={{ width: `${t.intel}%` }}></div>
                     </div>
                  </div>
               </div>
            </div>
          ))}
          {targets.length === 0 && <div className="col-span-full py-40 text-center opacity-5 text-2xl font-black uppercase tracking-[0.5em] italic border-2 border-dashed border-white/5 rounded-[4rem]">Nenhum Alvo Identificado</div>}
       </div>

       {/* DOSSIER DE ALVO */}
       {selectedTarget && (
         <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-300">
           <div className="bg-[#05080c] border border-red-500/20 w-full max-w-5xl rounded-[4rem] overflow-hidden flex flex-col h-[90vh] shadow-2xl">
              <div className="p-12 border-b border-white/5 flex justify-between items-center bg-red-950/10">
                 <div className="flex items-center gap-6">
                    <img src={selectedTarget.img} className="w-16 h-16 rounded-2xl border-2 border-red-600 object-cover" alt="" />
                    <div>
                       <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{selectedTarget.name}</h3>
                       <p className="text-red-500 text-[9px] font-black uppercase tracking-[0.4em] mt-1">Dossier de Inteligência • {selectedTarget.id}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedTarget(null)} className="text-slate-700 hover:text-white transition-all"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                       <div className="bg-black/40 p-8 rounded-[2.5rem] border border-white/5">
                          <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-6">Informações Confidenciais</h4>
                          <p className="text-sm text-slate-300 italic leading-relaxed whitespace-pre-wrap">"{selectedTarget.notes}"</p>
                       </div>
                    </div>
                    <div className="space-y-8">
                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4">Provas Anexadas</h4>
                       <div className="grid grid-cols-2 gap-4">
                          {selectedTarget.attachments.map(att => (
                            <div key={att.id} className="bg-white/5 rounded-xl overflow-hidden border border-white/5">
                               <img src={att.data} className="h-32 w-full object-cover" alt="" />
                               <p className="p-3 text-[8px] text-slate-500 font-mono text-center uppercase">{att.name}</p>
                            </div>
                          ))}
                          <button className="h-32 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center hover:border-red-600 transition-all group">
                             <span className="text-2xl text-slate-700 group-hover:text-red-600">+</span>
                             <span className="text-[8px] text-slate-800 font-black uppercase">Anexar Prova</span>
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="p-8 bg-black border-t border-white/5 text-[8px] font-black text-slate-700 uppercase tracking-[0.5em] italic text-center">ARQUIVO CENTRAL NIC • DIAMOND TERRITORY</div>
           </div>
         </div>
       )}
    </div>
  );

  const renderCases = () => (
    <div className="space-y-12 animate-in fade-in duration-700">
       <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Gestão de Casos (Dossiês)</h2>
          <button onClick={() => setShowCaseForm(!showCaseForm)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase shadow-xl transition-all">
            {showCaseForm ? 'CANCELAR' : 'ABRIR INVESTIGAÇÃO'}
          </button>
       </div>

       {showCaseForm && (
         <form onSubmit={handleCreateCase} className="bg-black/40 border border-indigo-900/30 p-12 rounded-[3.5rem] space-y-8 animate-in slide-in-from-top-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Título da Operação</label>
                  <input required value={newCaseData.title} onChange={e => setNewCaseData({...newCaseData, title: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-indigo-600 text-xs font-black uppercase" placeholder="EX: OPERAÇÃO CAVALO DE TROIA" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Prioridade</label>
                     <select value={newCaseData.priority} onChange={e => setNewCaseData({...newCaseData, priority: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-indigo-600 text-xs font-black">
                        <option>BAIXA</option><option>MÉDIA</option><option>ALTA</option><option>CRÍTICA</option>
                     </select>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Suspeito Principal</label>
                     <input value={newCaseData.primarySuspect} onChange={e => setNewCaseData({...newCaseData, primarySuspect: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-indigo-600 text-xs font-black uppercase" placeholder="NOME OU ALCUNHA" />
                  </div>
               </div>
            </div>
            <div className="space-y-3">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Sumário Executivo</label>
               <input required value={newCaseData.summary} onChange={e => setNewCaseData({...newCaseData, summary: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-indigo-600 text-xs italic" placeholder="Breve descrição dos factos..." />
            </div>
            <div className="space-y-3">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Detalhes da Investigação</label>
               <textarea required value={newCaseData.details} onChange={e => setNewCaseData({...newCaseData, details: e.target.value})} className="w-full bg-black border border-white/10 p-6 rounded-[2rem] text-white outline-none h-48 text-xs italic resize-none" placeholder="Relatório minucioso das diligências..." />
            </div>
            <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-[2.5rem] uppercase tracking-widest text-xs shadow-2xl transition-all">Abrir Dossier de Investigação</button>
         </form>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {cases.map(c => (
            <div key={c.id} onClick={() => setSelectedCase(c)} className="bg-[#05080c] border border-indigo-500/10 p-10 rounded-[3rem] hover:border-indigo-600/40 transition-all cursor-pointer group shadow-2xl flex flex-col justify-between h-[320px] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <svg className="w-24 h-24 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
               </div>
               <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-start">
                     <span className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                        c.priority === 'CRÍTICA' ? 'bg-red-600/20 text-red-500 border border-red-500/20' : 'bg-black text-indigo-500 border border-indigo-500/20'
                     }`}>{c.priority}</span>
                     <span className="text-slate-700 font-mono text-[9px] uppercase">{c.createdAt}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight group-hover:text-indigo-400 transition-colors">{c.title}</h3>
                  <p className="text-xs text-slate-400 italic line-clamp-3 leading-relaxed uppercase">{c.summary}</p>
               </div>
               <div className="pt-8 border-t border-white/5 relative z-10 flex justify-between items-center">
                  <div>
                     <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Encarregado</p>
                     <p className="text-[10px] font-black text-indigo-400 uppercase italic">{c.assignedAgent}</p>
                  </div>
                  <span className="text-[9px] font-black text-white uppercase tracking-widest px-4 py-1.5 bg-indigo-600 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all">Consultar Dossier →</span>
               </div>
            </div>
          ))}
          {cases.length === 0 && <div className="col-span-full py-40 text-center opacity-5 text-2xl font-black uppercase tracking-[0.5em] italic border-2 border-dashed border-white/5 rounded-[4rem]">Sem investigações ativas</div>}
       </div>

       {/* DOSSIER DE CASO */}
       {selectedCase && (
         <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-300">
           <div className="bg-[#040812] border border-indigo-500/20 w-full max-w-5xl rounded-[4rem] overflow-hidden flex flex-col h-[90vh] shadow-2xl">
              <div className="p-12 border-b border-white/5 flex justify-between items-center bg-indigo-950/10">
                 <div>
                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{selectedCase.title}</h3>
                    <p className="text-indigo-500 text-[9px] font-black uppercase tracking-[0.4em] mt-1">Dossier de Investigação Criminal • {selectedCase.id}</p>
                 </div>
                 <button onClick={() => setSelectedCase(null)} className="text-slate-700 hover:text-white transition-all"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-8">
                       <div className="bg-black/40 p-10 rounded-[2.5rem] border border-white/5">
                          <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6 border-b border-indigo-900/30 pb-2">Relatório Operacional</h4>
                          <p className="text-sm text-slate-300 italic leading-relaxed whitespace-pre-wrap">"{selectedCase.details}"</p>
                       </div>
                    </div>
                    <div className="space-y-8">
                       <div className="bg-black/40 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                          <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic">Metadados do Caso</h4>
                          <div><p className="text-[8px] text-slate-600 font-black uppercase">Suspeito Primário</p><p className="text-sm font-black text-white italic uppercase">{selectedCase.primarySuspect}</p></div>
                          <div><p className="text-[8px] text-slate-600 font-black uppercase">Oficial Encarregado</p><p className="text-sm font-black text-indigo-400 italic uppercase">{selectedCase.assignedAgent}</p></div>
                          <div><p className="text-[8px] text-slate-600 font-black uppercase">Data de Abertura</p><p className="text-sm font-black text-slate-400 font-mono">{selectedCase.createdAt}</p></div>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="p-8 bg-black border-t border-white/5 text-[8px] font-black text-slate-700 uppercase tracking-[0.5em] italic text-center">DOCUMENTO CONFIDENCIAL • ACESSO S9</div>
           </div>
         </div>
       )}
    </div>
  );

  const renderEvidenceVault = () => (
    <div className="space-y-12 animate-in fade-in duration-700">
       <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Cofre de Evidências Digitais</h2>
          <button onClick={() => setShowEvidenceForm(!showEvidenceForm)} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase shadow-xl transition-all">
            {showEvidenceForm ? 'CANCELAR' : 'PROTOCOLAR EVIDÊNCIA'}
          </button>
       </div>

       {showEvidenceForm && (
         <form onSubmit={handleCreateEvidence} className="bg-black/40 border border-blue-900/30 p-12 rounded-[3.5rem] space-y-8 animate-in slide-in-from-top-4 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Título da Evidência</label>
                  <input required value={newEvidenceData.title} onChange={e => setNewEvidenceData({...newEvidenceData, title: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-600 text-xs font-black uppercase" placeholder="EX: GRAVAÇÃO CÂMARA 04" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Tipo de Prova</label>
                     <select value={newEvidenceData.type} onChange={e => setNewEvidenceData({...newEvidenceData, type: e.target.value as any})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-600 text-xs font-black">
                        <option value="IMAGEM">IMAGEM / FOTO</option><option value="ÁUDIO">GRAVAÇÃO ÁUDIO</option><option value="VÍDEO">VÍDEO / CLIP</option><option value="DOCUMENTO">DOCUMENTO</option>
                     </select>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">ID do Caso (Opcional)</label>
                     <input value={newEvidenceData.caseId} onChange={e => setNewEvidenceData({...newEvidenceData, caseId: e.target.value})} className="w-full bg-black border border-white/10 p-5 rounded-2xl text-white outline-none focus:border-blue-600 text-xs font-mono" placeholder="CASE-001" />
                  </div>
               </div>
            </div>
            <div className="space-y-3">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Carregar Arquivo Operacional</label>
               <div className="flex items-center gap-4">
                  <input type="file" onChange={e => e.target.files?.[0] && handleFileToBase64(e.target.files[0], (b) => setNewEvidenceData({...newEvidenceData, fileData: b}))} className="w-full bg-black border border-white/10 p-4 rounded-xl text-xs text-slate-500 file:bg-blue-600 file:border-none file:text-white file:px-4 file:py-1 file:rounded file:mr-4 file:text-[8px] file:font-black file:uppercase" />
                  {newEvidenceData.fileData && <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">✓</div>}
               </div>
            </div>
            <div className="space-y-3">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Descrição Técnico-Jurídica</label>
               <textarea required value={newEvidenceData.description} onChange={e => setNewEvidenceData({...newEvidenceData, description: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-6 text-xs text-slate-300 outline-none focus:border-blue-600 h-32 resize-none italic" placeholder="Descreva o conteúdo e como a prova foi obtida..." />
            </div>
            <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-[2.5rem] uppercase tracking-widest text-xs shadow-2xl transition-all">Protocolar no Cofre Digital</button>
         </form>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {evidences.map(e => (
            <div key={e.id} onClick={() => setSelectedEvidence(e)} className="bg-black/40 border border-white/5 p-10 rounded-[3rem] hover:border-blue-600/40 transition-all cursor-pointer group shadow-2xl space-y-6 flex flex-col justify-between">
               <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg">
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 v2M7 7h10"/></svg>
                  </div>
                  <span className="text-slate-800 font-mono text-[8px] uppercase">EVID_REF_{e.id.slice(-6)}</span>
               </div>
               <div>
                  <h4 className="text-lg font-black text-white uppercase italic leading-tight group-hover:text-blue-400 transition-colors">{e.title}</h4>
                  <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest mt-2 italic">CASO: {e.caseId}</p>
               </div>
               <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-slate-500 uppercase tracking-widest">
                  <span>POR: {e.officer}</span>
                  <span className="bg-blue-900/20 px-2 py-1 rounded text-blue-400">{e.type}</span>
               </div>
            </div>
          ))}
          {evidences.length === 0 && <div className="col-span-full py-40 text-center opacity-5 text-2xl font-black uppercase tracking-[0.5em] italic border-2 border-dashed border-white/5 rounded-[4rem]">Cofre Digital Vazio</div>}
       </div>

       {/* DOSSIER DE EVIDÊNCIA */}
       {selectedEvidence && (
         <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-300">
           <div className="bg-[#02050a] border border-blue-500/20 w-full max-w-4xl rounded-[4rem] overflow-hidden flex flex-col h-[90vh] shadow-2xl">
              <div className="p-12 border-b border-white/5 flex justify-between items-center bg-blue-950/10">
                 <div>
                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{selectedEvidence.title}</h3>
                    <p className="text-blue-500 text-[9px] font-black uppercase mt-1">Registo de Cadeia de Custódia • {selectedEvidence.id}</p>
                 </div>
                 <button onClick={() => setSelectedEvidence(null)} className="text-slate-700 hover:text-white transition-all"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar text-center">
                 <div className="space-y-10">
                    {selectedEvidence.attachments.length > 0 ? (
                      <div className="bg-black/40 border border-white/5 p-4 rounded-[3rem] inline-block max-w-3xl mx-auto shadow-2xl">
                         <img src={selectedEvidence.attachments[0].data} className="max-h-[500px] rounded-[2rem] object-contain" alt="" />
                      </div>
                    ) : (
                      <div className="h-64 border-2 border-dashed border-white/5 rounded-[3rem] flex items-center justify-center italic text-slate-800 uppercase text-xs">Sem Média Visual</div>
                    )}
                    <div className="max-w-2xl mx-auto text-left space-y-6">
                       <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest border-b border-white/5 pb-2 italic">Histórico de Custódia</h4>
                       <p className="text-sm text-slate-300 italic leading-relaxed whitespace-pre-wrap">"{selectedEvidence.description}"</p>
                       <div className="pt-6 border-t border-white/5 flex justify-between items-center opacity-40">
                          <div><p className="text-[8px] text-slate-600 uppercase font-black">Oficial Custodiante</p><p className="text-xs font-black text-white uppercase italic">{selectedEvidence.officer}</p></div>
                          <p className="text-xs font-black text-white italic font-mono">{selectedEvidence.timestamp}</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="p-8 bg-black border-t border-white/5 text-[8px] font-black text-slate-700 uppercase tracking-[0.5em] italic text-center">SINC SECURED • EVIDENCE STORAGE V.9</div>
           </div>
         </div>
       )}
    </div>
  );

  // --- NEW RENDER FUNCTIONS TO FIX ERRORS ---

  const [newReportData, setNewReportData] = useState({
    caseNumber: '', location: '', type: 'INVESTIGAÇÃO', description: '', involved: ''
  });

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    const report: IncidentReport = {
      id: `REP-${Date.now()}`,
      caseNumber: newReportData.caseNumber || `NIC-${Date.now().toString().slice(-4)}`,
      dateTime: new Date().toLocaleString('pt-PT'),
      location: newReportData.location,
      type: newReportData.type,
      involved: newReportData.involved.split(',').map(name => ({ name: name.trim(), id: 'N/A', role: 'SUSPEITO' })),
      description: newReportData.description,
      status: 'EM ANDAMENTO',
      author: currentUser?.name || 'Agente NIC'
    };
    setReports(await saveReportLocally(report));
    setReportSubTab('history');
    setNewReportData({ caseNumber: '', location: '', type: 'INVESTIGAÇÃO', description: '', involved: '' });
  };

  const renderReports = () => (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Relatórios de Incidência</h2>
          <p className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3 italic">Arquivo Criminal e Operativo S9</p>
        </div>
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 gap-2">
           <button onClick={() => setReportSubTab('form')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${reportSubTab === 'form' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Novo</button>
           <button onClick={() => setReportSubTab('history')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${reportSubTab === 'history' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>Histórico</button>
        </div>
      </div>

      {reportSubTab === 'form' ? (
        <form onSubmit={handleCreateReport} className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-8 animate-in slide-in-from-top-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Nº do Caso</label>
                 <input value={newReportData.caseNumber} onChange={e => setNewReportData({...newReportData, caseNumber: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white" placeholder="NIC-2025-001" />
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Localização</label>
                 <input required value={newReportData.location} onChange={e => setNewReportData({...newReportData, location: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white" placeholder="EX: PIER DE DEL PERRO" />
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Natureza</label>
                 <input required value={newReportData.type} onChange={e => setNewReportData({...newReportData, type: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white" />
              </div>
           </div>
           <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Envolvidos (Separados por vírgula)</label>
              <input required value={newReportData.involved} onChange={e => setNewReportData({...newReportData, involved: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white" placeholder="João Silva, Maria Santos" />
           </div>
           <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Descrição dos Factos</label>
              <textarea required value={newReportData.description} onChange={e => setNewReportData({...newReportData, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-xs text-slate-300 h-40 resize-none italic" />
           </div>
           <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Protocolar Relatório NIC</button>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {reports.map(r => (
             <div key={r.id} className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                <div className="flex justify-between items-start">
                   <span className="text-[10px] font-mono text-indigo-500/40">#{r.caseNumber}</span>
                   <span className="text-[8px] font-black text-slate-700 uppercase">{r.dateTime}</span>
                </div>
                <h4 className="text-lg font-black text-white uppercase italic">{r.type} @ {r.location}</h4>
                <p className="text-xs text-slate-400 italic line-clamp-2 leading-relaxed">"{r.description}"</p>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-slate-600 uppercase italic">
                   <span>POR: {r.author}</span>
                   <span className="text-emerald-500">{r.status}</span>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );

  const [newWarrantData, setNewWarrantData] = useState({
    targetName: '', crime: '', priority: 'MÉDIA', notes: ''
  });

  const handleCreateWarrant = async (e: React.FormEvent) => {
    e.preventDefault();
    const warrant: Warrant = {
      id: `WARR-${Date.now()}`,
      targetName: newWarrantData.targetName.toUpperCase(),
      crime: newWarrantData.crime,
      priority: newWarrantData.priority as any,
      status: 'ATIVO',
      issuedBy: currentUser?.name || 'Comando NIC',
      issuedDate: new Date().toLocaleDateString('pt-PT'),
      notes: newWarrantData.notes
    };
    setWarrants(await saveWarrantLocally(warrant));
    setShowWarrantForm(false);
    setNewWarrantData({ targetName: '', crime: '', priority: 'MÉDIA', notes: '' });
  };

  const renderWarrants = () => (
    <div className="space-y-12 animate-in fade-in duration-700">
       <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Mandados de Captura</h2>
          <button onClick={() => setShowWarrantForm(!showWarrantForm)} className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase">
            {showWarrantForm ? 'CANCELAR' : 'NOVO MANDADO'}
          </button>
       </div>

       {showWarrantForm && (
         <form onSubmit={handleCreateWarrant} className="bg-black/40 border border-amber-900/30 p-10 rounded-[3rem] space-y-8 animate-in slide-in-from-top-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Alvo do Mandado</label>
                  <input required value={newWarrantData.targetName} onChange={e => setNewWarrantData({...newWarrantData, targetName: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white" />
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Prioridade</label>
                  <select value={newWarrantData.priority} onChange={e => setNewWarrantData({...newWarrantData, priority: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white">
                     <option>BAIXA</option><option>MÉDIA</option><option>ALTA</option><option>CRÍTICA</option>
                  </select>
               </div>
            </div>
            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Crimes / Motivação</label>
               <textarea required value={newWarrantData.crime} onChange={e => setNewWarrantData({...newWarrantData, crime: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-xs text-slate-300 h-24 resize-none italic" />
            </div>
            <button type="submit" className="w-full py-5 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-[10px] font-black uppercase">Emitir Mandado de Busca</button>
         </form>
       )}

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {warrants.map(w => (
            <div key={w.id} onClick={() => setSelectedWarrant(w)} className="bg-black/40 border border-amber-900/10 p-8 rounded-[2.5rem] space-y-6 hover:border-amber-500/30 cursor-pointer transition-all">
               <div className="flex justify-between items-start">
                  <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase ${w.priority === 'CRÍTICA' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'}`}>{w.priority}</span>
                  <span className="text-[8px] font-black text-slate-700 uppercase">{w.issuedDate}</span>
               </div>
               <h4 className="text-xl font-black text-white uppercase italic">{w.targetName}</h4>
               <p className="text-xs text-slate-400 italic line-clamp-2">"{w.crime}"</p>
               <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-slate-600 uppercase">
                  <span>POR: {w.issuedBy}</span>
                  <span className="text-emerald-500">{w.status}</span>
               </div>
            </div>
          ))}
       </div>

       {selectedWarrant && (
         <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-300">
           <div className="bg-[#05080c] border border-amber-500/20 w-full max-w-2xl rounded-[4rem] p-12 space-y-8 relative shadow-2xl">
              <button onClick={() => setSelectedWarrant(null)} className="absolute top-8 right-8 text-slate-700 hover:text-white transition-all"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg></button>
              <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter">DETALHES DO MANDADO</h3>
              <div className="bg-black/40 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                 <div><p className="text-[8px] text-slate-600 font-black uppercase">Alvo</p><p className="text-xl font-black text-white italic uppercase">{selectedWarrant.targetName}</p></div>
                 <div><p className="text-[8px] text-slate-600 font-black uppercase">Prioridade</p><p className="text-lg font-black text-amber-500 italic uppercase">{selectedWarrant.priority}</p></div>
                 <div><p className="text-[8px] text-slate-600 font-black uppercase">Motivo Criminal</p><p className="text-sm text-slate-300 italic leading-relaxed uppercase">{selectedWarrant.crime}</p></div>
                 <div><p className="text-[8px] text-slate-600 font-black uppercase">Autoridade Emissora</p><p className="text-sm font-black text-slate-400 italic uppercase">{selectedWarrant.issuedBy} • {selectedWarrant.issuedDate}</p></div>
              </div>
           </div>
         </div>
       )}
    </div>
  );

  /**
   * AI-powered Forensic Analysis using Gemini.
   */
  const handleForensicAnalysis = async () => {
    if (!forensicImage) return;
    setIsAnalyzing(true);

    try {
      // Create a new GoogleGenAI instance with the API key from environment variables.
      const ai = new GoogleGenAI({ apiKey: (import.meta as any).env.VITE_GEMINI_API_KEY || '' });
      const base64Data = forensicImage.split(',')[1];
      
      // Prompt for analyzing a forensic scene image.
      const prompt = `Analise esta imagem de evidência de uma cena de crime para a Unidade de Investigação Criminal (NIC) da GNR. 
      Identifique objetos ilegais, armas, munições, substâncias suspeitas ou indícios de atividades criminosas. 
      Retorne um JSON estruturado com uma lista de itens detectados (nome, quantidade, tipo, valor aproximado em euros) e um sumário analítico profissional para o relatório oficial.`;

      // Call Gemini API to generate content from image and text.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              detected_items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    quantity: { type: Type.NUMBER },
                    type: { type: Type.STRING },
                    value: { type: Type.NUMBER }
                  },
                  required: ["name", "quantity", "type", "value"]
                }
              },
              summary: { type: Type.STRING }
            },
            required: ["detected_items", "summary"]
          }
        }
      });

      // Extract generated text content.
      const data = JSON.parse(response.text || '{}');
      
      const newSeizure: ForensicSeizure = {
        id: `FORENSIC-${Date.now()}`,
        title: `ANÁLISE NEURONAL REF_${Date.now().toString().slice(-4)}`,
        officer: currentUser?.name || 'Oficial NIC',
        timestamp: new Date().toLocaleString('pt-PT'),
        items: data.detected_items.map((it: any) => ({
          name: it.name,
          qty: it.quantity,
          value: it.value,
          type: it.type
        })),
        totalValue: data.detected_items.reduce((acc: number, curr: any) => acc + curr.value, 0),
        aiSummary: data.summary,
        evidenceImage: forensicImage,
        caseId: 'NIC-FORENSIC-S9'
      };

      setForensicSeizures(await saveForensicSeizureLocally(newSeizure));
      setSelectedForensic(newSeizure);
      setForensicImage(null);

    } catch (error: any) {
      console.error("Forensic Error:", error);
      alert("Falha na análise neuronal. O terminal S9 não conseguiu processar a imagem.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderForensicAnalysis = () => (
    <div className="space-y-12 animate-in fade-in duration-700">
       <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Análise Forense S9</h2>
            <p className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3 italic">Motor de Visão Computacional Neuronal</p>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
             <div onClick={() => !isAnalyzing && forensicFileInputRef.current?.click()} className={`h-[500px] border-2 border-dashed rounded-[3rem] overflow-hidden flex flex-col items-center justify-center cursor-pointer relative group transition-all ${forensicImage ? 'border-indigo-500 bg-black/40' : 'border-slate-800 bg-slate-900/10 hover:border-indigo-900'}`}>
                {forensicImage ? (
                  <>
                    <img src={forensicImage} className="w-full h-full object-cover opacity-60" alt="" />
                    {isAnalyzing && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-950/20 backdrop-blur-sm">
                         <div className="w-32 h-1 bg-indigo-500 animate-[scan_2s_linear_infinite] shadow-[0_0_20px_#6366f1]"></div>
                         <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mt-8 animate-pulse italic">Analisando Evidência...</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center p-12 space-y-6 opacity-40 group-hover:opacity-100 transition-opacity">
                     <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto"><svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0"/></svg></div>
                     <p className="text-xs font-black uppercase tracking-widest text-white italic">Carregar Prova para Análise NIC</p>
                  </div>
                )}
                <input type="file" ref={forensicFileInputRef} onChange={e => {
                  const file = e.target.files?.[0];
                  if(file) handleFileToBase64(file, setForensicImage);
                }} accept="image/*" className="hidden" />
             </div>
             {forensicImage && !isAnalyzing && (
                <button onClick={handleForensicAnalysis} className="w-full py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95">
                  INICIAR ESCANEAMENTO NEURONAL S9
                </button>
             )}
          </div>

          <div className="bg-[#020604]/80 border border-indigo-500/10 p-8 rounded-[3rem] h-[500px] flex flex-col shadow-inner overflow-hidden">
             <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-8 border-b border-white/5 pb-6 italic">Relatórios Forenses Recentes</h3>
             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {forensicSeizures.map(s => (
                   <div key={s.id} onClick={() => setSelectedForensic(s)} className="bg-black/40 p-5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-indigo-500/30 cursor-pointer transition-all">
                      <div className="flex items-center gap-4">
                         <img src={s.evidenceImage} className="w-12 h-12 rounded-lg object-cover" alt="" />
                         <div>
                            <h4 className="text-xs font-black text-white uppercase italic truncate max-w-[150px]">{s.title}</h4>
                            <p className="text-[8px] text-slate-500 uppercase tracking-widest mt-1">{s.timestamp}</p>
                         </div>
                      </div>
                      <span className="text-indigo-500 font-mono font-black text-xs italic">Ver →</span>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );

  const handleNICShiftToggle = async () => {
    if (!currentUser) return;
    const active = shifts.find(s => s.officerId === currentUser.id && s.status !== 'COMPLETED');
    const now = new Date().toISOString();

    if (!active) {
      const newShift: NICShift = {
        id: `NIC-SHIFT-${Date.now()}`,
        officerId: currentUser.id,
        officerName: currentUser.name,
        startTime: now,
        status: 'RUNNING',
        totalActiveSeconds: 0,
        lastToggleTime: now,
        history: [{ action: 'START', time: now }]
      };
      setShifts(await saveNICShiftLocally(newShift));
    } else {
      const diff = Math.floor((new Date().getTime() - new Date(active.lastToggleTime).getTime()) / 1000);
      if (active.status === 'RUNNING') {
        const updated: NICShift = {
          ...active,
          status: 'PAUSED',
          totalActiveSeconds: active.totalActiveSeconds + diff,
          lastToggleTime: now,
          history: [...active.history, { action: 'PAUSE', time: now }]
        };
        setShifts(await saveNICShiftLocally(updated));
      } else {
        const updated: NICShift = {
          ...active,
          status: 'RUNNING',
          lastToggleTime: now,
          history: [...active.history, { action: 'RESUME', time: now }]
        };
        setShifts(await saveNICShiftLocally(updated));
      }
    }
  };

  const handleNICShiftEnd = async () => {
    if (!currentUser) return;
    const active = shifts.find(s => s.officerId === currentUser.id && s.status !== 'COMPLETED');
    if (!active) return;
    const now = new Date().toISOString();
    const diff = Math.floor((new Date().getTime() - new Date(active.lastToggleTime).getTime()) / 1000);
    const finalSeconds = active.status === 'RUNNING' ? active.totalActiveSeconds + diff : active.totalActiveSeconds;
    
    const updated: NICShift = {
      ...active,
      status: 'COMPLETED',
      endTime: now,
      totalActiveSeconds: finalSeconds,
      history: [...active.history, { action: 'END', time: now }]
    };
    setShifts(await saveNICShiftLocally(updated));
  };

  const renderTimesheet = () => {
    const active = shifts.find(s => s.officerId === currentUser?.id && s.status !== 'COMPLETED');
    const history = shifts.filter(s => s.officerId === currentUser?.id && s.status === 'COMPLETED');

    return (
      <div className="space-y-12 animate-in fade-in duration-700">
         <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Folha de Ponto NIC</h2>
              <p className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3 italic">Monitorização de Atividade Investigativa</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-black/40 border border-white/5 p-10 rounded-[3rem] text-center space-y-8 flex flex-col items-center shadow-2xl">
               <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Tempo em Operação</p>
                  <h3 className="text-6xl font-black text-white font-mono italic tracking-tighter">{currentTimeDisplay}</h3>
               </div>
               <div className="flex gap-4 w-full max-w-xs">
                  <button onClick={handleNICShiftToggle} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active?.status === 'RUNNING' ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}>
                     {active ? (active.status === 'RUNNING' ? 'PAUSAR' : 'RETOMAR') : 'INICIAR TURNO'}
                  </button>
                  {active && (
                    <button onClick={handleNICShiftEnd} className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">ENCERRAR</button>
                  )}
               </div>
            </div>

            <div className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-6 shadow-2xl overflow-hidden flex flex-col">
               <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest italic border-b border-white/5 pb-4">Histórico Recente</h4>
               <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                  {history.map(s => (
                    <div key={s.id} className="bg-white/5 p-4 rounded-2xl flex justify-between items-center border border-white/5 group hover:border-indigo-500/30">
                       <div>
                          <p className="text-[9px] font-black text-slate-500 uppercase">{new Date(s.startTime).toLocaleDateString()}</p>
                          <p className="text-xs font-black text-white italic uppercase">{Math.floor(s.totalActiveSeconds/3600)}h {Math.floor((s.totalActiveSeconds%3600)/60)}m Operados</p>
                       </div>
                       <button onClick={async () => setShifts(await deleteNICShiftLocally(s.id))} className="text-red-950 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    );
  };

  const renderRules = () => (
    <div className="space-y-12 animate-in fade-in duration-700">
       <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Diretrizes Operacionais NIC</h2>
            <p className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3 italic">Código de Conduta e Ética S9</p>
          </div>
       </div>

       <div className="bg-black/40 border border-white/5 p-12 rounded-[4rem] space-y-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <svg className="w-64 h-64 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
             <div className="space-y-8">
                <h4 className="text-xl font-black text-indigo-500 italic uppercase border-b border-indigo-900/30 pb-4">Art. 1º - Sigilo e Discrição</h4>
                <p className="text-slate-300 italic leading-relaxed text-sm">
                   Toda a informação obtida via escuta, infiltração ou análise forense é <span className="text-white font-bold underline">ESTRITAMENTE CONFIDENCIAL</span>. A partilha de dados do NIC com elementos externos ou guardas não autorizados resulta em expulsão por desonra.
                </p>
             </div>
             <div className="space-y-8">
                <h4 className="text-xl font-black text-indigo-500 italic uppercase border-b border-indigo-900/30 pb-4">Art. 2º - Infiltração</h4>
                <p className="text-slate-300 italic leading-relaxed text-sm">
                   Operações à paisana devem ser registadas no sistema S9 antes do início. O uso de viaturas descaracterizadas é um privilégio de inteligência e não de patrulha regular.
                </p>
             </div>
          </div>

          <div className="p-10 bg-indigo-950/10 border border-indigo-500/20 rounded-[3rem] text-center">
             <p className="text-xs text-slate-400 italic font-bold uppercase tracking-widest">"A inteligência é a nossa arma mais potente. Use-a com sabedoria e honra."</p>
          </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {internalTab === 'nic-main' && renderDashboard()}
      {internalTab === 'nic-reports' && renderReports()}
      {internalTab === 'nic-warrants' && renderWarrants()}
      {internalTab === 'nic-targets' && renderTargets()}
      {internalTab === 'nic-forensic' && renderForensicAnalysis()}
      {internalTab === 'nic-timesheet' && renderTimesheet()}
      {internalTab === 'nic-rules' && renderRules()}
      {internalTab === 'nic-cases' && renderCases()}
      {internalTab === 'nic-evidence' && renderEvidenceVault()}
      
      {/* Visualizadores de detalhes Legados (Forense) */}
      {selectedForensic && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-300 overflow-y-auto">
           <div className="bg-[#040812] border border-indigo-500/20 w-full max-w-5xl rounded-[4rem] overflow-hidden flex flex-col h-[90vh] shadow-[0_0_100px_rgba(79,70,229,0.2)]">
              <div className="p-12 border-b border-white/5 flex justify-between items-center bg-indigo-950/10">
                 <div>
                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">{selectedForensic.title}</h3>
                    <p className="text-indigo-500 text-[9px] font-black uppercase tracking-[0.4em] mt-2 italic">Relatório de Análise Neuronal</p>
                 </div>
                 <button onClick={() => setSelectedForensic(null)} className="text-slate-700 hover:text-white transition-all"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg></button>
              </div>
              <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                       <img src={selectedForensic.evidenceImage} className="w-full h-80 object-cover rounded-[3rem] border border-white/10 shadow-2xl" alt="" />
                       <div className="bg-black/40 p-10 rounded-[2.5rem] border border-white/5">
                          <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6 italic">Resumo Forense IA</h4>
                          <p className="text-sm text-slate-300 italic leading-relaxed whitespace-pre-wrap">"{selectedForensic.aiSummary}"</p>
                       </div>
                    </div>
                    <div className="space-y-8">
                       <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic border-b border-white/5 pb-4">Inventário de Apreensão</h4>
                       <div className="space-y-3">
                          {selectedForensic.items.map((item, i) => (
                            <div key={i} className="bg-white/5 p-5 rounded-2xl flex justify-between items-center border border-white/5">
                               <div>
                                  <p className="text-xs font-black text-white uppercase italic">{item.name}</p>
                                  <p className="text-[8px] text-slate-500 uppercase font-black mt-1">{item.type} • Qty: {item.qty}</p>
                               </div>
                               <span className="text-emerald-500 font-mono font-black text-sm">{item.value.toLocaleString()}€</span>
                            </div>
                          ))}
                       </div>
                       <div className="pt-8 border-t border-white/5 flex justify-between items-end">
                          <span className="text-[10px] font-black text-slate-600 uppercase">Valor Total Liquidado</span>
                          <span className="text-4xl font-black text-emerald-500 italic tracking-tighter">{selectedForensic.totalValue.toLocaleString()}€</span>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="p-8 bg-black border-t border-white/5 flex justify-between items-center text-[8px] font-black text-slate-700 uppercase tracking-[0.5em] italic">
                 <p>SISTEMA DE ANÁLISE FORENSE S9-DIGITAL • ACESSO RESTRITO</p>
                 <p>Hash_Auth: {btoa(selectedForensic.id).slice(0, 16).toUpperCase()}</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default NICSection;
