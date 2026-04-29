
import React, { useState, useEffect, useRef } from 'react';
import { PatrolCar, PatrolMember, Officer } from '../types';
import { getLocalCPs, saveCPLocally, deleteCPLocally } from '../services/dataService';

interface CPRegistrySectionProps {
  currentUser: Officer | null;
  officers: Officer[];
  isAdmin: boolean;
}

const CPRegistrySection: React.FC<CPRegistrySectionProps> = ({ currentUser, officers, isAdmin }) => {
  const [cps, setCps] = useState<PatrolCar[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getLocalCPs();
      setCps(data);
    };
    load();
  }, []);

  const [showOpenForm, setShowOpenForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState<PatrolCar | null>(null);
  const [showAddMember, setShowAddMember] = useState<string | null>(null); // CP ID
  const [showReport, setShowReport] = useState(false);
  
  const [newCPData, setNewCPData] = useState({
    number: '',
    commander: ''
  });

  const [editCPData, setEditCPData] = useState({
    number: '',
    commander: ''
  });

  const [selectedOfficerId, setSelectedOfficerId] = useState('');

  const handleOpenCP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCPData.number || !newCPData.commander) return;

    const commander = officers.find(o => o.id === newCPData.commander) || currentUser;
    
    const newCP: PatrolCar = {
      id: `CP-ID-${Date.now()}`,
      cpNumber: newCPData.number,
      commanderName: commander?.name || 'DESCONHECIDO',
      status: 'OPEN',
      startTime: new Date().toLocaleString('pt-PT'),
      members: [
        {
          id: commander?.id || 'id',
          name: commander?.name || 'NOME',
          rank: commander?.rank || 'PATENTE',
          entryTime: new Date().toLocaleTimeString('pt-PT'),
          status: 'ACTIVE'
        }
      ]
    };

    setCps(await saveCPLocally(newCP));
    setShowOpenForm(false);
    setNewCPData({ number: '', commander: '' });
  };

  const handleEditCP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showEditForm) return;

    const commander = officers.find(o => o.id === editCPData.commander);

    const updated: PatrolCar = {
      ...showEditForm,
      cpNumber: editCPData.number,
      commanderName: commander ? commander.name : showEditForm.commanderName
    };

    setCps(await saveCPLocally(updated));
    setShowEditForm(null);
    alert("REGISTO DE CP ATUALIZADO PELO COMANDO.");
  };

  const handleCloseCP = async (id: string) => {
    const cp = cps.find(x => x.id === id);
    if (!cp) return;

    const updated: PatrolCar = {
      ...cp,
      status: 'CLOSED',
      endTime: new Date().toLocaleString('pt-PT'),
      members: cp.members.map(m => m.status === 'ACTIVE' ? { ...m, exitTime: new Date().toLocaleTimeString('pt-PT'), status: 'REMOVED' } : m)
    };

    setCps(await saveCPLocally(updated));
    alert("CARRO PATRULHA ENCERRADO COM SUCESSO.");
  };

  const handleCancelCP = async (id: string) => {
    if (confirm("Deseja cancelar esta patrulha? O registo será removido.")) {
      setCps(await deleteCPLocally(id));
    }
  };

  const handleAddMember = async (cpId: string) => {
    const officer = officers.find(o => o.id === selectedOfficerId);
    const cp = cps.find(x => x.id === cpId);
    
    if (!officer || !cp) return;
    if (cp.members.some(m => m.id === officer.id && m.status === 'ACTIVE')) {
      alert("Oficial já se encontra ativo nesta patrulha.");
      return;
    }

    const newMember: PatrolMember = {
      id: officer.id,
      name: officer.name,
      rank: officer.rank,
      entryTime: new Date().toLocaleTimeString('pt-PT'),
      status: 'ACTIVE'
    };

    const updated: PatrolCar = {
      ...cp,
      members: [...cp.members, newMember]
    };

    setCps(await saveCPLocally(updated));
    setShowAddMember(null);
    setSelectedOfficerId('');
  };

  const handleRemoveMember = async (cpId: string, memberId: string) => {
    const cp = cps.find(x => x.id === cpId);
    if (!cp) return;

    const updated: PatrolCar = {
      ...cp,
      members: cp.members.map(m => (m.id === memberId && m.status === 'ACTIVE') ? { ...m, exitTime: new Date().toLocaleTimeString('pt-PT'), status: 'REMOVED' } : m)
    };

    setCps(await saveCPLocally(updated));
  };

  // --- LÓGICA DE CÁLCULO DE HORAS PARA O RELATÓRIO ---
  
  const parseTimeToSeconds = (timeStr: string) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(':');
    if (parts.length < 2) return 0;
    const h = parseInt(parts[0]);
    const m = parseInt(parts[1]);
    const s = parts[2] ? parseInt(parts[2]) : 0;
    return (h * 3600) + (m * 60) + s;
  };

  const calculateMemberDuration = (m: PatrolMember) => {
    if (!m.exitTime) return 0;
    let entry = parseTimeToSeconds(m.entryTime);
    let exit = parseTimeToSeconds(m.exitTime);
    
    // Se a saída for menor que a entrada, assumimos que passou da meia-noite
    if (exit < entry) {
      exit += (24 * 3600);
    }
    return exit - entry;
  };

  const formatSecondsToDuration = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const aggregateHoursByOfficer = () => {
    const stats: Record<string, { seconds: number, count: number, rank: string }> = {};

    cps.forEach(cp => {
      cp.members.forEach(m => {
        if (m.exitTime) {
          const duration = calculateMemberDuration(m);
          if (!stats[m.name]) {
            stats[m.name] = { seconds: 0, count: 0, rank: m.rank };
          }
          stats[m.name].seconds += duration;
          stats[m.name].count += 1;
        }
      });
    });

    return Object.entries(stats).sort((a, b) => b[1].seconds - a[1].seconds);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #report-print, #report-print * { visibility: visible; }
          #report-print { 
            position: absolute; left: 0; top: 0; width: 100%; display: block !important; 
            background: white !important; color: black !important; padding: 40px !important;
          }
          .no-print { display: none !important; }
        }
        #report-print { display: none; }
      `}</style>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Registo de Patrulhas</h2>
          <p className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.4em] mt-4 flex items-center gap-4 italic transition-all">
             <span className="w-2.5 h-2.5 bg-emerald-600 animate-pulse shadow-[0_0_10px_#10b981]"></span>
             Gestão de Unidades CP • Em Tempo Real
          </p>
        </div>
        
        <div className="flex gap-4 no-print">
          {isAdmin && (
            <button 
              onClick={() => setShowReport(true)}
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Gerar Relatório de Horas
            </button>
          )}
          <button 
            onClick={() => setShowOpenForm(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-3 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
            ABRIR NOVO CP
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {cps.map((cp) => (
          <div key={cp.id} className={`bg-[#1c1c1c] border-l-4 rounded-r-lg overflow-hidden flex flex-col shadow-2xl transition-all hover:scale-[1.02] relative group ${cp.status === 'CLOSED' ? 'border-emerald-500 opacity-60' : 'border-blue-500'}`}>
            {isAdmin && (
              <div className="absolute top-4 right-4 flex gap-2 no-print opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => {
                    setEditCPData({ number: cp.cpNumber, commander: officers.find(o => o.name === cp.commanderName)?.id || '' });
                    setShowEditForm(cp);
                  }}
                  className="bg-blue-600/20 text-blue-500 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button 
                  onClick={() => handleCancelCP(cp.id)}
                  className="bg-red-600/20 text-red-500 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            )}

            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                 <h3 className="text-xl font-black text-white flex items-center gap-2">
                   <span>CP-{cp.cpNumber}</span>
                 </h3>
                 <div className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${cp.status === 'OPEN' ? 'bg-blue-500/10 text-blue-500 animate-pulse' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {cp.status === 'OPEN' ? 'EM PATRULHA' : 'CONCLUÍDO'}
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                    <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Comandante de Unidade</p>
                    <p className="text-sm font-black text-white uppercase italic">{cp.commanderName}</p>
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-[8px] font-black text-slate-500 uppercase tracking-widest px-1">
                       <span>Efetivo a Bordo</span>
                       <span>{cp.members.filter(m => m.status === 'ACTIVE').length} Agentes</span>
                    </div>
                    <div className="space-y-2">
                       {cp.members.map((member) => (
                         <div key={member.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl group/member">
                            <div className="flex items-center gap-3">
                               <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`}></div>
                               <div>
                                  <p className="text-[10px] font-black text-white uppercase italic">{member.name}</p>
                                  <p className="text-[7px] text-slate-500 font-bold uppercase">{member.rank}</p>
                               </div>
                            </div>
                            <div className="text-right flex items-center gap-3">
                               <div>
                                  <p className="text-[7px] text-slate-500 font-black uppercase">Entrada</p>
                                  <p className="text-[8px] font-mono text-slate-400">{member.entryTime}</p>
                               </div>
                               {cp.status === 'OPEN' && member.status === 'ACTIVE' && cp.members.filter(m => m.status === 'ACTIVE').length > 1 && (
                                 <button 
                                   onClick={() => handleRemoveMember(cp.id, member.id)}
                                   className="text-red-900 hover:text-red-500 opacity-0 group-hover/member:opacity-100 transition-opacity"
                                 >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                                 </button>
                               )}
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                 <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase">
                    <span>Início: {cp.startTime}</span>
                    {cp.endTime && <span>Término: {cp.endTime}</span>}
                 </div>
                 
                 {cp.status === 'OPEN' && (
                   <div className="grid grid-cols-2 gap-3 no-print">
                      <button 
                        onClick={() => setShowAddMember(cp.id)}
                        className="bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 transition-all flex items-center justify-center gap-2"
                      >
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                         Add Agente
                      </button>
                      <button 
                        onClick={() => handleCloseCP(cp.id)}
                        className="bg-red-900/20 hover:bg-red-600 text-red-500 hover:text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border border-red-900/30 transition-all"
                      >
                         Fechar CP
                      </button>
                   </div>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showOpenForm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in zoom-in-95 duration-300 no-print">
          <div className="bg-[#1c1c1c] border border-emerald-500/20 w-full max-w-lg rounded-[3rem] p-10 relative shadow-2xl">
             <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-8 border-b border-white/5 pb-4">Abertura de Unidade</h3>
             <form onSubmit={handleOpenCP} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Número do Carro-Patrulha</label>
                   <input required value={newCPData.number} onChange={e => setNewCPData({...newCPData, number: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-black text-white focus:border-emerald-500 outline-none uppercase" placeholder="EX: 8220" />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Comandante de Unidade</label>
                   <select required value={newCPData.commander} onChange={e => setNewCPData({...newCPData, commander: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-black text-white focus:border-emerald-500 outline-none">
                      <option value="">SELECIONAR OFICIAL...</option>
                      {officers.map(o => <option key={o.id} value={o.id}>{o.rank} {o.name}</option>)}
                   </select>
                </div>
                <div className="flex gap-4 pt-4">
                   <button type="button" onClick={() => setShowOpenForm(false)} className="flex-1 py-4 bg-white/5 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-white transition-all">Cancelar</button>
                   <button type="submit" className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl transition-all">Ativar Unidade</button>
                </div>
             </form>
          </div>
        </div>
      )}

      {showAddMember && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in zoom-in-95 duration-300 no-print">
          <div className="bg-[#1c1c1c] border border-blue-500/20 w-full max-w-md rounded-[3rem] p-10 relative shadow-2xl">
             <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-8">Reforço de Unidade</h3>
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Selecionar Oficial para Reforço</label>
                   <select value={selectedOfficerId} onChange={e => setSelectedOfficerId(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-black text-white focus:border-blue-500 outline-none">
                      <option value="">SELECIONAR OFICIAL...</option>
                      {officers.map(o => <option key={o.id} value={o.id}>{o.rank} {o.name}</option>)}
                   </select>
                </div>
                <div className="flex gap-4 pt-4">
                   <button type="button" onClick={() => setShowAddMember(null)} className="flex-1 py-4 bg-white/5 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-white transition-all">Cancelar</button>
                   <button onClick={() => handleAddMember(showAddMember)} className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl transition-all">Confirmar Reforço</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {showReport && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-300 no-print">
          <div className="bg-[#05080c] border border-white/5 w-full max-w-5xl rounded-[4rem] flex flex-col h-[90vh] shadow-2xl relative">
             <div className="p-12 border-b border-white/5 flex justify-between items-center bg-emerald-950/10">
                <div>
                  <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Relatório Consolidado de Horas</h3>
                  <p className="text-emerald-500 text-[9px] font-black uppercase tracking-[0.4em] mt-2 italic">Controle de Patrulhamento Diamond Territory</p>
                </div>
                <div className="flex gap-4">
                   <button onClick={() => window.print()} className="px-10 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-xl">Imprimir</button>
                   <button onClick={() => setShowReport(false)} className="p-3 text-slate-700 hover:text-white transition-all"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg></button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                <div id="report-print" className="text-black bg-white p-10">
                   <div className="text-center mb-12 border-b-2 border-black pb-8">
                      <h1 className="text-3xl font-black uppercase">Guarda Nacional Republicana</h1>
                      <p className="text-sm font-bold uppercase mt-2">Comando Territorial de Diamond • DRH</p>
                   </div>
                   
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="border-b-2 border-black">
                            <th className="py-4 text-[10px] font-black uppercase">Patente</th>
                            <th className="py-4 text-[10px] font-black uppercase">Oficial</th>
                            <th className="py-4 text-[10px] font-black uppercase">Patrulhas</th>
                            <th className="py-4 text-[10px] font-black uppercase text-right">Tempo Total</th>
                         </tr>
                      </thead>
                      <tbody>
                         {aggregateHoursByOfficer().map(([name, stats]) => (
                           <tr key={name} className="border-b border-slate-200">
                              <td className="py-4 text-[10px] font-bold uppercase">{stats.rank}</td>
                              <td className="py-4 text-[10px] font-bold uppercase">{name}</td>
                              <td className="py-4 text-[10px]">{stats.count}</td>
                              <td className="py-4 text-[10px] text-right font-black">{formatSecondsToDuration(stats.seconds)}</td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {aggregateHoursByOfficer().map(([name, stats]) => (
                     <div key={name} className="bg-black/40 border border-white/5 p-6 rounded-2xl flex justify-between items-center group">
                        <div>
                           <p className="text-[8px] text-emerald-500 font-black uppercase mb-1">{stats.rank}</p>
                           <p className="text-sm font-black text-white italic uppercase">{name}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-xl font-black text-emerald-500 italic leading-none">{formatSecondsToDuration(stats.seconds)}</p>
                           <p className="text-[7px] text-slate-500 font-bold uppercase mt-1">{stats.count} Patrulhas</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      )}
      
      {showEditForm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-in zoom-in-95 duration-300 no-print">
          <div className="bg-[#1c1c1c] border border-blue-500/20 w-full max-w-lg rounded-[3rem] p-10 relative shadow-2xl">
             <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-8 border-b border-white/5 pb-4">Retificar CP Operacional</h3>
             <form onSubmit={handleEditCP} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Número do Carro-Patrulha</label>
                   <input required value={editCPData.number} onChange={e => setEditCPData({...editCPData, number: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-black text-white focus:border-blue-500 outline-none uppercase" />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Redefinir Comandante</label>
                   <select required value={editCPData.commander} onChange={e => setEditCPData({...editCPData, commander: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-black text-white focus:border-blue-500 outline-none">
                      <option value="">MANTER ATUAL...</option>
                      {officers.map(o => <option key={o.id} value={o.id}>{o.rank} {o.name}</option>)}
                   </select>
                </div>
                <div className="flex gap-4 pt-4">
                   <button type="button" onClick={() => setShowEditForm(null)} className="flex-1 py-4 bg-white/5 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-white transition-all">Cancelar</button>
                   <button type="submit" className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl transition-all">Atualizar Dados</button>
                </div>
             </form>
          </div>
        </div>
      )}

      <div className="bg-emerald-950/10 border border-emerald-500/10 p-10 rounded-[3rem] text-center no-print">
         <p className="text-emerald-800 text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">Protocolo de Patrulhamento SIGP-S9</p>
         <p className="text-xs text-slate-500 italic leading-relaxed max-w-3xl mx-auto uppercase">
            O registo de CPs é a base do nosso <span className="text-white font-bold underline">Tempo de Serviço</span>. Oficiais que patrulham sem registo de CP ativo não terão as horas contabilizadas para progressão de carreira.
         </p>
      </div>
    </div>
  );
};

export default CPRegistrySection;
