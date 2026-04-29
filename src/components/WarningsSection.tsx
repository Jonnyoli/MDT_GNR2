
import React, { useState, useEffect } from 'react';

const WarningsSection: React.FC = () => {
  const [discordAvisos, setDiscordAvisos] = useState<any[]>([]);
  const [loadingAvisos, setLoadingAvisos] = useState(false);

  const fetchDiscordAvisos = async () => {
    try {
      setLoadingAvisos(true);
      const apiHost = window.location.hostname === 'localhost' ? 'localhost' : '5.78.68.73';
      const response = await fetch(`http://${apiHost}:3002/api/discord/avisos`);
      if (response.ok) {
        const data = await response.json();
        setDiscordAvisos(data);
      }
    } catch (error) {
      console.error("Erro ao carregar avisos do Discord:", error);
    } finally {
      setLoadingAvisos(false);
    }
  };

  useEffect(() => {
    fetchDiscordAvisos();
    const interval = setInterval(fetchDiscordAvisos, 30000); // Atualiza a cada 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* HEADER */}
      <div className="border-b border-white/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div>
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Avisos Disciplinares</h2>
          <p className="text-amber-600 text-[10px] font-black uppercase tracking-[0.4em] mt-5 flex items-center gap-4 italic transition-all">
             <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse shadow-[0_0_10px_#d97706]"></span>
             Feed Sincronizado do Discord • Em Direto
          </p>
        </div>
        
        <button 
          onClick={fetchDiscordAvisos} 
          className="text-[9px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2 group"
        >
          <svg className={`w-3.5 h-3.5 ${loadingAvisos ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          {loadingAvisos ? 'SINCRONIZANDO...' : 'ATUALIZAR FEED'}
        </button>
      </div>

      {/* LIVE DISCORD FEED */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {discordAvisos.length > 0 ? discordAvisos.map((aviso) => (
          <div key={aviso.id} className="bg-amber-950/5 border border-amber-500/10 p-10 rounded-[2.5rem] group hover:border-amber-500/30 transition-all relative overflow-hidden h-[320px] flex flex-col shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
               <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
            </div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white font-black shadow-lg border border-white/10 uppercase italic text-xl">
                     {aviso.author[0]}
                  </div>
                  <div>
                     <p className="text-xs font-black text-white italic uppercase tracking-tighter">{aviso.author}</p>
                     <p className="text-[9px] text-amber-600 font-bold uppercase">{new Date(aviso.timestamp).toLocaleDateString('pt-PT')} • {new Date(aviso.timestamp).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 mb-6">
              <p className="text-xs text-slate-300 leading-relaxed italic whitespace-pre-wrap pr-3">{aviso.content}</p>
            </div>
            
            {aviso.attachments && aviso.attachments.length > 0 && (
               <div className="pt-6 border-t border-amber-500/10 relative z-10">
                  <p className="text-[8px] font-black text-amber-600 uppercase tracking-widest mb-3">Evidências Digitais</p>
                  <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                     {aviso.attachments.map((url: string, idx: number) => (
                        <a key={idx} href={url} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-black border border-amber-500/20 flex-shrink-0 hover:border-amber-500 transition-all overflow-hidden shadow-lg">
                           <img src={url} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" alt="Anexo" />
                        </a>
                     ))}
                  </div>
               </div>
            )}
          </div>
        )) : (
          <div className="col-span-full py-40 text-center opacity-10 flex flex-col items-center">
             <svg className="w-32 h-32 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
             <p className="text-2xl font-black italic uppercase tracking-[0.3em]">Aguardando comunicações do comando...</p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="bg-amber-950/10 border border-amber-500/10 p-10 rounded-[3rem] text-center mt-12">
         <p className="text-[10px] text-amber-800 font-black uppercase tracking-[0.4em] mb-4 italic">Sistema de Integridade Diamond S9</p>
         <p className="text-[10px] text-slate-600 italic leading-relaxed max-w-2xl mx-auto uppercase">
            Este feed reflete as decisões disciplinares oficiais publicadas no Discord. Para retificações ou contestações, contacte o Departamento de Recursos Humanos.
         </p>
      </div>
    </div>
  );
};

export default WarningsSection;
