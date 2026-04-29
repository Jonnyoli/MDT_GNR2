
import React, { useState, useEffect } from 'react';
import { MenuItemConfig } from '../types';
import { getMenuConfig, saveMenuConfig, addSystemLog } from '../services/dataService';

interface MenuEditorSectionProps {
  onMenuUpdate: () => void;
  currentUser: any;
}

const ALL_RANKS = [
  'Comandante-Geral', 'Tenente-General', 'Major-General', 'Brigadeiro-General',
  'Coronel', 'Tenente Coronel', 'Major', 'Capitão', 'Tenente', 'Alferes', 'Aspirante a Oficial',
  'Sargento Mor', 'Sargento Chefe', 'Primeiro Sargento', 'Segundo Sargento', 'Furriel',
  'Cabo-Mor', 'Cabo-Chefe', 'Cabo', 'Guarda Principal', 'Guarda', 'Guarda Provisório'
];

const ALL_TAG_OPTIONS = [
  'Núcleo de Investigação Criminal',
  'Grupo de Intervenção de Operações Especiais',
  'Destacamento de Intervenção',
  'Unidade Nacional de Trânsito',
  'Unidade de Emergência de Proteção e Socorro',
  'Escola da Guarda',
  'Conselho Superior da Guarda'
];

const MenuEditorSection: React.FC<MenuEditorSectionProps> = ({ onMenuUpdate, currentUser }) => {
  const [config, setConfig] = useState<MenuItemConfig[]>([]);

  useEffect(() => {
    setConfig(getMenuConfig());
  }, []);

  const handleMove = (index: number, direction: 'UP' | 'DOWN') => {
    const newConfig = [...config];
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newConfig.length) return;

    [newConfig[index], newConfig[targetIndex]] = [newConfig[targetIndex], newConfig[index]];
    
    const finalized = newConfig.map((item, idx) => ({ ...item, order: idx }));
    setConfig(finalized);
    saveMenuConfig(finalized);
    onMenuUpdate();
  };

  const toggleRank = (id: string, rank: string) => {
    const newConfig = config.map(item => {
      if (item.id === id) {
        const ranks = item.allowedRanks.includes(rank)
          ? item.allowedRanks.filter(r => r !== rank)
          : [...item.allowedRanks, rank];
        return { ...item, allowedRanks: ranks };
      }
      return item;
    });
    setConfig(newConfig);
    saveMenuConfig(newConfig);
    onMenuUpdate();
  };

  const toggleTag = (id: string, tag: string) => {
    const newConfig = config.map(item => {
      if (item.id === id) {
        const tags = (item.allowedTags || []).includes(tag)
          ? (item.allowedTags || []).filter(t => t !== tag)
          : [...(item.allowedTags || []), tag];
        return { ...item, allowedTags: tags };
      }
      return item;
    });
    setConfig(newConfig);
    saveMenuConfig(newConfig);
    onMenuUpdate();
    addSystemLog('UPDATE', 'SYSTEM_MENU', id, `Tags da aba ${id} alteradas para: ${tag}`, currentUser?.name);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="border-b border-white/5 pb-10">
        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Arquitetura de Terminal</h2>
        <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mt-5 flex items-center gap-4 italic transition-all">
           <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_#f59e0b]"></span>
           Comando Geral • Gestão de Acessos e Interface
        </p>
      </div>

      <div className="space-y-6">
        {config.map((item, index) => (
          <div key={item.id} className="bg-black/40 border border-white/5 p-8 rounded-[3rem] group hover:border-amber-500/20 transition-all flex flex-col lg:flex-row gap-10">
            
            <div className="flex flex-row lg:flex-col gap-3 justify-center">
               <button 
                 disabled={index === 0}
                 onClick={() => handleMove(index, 'UP')}
                 className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white hover:bg-emerald-600 transition-all disabled:opacity-10"
               >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7"/></svg>
               </button>
               <button 
                 disabled={index === config.length - 1}
                 onClick={() => handleMove(index, 'DOWN')}
                 className="p-3 bg-white/5 rounded-xl text-slate-500 hover:text-white hover:bg-emerald-600 transition-all disabled:opacity-10"
               >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
               </button>
            </div>

            <div className="flex-1 space-y-8">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}/></svg>
                  </div>
                  <div>
                     <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{item.label}</h3>
                     <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-widest">ID_S9: {item.id}</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest ml-1">Patentes Autorizadas</p>
                     <div className="flex flex-wrap gap-2">
                        {ALL_RANKS.map(rank => {
                          const isActive = item.allowedRanks.includes(rank);
                          return (
                            <button key={rank} onClick={() => toggleRank(item.id, rank)} className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase transition-all border ${isActive ? 'bg-white text-black border-white shadow-lg' : 'bg-black/40 text-slate-600 border-white/5 hover:border-white/10'}`}>
                              {rank}
                            </button>
                          );
                        })}
                     </div>
                  </div>

                  <div className="space-y-4">
                     <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest ml-1">Restringir por Especialização (Tag Discord)</p>
                     <div className="flex flex-wrap gap-2">
                        {ALL_TAG_OPTIONS.map(tag => {
                          const isActive = (item.allowedTags || []).includes(tag);
                          return (
                            <button key={tag} onClick={() => toggleTag(item.id, tag)} className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase transition-all border ${isActive ? 'bg-blue-600 text-white border-blue-500 shadow-lg' : 'bg-black/40 text-slate-600 border-white/5 hover:border-white/10'}`}>
                              {tag}
                            </button>
                          );
                        })}
                        {(!item.allowedTags || item.allowedTags.length === 0) && <p className="text-[9px] text-slate-700 italic">Sem restrições de tag (Livre por patente)</p>}
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col justify-center items-center lg:border-l border-white/5 lg:pl-10 min-w-[150px]">
               <p className="text-[8px] text-slate-600 font-black uppercase mb-4 tracking-widest">Segurança</p>
               <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase italic ${item.allowedTags && item.allowedTags.length > 0 ? 'bg-red-600/10 text-red-500' : 'bg-emerald-600/10 text-emerald-500'}`}>
                  {item.allowedTags && item.allowedTags.length > 0 ? 'ACESSO ESPECIAL' : 'ACESSO GERAL'}
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-950/10 border border-amber-500/10 p-10 rounded-[3rem] text-center">
         <p className="text-amber-800 text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">Cláusula de Governança Digital</p>
         <p className="text-xs text-slate-500 italic leading-relaxed max-w-3xl mx-auto uppercase">
            A reconfiguração das abas e suas respetivas especializações é imediata. <span className="text-white font-bold underline">Cuidado:</span> Atribuir uma tag obrigatória a uma aba removerá o acesso de todos os guardas que não a possuam.
         </p>
      </div>
    </div>
  );
};

export default MenuEditorSection;
