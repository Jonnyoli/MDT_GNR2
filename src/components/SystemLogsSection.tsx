
import React, { useState, useEffect } from 'react';
import { SystemLog } from '../types';
import { getSystemLogs } from '../services/dataService';

const SystemLogsSection: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('ALL');

  useEffect(() => {
    const refreshLogs = () => {
      setLogs(getSystemLogs());
    };
    refreshLogs();
    const interval = setInterval(refreshLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.officerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'ALL' || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'text-emerald-500';
      case 'DELETE': return 'text-red-500';
      case 'UPDATE': return 'text-blue-500';
      case 'AUTH': return 'text-purple-500';
      default: return 'text-slate-500';
    }
  };

  const getResourceIcon = (type: string) => {
    if (type.includes('WARRANT')) return '⚖️';
    if (type.includes('EVIDENCE')) return '📁';
    if (type.includes('REPORT')) return '📝';
    if (type.includes('TARGET')) return '🎯';
    if (type.includes('AUTO')) return '🖋️';
    if (type.includes('SHIFT')) return '🕒';
    return '🔹';
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 font-mono">
      <div className="border-b border-white/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div>
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Auditoria de Sistema</h2>
          <p className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.4em] mt-5 flex items-center gap-4 italic transition-all">
             <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
             BLACK BOX • REGISTO DE EVENTOS CRÍTICOS
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
           <div className="relative w-64">
              <input 
                type="text" 
                placeholder="PROCURAR LOGS..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-xl pl-4 pr-4 py-3 text-[10px] font-black text-white focus:border-emerald-500 outline-none uppercase transition-all"
              />
           </div>
           <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
              {['ALL', 'CREATE', 'UPDATE', 'DELETE'].map(a => (
                <button 
                  key={a}
                  onClick={() => setFilterAction(a)}
                  className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${filterAction === a ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-white'}`}
                >
                  {a}
                </button>
              ))}
           </div>
        </div>
      </div>

      <div className="bg-black/60 border border-white/5 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative">
         {/* Efeito de Scanner de Terminal */}
         <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(16,185,129,0)_50%,rgba(16,185,129,0.1)_50%)] bg-[length:100%_4px]"></div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-white/[0.02] border-b border-white/5">
                     <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Oficial</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Ação</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Recurso</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Conteúdo do Log</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.02]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.01] transition-colors group">
                       <td className="px-10 py-5 whitespace-nowrap">
                          <span className="text-[10px] font-mono text-slate-600 group-hover:text-emerald-500/60 transition-colors">
                            {new Date(log.timestamp).toLocaleString('pt-PT')}
                          </span>
                       </td>
                       <td className="px-10 py-5">
                          <div className="flex items-center gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40"></div>
                             <span className="text-xs font-black text-white italic uppercase">{log.officerName}</span>
                          </div>
                       </td>
                       <td className="px-10 py-5 text-center">
                          <span className={`text-[9px] font-black px-3 py-1 rounded-lg border ${getActionColor(log.action)} border-current bg-current/5`}>
                             {log.action}
                          </span>
                       </td>
                       <td className="px-10 py-5">
                          <div className="flex items-center gap-3">
                             <span className="text-lg">{getResourceIcon(log.resourceType)}</span>
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{log.resourceType}</span>
                          </div>
                       </td>
                       <td className="px-10 py-5 max-w-md">
                          <p className="text-[11px] text-slate-300 italic truncate group-hover:text-white transition-colors">
                            {log.details}
                          </p>
                       </td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                       <td colSpan={5} className="py-40 text-center">
                          <div className="opacity-10 space-y-6">
                             <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                             <p className="text-2xl font-black uppercase tracking-[0.5em] italic">Datalog Vazio</p>
                          </div>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      <div className="bg-emerald-950/10 border border-emerald-500/10 p-10 rounded-[3rem] text-center">
         <p className="text-emerald-800 text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">Cláusula de Monitorização Permanente</p>
         <p className="text-xs text-slate-500 italic leading-relaxed max-w-3xl mx-auto uppercase">
            Todas as ações efetuadas neste terminal são <span className="text-white font-bold underline">registadas de forma inalterável</span> para fins de segurança nacional e auditoria militar. O acesso aos logs é restrito ao Comando-Geral e membros de Auditoria.
         </p>
      </div>
    </div>
  );
};

export default SystemLogsSection;
