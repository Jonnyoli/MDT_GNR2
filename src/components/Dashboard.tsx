
import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, RadialBarChart, RadialBar } from 'recharts';
import { LogEntry, Officer, Warrant, GNRShift, PatrolCar } from '../types';
import { getLocalAutos, getLocalOfficers, getGlobalSeizureTotal, getLocalWarrants } from '../services/dataService';
import { apiService } from '../services/apiService';

interface DashboardProps {
  onSOS: () => void;
  isSOSActive: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ onSOS, isSOSActive }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString('pt-PT'));
  const [autos, setAutos] = useState<LogEntry[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [warrants, setWarrants] = useState<Warrant[]>([]);
  const [activeShifts, setActiveShifts] = useState<any[]>([]);
  const [activeCPs, setActiveCPs] = useState<PatrolCar[]>([]);
  const [seizureTotal, setSeizureTotal] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [alertLevel, setAlertLevel] = useState<'GREEN' | 'AMBER' | 'RED'>('GREEN');

  const RANK_WEIGHTS: { [key: string]: number } = {
    'Comandante Geral': 1,
    'Tenente General': 2,
    'Major General': 3,
    'Brigadeiro General': 4,
    'Coronel': 5,
    'Tenente Coronel': 6,
    'Major': 7,
    'Capitão': 8,
    'Tenente': 9,
    'Alferes': 10,
    'Aspirante a Oficial': 11,
    'Sargento Mor': 12,
    'Sargento Chefe': 13,
    'Primeiro Sargento': 14,
    'Segundo Sargento': 15,
    'Furriel': 16,
    'Cabo Mor': 17,
    'Cabo Chefe': 18,
    'Cabo': 19,
    'Guarda Principal': 20,
    'Guarda': 21,
    'Guarda Provisório': 22
  };

  useEffect(() => {
    setMounted(true);
    
    const loadData = async () => {
      const [allAutos, allOfficers, allWarrants, total] = await Promise.all([
        getLocalAutos(),
        getLocalOfficers(),
        getLocalWarrants(),
        getGlobalSeizureTotal()
      ]);
      
      setAutos(allAutos.slice(0, 10));
      setOfficers(allOfficers);
      setWarrants(allWarrants.filter(w => w.status === 'ATIVO'));
      setSeizureTotal(total);
    };

    loadData();
    
    const refreshInterval = setInterval(async () => {
      try {
        const [shifts, cps] = await Promise.all([
          apiService.getLivePontos(),
          apiService.getLiveCPs()
        ]);
        const uniqueShifts = (shifts || []).filter((s:any) => s.status !== 'FECHADO' && s.status !== 'COMPLETED')
          .reduce((acc: any[], current: any) => {
            const x = acc.find(item => item.officerId === current.officerId);
            if (!x) return acc.concat([current]);
            else return acc;
          }, [])
          .sort((a: any, b: any) => {
            const rankA = (a.officerRank || '').split('-')[0].trim();
            const rankB = (b.officerRank || '').split('-')[0].trim();
            const weightA = RANK_WEIGHTS[rankA] || 999;
            const weightB = RANK_WEIGHTS[rankB] || 999;
            if (weightA !== weightB) return weightA - weightB;
            return a.officerName.localeCompare(b.officerName);
          });
        setActiveShifts(uniqueShifts);
        setActiveCPs(cps.filter((c:any) => c.status !== 'FECHADA' && c.status !== 'COMPLETED'));
      } catch (e) {
        console.error("Erro ao fazer refresh live:", e);
      }
    }, 2000);
    
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('pt-PT'));
    }, 1000);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(timer);
    };
  }, []);

  const totalPersonnelOnDuty = useMemo(() => activeShifts.length, [activeShifts]);
  const totalVehiclesActive = useMemo(() => activeCPs.length, [activeCPs]);

  const radialData = [
    { name: 'Apreensões', value: Math.min((seizureTotal / 5000000) * 100, 100), fill: '#10b981' }
  ];

  const categorizedShifts = useMemo(() => {
    return {
      comando: activeShifts.filter(s => (s.officerCategory || '').includes('(T)')),
      oficiais: activeShifts.filter(s => (s.officerCategory || '').includes('(K)')),
      sargentos: activeShifts.filter(s => (s.officerCategory || '').includes('(Z)')),
      guardas: activeShifts.filter(s => (s.officerCategory || '').includes('(G)')),
      cfg: activeShifts.filter(s => (s.officerCategory || '').includes('(H)')),
      outros: activeShifts.filter(s => {
        const cat = s.officerCategory || '';
        return !cat.includes('(T)') && !cat.includes('(K)') && !cat.includes('(Z)') && !cat.includes('(G)') && !cat.includes('(H)');
      })
    };
  }, [activeShifts]);

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-20">
      <style>{`
        .status-glass { background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255,255,255,0.05); backdrop-filter: blur(10px); }
        @keyframes scan-glow { 0% { opacity: 0.3; } 50% { opacity: 0.7; } 100% { opacity: 0.3; } }
        .live-indicator { animation: scan-glow 2s infinite; }
      `}</style>

      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">Central de Comando</h2>
          <div className="flex items-center gap-6">
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3 italic">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
              SIGP-S9 MONITORIZAÇÃO • {time}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
           <div className="bg-black/40 border border-white/5 p-2 rounded-2xl flex gap-2">
              <button onClick={() => setAlertLevel('GREEN')} className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase transition-all ${alertLevel === 'GREEN' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}>Normal</button>
              <button onClick={() => setAlertLevel('AMBER')} className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase transition-all ${alertLevel === 'AMBER' ? 'bg-amber-500 text-black shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}>Amber</button>
              <button onClick={() => setAlertLevel('RED')} className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase transition-all ${alertLevel === 'RED' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-400'}`}>Defcon 1</button>
           </div>
           <button onClick={onSOS} className={`px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl border-2 ${isSOSActive ? 'bg-red-600 text-white border-white animate-pulse' : 'bg-transparent border-red-600 text-red-600 hover:bg-red-600 hover:text-white'}`}>
             {isSOSActive ? 'PANIC BUTTON ACTIVE' : 'FORCE 10-33'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { l: 'OFICIAIS EM TURNO', v: totalPersonnelOnDuty.toString().padStart(2, '0'), c: 'text-blue-500', bg: 'bg-blue-500/5' },
           { l: 'CPS OPERACIONAIS', v: totalVehiclesActive.toString().padStart(2, '0'), c: 'text-emerald-500', bg: 'bg-emerald-500/5' },
           { l: 'MANDADOS ATIVOS', v: warrants.length.toString().padStart(2, '0'), c: 'text-red-500', bg: 'bg-red-500/5' },
           { l: 'APREENSÕES (VALOR)', v: `${(seizureTotal / 1000).toFixed(1)}k€`, c: 'text-amber-500', bg: 'bg-amber-500/5' }
         ].map((stat, i) => (
           <div key={i} className={`p-8 rounded-[2.5rem] border border-white/5 ${stat.bg} shadow-xl relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-10 transition-opacity">
                 <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">{stat.l}</p>
              <h3 className={`text-4xl font-black italic tracking-tighter ${stat.c}`}>{stat.v}</h3>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
           <div className="status-glass p-10 rounded-[3.5rem] space-y-10 shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-white/5 pb-8 relative z-10">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white">
                       <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Efetivo em Turno Ativo</h3>
                    </div>
                 </div>
              </div>

              <div className="space-y-10 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar relative z-10">
                 {/* GRUPOS CATEGORIZADOS */}
                 {Object.entries(categorizedShifts).map(([key, list]) => (
                    list.length > 0 && (
                      <div key={key} className="space-y-4">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-3 italic py-2 px-4 rounded-lg border-l-2 ${
                          key === 'comando' ? 'text-amber-500 bg-amber-500/5 border-amber-500' :
                          key === 'oficiais' ? 'text-blue-400 bg-blue-400/5 border-blue-400' :
                          key === 'sargentos' ? 'text-slate-400 bg-slate-400/5 border-slate-400' :
                          key === 'guardas' ? 'text-emerald-500 bg-emerald-500/5 border-emerald-500' :
                          key === 'cfg' ? 'text-indigo-400 bg-indigo-400/5 border-indigo-400' :
                          'text-slate-500 bg-slate-500/5 border-slate-500'
                        }`}>
                          {key === 'comando' ? 'Comando Geral (T)' :
                           key === 'oficiais' ? 'Oficiais (K)' :
                           key === 'sargentos' ? 'Corpo de Sargentos (Z)' :
                           key === 'guardas' ? 'Corpo de Guardas (G)' :
                           key === 'cfg' ? 'Centro de Formação (H)' :
                           'Efetivo em Serviço (Pendentes)'}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {list.map(shift => (
                              <div key={shift.id} className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group hover:border-emerald-500/20 transition-all">
                                 <div className="flex items-center gap-5">
                                    <img src={shift.officerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${shift.officerName}`} className="w-12 h-12 rounded-xl bg-black/40 border border-white/5 object-cover" alt="" />
                                    <div>
                                       <p className="text-sm font-black text-white italic uppercase">{shift.officerName}</p>
                                       <p className="text-[8px] text-slate-500 font-bold uppercase mt-1">{shift.officerRank || 'PATENTE NÃO SINCRONIZADA'}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <span className="text-[9px] font-black text-emerald-500 italic block">ATIVO</span>
                                    <span className="text-[7px] text-slate-800 font-mono block uppercase">{shift.id.slice(-6)}</span>
                                 </div>
                              </div>
                           ))}
                        </div>
                      </div>
                    )
                 ))}
              </div>
           </div>

           <div className="status-glass p-10 rounded-[3.5rem] space-y-8 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/5 pb-6">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1"/></svg>
                    </div>
                    <h3 className="text-sm font-black text-white uppercase italic tracking-widest">Dispositivo Operacional (CP)</h3>
                 </div>
                 <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-lg font-black italic">{totalVehiclesActive} UNIDADES</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {activeCPs.length > 0 ? activeCPs.map((cp) => (
                    <div key={cp.id} className="bg-emerald-950/10 border border-emerald-500/10 p-8 rounded-[2.5rem] space-y-6 hover:border-emerald-500/30 transition-all group">
                       <div className="flex justify-between items-start">
                          <h4 className="text-3xl font-black text-white italic tracking-tighter group-hover:text-emerald-500 transition-colors">CP-{cp.cpNumber}</h4>
                       </div>
                       <div className="space-y-4">
                          <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                             <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Comandante</p>
                             <p className="text-xs font-black text-white italic uppercase truncate">{cp.commanderName}</p>
                          </div>
                       </div>
                    </div>
                 )) : null}
              </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
           <div className={`p-10 rounded-[3rem] border-2 transition-all duration-700 shadow-2xl relative overflow-hidden ${
              alertLevel === 'RED' ? 'border-red-600 bg-red-600/5 text-red-500' :
              alertLevel === 'AMBER' ? 'border-amber-500 bg-amber-500/5 text-amber-500' :
              'border-emerald-500 bg-emerald-500/5 text-emerald-500'
           }`}>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-60">Territorial Status</p>
              <h4 className="text-5xl font-black italic tracking-tighter uppercase leading-none mb-6">DEFCON {alertLevel === 'RED' ? '1' : alertLevel === 'AMBER' ? '2' : '3'}</h4>
           </div>

           <div className="status-glass p-10 rounded-[3rem] h-[450px] flex flex-col shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                 <h3 className="text-xs font-black text-red-500 uppercase tracking-[0.3em] italic flex items-center gap-3">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                    Mandados Ativos
                 </h3>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-3">
                 {warrants.map(w => (
                    <div key={w.id} className="p-5 bg-red-950/10 border border-red-900/20 rounded-2xl animate-in">
                       <p className="text-sm font-black text-white uppercase italic">{w.targetName}</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
