
import React, { useState, useMemo } from 'react';
import { Officer } from '../types';

interface DutyBoardSectionProps {
  officers: Officer[];
  isAdmin: boolean;
  onUpdateOfficer: (o: Officer) => void;
  currentUser: Officer | null;
}

interface TagDefinition {
  name: string;
  color: string;
  icon: string;
  category: string;
}

const ALL_TAGS: TagDefinition[] = [
  // --- CONSELHOS ---
  { name: 'Conselho de Elite da Guarda', color: 'bg-amber-500', icon: '⭐', category: 'CONSELHOS' },
  { name: 'Conselho Superior de Oficiais', color: 'bg-orange-950', icon: '⚔️', category: 'CONSELHOS' },
  { name: 'Conselho Superior da Guarda', color: 'bg-slate-300', icon: '🛡️', category: 'CONSELHOS' },
  
  // --- GESTÃO / EG ---
  { name: 'Gestor BR/Challenges', color: 'bg-emerald-600', icon: '🦖', category: 'GESTÃO' },
  { name: 'Diretor EG', color: 'bg-purple-800', icon: '🎓', category: 'ESCOLA DA GUARDA' },
  { name: 'EG Recrutamentos', color: 'bg-purple-600', icon: '📦', category: 'ESCOLA DA GUARDA' },
  { name: 'EG Examinador', color: 'bg-purple-500', icon: '📝', category: 'ESCOLA DA GUARDA' },

  // --- UNIDADES ---
  { name: 'Comando GIOE', color: 'bg-emerald-900', icon: '💀', category: 'GIOE' },
  { name: 'Em Formação GIOE', color: 'bg-emerald-800', icon: '💀', category: 'GIOE' },
  { name: 'Grupo de Intv. de Ops. Especiais', color: 'bg-emerald-700', icon: '💀', category: 'GIOE' },
  
  { name: 'Comando DI', color: 'bg-red-900', icon: '🚨', category: 'D.I.' },
  { name: 'Em Formação DI', color: 'bg-red-800', icon: '🚨', category: 'D.I.' },
  { name: 'Destacamento de Intervenção', color: 'bg-red-700', icon: '🚨', category: 'D.I.' },

  { name: 'Direção NIC', color: 'bg-blue-900', icon: '🕵️', category: 'N.I.C.' },
  { name: 'Núcleo de Investigação Criminal', color: 'bg-blue-700', icon: '🕵️', category: 'N.I.C.' },

  { name: 'Comando UNT', color: 'bg-amber-600', icon: '🚓', category: 'U.N.T.' },
  { name: 'Provisório UNT', color: 'bg-amber-500', icon: '🚓', category: 'U.N.T.' },
  { name: 'Unidade Nacional de Trânsito', color: 'bg-slate-600', icon: '🚓', category: 'U.N.T.' },

  { name: 'Comando UEPS', color: 'bg-orange-800', icon: '🧯', category: 'U.E.P.S.' },
  { name: 'Unidade de Emrg. de Proteção e Socorro', color: 'bg-orange-700', icon: '🧯', category: 'U.E.P.S.' },

  { name: 'Comando GSA', color: 'bg-yellow-700', icon: '🦅', category: 'G.S.A.' },
  { name: 'Equipa Tática', color: 'bg-yellow-600', icon: '🦅', category: 'G.S.A.' },
  { name: 'Certificado de Piloto', color: 'bg-yellow-500', icon: '🦅', category: 'G.S.A.' },
  { name: 'Grupo de Suporte Aéreo', color: 'bg-yellow-400', icon: '🦅', category: 'G.S.A.' },

  { name: 'Comando UCC', color: 'bg-cyan-800', icon: '⚓', category: 'U.C.C.' },
  { name: 'Unidade de Controlo Costeiro', color: 'bg-cyan-600', icon: '⚓', category: 'U.C.C.' },

  { name: 'Comando GIC', color: 'bg-orange-900', icon: '🐕', category: 'G.I.C.' },
  { name: 'Grupo de Intervenção Cinotécnica', color: 'bg-orange-800', icon: '🐕', category: 'G.I.C.' },

  // --- DEPARTAMENTOS ---
  { name: 'Gestor DRH', color: 'bg-fuchsia-900', icon: '🟩', category: 'DEPARTAMENTOS' },
  { name: 'Dept. de Recursos Humanos', color: 'bg-fuchsia-700', icon: '🟩', category: 'DEPARTAMENTOS' },
  { name: 'Divisão de Assessoria Jurídica', color: 'bg-emerald-900', icon: '⚖️', category: 'DEPARTAMENTOS' },
  { name: 'Curso de Negociador', color: 'bg-violet-900', icon: '💡', category: 'DEPARTAMENTOS' },
  { name: 'Gabinete de Assistência Psicológica', color: 'bg-pink-700', icon: '🧠', category: 'DEPARTAMENTOS' },

  // --- AVISOS ---
  { name: 'Suspensão de serviço', color: 'bg-red-600', icon: '🛑', category: 'AVISOS' },
  { name: '1ª Repreensão', color: 'bg-red-700', icon: '⛔', category: 'AVISOS' },
  { name: '2ª Repreensão', color: 'bg-red-800', icon: '⛔', category: 'AVISOS' },
  { name: 'Ausente', color: 'bg-emerald-600', icon: '✅', category: 'AVISOS' },
];

const DutyBoardSection: React.FC<DutyBoardSectionProps> = ({ officers, isAdmin, onUpdateOfficer, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);

  const filteredOfficers = useMemo(() => {
    if (!officers) return [];
    return officers.filter(o => {
      const nameMatch = (o.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const nipMatch = String(o.nip || "").includes(searchTerm);
      const tagsMatch = (o.tags || []).some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      return nameMatch || nipMatch || tagsMatch;
    }).sort((a, b) => {
      if (a.status === 'online' && b.status !== 'online') return -1;
      if (a.status !== 'online' && b.status === 'online') return 1;
      return 0;
    });
  }, [officers, searchTerm]);

  const toggleTag = (officer: Officer, tagName: string) => {
    const currentTags = officer.tags || [];
    const newTags = currentTags.includes(tagName)
      ? currentTags.filter(t => t !== tagName)
      : [...currentTags, tagName];
    
    onUpdateOfficer({ ...officer, tags: newTags });
  };

  const isComandoGeral = isAdmin && (
    currentUser?.id === 'admin-root' || 
    ['Comandante-Geral', 'Tenente-General', 'Major-General', 'Brigadeiro-General'].includes(currentUser?.rank || '')
  );

  const categories = Array.from(new Set(ALL_TAGS.map(t => t.category)));

  const sortTagsHierarchically = (tags: string[]) => {
    return [...tags].sort((a, b) => {
      const getPrio = (n: string) => {
        if (n.includes('Conselho')) return 1;
        if (n.includes('Comando') || n.includes('COMANDO')) return 2;
        if (n.includes('General') || n.includes('Coronel') || n.includes('Major') || n.includes('Capitão') || n.includes('Tenente')) return 10;
        if (n.includes('Dept.') || n.includes('Grupo') || n.includes('Unidade') || n.includes('Núcleo')) return 20;
        if (n.includes('Curso') || n.includes('Certificado') || n.includes('Examinador')) return 30;
        if (n.includes('Medalha')) return 50;
        return 100;
      };
      return getPrio(a) - getPrio(b);
    });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Quadro de Serviço</h2>
          <p className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.4em] mt-4 italic">Gestão Centralizada de Especializações • SIGP-S9</p>
        </div>
        
        <div className="relative group">
          <input 
            type="text" 
            placeholder="PESQUISAR OFICIAL OU TAG..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black text-white uppercase focus:border-emerald-500 w-80 transition-all outline-none"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOfficers.length > 0 ? filteredOfficers.map(off => (
          <div key={off.id} className={`bg-[#060d0b]/40 border p-8 rounded-[3rem] transition-all relative overflow-hidden group hover:border-white/20 ${off.status === 'online' ? 'border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.05)]' : 'border-white/5'}`}>
             
             {isComandoGeral && (
               <button 
                 onClick={() => setSelectedOfficer(off)}
                 className="absolute top-6 right-6 p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white hover:bg-emerald-600 transition-all opacity-0 group-hover:opacity-100 shadow-xl"
               >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
               </button>
             )}

             <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                   <div className="w-20 h-20 rounded-3xl bg-black border border-white/10 overflow-hidden shadow-2xl">
                      <img src={off.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${off.name}`} className="w-full h-full object-cover" alt="" />
                   </div>
                   <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-[#020806] ${off.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none">{off.name}</h3>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">{off.rank} • {off.nip}</p>
                </div>
             </div>

             <div className="space-y-4">
                <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest px-1">Atribuições do Discord</p>
                <div className="flex flex-wrap gap-2 min-h-[40px]">
                   {off.tags && off.tags.length > 0 ? sortTagsHierarchically(off.tags).map(tag => {
                     const meta = ALL_TAGS.find(t => tag.includes(t.name));
                     return (
                       <span key={tag} className={`${meta?.color || 'bg-slate-800'} text-white text-[8px] font-black px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg group-hover:scale-105 transition-transform border border-white/5`}>
                         <span className="opacity-70">{meta?.icon || '🔹'}</span>
                         {tag}
                       </span>
                     );
                   }) : (
                     <span className="text-[9px] text-slate-800 font-black uppercase italic">Padrão: Guarda Regular</span>
                   )}
                </div>
             </div>
          </div>
        )) : (
          <div className="col-span-full py-40 text-center bg-black/20 rounded-[4rem] border border-dashed border-white/5">
             <div className="w-24 h-24 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
             </div>
             <p className="text-xl font-black italic uppercase tracking-widest text-slate-800">Sem registos de efetivo no sistema</p>
          </div>
        )}
      </div>

      {selectedOfficer && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-300">
           <div className="bg-[#040806] border border-emerald-500/20 w-full max-w-5xl rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col h-[90vh]">
              
              <div className="relative z-10 mb-12 flex justify-between items-start border-b border-white/5 pb-8">
                 <div>
                    <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-tight">Gestor de Atribuições</h3>
                    <p className="text-emerald-500 text-[11px] font-black uppercase tracking-[0.4em] mt-3 italic">Oficial: {selectedOfficer.name}</p>
                 </div>
                 <button onClick={() => setSelectedOfficer(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg></button>
              </div>

              <div className="flex-1 overflow-y-auto pr-6 custom-scrollbar space-y-12">
                 {categories.map(cat => (
                    <div key={cat} className="space-y-6">
                       <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] border-l-2 border-emerald-500 pl-4 italic">{cat}</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {ALL_TAGS.filter(t => t.category === cat).map(tag => {
                             const isActive = selectedOfficer.tags?.includes(tag.name);
                             return (
                               <button 
                                 key={tag.name}
                                 onClick={() => toggleTag(selectedOfficer, tag.name)}
                                 className={`p-4 rounded-[1.5rem] border flex items-center gap-4 transition-all relative overflow-hidden group ${isActive ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]' : 'bg-black/40 border-white/5 text-slate-500 hover:border-white/20'}`}
                               >
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${isActive ? 'bg-black text-white' : 'bg-white/5'}`}>
                                     {tag.icon}
                                  </div>
                                  <div className="text-left">
                                     <span className="text-[10px] font-black uppercase tracking-tight block leading-tight">{tag.name}</span>
                                     {isActive && <span className="text-[7px] font-black uppercase tracking-widest text-emerald-600">VINCULADO</span>}
                                  </div>
                                  {isActive && <div className="absolute top-2 right-4 w-1.5 h-1.5 bg-black rounded-full animate-pulse"></div>}
                               </button>
                             );
                          })}
                       </div>
                    </div>
                 ))}
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 text-center flex justify-between items-center opacity-60">
                 <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">SISTEMA_IDENTIDADE_OPERACIONAL_S9_V2</p>
                 <button 
                   onClick={() => setSelectedOfficer(null)}
                   className="py-4 px-12 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
                 >
                    Confirmar Alterações
                 </button>
              </div>
           </div>
        </div>
      )}

      <div className="bg-emerald-950/10 border border-emerald-500/10 p-10 rounded-[3rem] text-center">
         <p className="text-[10px] text-emerald-800 font-black uppercase tracking-[0.4em] mb-4 italic">Protocolo de Registro Unificado</p>
         <p className="text-xs text-slate-500 italic leading-relaxed max-w-3xl mx-auto uppercase">
            Todas as atribuições visíveis no quadro são espelhos das permissões oficiais no <span className="text-white font-bold">Servidor Discord</span>. A sincronização garante que o efetivo operando no Diamond possua o treino adequado para as funções desempenhadas.
         </p>
      </div>
    </div>
  );
};

export default DutyBoardSection;
