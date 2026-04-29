
import React, { useState, useEffect } from 'react';
import { HRNote, Officer } from '../types';
import { getLocalHRNotes, saveHRNoteLocally, deleteHRNoteLocally, getLocalOfficers } from '../services/dataService';

const HRSection: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const [activeSubTab, setActiveSubTab] = useState<'diretrizes' | 'procedimentos' | 'financas' | 'anotacoes' | 'relatorios'>('relatorios');
  const [notes, setNotes] = useState<HRNote[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newNote, setNewNote] = useState({ content: '', category: 'GERAL' as HRNote['category'] });
  
  // States para Relatórios
  const [reportData, setReportData] = useState<any[]>([]);
  const [selectedReportMember, setSelectedReportMember] = useState<any | null>(null);
  const [dateRange, setDateRange] = useState({ 
    start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0], 
    end: new Date().toISOString().split('T')[0] 
  });
  const [loadingReport, setLoadingReport] = useState(false);

  useEffect(() => {
    setNotes(getLocalHRNotes());
    getLocalOfficers().then(setOfficers);
  }, []);

  const fetchHRReport = async () => {
    try {
      setLoadingReport(true);
      const apiHost = window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname;
      const response = await fetch(`http://${apiHost}:3002/api/reports/hr?start=${dateRange.start}&end=${dateRange.end}`);
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      }
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
    } finally {
      setLoadingReport(false);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    const note: HRNote = {
      id: `NOTE-${Date.now()}`,
      author: 'Oficial em Serviço',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=officer',
      content: newNote.content,
      category: newNote.category,
      timestamp: new Date().toLocaleString('pt-PT')
    };
    const updated = saveHRNoteLocally(note);
    setNotes(updated);
    setNewNote({ content: '', category: 'GERAL' });
    setShowNoteForm(false);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm("REMOVER ESTA ANOTAÇÃO DO ARQUIVO?")) {
      const updated = deleteHRNoteLocally(id);
      setNotes(updated);
    }
  };

  const functions = [
    { id: 1, title: 'Formalização de Despedimentos', channel: '🧾┃despedimentos', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 2, title: 'Verificação Diária de Folhas de Ponto', channel: '🕒┃folhas-ponto', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 3, title: 'Atendimento Rápido via Tickets', channel: '🎫┃tickets', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' }
  ];

  const folhaPontoTemplate = `📋 FOLHA DE PONTO
Todos os guardas da GNR são designados de «colaborador» da instituição.

Para efetuar a picagem do ponto:
/ponto

📌 Não se esqueça de que a folha de ponto possui um «tempo útil» de 7 dias até ser «arquivada»!`;

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* HEADER */}
      <div className="border-b border-white/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div>
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Recursos Humanos</h2>
          <p className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.4em] mt-5 flex items-center gap-4 italic transition-all">
             <span className="w-2.5 h-2.5 bg-emerald-600 animate-pulse shadow-[0_0_10px_#10b981]"></span>
             D.R.H. • GESTÃO DE EFETIVO E CARREIRA
          </p>
        </div>
        
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 gap-2 overflow-x-auto">
           <button onClick={() => setActiveSubTab('diretrizes')} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${activeSubTab === 'diretrizes' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-white'}`}>Diretrizes</button>
           <button onClick={() => setActiveSubTab('procedimentos')} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${activeSubTab === 'procedimentos' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-white'}`}>Procedimentos</button>
           <button onClick={() => setActiveSubTab('relatorios')} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${activeSubTab === 'relatorios' ? 'bg-amber-600 text-black' : 'text-slate-500 hover:text-white'}`}>Relatórios</button>
           <button onClick={() => setActiveSubTab('anotacoes')} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${activeSubTab === 'anotacoes' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}>Anotações</button>
           <button onClick={() => setActiveSubTab('financas')} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${activeSubTab === 'financas' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-white'}`}>Finanças</button>
        </div>
      </div>

      {activeSubTab === 'relatorios' && (
        <div className="space-y-10 animate-in fade-in duration-700">
           {/* CONTROL PANEL */}
           <div className="bg-black/40 border border-white/5 p-10 rounded-[3rem] flex flex-col lg:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                 <svg className="w-48 h-48 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"/></svg>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:w-auto relative z-10">
                 <div className="space-y-2 w-full md:w-auto">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Início do Período</label>
                    <input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-6 py-4 text-[10px] font-black text-white outline-none focus:border-amber-500 transition-all uppercase" />
                 </div>
                 <div className="hidden md:block pt-6 text-amber-500/20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                 </div>
                 <div className="space-y-2 w-full md:w-auto">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Fim do Período</label>
                    <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-6 py-4 text-[10px] font-black text-white outline-none focus:border-amber-500 transition-all uppercase" />
                 </div>
              </div>

              <div className="flex gap-4 w-full lg:w-auto relative z-10">
                <button 
                  onClick={fetchHRReport}
                  disabled={loadingReport}
                  className="flex-1 lg:flex-none px-12 py-5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-black font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  {loadingReport ? (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  )}
                  Puxar Relatório
                </button>
              </div>
           </div>

           {/* STATS OVERVIEW */}
           {reportData.length > 0 && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in zoom-in-95 duration-500">
                <div className="bg-emerald-950/10 border border-emerald-500/10 p-8 rounded-[2.5rem]">
                   <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2 italic">Total de Horas Unidade</p>
                   <h3 className="text-4xl font-black text-white italic tracking-tighter">
                      {reportData.reduce((acc, curr) => acc + parseFloat(curr.totalHours), 0).toFixed(1)}H
                   </h3>
                </div>
                <div className="bg-blue-950/10 border border-blue-500/10 p-8 rounded-[2.5rem]">
                   <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-2 italic">Total de Patrulhas</p>
                   <h3 className="text-4xl font-black text-white italic tracking-tighter">
                      {reportData.reduce((acc, curr) => acc + (curr.patrolCount || 0), 0)} CPs
                   </h3>
                </div>
                <div className="bg-amber-950/10 border border-amber-500/10 p-8 rounded-[2.5rem]">
                   <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-2 italic">Militares Ativos</p>
                   <h3 className="text-4xl font-black text-white italic tracking-tighter">{reportData.length}</h3>
                </div>
             </div>
           )}

           {/* MAIN CONTENT AREA: TABLE OR EMBED VIEW */}
           <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
              {/* LISTA DE MILITARES */}
              <div className={`${selectedReportMember ? 'xl:col-span-4' : 'xl:col-span-12'} bg-black/40 border border-white/5 rounded-[3.5rem] overflow-hidden shadow-2xl transition-all duration-500`}>
                 <div className="p-8 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-sm font-black text-white uppercase italic tracking-widest">Registos Processados</h3>
                 </div>
                 <div className="overflow-y-auto max-h-[600px] custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                       <thead className="sticky top-0 bg-[#05080c] z-10">
                          <tr className="bg-white/[0.02]">
                             <th className="px-8 py-5 text-[8px] font-black text-slate-500 uppercase tracking-widest">Militar</th>
                             {!selectedReportMember && (
                                <>
                                   <th className="px-8 py-5 text-[8px] font-black text-slate-500 uppercase tracking-widest text-center">Horas</th>
                                   <th className="px-8 py-5 text-[8px] font-black text-slate-500 uppercase tracking-widest text-center">Patrulhas</th>
                                </>
                             )}
                             <th className="px-8 py-5 text-[8px] font-black text-slate-500 uppercase tracking-widest text-right">Ação</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {reportData.map((row, i) => (
                             <tr key={i} className={`hover:bg-amber-500/5 transition-colors cursor-pointer group ${selectedReportMember?.userId === row.userId ? 'bg-amber-500/10' : ''}`} onClick={() => setSelectedReportMember(row)}>
                                <td className="px-8 py-5">
                                   <div className="flex items-center gap-4">
                                      <div className="w-8 h-8 rounded-lg bg-black border border-white/10 flex items-center justify-center text-[9px] font-black text-amber-500 uppercase italic shrink-0">
                                         {row.name[0]}
                                      </div>
                                      <div className="min-w-0">
                                         <p className="text-[11px] font-black text-white italic uppercase truncate">{row.name}</p>
                                         <p className="text-[8px] text-slate-500 font-bold uppercase truncate">{row.rank}</p>
                                      </div>
                                   </div>
                                </td>
                                {!selectedReportMember && (
                                   <>
                                      <td className="px-8 py-5 text-center">
                                         <span className="text-xs font-black text-emerald-500 font-mono">{row.totalHours}H</span>
                                      </td>
                                      <td className="px-8 py-5 text-center">
                                         <span className="text-xs font-black text-blue-500 font-mono">{row.patrolCount || 0}</span>
                                      </td>
                                   </>
                                )}
                                <td className="px-8 py-5 text-right">
                                   <button className="p-2 bg-white/5 rounded-lg group-hover:bg-amber-600 group-hover:text-black transition-all">
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                                   </button>
                                </td>
                             </tr>
                          ))}
                          {reportData.length === 0 && (
                             <tr>
                                <td colSpan={5} className="px-10 py-32 text-center opacity-10 italic uppercase tracking-widest">Aguardando definição de período...</td>
                             </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>

              {/* EMBED VIEW (ESTILO DISCORD) */}
              {selectedReportMember && (
                 <div className="xl:col-span-8 animate-in slide-in-from-right-8 duration-500">
                    <div className="bg-[#0c0d11] border border-white/5 rounded-[3.5rem] p-12 space-y-10 shadow-2xl relative overflow-hidden">
                       {/* Discord-like Color Bar */}
                       <div className="absolute left-0 top-12 bottom-12 w-1.5 bg-amber-500 rounded-r-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
                       
                       <div className="flex justify-between items-start pl-6">
                          <div className="flex items-center gap-6">
                             <div className="w-24 h-24 rounded-3xl bg-black/40 border border-white/10 p-1">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedReportMember.name}`} className="w-full h-full object-cover rounded-2xl" alt="" />
                             </div>
                             <div>
                                <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">{selectedReportMember.name}</h3>
                                <div className="flex items-center gap-3">
                                   <span className="px-3 py-1 bg-amber-500 text-black text-[9px] font-black rounded-lg uppercase tracking-widest">{selectedReportMember.rank}</span>
                                   <span className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">ID: {selectedReportMember.userId}</span>
                                </div>
                             </div>
                          </div>
                          <button onClick={() => setSelectedReportMember(null)} className="text-slate-600 hover:text-white transition-colors">
                             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
                          </button>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-6">
                          {/* Horas de Serviço */}
                          <div className="bg-black/40 p-8 rounded-[2.5rem] border border-white/5 space-y-4">
                             <div className="flex items-center gap-3 text-emerald-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">Tempo de Serviço</p>
                             </div>
                             <h4 className="text-5xl font-black text-white italic tracking-tighter leading-none">
                                {selectedReportMember.totalHours}<span className="text-xl text-slate-600 ml-2">Horas</span>
                             </h4>
                             <p className="text-[10px] text-slate-500 italic uppercase">Período Selecionado</p>
                          </div>

                          {/* Patrulhas */}
                          <div className="bg-black/40 p-8 rounded-[2.5rem] border border-white/5 space-y-4">
                             <div className="flex items-center gap-3 text-blue-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1"/></svg>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">Patrulhamento (CP)</p>
                             </div>
                             <h4 className="text-5xl font-black text-white italic tracking-tighter leading-none">
                                {selectedReportMember.patrolCount || 0}<span className="text-xl text-slate-600 ml-2">Missões</span>
                             </h4>
                             <p className="text-[10px] text-slate-500 italic uppercase">Engajamentos em Campo</p>
                          </div>
                       </div>

                       {/* Análise de Produtividade */}
                       <div className="pl-6 space-y-6">
                          <div className="flex items-center gap-6">
                             <h4 className="text-xs font-black text-white uppercase italic tracking-[0.3em] shrink-0">Análise de Performance</h4>
                             <div className="h-px w-full bg-white/5"></div>
                          </div>
                          <div className="bg-white/[0.02] p-8 rounded-[2.5rem] border border-white/5">
                             <div className="flex justify-between items-center mb-6">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Produtividade Semanal</span>
                                <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase italic ${parseFloat(selectedReportMember.totalHours) > 10 ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                                   {parseFloat(selectedReportMember.totalHours) > 10 ? 'EXCELENTE' : 'ABAIXO DA META'}
                                </span>
                             </div>
                             <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${Math.min((parseFloat(selectedReportMember.totalHours) / 20) * 100, 100)}%` }}></div>
                             </div>
                             <div className="flex justify-between mt-4">
                                <p className="text-[9px] text-slate-600 font-bold uppercase italic">Meta: 10H / Semana</p>
                                <p className="text-[9px] text-white font-black italic uppercase">Progresso: {Math.round(Math.min((parseFloat(selectedReportMember.totalHours) / 20) * 100, 100))}%</p>
                             </div>
                          </div>
                       </div>

                       <div className="pl-6 pt-10 border-t border-white/5 flex justify-between items-center">
                          <p className="text-[8px] text-slate-700 font-black uppercase tracking-widest italic leading-relaxed">
                             Relatório Gerado via SIGP-S9 Intelligence Service<br/>
                             © Guarda Nacional Republicana • Diamond S9
                          </p>
                          <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-3">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2-2H9a2 2 0 00-2 2v4"/></svg>
                             Imprimir PDF
                          </button>
                       </div>
                    </div>
                 </div>
              )}
           </div>
        </div>
      )}

      {activeSubTab === 'diretrizes' && (
        <div className="space-y-12 animate-in slide-in-from-left-4 duration-500">
          {/* PAINEL DE GOVERNANÇA */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-[#050c09] border border-emerald-900/20 p-10 rounded-[3rem] space-y-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
               </div>
               <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  Funcionamento
               </h3>
               <p className="text-sm text-slate-300 italic leading-relaxed">
                 Coordenação da equipa da responsabilidade de um elemento do <span className="text-white font-bold underline">Comando-Geral</span>.
               </p>
            </div>

            <div className="lg:col-span-2 bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-8">
               <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3 border-b border-white/5 pb-4">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  Responsabilidades Diretas
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { t: 'Folhas de Ponto', d: 'Análise constante da atividade diária de cada agente em serviço.' },
                    { t: 'Despedimentos', d: 'Oficialização de saídas, limpeza de cofres e emissão de documentação.' },
                    { t: 'Gestão de Tickets', d: 'Atendimento primário a guardas e civis, salvo reencaminhamentos.' }
                  ].map((res, i) => (
                    <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-emerald-500/20 transition-all">
                       <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3 italic">{res.t}</p>
                       <p className="text-xs text-slate-400 italic leading-relaxed">{res.d}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* MATRIZ DE FUNÇÕES */}
          <div className="space-y-8">
             <div className="flex items-center gap-6">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter shrink-0">Matriz de Operações DRH</h3>
                <div className="h-px w-full bg-gradient-to-r from-emerald-500/20 to-transparent"></div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {functions.map((f) => (
                  <div key={f.id} className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] hover:border-emerald-500/30 transition-all group flex flex-col justify-between h-64">
                     <div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={f.icon}/></svg>
                        </div>
                        <h4 className="text-sm font-black text-white uppercase italic tracking-tighter leading-tight">{f.title}</h4>
                     </div>
                     <div className="pt-6 border-t border-white/5">
                        <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Local de Protocolo</p>
                        <p className="text-[9px] text-emerald-600 font-mono font-bold italic">{f.channel}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {activeSubTab === 'procedimentos' && (
        <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
           <div className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-8">
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                 <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                 </div>
                 Gestão de Folhas de Ponto
              </h3>
              <div className="bg-[#05060d] border border-indigo-500/20 p-8 rounded-[2rem] font-mono text-[10px] text-slate-400 space-y-4 leading-relaxed relative overflow-hidden h-[300px] overflow-y-auto custom-scrollbar">
                 <pre className="whitespace-pre-wrap italic">
{folhaPontoTemplate}
                 </pre>
              </div>
           </div>
        </div>
      )}

      {activeSubTab === 'anotacoes' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </div>
                <div>
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Terminal de Anotações</h3>
                   <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest italic">Registos Internos e Observações de Conduta</p>
                </div>
             </div>
             <button 
               onClick={() => setShowNoteForm(!showNoteForm)}
               className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-2"
             >
               {showNoteForm ? 'CANCELAR' : 'NOVA ANOTAÇÃO'}
             </button>
          </div>

          {showNoteForm && (
            <form onSubmit={handleAddNote} className="bg-[#05080c] border border-blue-900/20 p-8 rounded-[2.5rem] space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
               <textarea 
                 required
                 value={newNote.content}
                 onChange={e => setNewNote({...newNote, content: e.target.value})}
                 className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-sm text-slate-300 outline-none focus:border-blue-500 h-32 resize-none italic"
                 placeholder="Escreva aqui a observação ou nota interna..."
               />
               <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all">Protocolar Nota</button>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map(note => (
              <div key={note.id} className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] flex flex-col group hover:border-blue-500/20 transition-all relative overflow-hidden shadow-xl">
                 <div className="flex justify-between items-start mb-6">
                    <span className="px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest bg-slate-500/10 text-slate-500">{note.category}</span>
                    <span className="text-[8px] font-mono text-slate-700">{note.timestamp}</span>
                 </div>
                 <p className="text-xs text-slate-300 italic leading-relaxed whitespace-pre-wrap">"{note.content}"</p>
                 <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[9px] font-black text-white uppercase italic">{note.author}</span>
                    {isAdmin && (
                      <button onClick={() => handleDeleteNote(note.id)} className="text-slate-800 hover:text-red-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    )}
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER DRH */}
      <div className="bg-emerald-950/10 border border-emerald-500/10 p-10 rounded-[3rem] text-center">
         <p className="text-[10px] text-emerald-800 font-black uppercase tracking-[0.4em] mb-4 italic">Cláusula de Ética DRH</p>
         <p className="text-xs text-slate-500 italic leading-relaxed max-w-3xl mx-auto uppercase">
            Os membros do DRH são a face da <span className="text-white font-bold underline">Justiça Interna</span>. Qualquer favorecimento resultará em expulsão imediata.
         </p>
      </div>
    </div>
  );
};

export default HRSection;