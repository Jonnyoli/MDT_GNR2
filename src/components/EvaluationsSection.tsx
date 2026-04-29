
import React, { useState } from 'react';
import { Officer } from '../types';

interface EvaluationData {
  id: string;
  evaluator: string;
  targetName: string;
  theme: string;
  previousEvals: string;
  // Stats
  radioScore: number;
  conductScore: number;
  radioDescription: string;
  // Detenção 1
  det1ConductDesc: string;
  det1Score: number;
  det1Rights: boolean;
  det1Identified: boolean;
  det1Seized: boolean;
  // Detenção 2
  det2ConductDesc: string;
  det2Score: number;
  det2Rights: boolean;
  det2Identified: boolean;
  det2Seized: boolean;
  // Ocorrência
  incidentNote: string;
  incidentCrimes: boolean;
  incidentPhoto: boolean;
  incidentLayout: boolean;
  incidentDescriptionCorrect: boolean;
  // Final
  errors: string;
  finalObs: string;
  date: string;
}

interface EvaluationsSectionProps {
  isAdmin: boolean;
  currentUser: Officer | null;
}

const EvaluationsSection: React.FC<EvaluationsSectionProps> = ({ isAdmin, currentUser }) => {
  const [step, setStep] = useState(1);
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationData | null>(null);
  const [history, setHistory] = useState<EvaluationData[]>(() => {
    const saved = localStorage.getItem('gnr_evaluations');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState<Partial<EvaluationData>>({
    radioScore: 5,
    conductScore: 5,
    det1Score: 5,
    det2Score: 5,
    det1Rights: false,
    det1Identified: false,
    det1Seized: false,
    det2Rights: false,
    det2Identified: false,
    det2Seized: false,
    incidentCrimes: false,
    incidentPhoto: false,
    incidentLayout: false,
    incidentDescriptionCorrect: false,
  });

  const saveEvaluation = () => {
    if (!formData.targetName || !formData.finalObs) {
      alert("Por favor, preencha o nome do guarda e o parecer final.");
      return;
    }

    const completeEval: EvaluationData = {
      ...(formData as EvaluationData),
      id: `EVAL-${Date.now().toString().slice(-6)}`,
      evaluator: currentUser?.name || 'Comando',
      date: new Date().toLocaleDateString('pt-PT'),
    };

    const newHistory = [completeEval, ...history];
    setHistory(newHistory);
    localStorage.setItem('gnr_evaluations', JSON.stringify(newHistory));
    alert('Dossiê do Guarda selado e enviado para o Comando Geral.');
    setStep(1);
    setFormData({ radioScore: 5, conductScore: 5, det1Score: 5, det2Score: 5 });
  };

  const Toggle = ({ label, value, onChange }: { label: string, value: boolean, onChange: (v: boolean) => void }) => (
    <div className={`flex items-center justify-between p-5 rounded-3xl border transition-all duration-500 group ${value ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-black/40 border-white/5 hover:border-white/10'}`}>
      <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${value ? 'text-emerald-500' : 'text-slate-500'}`}>{label}</span>
      <button 
        type="button"
        onClick={() => onChange(!value)}
        className={`w-14 h-7 rounded-full relative p-1 transition-all duration-500 ${value ? 'bg-emerald-600' : 'bg-slate-800'}`}
      >
        <div className={`w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-500 ${value ? 'translate-x-7 shadow-[0_0_10px_white]' : 'translate-x-0'}`}></div>
      </button>
    </div>
  );

  const ScoreInput = ({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) => {
    const getColor = (v: number) => {
      if (v <= 3) return 'text-red-500';
      if (v <= 6) return 'text-amber-500';
      return 'text-emerald-500';
    };

    const getBgColor = (v: number) => {
      if (v <= 3) return 'accent-red-600';
      if (v <= 6) return 'accent-amber-600';
      return 'accent-emerald-600';
    };

    return (
      <div className="space-y-4 p-6 bg-black/20 rounded-3xl border border-white/5">
         <div className="flex justify-between text-[9px] font-black uppercase tracking-widest px-2">
            <span className="text-slate-500">{label}</span>
            <span className={`${getColor(value)} text-sm font-mono transition-colors`}>{value}/10</span>
         </div>
         <input 
           type="range" min="1" max="10" step="1" 
           value={value} 
           onChange={e => onChange(parseInt(e.target.value))}
           className={`w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer transition-all ${getBgColor(value)}`}
         />
      </div>
    );
  };

  const stepsInfo = [
    { id: 1, label: 'Identificação', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 2, label: 'Performance', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 3, label: 'Abordagem A', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 4, label: 'Abordagem B', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 5, label: 'Ocorrência', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z' },
    { id: 6, label: 'Parecer', icon: 'M9 12l2 2 4-4' },
  ];

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="border-l-8 border-emerald-500 pl-8 py-2">
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Dados de Recrutamento</h3>
                <p className="text-[10px] text-emerald-900 font-black uppercase tracking-[0.3em] mt-2">Identificação de Alvo para Promoção ou Avaliação</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Oficial em Avaliação *</label>
                   <input value={formData.targetName || ''} onChange={e => setFormData({...formData, targetName: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl px-8 py-5 text-sm font-black text-white focus:border-emerald-500 outline-none transition-all uppercase placeholder:text-slate-800" placeholder="EX: GUARDA SANTOS (NIP: 1234)" />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Finalidade do Protocolo *</label>
                   <input value={formData.theme || ''} onChange={e => setFormData({...formData, theme: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl px-8 py-5 text-sm font-black text-white focus:border-emerald-500 outline-none transition-all uppercase placeholder:text-slate-800" placeholder="EX: PROMOÇÃO A CABO" />
                </div>
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">Histórico de Performance Anterior</label>
                <textarea value={formData.previousEvals || ''} onChange={e => setFormData({...formData, previousEvals: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-[2rem] px-8 py-6 text-sm font-black text-white focus:border-emerald-500 outline-none h-40 resize-none italic" placeholder="Insira observações de patrulhas anteriores..." />
             </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="border-l-8 border-emerald-500 pl-8 py-2">
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Conduta Operacional</h3>
                <p className="text-[10px] text-emerald-900 font-black uppercase tracking-[0.3em] mt-2">Performance em Rádio e Comportamento Civil</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <ScoreInput label="Comunicação em Rádio (Protocolo 10)" value={formData.radioScore || 5} onChange={v => setFormData({...formData, radioScore: v})} />
                <ScoreInput label="Postura perante Civil e Oficiais" value={formData.conductScore || 5} onChange={v => setFormData({...formData, conductScore: v})} />
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Justificação Técnica de Pontuação</label>
                <textarea value={formData.radioDescription || ''} onChange={e => setFormData({...formData, radioDescription: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-[2rem] px-8 py-6 text-sm font-black text-white focus:border-emerald-500 outline-none h-40 resize-none italic" placeholder="Detalhes sobre a fluidez de rádio e respeito à hierarquia..." />
             </div>
          </div>
        );
      case 3:
      case 4:
        const isA = step === 3;
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="border-l-8 border-emerald-500 pl-8 py-2">
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Cenário de Detenção {isA ? 'Alpha' : 'Bravo'}</h3>
                <p className="text-[10px] text-emerald-900 font-black uppercase tracking-[0.3em] mt-2">Validação de Direitos e Procedimento Criminal</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Toggle label="Leitura de Direitos" value={!!(isA ? formData.det1Rights : formData.det2Rights)} onChange={v => setFormData({...formData, [isA ? 'det1Rights' : 'det2Rights']: v})} />
                <Toggle label="Identificação de Patente" value={!!(isA ? formData.det1Identified : formData.det2Identified)} onChange={v => setFormData({...formData, [isA ? 'det1Identified' : 'det2Identified']: v})} />
                <Toggle label="Revista e Apreensão" value={!!(isA ? formData.det1Seized : formData.det2Seized)} onChange={v => setFormData({...formData, [isA ? 'det1Seized' : 'det2Seized']: v})} />
             </div>
             <ScoreInput label={`Fluidez do Procedimento ${isA ? 'Alpha' : 'Bravo'}`} value={(isA ? formData.det1Score : formData.det2Score) || 5} onChange={v => setFormData({...formData, [isA ? 'det1Score' : 'det2Score']: v})} />
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Relato da Atuação</label>
                <textarea value={(isA ? formData.det1ConductDesc : formData.det2ConductDesc) || ''} onChange={e => setFormData({...formData, [isA ? 'det1ConductDesc' : 'det2ConductDesc']: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-[2rem] px-8 py-6 text-sm font-black text-white focus:border-emerald-500 outline-none h-40 resize-none italic" placeholder="Descreva como o oficial conduziu a abordagem..." />
             </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="border-l-8 border-emerald-500 pl-8 py-2">
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Documentação de Incidente</h3>
                <p className="text-[10px] text-emerald-900 font-black uppercase tracking-[0.3em] mt-2">Gestão Documental e Evidências</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Toggle label="Crimes Corretos" value={!!formData.incidentCrimes} onChange={v => setFormData({...formData, incidentCrimes: v})} />
                <Toggle label="Registo Fotográfico" value={!!formData.incidentPhoto} onChange={v => setFormData({...formData, incidentPhoto: v})} />
                <Toggle label="Layout de Auto S9" value={!!formData.incidentLayout} onChange={v => setFormData({...formData, incidentLayout: v})} />
                <Toggle label="Descrição dos Factos" value={!!formData.incidentDescriptionCorrect} onChange={v => setFormData({...formData, incidentDescriptionCorrect: v})} />
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Avaliação de Rigor Documental</label>
                <textarea value={formData.incidentNote || ''} onChange={e => setFormData({...formData, incidentNote: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-[2rem] px-8 py-6 text-sm font-black text-white focus:border-emerald-500 outline-none h-40 resize-none italic" />
             </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="border-l-8 border-emerald-500 pl-8 py-2">
                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Veredito do Comando</h3>
                <p className="text-[10px] text-emerald-900 font-black uppercase tracking-[0.3em] mt-2">Conclusão Final do Dossier Operacional</p>
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-2">Anomalias / Erros Graves Detetados</label>
                <textarea value={formData.errors || ''} onChange={e => setFormData({...formData, errors: e.target.value})} className="w-full bg-red-500/5 border border-red-500/20 rounded-2xl px-8 py-6 text-sm font-black text-red-400 focus:border-red-500 outline-none h-24 resize-none" placeholder="Ex: Não leu direitos, uso excessivo de força..." />
             </div>
             <div className="space-y-3">
                <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-2">Parecer Final do Avaliador *</label>
                <textarea value={formData.finalObs || ''} onChange={e => setFormData({...formData, finalObs: e.target.value})} className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-2xl px-8 py-6 text-sm font-black text-white focus:border-emerald-500 outline-none h-40 resize-none" placeholder="O oficial demonstrou competência em..." />
             </div>
             
             <div className="bg-emerald-600/10 border border-emerald-500/20 p-8 rounded-[2.5rem] flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                   <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                </div>
                <div>
                   <p className="text-xs font-black text-white uppercase italic">Selo de Autenticação GNR-MDT</p>
                   <p className="text-[10px] text-emerald-700 font-black uppercase tracking-widest mt-1">Ao submeter, este dossier será encriptado e enviado ao Comando.</p>
                </div>
             </div>

             <button onClick={saveEvaluation} className="w-full py-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2.5rem] text-[14px] font-black uppercase tracking-[0.3em] transition-all shadow-2xl hover:shadow-emerald-500/40 active:scale-95 group flex items-center justify-center gap-4">
                <span>Selar e Transmitir Dossier Operacional</span>
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
             </button>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* DETAILED VIEW MODAL */}
      {selectedEvaluation && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="bg-[#020806] border border-emerald-500/20 w-full max-w-5xl rounded-[3rem] overflow-hidden relative shadow-[0_50px_100px_rgba(0,0,0,1)] flex flex-col h-[85vh]">
             {/* Header do Dossiê */}
             <div className="p-12 border-b border-white/5 bg-emerald-950/10 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                <div className="flex items-center gap-8 relative z-10">
                   <div className="w-20 h-20 rounded-2xl bg-black border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-2xl">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                   </div>
                   <div>
                      <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">{selectedEvaluation.targetName}</h3>
                      <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3 italic flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Protocolo de Avaliação #{selectedEvaluation.id}
                      </p>
                   </div>
                </div>
                <button onClick={() => setSelectedEvaluation(null)} className="text-slate-700 hover:text-white transition-all relative z-10">
                   <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
             </div>

             {/* Conteúdo do Dossiê */}
             <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                {/* Métricas Rápidas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   {[
                     { label: 'Nota Rádio', val: selectedEvaluation.radioScore, max: 10 },
                     { label: 'Conduta', val: selectedEvaluation.conductScore, max: 10 },
                     { label: 'Procedimento A', val: selectedEvaluation.det1Score, max: 10 },
                     { label: 'Procedimento B', val: selectedEvaluation.det2Score, max: 10 },
                   ].map((m, i) => (
                     <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl text-center">
                        <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-3">{m.label}</p>
                        <div className="text-4xl font-black text-white italic">{m.val}<span className="text-emerald-900 text-sm ml-1">/{m.max}</span></div>
                        <div className="mt-4 h-1 bg-slate-900 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500" style={{ width: `${(m.val/m.max)*100}%` }}></div>
                        </div>
                     </div>
                   ))}
                </div>

                {/* Blocos de Texto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <div className="p-10 bg-black/40 border border-emerald-500/10 rounded-[2.5rem] relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-6 text-emerald-900/10">
                            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                         </div>
                         <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-6 italic">Relatório de Performance Final</h4>
                         <p className="text-sm text-slate-200 leading-[1.8] italic font-mono">"{selectedEvaluation.finalObs}"</p>
                      </div>

                      <div className="p-8 bg-slate-900/20 border border-white/5 rounded-[2rem]">
                         <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 italic">Observações de Campo (Rádio)</h4>
                         <p className="text-xs text-slate-400 leading-relaxed italic">"{selectedEvaluation.radioDescription || 'Sem observações adicionais.'}"</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      {selectedEvaluation.errors && (
                        <div className="p-10 bg-red-600/5 border border-red-600/20 rounded-[2.5rem] animate-pulse">
                           <h4 className="text-xs font-black text-red-500 uppercase tracking-widest mb-6 italic flex items-center gap-3">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                              Inconformidades Detetadas
                           </h4>
                           <p className="text-sm text-red-400 font-black italic font-mono uppercase leading-relaxed">"{selectedEvaluation.errors}"</p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-white/5 p-6 rounded-2xl">
                            <p className="text-[8px] text-slate-500 font-black uppercase mb-2">Avaliador Responsável</p>
                            <p className="text-xs font-black text-white uppercase italic">{selectedEvaluation.evaluator}</p>
                         </div>
                         <div className="bg-white/5 p-6 rounded-2xl">
                            <p className="text-[8px] text-slate-500 font-black uppercase mb-2">Data do Protocolo</p>
                            <p className="text-xs font-black text-white italic">{selectedEvaluation.date}</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Header Estilizado */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Avaliações Sargento</h2>
          <p className="text-emerald-700 text-[11px] font-black uppercase tracking-[0.5em] mt-5 flex items-center gap-4">
             <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_#10b981]"></span>
             Módulo de Progressão de Carreira • GNR S9
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Lado Esquerdo: Formulário Ativo */}
        <div className="lg:col-span-8 space-y-10">
           {/* Visual Stepper Refinado */}
           <div className="grid grid-cols-6 gap-3">
              {stepsInfo.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => s.id <= step + 1 && setStep(s.id)}
                  className={`flex flex-col items-center gap-3 transition-all duration-700 group ${step === s.id ? 'opacity-100' : 'opacity-30 hover:opacity-100'}`}
                >
                   <div className={`w-full h-1.5 rounded-full transition-all duration-700 ${step >= s.id ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-900'}`}></div>
                   <span className={`text-[8px] font-black uppercase tracking-widest hidden md:block ${step === s.id ? 'text-emerald-500' : 'text-slate-600'}`}>{s.label}</span>
                </button>
              ))}
           </div>

           <div className="bg-[#040d0a]/60 border border-emerald-950 p-12 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col min-h-[600px] group transition-all hover:border-emerald-500/20">
              <div className="absolute top-0 right-0 p-10 text-emerald-950 opacity-20 pointer-events-none group-hover:opacity-40 transition-all">
                 <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d={stepsInfo.find(s => s.id === step)?.icon || ''}/>
                 </svg>
              </div>
              
              <div className="flex-1 relative z-10">
                {renderStep()}
              </div>

              {/* Controles de Navegação */}
              <div className="mt-12 flex justify-between pt-10 border-t border-white/5 relative z-10">
                 <button 
                   onClick={() => setStep(prev => Math.max(1, prev - 1))}
                   disabled={step === 1}
                   className={`px-12 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${step === 1 ? 'opacity-0' : 'bg-black/40 text-slate-600 border border-white/5 hover:bg-white/5 hover:text-white'}`}
                 >
                    ← Voltar Secção
                 </button>
                 {step < 6 && (
                   <button 
                     onClick={() => setStep(prev => Math.min(6, prev + 1))}
                     className="px-12 py-5 bg-white text-black rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center gap-3"
                   >
                      Próxima Secção
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                   </button>
                 )}
              </div>
           </div>
        </div>

        {/* Lado Direito: Histórico Lateral Estilizado */}
        <div className="lg:col-span-4 space-y-8">
           <div className="flex items-center justify-between px-6">
              <h3 className="text-xs font-black text-emerald-900 uppercase tracking-[0.4em] flex items-center gap-3 italic">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                 Histórico Recente
              </h3>
           </div>

           <div className="space-y-5 max-h-[750px] overflow-y-auto pr-3 custom-scrollbar">
              {history.length === 0 ? (
                <div className="p-16 border-2 border-dashed border-white/5 rounded-[3rem] text-center opacity-10 italic text-[10px] uppercase font-black">
                   <svg className="w-16 h-16 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                   Sem registos encriptados.
                </div>
              ) : (
                history.map((evalItem) => (
                  <div 
                    key={evalItem.id} 
                    onClick={() => setSelectedEvaluation(evalItem)}
                    className="bg-black/30 border border-white/5 p-8 rounded-[2.5rem] hover:border-emerald-500/30 transition-all group cursor-pointer active:scale-95 shadow-lg flex flex-col"
                  >
                     <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-mono font-black text-emerald-500/40 group-hover:text-emerald-500 transition-colors italic">#{evalItem.id}</span>
                        <span className="text-[9px] text-slate-700 font-bold uppercase font-mono">{evalItem.date}</span>
                     </div>
                     <h4 className="text-xl font-black text-white uppercase italic group-hover:text-emerald-400 transition-all leading-none truncate">{evalItem.targetName}</h4>
                     <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-3 truncate opacity-50">{evalItem.theme}</p>
                     
                     <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
                           <span className="text-[10px] font-black text-white italic uppercase">{evalItem.evaluator}</span>
                        </div>
                        <div className="px-3 py-1 bg-emerald-500/10 rounded-lg text-emerald-500 text-[10px] font-black font-mono">
                           {( (evalItem.radioScore + evalItem.conductScore + evalItem.det1Score + evalItem.det2Score) / 4 ).toFixed(1)}
                        </div>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationsSection;
