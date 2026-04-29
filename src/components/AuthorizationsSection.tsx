
import React, { useState, useEffect } from 'react';

interface AuthItem {
  name: string;
  perm: string;
  group: string;
  img: string;
  color: string;
  bg: string;
  items?: string[]; // Para kits de armamento
}

interface AuthorizationsSectionProps {
  isAdmin?: boolean;
}

const DEFAULT_VEHICLES: AuthItem[] = [
  // --- GUARDAS / GERAL ---
  { name: 'Vapid Scout', perm: 'GUARDAS', group: 'G', img: 'https://i.imgur.com/O6r49Uo.png', color: 'text-emerald-500', bg: 'border-emerald-500/20' },
  { name: 'Torrence', perm: 'GUARDAS', group: 'G', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800', color: 'text-emerald-500', bg: 'border-emerald-500/20' },
  { name: 'Oracle', perm: 'GUARDAS', group: 'G', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800', color: 'text-emerald-500', bg: 'border-emerald-500/20' },
  { name: 'Bicicleta', perm: 'TODA A GNR', group: 'G', img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800', color: 'text-emerald-400', bg: 'border-emerald-400/20' },
  { name: 'Mota', perm: '@SARGENTOS', group: 'S', img: 'https://images.unsplash.com/photo-1558981403-c5f9199ad250?auto=format&fit=crop&q=80&w=800', color: 'text-blue-400', bg: 'border-blue-400/20' },

  // --- UNIDADES ESPECIAIS (DI / GIOE) ---
  { name: 'Alamo', perm: '@🚨 | Destacamento de Intervenção / @💀 | G.I.O.E.', group: 'DI', img: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800', color: 'text-red-500', bg: 'border-red-500/20' },
  { name: 'Rebla GTS', perm: '@🚨 | Destacamento de Intervenção / @💀 | G.I.O.E.', group: 'DI', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800', color: 'text-red-500', bg: 'border-red-500/20' },
  { name: 'Vapid Speedo', perm: '@🚨 | Destacamento de Intervenção / @💀 | G.I.O.E.', group: 'DI', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800', color: 'text-red-500', bg: 'border-red-500/20' },
  { name: 'Benefactor Jogger', perm: '@🚨 | Destacamento de Intervenção (Ou Aut. OFICIAIS)', group: 'DI', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800', color: 'text-red-400', bg: 'border-red-400/20' },
  { name: 'Jogger Descaracterizada', perm: '@💀 | G.I.O.E. / @🕵️‍♂️ | N.I.C.', group: 'GIOE', img: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&q=80&w=800', color: 'text-slate-200', bg: 'border-white/10' },
  { name: 'Blindado', perm: 'ESTRITAMENTE @💀 | G.I.O.E.', group: 'HVT', img: 'https://images.unsplash.com/photo-1599812411672-f2433d395781?auto=format&fit=crop&q=80&w=800', color: 'text-slate-900', bg: 'border-red-600/40' },

  // --- UNIDADE NACIONAL DE TRÂNSITO (UNT) ---
  { name: 'Comet S2 (UNT)', perm: '@🚓 | Comando ● UNT', group: 'UNT', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800', color: 'text-amber-500', bg: 'border-amber-500/20' },
  { name: 'Schlagen', perm: 'Toda a @🚓 | Unidade Nacional de Trânsito', group: 'UNT', img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800', color: 'text-blue-500', bg: 'border-blue-500/20' },
  { name: 'Obey Tailgater (UNT)', perm: 'Toda a @🚓 | Unidade Nacional de Trânsito', group: 'UNT', img: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800', color: 'text-blue-500', bg: 'border-blue-500/20' },
  { name: 'Rhinehart (UNT)', perm: 'Toda a @🚓 | Unidade Nacional de Trânsito', group: 'UNT', img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800', color: 'text-blue-500', bg: 'border-blue-500/20' },

  // --- MARÍTIMO E SOCORRO (UEPS) ---
  { name: 'Barco UCC', perm: '@🧯 | U.E.P.S. (Ativa) / @SARGENTOS', group: 'UCC', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800', color: 'text-cyan-400', bg: 'border-cyan-400/20' },
  { name: 'Jetski', perm: '@🧯 | U.E.P.S. (Ativa) / @GUARDAS', group: 'UCC', img: 'https://images.unsplash.com/photo-1517026575980-3e1e2dedeab4?auto=format&fit=crop&q=80&w=800', color: 'text-cyan-400', bg: 'border-cyan-400/20' },

  // --- AEREO (GSA) ---
  { name: 'Eagle GNR', perm: '@🦅 | Certificado de Piloto (GSA)', group: 'GSA', img: 'https://images.unsplash.com/photo-1540962351504-03099e0a75c3?auto=format&fit=crop&q=80&w=800', color: 'text-amber-400', bg: 'border-amber-400/20' },
  { name: 'Eagle GIOE', perm: '@💀 | G.I.O.E. + @🦅 | Certificado de Piloto', group: 'GSA', img: 'https://images.unsplash.com/photo-1464039397811-476f652a343b?auto=format&fit=crop&q=80&w=800', color: 'text-red-600', bg: 'border-red-600/20' },
];

const DEFAULT_WEAPONS: AuthItem[] = [
  { 
    name: 'Kit de Patrulha', 
    perm: 'TODA A GNR', 
    group: 'KIT', 
    img: 'https://images.unsplash.com/photo-1615948812087-07d35599f4ee?auto=format&fit=crop&q=80&w=800', 
    color: 'text-emerald-500', 
    bg: 'border-emerald-500/20',
    items: ['Pistola de Combate', 'Taser', 'Cacetete', 'Algemas', 'Lanterna']
  },
  { 
    name: 'Shotgun de Borracha', 
    perm: 'A partir de @Guarda Principal', 
    group: 'SG', 
    img: 'https://images.unsplash.com/photo-1584010373243-7640b3b49910?auto=format&fit=crop&q=80&w=800', 
    color: 'text-emerald-400', 
    bg: 'border-emerald-500/20' 
  },
  { 
    name: 'SMG MP5', 
    perm: 'A partir de @Cabo', 
    group: 'SMG', 
    img: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&q=80&w=800', 
    color: 'text-teal-400', 
    bg: 'border-teal-500/20' 
  },
  { 
    name: 'Carabina', 
    perm: '@SARGENTOS', 
    group: 'AR', 
    img: 'https://images.unsplash.com/photo-1582264426524-77e841961633?auto=format&fit=crop&q=80&w=800', 
    color: 'text-blue-500', 
    bg: 'border-blue-500/20' 
  },
  { 
    name: 'Carabina MK2', 
    perm: '@OFICIAIS', 
    group: 'AR+', 
    img: 'https://images.unsplash.com/photo-1582264426524-77e841961633?auto=format&fit=crop&q=80&w=800', 
    color: 'text-purple-500', 
    bg: 'border-purple-500/20' 
  },
];

const AuthorizationsSection: React.FC<AuthorizationsSectionProps> = ({ isAdmin }) => {
  const [activeSubTab, setActiveSubTab] = useState<'frota' | 'armamento'>('frota');
  
  const [vehicles, setVehicles] = useState<AuthItem[]>(() => {
    const saved = localStorage.getItem('gnr_vehicle_data_v3');
    return saved ? JSON.parse(saved) : DEFAULT_VEHICLES;
  });

  const [weapons, setWeapons] = useState<AuthItem[]>(() => {
    const saved = localStorage.getItem('gnr_weapon_data_v3');
    return saved ? JSON.parse(saved) : DEFAULT_WEAPONS;
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempUrl, setTempUrl] = useState('');

  const currentList = activeSubTab === 'frota' ? vehicles : weapons;

  const startEditing = (idx: number) => {
    setEditingIndex(idx);
    setTempUrl(currentList[idx].img);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setTempUrl('');
  };

  const saveUrl = (idx: number) => {
    if (activeSubTab === 'frota') {
      const newList = [...vehicles];
      newList[idx] = { ...newList[idx], img: tempUrl.trim() };
      setVehicles(newList);
      localStorage.setItem('gnr_vehicle_data_v3', JSON.stringify(newList));
    } else {
      const newList = [...weapons];
      newList[idx] = { ...newList[idx], img: tempUrl.trim() };
      setWeapons(newList);
      localStorage.setItem('gnr_weapon_data_v3', JSON.stringify(newList));
    }
    setEditingIndex(null);
  };

  const resetToDefault = () => {
    if (confirm("Deseja restaurar as predefinições de " + activeSubTab.toUpperCase() + "?")) {
      if (activeSubTab === 'frota') {
        setVehicles(DEFAULT_VEHICLES);
        localStorage.setItem('gnr_vehicle_data_v3', JSON.stringify(DEFAULT_VEHICLES));
      } else {
        setWeapons(DEFAULT_WEAPONS);
        localStorage.setItem('gnr_weapon_data_v3', JSON.stringify(DEFAULT_WEAPONS));
      }
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-20">
      <div className="border-b border-white/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div>
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Autorizações</h2>
          <p className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.4em] mt-5 flex items-center gap-4 italic">
             <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
             Protocolo Operacional • {activeSubTab === 'frota' ? 'Frota de Viatura' : 'Arsenal de Armamento'}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="bg-black/40 p-1.5 rounded-2xl border border-white/5 flex gap-2">
            <button 
              onClick={() => { setActiveSubTab('frota'); setEditingIndex(null); }}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'frota' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-white'}`}
            >
              Frota
            </button>
            <button 
              onClick={() => { setActiveSubTab('armamento'); setEditingIndex(null); }}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'armamento' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-white'}`}
            >
              Armamento
            </button>
          </div>

          {isAdmin && (
            <div className="flex gap-4">
              <button 
                onClick={resetToDefault}
                className="bg-white/5 border border-white/10 text-slate-400 px-6 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Reset {activeSubTab}
              </button>
              <div className="bg-amber-600/10 border border-amber-600/20 px-6 py-3 rounded-xl">
                <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest italic animate-pulse">Acesso Comando Ativo</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {currentList.map((v, i) => (
          <div key={i} className={`bg-black/40 border rounded-[2.5rem] overflow-hidden group hover:border-white/20 transition-all shadow-2xl relative ${v.bg}`}>
            <div className="h-64 relative overflow-hidden">
               <img src={v.img} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000" alt={v.name} />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
               
               {/* Overlay de Edição Inline */}
               {editingIndex === i ? (
                 <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-40 p-6 flex flex-col justify-center items-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Nova URL de Média</p>
                    <input 
                      type="text" 
                      value={tempUrl}
                      onChange={(e) => setTempUrl(e.target.value)}
                      className="w-full bg-white/5 border border-amber-600/30 rounded-xl px-4 py-2 text-[10px] text-white focus:outline-none focus:border-amber-500"
                      autoFocus
                    />
                    <div className="flex gap-2 w-full">
                       <button 
                         onClick={() => saveUrl(i)}
                         className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-[9px] font-black uppercase tracking-widest"
                       >
                         Guardar
                       </button>
                       <button 
                         onClick={cancelEditing}
                         className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl text-[9px] font-black uppercase tracking-widest"
                       >
                         Cancelar
                       </button>
                    </div>
                 </div>
               ) : (
                 isAdmin && (
                   <button 
                     onClick={(e) => { e.stopPropagation(); startEditing(i); }}
                     className="absolute top-6 left-6 bg-amber-600 hover:bg-amber-500 text-white p-3 rounded-2xl shadow-2xl transition-all active:scale-90 z-30 flex items-center gap-2"
                   >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                      <span className="text-[8px] font-black uppercase tracking-widest">Alterar Media</span>
                   </button>
                 )
               )}

               <div className="absolute top-6 right-6 z-30">
                  <div className={`w-12 h-12 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center font-black italic ${v.color}`}>
                     {v.group}
                  </div>
               </div>
            </div>

            <div className="p-10 relative">
               <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] mb-1">
                      {activeSubTab === 'frota' ? 'Modelo de Unidade' : 'Especificação Tática'}
                    </p>
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">{v.name}</h3>
                  </div>
               </div>

               <div className="space-y-6">
                  {v.items && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {v.items.map((item, idx) => (
                        <span key={idx} className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-[8px] font-black text-slate-300 uppercase italic">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                     <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-3 italic">Habilitação Requerida</p>
                     <div className="flex items-start gap-3">
                        <div className={`w-1.5 h-4 mt-1 rounded-full bg-current shrink-0 ${v.color}`}></div>
                        <span className={`text-[11px] font-black uppercase italic tracking-wider leading-relaxed ${v.color}`}>
                           {v.perm}
                        </span>
                     </div>
                  </div>
               </div>

               <div className="mt-8 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                    {activeSubTab === 'frota' ? 'Protocolo S9-Frota' : 'Protocolo S9-Arsenal'}
                  </span>
                  <div className="flex gap-1">
                     <div className="w-1 h-1 rounded-full bg-white/20"></div>
                     <div className="w-4 h-1 rounded-full bg-white/20"></div>
                  </div>
               </div>
            </div>
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(0,255,0,0.01),rgba(0,255,0,0.01),rgba(0,255,0,0.01))] bg-[length:100%_2px,3px_100%] opacity-20 z-0"></div>
          </div>
        ))}
      </div>

      <div className="bg-emerald-950/10 border border-emerald-500/10 p-10 rounded-[3rem] text-center">
         <p className="text-[10px] text-emerald-800 font-black uppercase tracking-[0.4em] mb-4 italic">Diretrizes Operacionais</p>
         <p className="text-xs text-slate-400 italic leading-relaxed max-w-3xl mx-auto">
            A utilização de equipamentos ou viaturas fora da patente permitida sem autorização expressa do Comando-Geral resultará em <span className="text-white font-bold underline">Processo Disciplinar</span>. O Arsenal Diamond é monitorizado via RFID.
         </p>
      </div>
    </div>
  );
};

export default AuthorizationsSection;
