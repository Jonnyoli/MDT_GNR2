
import React, { useState, useMemo } from 'react';
import { Officer } from '../types';
import { apiService } from '../services/apiService';

interface UsersSectionProps {
  officers: Officer[];
  isAdmin: boolean;
  onRegister: (o: Officer) => void;
  onUpdate?: (o: Officer) => void;
  currentUser?: Officer | null;
  onForceSync?: () => Promise<void>;
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

const UsersSection: React.FC<UsersSectionProps> = ({ officers, isAdmin, onRegister, onUpdate, currentUser, onForceSync }) => {
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);
  const [tagEditingOfficer, setTagEditingOfficer] = useState<Officer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const categories = Array.from(new Set(ALL_TAGS.map(t => t.category)));

  const hierarchyGroups = [
    { label: 'COMANDO GERAL (T)', id: 'comando_geral', ranks: ['Comandante Geral', 'Tenente General', 'Major General', 'Brigadeiro General'], textColor: 'text-amber-500' },
    { label: 'OFICIAIS (K)', id: 'oficiais', ranks: ['Coronel', 'Tenente Coronel', 'Major', 'Capitão', 'Tenente', 'Alferes', 'Aspirante a Oficial'], textColor: 'text-purple-400' },
    { label: 'SARGENTOS (Z)', id: 'sargentos', ranks: ['Sargento Mor', 'Sargento Chefe', 'Primeiro Sargento', 'Segundo Sargento', 'Furriel'], textColor: 'text-blue-400' },
    { label: 'GUARDAS (G)', id: 'guardas', ranks: ['Cabo Mor', 'Cabo Chefe', 'Cabo', 'Guarda Principal', 'Guarda'], textColor: 'text-emerald-400' },
    { label: 'CFG (H)', id: 'cfg', ranks: ['Guarda Provisório'], textColor: 'text-slate-400' }
  ];

  const allPossibleRanks = useMemo(() => hierarchyGroups.flatMap(g => g.ranks), []);

  const filteredOfficers = useMemo(() => {
    return (officers || []).filter(o => {
      const nameMatch = (o.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const nipMatch = String(o.nip || "").includes(searchTerm);
      const tagMatch = (o.tags || []).some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const rankMatch = (o.rank || "").toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatch || nipMatch || tagMatch || rankMatch;
    });
  }, [officers, searchTerm]);

  const canEdit = isAdmin && (
    currentUser?.id === 'admin-root' || 
    ['Comandante Geral', 'Tenente General', 'Major General', 'Brigadeiro General', 'Coronel'].includes(currentUser?.rank || '')
  );

  const toggleTag = (officer: Officer, tagName: string) => {
    if (!onUpdate) return;
    const currentTags = officer.tags || [];
    const newTags = currentTags.includes(tagName)
      ? currentTags.filter(t => t !== tagName)
      : [...currentTags, tagName];
    
    const updated = { ...officer, tags: newTags };
    onUpdate(updated);
    setTagEditingOfficer(updated);
  };

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
    <div className="space-y-16 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Efetivo da Guarda</h2>
          <p className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.4em] mt-4 italic">Base de Dados e Atribuições Táticas</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="PESQUISAR NOME, NIP OU TAG..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-[10px] font-black text-white uppercase focus:border-emerald-500 w-80 transition-all outline-none"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          {isAdmin && (
            <div className="flex gap-4">
              <button 
                onClick={async () => {
                   try {
                     const isConfirmed = confirm("Deseja forçar a sincronização com o Discord agora?");
                     if(!isConfirmed) return;
                     if(onForceSync) await onForceSync();
                     alert("Sincronização concluída com sucesso!");
                   } catch(e: any) {
                     alert("Erro: " + e.message);
                   }
                }} 
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Sincronizar Discord
              </button>
              <button onClick={() => setShowAddForm(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 active:scale-95">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
                Adicionar Oficial
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-20">
        {hierarchyGroups.map((group) => {
          const groupOfficers = filteredOfficers
            .filter(o => {
              const hasCategoryMatch = (o as any).category === group.label;
              const rankPrefix = o.rank?.split('-')[0]?.toUpperCase();
              const groupPrefix = group.label.match(/\(([A-Z])\)/)?.[1];
              const hasPrefixMatch = rankPrefix && groupPrefix && rankPrefix === groupPrefix;
              const hasRankListMatch = group.ranks.includes(o.rank);
              
              return hasCategoryMatch || hasPrefixMatch || hasRankListMatch;
            })
            .sort((a, b) => {
              const numA = parseInt(a.rank?.split('-')[1] || '999');
              const numB = parseInt(b.rank?.split('-')[1] || '999');
              return numA - numB;
            });
          
          if (groupOfficers.length === 0) return null;
          
          return (
            <section key={group.id} className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-6">
                 <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/5"></div>
                 <h3 className={`text-[11px] font-black uppercase tracking-[0.5em] px-6 py-2 rounded-full border border-white/5 bg-white/5 ${group.textColor}`}>{group.label}</h3>
                 <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/5"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupOfficers.map(off => (
                  <div key={off.id} className="bg-[#060d0b]/40 border border-white/5 p-8 rounded-[3rem] hover:border-white/20 transition-all group relative overflow-hidden flex flex-col">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="relative cursor-pointer" onClick={() => setSelectedOfficer(off)}>
                        <div className="h-20 w-20 rounded-3xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center">
                          <img src={off.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${off.name}`} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-[#020806] ${off.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-700'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-start">
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none truncate">{off.name}</h3>
                            <div className="flex gap-2">
                               {canEdit && (
                                 <>
                                  <button onClick={() => setTagEditingOfficer(off)} title="Gestor de Atribuições" className="p-2.5 bg-amber-600/10 text-amber-500 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg></button>
                                  <button onClick={() => setEditingOfficer(off)} title="Editar Cadastro" className="p-2.5 bg-blue-600/10 text-blue-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
                                 </>
                               )}
                            </div>
                         </div>
                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">{off.rank} • NIP {off.nip}</p>
                      </div>
                    </div>

                    <div className="space-y-4 flex-1">
                       <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest px-1">Atribuições do Discord</p>
                       <div className="flex flex-wrap gap-2 min-h-[40px]">
                          {off.tags && off.tags.length > 0 ? sortTagsHierarchically(off.tags).map(tag => {
                             const meta = ALL_TAGS.find(t => tag.includes(t.name));
                             return (
                               <span key={tag} className={`${meta?.color || 'bg-slate-800'} text-white text-[8px] font-black px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg border border-white/5`}>
                                 <span className="opacity-70">{meta?.icon || '🔹'}</span>
                                 {tag}
                               </span>
                             );
                          }) : <span className="text-[9px] text-slate-800 font-black uppercase italic">Padrão: Guarda Regular</span>}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {(() => {
           const allRankedNames = new Set(hierarchyGroups.flatMap(g => g.ranks));
           const allGroupLabels = new Set(hierarchyGroups.map(g => g.label));
           
           const others = filteredOfficers.filter(o => {
             const hasRankMatch = allRankedNames.has(o.rank);
             const hasCategoryMatch = allGroupLabels.has((o as any).category);
             const rankPrefix = o.rank?.split('-')[0]?.toUpperCase();
             const hasPrefixMatch = Array.from(allGroupLabels).some(label => {
                const groupPrefix = label.match(/\(([A-Z])\)/)?.[1];
                return rankPrefix && groupPrefix && rankPrefix === groupPrefix;
             });
             
             return !hasRankMatch && !hasCategoryMatch && !hasPrefixMatch;
           });
           if (others.length === 0) return null;
           return (
            <section className="space-y-8 opacity-60">
              <div className="flex items-center gap-6">
                 <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/5"></div>
                 <h3 className="text-[11px] font-black uppercase tracking-[0.5em] px-6 py-2 rounded-full border border-white/5 bg-white/5 text-slate-500 italic">Outros Militares / Reserva</h3>
                 <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/5"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {others.map(off => (
                  <div key={off.id} className="bg-black/20 border border-white/5 p-8 rounded-[3rem] flex flex-col">
                    <div className="flex items-center gap-6">
                       <div className="h-16 w-16 rounded-2xl bg-black/40 overflow-hidden">
                          <img src={off.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${off.name}`} className="w-full h-full object-cover" alt="" />
                       </div>
                       <div>
                          <h3 className="text-lg font-black text-white uppercase italic truncate">{off.name}</h3>
                          <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{off.rank} • NIP {off.nip}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
           );
        })()}
      </div>

      {tagEditingOfficer && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-300">
           <div className="bg-[#040806] border border-emerald-500/20 w-full max-w-5xl rounded-[4rem] p-12 shadow-2xl relative overflow-hidden flex flex-col h-[90vh]">
              <div className="relative z-10 mb-12 flex justify-between items-start border-b border-white/5 pb-8">
                 <div>
                    <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-tight">Gestor de Atribuições</h3>
                    <p className="text-emerald-500 text-[11px] font-black uppercase tracking-[0.4em] mt-3 italic">Oficial: {tagEditingOfficer.name}</p>
                 </div>
                 <button onClick={() => setTagEditingOfficer(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg></button>
              </div>
              <div className="flex-1 overflow-y-auto pr-6 custom-scrollbar space-y-12">
                 {categories.map(cat => (
                    <div key={cat} className="space-y-6">
                       <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] border-l-2 border-emerald-500 pl-4 italic">{cat}</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {ALL_TAGS.filter(t => t.category === cat).map(tag => {
                             const isActive = tagEditingOfficer.tags?.includes(tag.name);
                             return (
                               <button key={tag.name} onClick={() => toggleTag(tagEditingOfficer, tag.name)} className={`p-4 rounded-[1.5rem] border flex items-center gap-4 transition-all relative overflow-hidden group ${isActive ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]' : 'bg-black/40 border-white/5 text-slate-500 hover:border-white/20'}`}>
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${isActive ? 'bg-black text-white' : 'bg-white/5'}`}>{tag.icon}</div>
                                  <span className="text-[10px] font-black uppercase tracking-tight text-left leading-tight">{tag.name}</span>
                                  {isActive && <div className="absolute top-2 right-4 w-1.5 h-1.5 bg-black rounded-full animate-pulse"></div>}
                               </button>
                             );
                          })}
                       </div>
                    </div>
                 ))}
              </div>
              <div className="mt-12 pt-8 border-t border-white/5 text-center flex justify-between items-center opacity-60">
                 <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest italic">SISTEMA_S9_SYNC_DISCORD_V2</p>
                 <button onClick={() => setTagEditingOfficer(null)} className="py-4 px-12 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-500 hover:text-white transition-all">Fechar Gestor</button>
              </div>
           </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in zoom-in-95 duration-300">
           <div className="bg-[#05120d] border border-emerald-500/20 w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl relative">
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-10 border-b border-white/5 pb-6">Registrar Novo Oficial</h3>
              <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const nOff: Officer = { id: `OFF-${Date.now()}`, name: fd.get('name') as string, nip: fd.get('nip') as string, rank: fd.get('rank') as string, status: 'offline', avatar: fd.get('avatar') as string || '', totalHours: 0, joinedDate: new Date().toLocaleDateString('pt-PT'), tags: [] }; onRegister(nOff); setShowAddForm(false); }} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input name="name" required className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-emerald-500 transition-all uppercase" placeholder="NOME DO OFICIAL" />
                    <input name="nip" required className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-emerald-500 transition-all uppercase" placeholder="EX: 25492" />
                 </div>
                 <select name="rank" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-emerald-500 transition-all">
                    {allPossibleRanks.map(r => <option key={r} value={r}>{r}</option>)}
                 </select>
                 <input name="avatar" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-emerald-500 transition-all" placeholder="URL AVATAR (OPCIONAL)" />
                 <div className="flex gap-4 pt-6">
                    <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-4 bg-white/5 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Cancelar</button>
                    <button type="submit" className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all">Registrar</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {editingOfficer && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in zoom-in-95 duration-300">
           <div className="bg-[#05060d] border border-blue-500/20 w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl relative">
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-10 border-b border-white/5 pb-6">Retificar Dados do Oficial</h3>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome Operacional</label>
                    <input value={editingOfficer.name} onChange={e => setEditingOfficer({...editingOfficer, name: e.target.value.toUpperCase()})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-blue-500 transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Patente</label>
                    <select value={editingOfficer.rank} onChange={e => setEditingOfficer({...editingOfficer, rank: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:border-blue-500 transition-all">
                       {allPossibleRanks.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                 </div>
                 <div className="flex gap-4 pt-6">
                    <button onClick={() => setEditingOfficer(null)} className="flex-1 py-4 bg-white/5 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancelar</button>
                    <button onClick={() => { onUpdate?.(editingOfficer); setEditingOfficer(null); }} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Salvar Alterações</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default UsersSection;
