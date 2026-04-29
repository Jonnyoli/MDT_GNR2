
import React, { useState, useEffect } from 'react';
import { IllegalSpot } from '../types';
import { getLocalSpots, saveSpotLocally, deleteSpotLocally } from '../services/dataService';

interface IllegalSpotsSectionProps {
  isAdmin: boolean;
}

const DEFAULT_INTEL_SPOTS: IllegalSpot[] = [
  { id: 'SPOT-001', name: 'PEÇAS (MARINE)', type: 'OUTRO', risk: 'MÉDIO', location: 'Marine', description: 'Ponto de recolha e desmantelamento de peças marítimas.', lastSeen: '01/01/2025', intelLevel: 65, image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800' },
  { id: 'SPOT-002', name: 'PEÇAS (AVIÕES)', type: 'OUTRO', risk: 'MÉDIO', location: 'Aviões', description: 'Recolha de componentes de aviação em zona de hangar.', lastSeen: '01/01/2025', intelLevel: 45, image: 'https://images.unsplash.com/photo-1540962351504-03099e0a75c3?auto=format&fit=crop&q=80&w=800' },
  { id: 'SPOT-003', name: 'ARMAS (HUMAN LABS)', type: 'OUTRO', risk: 'ALTO', location: 'Human Labs', description: 'Laboratório avançado com registo de produção bélica.', lastSeen: '01/01/2025', intelLevel: 80, image: 'https://images.unsplash.com/photo-1584010373243-7640b3b49910?auto=format&fit=crop&q=80&w=800' },
  { id: 'SPOT-004', name: 'CRAFT ARMAS EXCLUSIVA', type: 'OUTRO', risk: 'EXTREMO', location: 'Caçadores', description: 'Ponto crítico de fabrico de armamento de elite.', lastSeen: '01/01/2025', intelLevel: 95, image: 'https://images.unsplash.com/photo-1615948812087-07d35599f4ee?auto=format&fit=crop&q=80&w=800' },
  { id: 'SPOT-005', name: 'ACESSÓRIOS (CAÇADORES?)', type: 'OUTRO', risk: 'ALTO', location: 'Caçadores', description: 'Suspeita de venda de carregadores e miras táticas.', lastSeen: '01/01/2025', intelLevel: 30, image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&q=80&w=800' },
  { id: 'SPOT-006', name: 'BPS (BLUEPRINTS)', type: 'OUTRO', risk: 'ALTO', location: 'Barragem', description: 'Zona de troca de esquemas técnicos e blueprints de armas.', lastSeen: '01/01/2025', intelLevel: 70, image: 'https://images.unsplash.com/photo-1518005020251-5844898e0582?auto=format&fit=crop&q=80&w=800' },
  { id: 'SPOT-007', name: 'COCAÍNA', type: 'DROGA', risk: 'ALTO', location: 'Pescadores v2', description: 'Processamento e embalamento de pó branco em zona ribeirinha.', lastSeen: '01/01/2025', intelLevel: 85, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=800' },
  { id: 'SPOT-008', name: 'METANFETAMINA', type: 'DROGA', risk: 'ALTO', location: 'Pescadores', description: 'Cozinha de cristal ativa com alta movimentação de indivíduos.', lastSeen: '01/01/2025', intelLevel: 90, image: 'https://images.unsplash.com/photo-1512070632787-434026857467?auto=format&fit=crop&q=80&w=800' },
  { id: 'SPOT-009', name: 'ERVA (CANÁBIS)', type: 'DROGA', risk: 'MÉDIO', location: 'MSM SITIO', description: 'Estufa ou zona de cultivo recorrente em local isolado.', lastSeen: '01/01/2025', intelLevel: 55, image: 'https://images.unsplash.com/photo-1536631627125-9f5b3577d33d?auto=format&fit=crop&q=80&w=800' },
];

const IllegalSpotsSection: React.FC<IllegalSpotsSectionProps> = ({ isAdmin }) => {
  const [spots, setSpots] = useState<IllegalSpot[]>(() => {
    const local = getLocalSpots();
    return local.length > 0 ? local : DEFAULT_INTEL_SPOTS;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<IllegalSpot | null>(null);

  const [formData, setFormData] = useState<Partial<IllegalSpot>>({
    name: '',
    type: 'DROGA',
    risk: 'MÉDIO',
    location: '',
    description: '',
    intelLevel: 50,
    image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&q=80&w=800'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSpot: IllegalSpot = {
      ...(formData as IllegalSpot),
      id: `SPOT-${Date.now()}`,
      lastSeen: new Date().toLocaleDateString('pt-PT'),
    };
    const updated = [newSpot, ...spots];
    setSpots(updated);
    localStorage.setItem('gnr_data_illegal_spots', JSON.stringify(updated));
    setShowForm(false);
    setFormData({ name: '', type: 'DROGA', risk: 'MÉDIO', location: '', description: '', intelLevel: 50, image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&q=80&w=800' });
  };

  const filteredSpots = spots.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'EXTREMO': return 'text-red-500 border-red-500/20 bg-red-500/5';
      case 'ALTO': return 'text-orange-500 border-orange-500/20 bg-orange-500/5';
      case 'MÉDIO': return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
      default: return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("REMOVER SPOT DA BASE DE DADOS DE INTELIGÊNCIA?")) {
      const updated = spots.filter(s => s.id !== id);
      setSpots(updated);
      localStorage.setItem('gnr_data_illegal_spots', JSON.stringify(updated));
      setSelectedSpot(null);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* HEADER */}
      <div className="border-b border-white/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div>
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Mapeamento Criminal</h2>
          <p className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em] mt-5 flex items-center gap-4 italic transition-all">
             <span className="w-2.5 h-2.5 bg-red-600 animate-pulse shadow-[0_0_10px_#dc2626]"></span>
             Spots Ilegais e Pontos de Risco Ativos (SINC-SYNC)
          </p>
        </div>

        <div className="flex gap-4">
           <div className="relative w-80">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input 
                type="text" 
                placeholder="PESQUISAR PONTO OU TIPO..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-6 py-3.5 text-xs font-black text-white focus:border-red-500 outline-none uppercase transition-all"
              />
           </div>
           {isAdmin && (
             <button 
               onClick={() => setShowForm(!showForm)}
               className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-2"
             >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
               {showForm ? 'CANCELAR' : 'REGISTAR SPOT'}
             </button>
           )}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-black/40 border border-red-900/20 p-10 rounded-[2.5rem] space-y-8 animate-in slide-in-from-top-4 duration-500 max-w-4xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome do Spot</label>
                 <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-4 text-xs text-white focus:border-red-500 outline-none uppercase" placeholder="EX: DESMANCHE DE VESPUCCI" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Tipo</label>
                   <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-4 text-xs text-white focus:border-red-500 outline-none uppercase">
                      <option value="DROGA">DROGA</option>
                      <option value="DESMANCHE">DESMANCHE</option>
                      <option value="GANGUE">GANGUE</option>
                      <option value="LAVAGEM">LAVAGEM</option>
                      <option value="OUTRO">OUTRO / PEÇAS</option>
                   </select>
                </div>
                <div className="space-y-3">
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Risco</label>
                   <select value={formData.risk} onChange={e => setFormData({...formData, risk: e.target.value as any})} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-4 text-xs text-white focus:border-red-500 outline-none uppercase">
                      <option value="BAIXO">BAIXO</option>
                      <option value="MÉDIO">MÉDIO</option>
                      <option value="ALTO">ALTO</option>
                      <option value="EXTREMO">EXTREMO</option>
                   </select>
                </div>
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Localização (Texto)</label>
                 <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-4 text-xs text-white focus:border-red-500 outline-none uppercase" placeholder="EX: Sandy Shores, Beco do Ferro" />
              </div>
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">URL da Imagem de Intel</label>
                 <input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-4 text-xs text-white focus:border-red-500 outline-none" />
              </div>
           </div>
           <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Relatório de Inteligência</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-xs text-slate-300 outline-none focus:border-red-500 h-32 resize-none italic" placeholder="Descreva atividades observadas, facções dominantes, etc..." />
           </div>
           <button type="submit" className="w-full py-5 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">ARQUIVAR SPOT NO MDT</button>
        </form>
      )}

      {/* GRID DE SPOTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredSpots.map((spot) => (
          <div key={spot.id} onClick={() => setSelectedSpot(spot)} className="bg-black/40 border border-white/5 rounded-[3rem] overflow-hidden group hover:border-red-500/20 transition-all flex flex-col shadow-2xl relative cursor-pointer active:scale-95">
            <div className="h-56 relative overflow-hidden">
               <img src={spot.image} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000" alt="" />
               <div className="absolute top-6 left-6 flex gap-2">
                  <span className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getRiskColor(spot.risk)}`}>
                    RISCO {spot.risk}
                  </span>
                  <span className="bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-lg text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
                    {spot.type}
                  </span>
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            </div>

            <div className="p-8 space-y-6">
               <div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter truncate leading-none mb-1">{spot.name}</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase italic flex items-center gap-2">
                     <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                     {spot.location}
                  </p>
               </div>

               <div className="space-y-3">
                  <div className="flex justify-between items-center text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">
                     <span>Nível de Intel Coletada</span>
                     <span>{spot.intelLevel}%</span>
                  </div>
                  <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                     <div className="h-full bg-red-600 shadow-[0_0_10px_#dc2626]" style={{ width: `${spot.intelLevel}%` }}></div>
                  </div>
               </div>

               <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Última Transmissão: {spot.lastSeen}</span>
                  <span className="text-[8px] text-red-500 font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">Ver Dossier →</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE DETALHES DO SPOT */}
      {selectedSpot && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
           <div className="bg-[#05080c] border border-red-500/20 w-full max-w-4xl rounded-[3rem] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl relative">
              <div className="p-12 border-b border-white/5 flex justify-between items-center bg-red-950/10 relative overflow-hidden">
                 <div className="flex items-center gap-8 relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-black border border-red-500/20 flex items-center justify-center text-red-500 shadow-2xl">
                       <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.268 0 2.49.234 3.62.661m-1.756 3.39a3 3 0 00-4.632 0m4.632 0a3 3 0 011.023 3.67m-1.164 2.025a10.003 10.003 0 01-1.746 3.419m-3.374-1.213a3 3 0 114.668 0m3.115 1.004a10.025 10.025 0 01-4.459 2.082"/></svg>
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">{selectedSpot.name}</h3>
                       <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.4em] mt-3 italic flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_#dc2626]"></span>
                          Intel Digital: {selectedSpot.id}
                       </p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedSpot(null)} className="p-3 text-slate-700 hover:text-white hover:bg-white/5 rounded-2xl transition-all relative z-10">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <img src={selectedSpot.image} className="w-full h-80 object-cover rounded-[2.5rem] border border-white/5 shadow-2xl" alt="" />
                       <div className="bg-black/40 p-8 rounded-3xl border border-white/5">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">Geolocalização Aproximada</h4>
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg></div>
                             <p className="text-xl font-black text-white italic uppercase tracking-tighter">{selectedSpot.location}</p>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-8">
                       <div className={`p-8 rounded-3xl border ${getRiskColor(selectedSpot.risk)}`}>
                          <p className="text-[10px] font-black uppercase mb-2">Classificação de Risco</p>
                          <p className="text-3xl font-black italic tracking-tighter uppercase leading-none">PROTOCOLO {selectedSpot.risk}</p>
                       </div>
                       <div className="bg-black/40 border border-white/5 p-10 rounded-[2.5rem] space-y-6">
                          <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest italic flex items-center gap-3">
                             <div className="w-1 h-4 bg-red-600"></div>
                             Relatório Forense de Local
                          </h4>
                          <p className="text-sm text-slate-300 leading-relaxed italic whitespace-pre-wrap font-serif">
                             "{selectedSpot.description}"
                          </p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-black border-t border-white/5 flex justify-between items-center">
                 <div className="flex gap-4">
                    {isAdmin && (
                      <button 
                        onClick={() => handleDelete(selectedSpot.id)}
                        className="px-8 py-3 bg-red-950/40 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest border border-red-900/20 hover:bg-red-600 hover:text-white transition-all"
                      >
                        Excluir Registo
                      </button>
                    )}
                 </div>
                 <button onClick={() => window.print()} className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                    Exportar Intel
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="bg-red-950/10 border border-red-900/10 p-10 rounded-[3rem] text-center">
         <p className="text-red-800 text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">Protocolo de Monitorização Diamond</p>
         <p className="text-xs text-slate-500 italic leading-relaxed max-w-3xl mx-auto uppercase">
            O mapeamento de spots ilegais é um trabalho contínuo do <span className="text-white font-bold underline">N.I.C.</span>. Patrulhas devem manter distância segura e solicitar apoio aéreo para vigilância discreta nestas zonas.
         </p>
      </div>
    </div>
  );
};

export default IllegalSpotsSection;
