
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GNRShift, Officer } from '../types';
import { getLocalGNRShifts, saveGNRShiftLocally, deleteGNRShiftLocally, getLocalOfficers } from '../services/dataService';

interface GNRTimesheetSectionProps {
  currentUser: Officer | null;
  isAdmin: boolean;
}

type ViewMode = 'MY_PONTO' | 'PERSONNEL_MANAGE';

const GNRTimesheetSection: React.FC<GNRTimesheetSectionProps> = ({ currentUser, isAdmin }) => {
  const [shifts, setShifts] = useState<GNRShift[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('MY_PONTO');

  useEffect(() => {
    const load = async () => {
      const [s, o] = await Promise.all([getLocalGNRShifts(), getLocalOfficers()]);
      setShifts(s);
      setOfficers(o);
    };
    load();
  }, []);
  const [selectedOfficerId, setSelectedOfficerId] = useState<string | null>(null);
  const [showGlobalReport, setShowGlobalReport] = useState(false);
  
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState('0h 0m 0s');
  const [currentPauseDisplay, setCurrentPauseDisplay] = useState('0h 0m 0s');
  const timerRef = useRef<number | null>(null);

  // Sincronização periódica do timer ativo
  useEffect(() => {
    const updateTimer = () => {
      if (!currentUser) return;
      const activeShift = shifts.find(s => s.officerId === currentUser.id && s.status !== 'COMPLETED');
      
      if (activeShift) {
        const now = new Date();
        const lastToggle = new Date(activeShift.lastToggleTime);
        const diffSeconds = Math.floor((now.getTime() - lastToggle.getTime()) / 1000);
        
        let totalActive = activeShift.totalActiveSeconds;
        let totalPaused = activeShift.totalPausedSeconds;

        if (activeShift.status === 'RUNNING') {
          totalActive += diffSeconds;
        } else if (activeShift.status === 'PAUSED') {
          totalPaused += diffSeconds;
        }

        const format = (sec: number) => {
          const h = Math.floor(sec / 3600);
          const m = Math.floor((sec % 3600) / 60);
          const s = sec % 60;
          return `${h}h ${m}m ${s}s`;
        };

        setCurrentTimeDisplay(format(totalActive));
        setCurrentPauseDisplay(format(totalPaused));
      } else {
        setCurrentTimeDisplay('0h 0m 0s');
        setCurrentPauseDisplay('0h 0m 0s');
      }
    };

    updateTimer();
    timerRef.current = window.setInterval(updateTimer, 1000);
    return () => { if(timerRef.current) clearInterval(timerRef.current); };
  }, [shifts, currentUser]);

  const handleStart = async () => {
    if (!currentUser) return;
    const now = new Date().toISOString();
    const newShift: GNRShift = {
      id: `GNR-SHIFT-${Date.now()}`,
      officerId: currentUser.id,
      officerName: currentUser.name,
      officerRank: currentUser.rank,
      startTime: now,
      status: 'RUNNING',
      totalActiveSeconds: 0,
      totalPausedSeconds: 0,
      lastToggleTime: now,
      history: [{ action: 'START', time: now }]
    };
    setShifts(await saveGNRShiftLocally(newShift));
  };

  const handlePause = async () => {
    if (!currentUser) return;
    const active = shifts.find(s => s.officerId === currentUser.id && s.status === 'RUNNING');
    if (!active) return;
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(active.lastToggleTime).getTime()) / 1000);
    const updated: GNRShift = {
      ...active,
      status: 'PAUSED',
      totalActiveSeconds: active.totalActiveSeconds + diff,
      lastToggleTime: now.toISOString(),
      history: [...active.history, { action: 'PAUSE', time: now.toISOString() }]
    };
    setShifts(await saveGNRShiftLocally(updated));
  };

  const handleResume = async () => {
    if (!currentUser) return;
    const paused = shifts.find(s => s.officerId === currentUser.id && s.status === 'PAUSED');
    if (!paused) return;
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(paused.lastToggleTime).getTime()) / 1000);
    const updated: GNRShift = {
      ...paused,
      status: 'RUNNING',
      totalPausedSeconds: paused.totalPausedSeconds + diff,
      lastToggleTime: now.toISOString(),
      history: [...paused.history, { action: 'RESUME', time: now.toISOString() }]
    };
    setShifts(await saveGNRShiftLocally(updated));
  };

  const handleEnd = async () => {
    if (!currentUser) return;
    const active = shifts.find(s => s.officerId === currentUser.id && s.status !== 'COMPLETED');
    if (!active) return;
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(active.lastToggleTime).getTime()) / 1000);
    let finalActive = active.totalActiveSeconds;
    let finalPaused = active.totalPausedSeconds;
    if (active.status === 'RUNNING') finalActive += diff;
    else finalPaused += diff;
    const updated: GNRShift = {
      ...active,
      status: 'COMPLETED',
      endTime: now.toISOString(),
      totalActiveSeconds: finalActive,
      totalPausedSeconds: finalPaused,
      history: [...active.history, { action: 'END', time: now.toISOString() }]
    };
    setShifts(await saveGNRShiftLocally(updated));
  };

  const handleDelete = async (id: string) => {
    if (confirm("Remover este registro permanentemente?")) {
      setShifts(await deleteGNRShiftLocally(id));
    }
  };

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString('pt-PT'),
      time: d.toLocaleTimeString('pt-PT')
    };
  };

  const reportData = useMemo(() => {
    const stats: Record<string, { seconds: number, count: number, name: string, rank: string }> = {};
    shifts.filter(s => s.status === 'COMPLETED').forEach(s => {
      if (!stats[s.officerId]) {
        stats[s.officerId] = { seconds: 0, count: 0, name: s.officerName, rank: s.officerRank };
      }
      stats[s.officerId].seconds += s.totalActiveSeconds;
      stats[s.officerId].count += 1;
    });
    return Object.values(stats).sort((a, b) => b.seconds - a.seconds);
  }, [shifts]);

  const activeShift = shifts.find(s => s.officerId === currentUser?.id && s.status !== 'COMPLETED');

  // Filtragem de histórico baseada na visualização
  const historyToDisplay = useMemo(() => {
    if (viewMode === 'MY_PONTO') {
      return shifts.filter(s => s.officerId === currentUser?.id && s.status === 'COMPLETED');
    }
    if (viewMode === 'PERSONNEL_MANAGE' && selectedOfficerId) {
      return shifts.filter(s => s.officerId === selectedOfficerId && s.status === 'COMPLETED');
    }
    return [];
  }, [shifts, viewMode, selectedOfficerId, currentUser]);

  const DiscordEmbed = ({ s }: { s: GNRShift }) => {
    const start = formatDateTime(s.startTime);
    const end = formatDateTime(s.endTime!);
    const hActive = Math.floor(s.totalActiveSeconds / 3600);
    const mActive = Math.floor((s.totalActiveSeconds % 3600) / 60);
    const sActive = s.totalActiveSeconds % 60;
    const hPause = Math.floor(s.totalPausedSeconds / 3600);
    const mPause = Math.floor((s.totalPausedSeconds % 3600) / 60);
    const sPause = s.totalPausedSeconds % 60;
    const totalHoursDecimal = (s.totalActiveSeconds / 3600).toFixed(2);

    return (
      <div className="discord-embed shadow-2xl transition-all hover:scale-[1.01] mb-6">
        <div className="discord-label">
          <span className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[10px]">🔵</span>
          Ponto Finalizado
        </div>
        <div className="text-emerald-400 text-xs font-bold mb-4 flex items-center gap-2">
          <span className="bg-emerald-500 text-white w-4 h-4 rounded flex items-center justify-center text-[8px]">✓</span>
          O ponto foi encerrado com sucesso.
        </div>
        <div className="discord-label">👤 Usuário</div>
        <div className="mb-4">
          <span className="discord-mention">@{s.officerRank.charAt(0)}-{s.id.slice(-2)} | {s.officerName}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="discord-label">📅 Início</div>
            <div className="discord-value font-mono text-sm">{start.date} ⏰ {start.time}</div>
          </div>
          <div>
            <div className="discord-label">📅 Término</div>
            <div className="discord-value font-mono text-sm">{end.date} ⏰ {end.time}</div>
          </div>
        </div>
        <div className="discord-label">⏱️ Tempo Total (ativo)</div>
        <div className="discord-value font-bold text-lg">{hActive}h {mActive}m {sActive}s</div>
        <div className="discord-label">⏸️ Tempo em Pausa</div>
        <div className="discord-value">{hPause}h {mPause}m {sPause}s</div>
        <div className="discord-label">📊 Resumo</div>
        <div className="space-y-1 text-xs text-slate-300 mb-4">
          <p>• <span className="font-bold">Tempo ativo:</span> {hActive}h {mActive}m {sActive}s</p>
          <p>• <span className="font-bold">Tempo em pausa:</span> {hPause}h {mPause}m {sPause}s</p>
          <p>• <span className="font-bold">Horas totais ativas:</span> {totalHoursDecimal}h</p>
          <p>• <span className="font-bold">Período:</span> {start.date} → {end.date}</p>
        </div>
        <div className="discord-label">🔒 Fechado por</div>
        <div className="mb-2">
          <span className="discord-mention">@{s.officerRank.charAt(0)}-{s.id.slice(-2)} | {s.officerName}</span>
        </div>
        <div className="discord-footer">
          Sistema de Pontos • Registro concluído • {end.date} {end.time.slice(0, 5)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <style>{`
        .discord-embed {
          background-color: #2b2d31;
          border-left: 4px solid #3b82f6;
          border-radius: 4px;
          padding: 16px;
          max-width: 520px;
          font-family: 'Inter', sans-serif;
        }
        .discord-mention {
          background-color: #3c4270;
          color: #c9cdfb;
          padding: 0 4px;
          border-radius: 3px;
          font-weight: 500;
          cursor: pointer;
        }
        .discord-mention:hover {
          background-color: #5865f2;
          color: white;
        }
        .discord-label {
          color: #dbdee1;
          font-weight: 800;
          font-size: 0.85rem;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .discord-value {
          color: #f2f3f5;
          font-size: 0.95rem;
          margin-bottom: 12px;
        }
        .discord-footer {
          color: #949ba4;
          font-size: 0.75rem;
          margin-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 12px;
        }
        @media print {
          .no-print { display: none !important; }
          #printable-report, #printable-report * { visibility: visible; }
          #printable-report { 
            position: absolute !important; left: 0 !important; top: 0 !important; 
            width: 100% !important; display: block !important; background: white !important; 
            color: black !important; padding: 40px !important; z-index: 9999;
          }
        }
        #printable-report { display: none; }
      `}</style>

      {/* HEADER E SUB-MENU */}
      <div className="flex flex-col gap-8 border-b border-white/5 pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Folha de Ponto GNR</h2>
            <p className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.4em] mt-4 flex items-center gap-4 italic transition-all">
               <span className="w-2.5 h-2.5 bg-emerald-600 animate-pulse shadow-[0_0_10px_#10b981]"></span>
               Sistema SIGP-S9 • Gestão de Atividade
            </p>
          </div>
          
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 no-print">
             <button 
               onClick={() => setViewMode('MY_PONTO')}
               className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'MY_PONTO' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
               Meu Registo
             </button>
             {isAdmin && (
               <>
                 <button 
                   onClick={() => setViewMode('PERSONNEL_MANAGE')}
                   className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${viewMode === 'PERSONNEL_MANAGE' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                 >
                   Dossiês de Efetivo
                 </button>
                 <button 
                   onClick={() => setShowGlobalReport(true)}
                   className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all text-amber-500 hover:text-white hover:bg-amber-600/20`}
                 >
                   Relatório Comando
                 </button>
               </>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LADO ESQUERDO: CONTROLES OU LISTA DE PESSOAL */}
        <div className="lg:col-span-4 space-y-8 no-print">
           {viewMode === 'MY_PONTO' && (
             <div className="bg-black/40 border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col items-center">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">Relógio Ativo</p>
                <div className="text-center space-y-2 mb-10">
                   <h3 className="text-5xl font-black text-white font-mono italic tracking-tighter">{currentTimeDisplay}</h3>
                   <p className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.3em]">EM SERVIÇO</p>
                </div>
                <div className="text-center space-y-1 mb-10 opacity-40">
                   <h4 className="text-xl font-black text-slate-400 font-mono">{currentPauseDisplay}</h4>
                   <p className="text-[7px] font-black text-slate-500 uppercase tracking-[0.2em]">EM PAUSA</p>
                </div>
                <div className="flex flex-col gap-4 w-full">
                   {!activeShift ? (
                     <button onClick={handleStart} className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
                        INICIAR TURNO
                     </button>
                   ) : (
                     <>
                        <div className="flex gap-4">
                           {activeShift.status === 'RUNNING' ? (
                             <button onClick={handlePause} className="flex-1 py-5 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">PAUSAR</button>
                           ) : (
                             <button onClick={handleResume} className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">RETOMAR</button>
                           )}
                        </div>
                        <button onClick={handleEnd} className="w-full py-6 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-xl">ENCERRAR PONTO</button>
                     </>
                   )}
                </div>
             </div>
           )}

           {viewMode === 'PERSONNEL_MANAGE' && (
             <div className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest italic border-b border-white/5 pb-4">Selecione o Oficial</h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                   {officers.map(off => (
                     <button 
                       key={off.id}
                       onClick={() => setSelectedOfficerId(off.id)}
                       className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all text-left group ${selectedOfficerId === off.id ? 'bg-blue-600 text-white' : 'bg-white/5 hover:bg-white/10 text-slate-400'}`}
                     >
                        <img src={off.avatar} className="w-10 h-10 rounded-xl bg-black/40" alt="" />
                        <div>
                           <p className="text-[10px] font-black uppercase italic leading-none">{off.name}</p>
                           <p className={`text-[8px] font-bold mt-1 ${selectedOfficerId === off.id ? 'text-blue-200' : 'text-slate-600'}`}>{off.rank} • {off.nip}</p>
                        </div>
                     </button>
                   ))}
                </div>
             </div>
           )}
        </div>

        {/* LADO DIREITO: HISTÓRICO */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex items-center justify-between px-6 no-print">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-4 italic">
                {viewMode === 'MY_PONTO' ? 'Meus Registos Arquivados' : 'Dossiê Individual de Atividade'}
              </h3>
           </div>
           
           <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
              {historyToDisplay.map((s) => (
                <div key={s.id} className="relative group">
                   <DiscordEmbed s={s} />
                   {isAdmin && (
                     <button 
                       onClick={() => handleDelete(s.id)}
                       className="absolute -right-4 top-0 p-2 bg-red-900/20 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white"
                     >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                     </button>
                   )}
                </div>
              ))}

              {historyToDisplay.length === 0 && (
                <div className="py-20 text-center opacity-10 italic border-2 border-dashed border-white/5 rounded-[3rem]">
                   <p className="text-xl font-black uppercase tracking-widest">
                      {viewMode === 'PERSONNEL_MANAGE' && !selectedOfficerId ? 'Selecione um guarda na lista lateral' : 'Nenhum registo arquivado'}
                   </p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* MODAL: RELATÓRIO GLOBAL DO COMANDO */}
      {showGlobalReport && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-300 no-print">
           <div className="bg-[#05080c] border border-white/5 w-full max-w-5xl rounded-[4rem] flex flex-col h-[90vh] shadow-2xl relative overflow-hidden">
              
              <div className="p-12 border-b border-white/5 flex justify-between items-center bg-amber-950/10 no-print">
                 <div>
                    <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Relatório Consolidado de Horas</h3>
                    <p className="text-amber-500 text-[9px] font-black uppercase tracking-[0.4em] mt-3 italic">
                       <span className="animate-pulse">●</span> Comando Territorial Diamond • Controlo de Assiduidade
                    </p>
                 </div>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => window.print()}
                      className="px-8 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-xl flex items-center gap-2"
                    >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                       Imprimir Documento
                    </button>
                    <button 
                      onClick={() => setShowGlobalReport(false)}
                      className="p-3 text-slate-700 hover:text-white transition-all"
                    >
                       <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-black/20">
                 {/* Visualização Prévia para UI */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    {reportData.map((data, i) => (
                      <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-2xl flex justify-between items-center group hover:border-amber-500/30 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-black italic">
                               {data.rank.charAt(0)}
                            </div>
                            <div>
                               <p className="text-[8px] text-slate-500 font-black uppercase">{data.rank}</p>
                               <p className="text-sm font-black text-white italic uppercase">{data.name}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-xl font-black text-emerald-500 italic leading-none">{(data.seconds/3600).toFixed(2)}h</p>
                            <p className="text-[7px] text-slate-600 font-bold uppercase mt-1">{data.count} Turnos</p>
                         </div>
                      </div>
                    ))}
                 </div>

                 {/* Documento Estilizado para Impressão */}
                 <div id="printable-report" className="text-black bg-white">
                    <div className="text-center space-y-3 border-b-4 border-black pb-10 mb-10">
                       <h1 className="text-4xl font-black uppercase tracking-tighter">Guarda Nacional Republicana</h1>
                       <h2 className="text-xl font-bold uppercase tracking-tight italic">Relatório de Horas Operacionais • Direção Territorial</h2>
                       <p className="text-[10px] font-mono text-slate-400 mt-6 uppercase">Documento Gerado Automático via SIGP-S9 • {new Date().toLocaleString('pt-PT')}</p>
                    </div>

                    <table className="w-full text-left border-collapse mb-20">
                       <thead>
                          <tr className="border-b-2 border-black bg-slate-50">
                             <th className="py-5 px-4 text-[11px] font-black uppercase tracking-widest">Patente</th>
                             <th className="py-5 px-4 text-[11px] font-black uppercase tracking-widest">Oficial Visado</th>
                             <th className="py-5 px-4 text-[11px] font-black uppercase tracking-widest text-center">Quant. Turnos</th>
                             <th className="py-5 px-4 text-[11px] font-black uppercase tracking-widest text-right">Total Acumulado (Ativo)</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-200">
                          {reportData.map((data, i) => (
                             <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="py-5 px-4 text-[10px] font-bold uppercase italic">{data.rank}</td>
                                <td className="py-5 px-4 text-sm font-black uppercase">{data.name}</td>
                                <td className="py-5 px-4 text-center font-mono font-bold">{data.count}</td>
                                <td className="py-5 px-4 text-right text-lg font-black italic">{(data.seconds/3600).toFixed(2)}h</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>

                    <div className="mt-32 pt-10 border-t border-slate-300 grid grid-cols-2 gap-20">
                       <div className="text-center space-y-4">
                          <div className="h-0.5 bg-black/20 w-full mb-2"></div>
                          <p className="text-[10px] font-black uppercase tracking-widest">Responsável Recursos Humanos</p>
                          <p className="font-signature text-3xl opacity-20">DRH Diamond</p>
                       </div>
                       <div className="text-center space-y-4">
                          <div className="h-0.5 bg-black/20 w-full mb-2"></div>
                          <p className="text-[10px] font-black uppercase tracking-widest">Comandante-Geral Diamond</p>
                          <p className="font-signature text-3xl opacity-20">Smurf Oliveira</p>
                       </div>
                    </div>

                    <div className="absolute bottom-10 left-0 w-full px-20 flex justify-between items-end opacity-20 text-[7px] font-black uppercase font-mono">
                       <p>GNR_MDT_REPORT_SIGP_V9.5</p>
                       <p>Hash_Auth: {btoa(Date.now().toString()).slice(0, 16).toUpperCase()}</p>
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-black border-t border-white/5 flex justify-between items-center text-[8px] font-black text-slate-700 uppercase tracking-widest italic no-print">
                 <p>SISTEMA DE GESTÃO DE EFETIVO S9 • ACESSO RESTRITO COMANDO</p>
                 <p>Documento de Auditoria e Progressão de Carreira</p>
              </div>
           </div>
        </div>
      )}

      <div className="bg-emerald-950/10 border border-emerald-500/10 p-10 rounded-[3rem] text-center no-print">
         <p className="text-emerald-800 text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">Protocolo de Registro Unificado SIGP</p>
         <p className="text-xs text-slate-500 italic leading-relaxed max-w-3xl mx-auto uppercase">
            O tempo de patrulha é o principal fator de <span className="text-white font-bold underline">progressão na carreira</span>. O Comando monitoriza este registo para auditoria de produtividade e atribuição de méritos.
         </p>
      </div>
    </div>
  );
};

export default GNRTimesheetSection;
