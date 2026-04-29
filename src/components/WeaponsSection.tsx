
import React, { useState } from 'react';
import { WeaponRegistry } from '../types';
import { getLocalWeapons, saveWeaponLocally, deleteWeaponLocally, updateWeaponLocally } from '../services/dataService';

interface WeaponsSectionProps {
  isAdmin: boolean;
}

const WeaponsSection: React.FC<WeaponsSectionProps> = ({ isAdmin }) => {
  const [weapons, setWeapons] = useState<WeaponRegistry[]>(() => getLocalWeapons());
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedPermitWeapon, setSelectedPermitWeapon] = useState<WeaponRegistry | null>(null);

  const [formData, setFormData] = useState<Partial<WeaponRegistry>>({
    serialNumber: '',
    weaponType: 'Pistola (Glock 17)',
    ownerName: '',
    ownerNif: '',
    status: 'PENDENTE',
    notes: ''
  });

  const weaponModels = [
    { label: 'Glock 17 (Pistola de Combate)', value: 'Pistola (Glock 17)' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newWeapon: WeaponRegistry = {
      ...(formData as WeaponRegistry),
      id: `ARM-${Date.now()}`,
      registrationDate: new Date().toLocaleDateString('pt-PT'),
    };
    setWeapons(saveWeaponLocally(newWeapon));
    setShowForm(false);
    setFormData({ serialNumber: '', weaponType: 'Pistola (Glock 17)', ownerName: '', ownerNif: '', status: 'PENDENTE', notes: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm("REMOVER REGISTO DE ARMA DO SISTEMA?")) {
      setWeapons(deleteWeaponLocally(id));
    }
  };

  const handleUpdateStatus = (id: string, status: WeaponRegistry['status']) => {
    const weapon = weapons.find(w => w.id === id);
    if (weapon) {
      setWeapons(updateWeaponLocally({ ...weapon, status }));
    }
  };

  const filteredWeapons = weapons.filter(w => 
    w.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.ownerNif.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LEGALIZADA': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'ILEGAL': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'APREENDIDA': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <style>{`
        .weapon-input:focus {
          box-shadow: 0 0 15px rgba(37, 99, 235, 0.2);
        }
        .weapon-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .permit-card {
          width: 500px;
          height: 300px;
          background: #f8fafc;
          border-radius: 20px;
          color: #0f172a;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          font-family: 'Inter', sans-serif;
          border: 1px solid rgba(0,0,0,0.1);
        }
        .permit-header {
          background: linear-gradient(90deg, #065f46 0%, #059669 50%, #dc2626 100%);
          height: 12px;
          width: 100%;
        }
        .hologram-seal {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%);
          border-radius: 50%;
          opacity: 0.6;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(0,0,0,0.1);
        }
        @media print {
          .no-print { display: none !important; }
          .print-center { display: flex !important; justify-content: center !important; align-items: center !important; height: 100vh !important; }
        }
      `}</style>

      {/* HEADER */}
      <div className="border-b border-white/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div>
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Arquivo de Armamento</h2>
          <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mt-5 flex items-center gap-4 italic transition-all">
             <span className="w-2.5 h-2.5 bg-blue-600 animate-pulse shadow-[0_0_10px_#2563eb]"></span>
             SISTEMA DE RASTREIO BÉLICO • DIAMOND S9
          </p>
        </div>

        <div className="flex flex-wrap gap-4 w-full md:w-auto">
           <div className="relative flex-1 md:w-80">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input 
                type="text" 
                placeholder="PROCURAR POR SÉRIE, NOME OU NIF..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-6 py-3.5 text-xs font-black text-white focus:border-blue-500 outline-none uppercase transition-all"
              />
           </div>
           <button 
             onClick={() => setShowForm(!showForm)}
             className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-2 ${showForm ? 'bg-red-600/20 text-red-500 border border-red-500/30' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"}/></svg>
             {showForm ? 'FECHAR REGISTO' : 'REGISTAR ARMAMENTO'}
           </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#05080c] border border-blue-900/20 p-10 rounded-[3rem] space-y-8 animate-in slide-in-from-top-4 duration-500 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 text-blue-500/5 pointer-events-none">
              <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">NÚMERO DE SÉRIE (SERIAL NUMBER) *</label>
                 <div className="relative">
                    <input 
                      required 
                      value={formData.serialNumber} 
                      onChange={e => setFormData({...formData, serialNumber: e.target.value})} 
                      className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-sm font-mono font-black text-blue-400 focus:border-blue-500 outline-none uppercase transition-all weapon-input" 
                      placeholder="EX: GNR-0001-X" 
                    />
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>
                 </div>
              </div>
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">MODELO DE ARMAMENTO (GLOCK APENAS) *</label>
                 <div className="relative">
                    <select 
                      required
                      value={formData.weaponType} 
                      onChange={e => setFormData({...formData, weaponType: e.target.value})} 
                      className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-black text-white focus:border-blue-500 outline-none uppercase appearance-none cursor-pointer"
                    >
                       {weaponModels.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">NOME COMPLETO DO PROPRIETÁRIO</label>
                 <input 
                   required 
                   value={formData.ownerName} 
                   onChange={e => setFormData({...formData, ownerName: e.target.value})} 
                   className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-black text-white focus:border-blue-500 outline-none uppercase weapon-input" 
                   placeholder="NOME DO CIDADÃO" 
                 />
              </div>
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">NIF DE REGISTO</label>
                 <input 
                   required 
                   value={formData.ownerNif} 
                   onChange={e => setFormData({...formData, ownerNif: e.target.value})} 
                   className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-xs font-black text-white focus:border-blue-500 outline-none uppercase weapon-input" 
                   placeholder="IDENTIFICAÇÃO FISCAL" 
                 />
              </div>
           </div>

           <div className="space-y-3 relative z-10">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">OBSERVAÇÕES TÉCNICAS E ESTADO DE CONSERVAÇÃO</label>
              <textarea 
                value={formData.notes} 
                onChange={e => setFormData({...formData, notes: e.target.value})} 
                className="w-full bg-black border border-white/10 rounded-2xl p-6 text-xs text-slate-300 outline-none focus:border-blue-500 h-24 resize-none italic" 
                placeholder="Ex: Arma nova na caixa, possui laser montado, desgaste no cabo..." 
              />
           </div>

           <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 relative z-10">
              ARQUIVAR REGISTO BÉLICO NO TERMINAL
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
           </button>
        </form>
      )}

      {/* LISTA DE ARMAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredWeapons.length > 0 ? filteredWeapons.map((w) => (
          <div key={w.id} className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] group hover:border-blue-500/20 transition-all duration-300 flex flex-col shadow-xl relative overflow-hidden weapon-card-hover">
             <div className="flex justify-between items-start mb-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-black text-blue-500/50">REF_{w.id.slice(-6)}</span>
                  <span className="text-[8px] text-slate-700 font-bold uppercase mt-1">{w.registrationDate}</span>
                </div>
                <span className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getStatusColor(w.status)}`}>
                  {w.status}
                </span>
             </div>

             <div className="mb-8">
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-2 italic">Número de Série (Encrip.)</p>
                <h3 className="text-3xl font-mono font-black text-white uppercase tracking-tighter truncate group-hover:text-blue-400 transition-colors">{w.serialNumber}</h3>
             </div>

             <div className="space-y-4 flex-1">
                <div className="flex items-center gap-4 bg-white/5 p-5 rounded-2xl border border-white/5 group-hover:bg-blue-600/5 transition-colors">
                   <div className="w-10 h-10 rounded-xl bg-blue-900/20 flex items-center justify-center text-blue-500 shrink-0">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                   </div>
                   <div className="min-w-0">
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Proprietário Legal</p>
                      <p className="text-xs font-black text-white italic uppercase truncate">{w.ownerName}</p>
                      <p className="text-[9px] text-blue-500 font-bold">NIF: {w.ownerNif}</p>
                   </div>
                </div>
                
                <div className="flex justify-between items-center px-2 py-3 bg-black/20 rounded-xl">
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Modelo Detetado</span>
                   <span className="text-[10px] font-black text-slate-200 italic uppercase">{w.weaponType}</span>
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                <div className="flex gap-4">
                   {isAdmin && (
                     <>
                       <button onClick={() => handleUpdateStatus(w.id, 'LEGALIZADA')} className="text-[8px] font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-tighter hover:underline">LEGAL</button>
                       <button onClick={() => handleUpdateStatus(w.id, 'APREENDIDA')} className="text-[8px] font-black text-amber-500 hover:text-amber-400 uppercase tracking-tighter hover:underline">APREENDER</button>
                     </>
                   )}
                   {w.status === 'LEGALIZADA' && (
                     <button 
                       onClick={() => setSelectedPermitWeapon(w)}
                       className="bg-emerald-600/20 text-emerald-500 border border-emerald-500/30 px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                     >
                       Emitir LUPA
                     </button>
                   )}
                </div>
                {isAdmin && (
                  <button onClick={() => handleDelete(w.id)} className="text-slate-800 hover:text-red-600 transition-all p-2 rounded-lg hover:bg-red-500/10">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                )}
             </div>
             
             {/* CRT Effect Overlay */}
             <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(37,99,235,0)_50%,rgba(37,99,235,0.1)_50%)] bg-[length:100%_2px]"></div>
          </div>
        )) : (
          <div className="col-span-full py-40 text-center bg-black/20 rounded-[4rem] border border-dashed border-white/5">
             <div className="w-24 h-24 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.268 0 2.49.234 3.62.661m-1.756 3.39a3 3 0 00-4.632 0m4.632 0a3 3 0 011.023 3.67m-1.164 2.025a10.003 10.003 0 01-1.746 3.419m-3.374-1.213a3 3 0 114.668 0m3.115 1.004a10.025 10.025 0 01-4.459 2.082"/></svg>
             </div>
             <p className="text-xl font-black italic uppercase tracking-widest text-slate-800">Sem registos de armamento no arquivo central</p>
          </div>
        )}
      </div>

      {/* MODAL DO CARTÃO DE ARMAS (LUPA) */}
      {selectedPermitWeapon && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-10">
            <div className="flex justify-between items-center w-full no-print px-4">
              <button onClick={() => window.print()} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-2xl flex items-center gap-2">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                 Imprimir Cartão
              </button>
              <button onClick={() => setSelectedPermitWeapon(null)} className="text-white hover:text-red-500 transition-all">
                 <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="print-center">
              <div className="permit-card">
                 <div className="permit-header"></div>
                 
                 <div className="p-8 flex gap-8 h-full">
                    {/* Foto ID */}
                    <div className="w-32 h-40 bg-slate-200 border-2 border-slate-300 rounded-xl overflow-hidden shadow-inner shrink-0 relative group">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPermitWeapon.ownerName}`} className="w-full h-full object-cover" alt="" />
                       <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none"></div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                       <div>
                          <div className="flex justify-between items-start">
                             <div>
                                <h3 className="text-[10px] font-black text-emerald-900 uppercase tracking-widest leading-none">República Portuguesa</h3>
                                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Guarda Nacional Republicana</p>
                             </div>
                             <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center p-1 shadow-lg">
                                <svg className="text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                             </div>
                          </div>

                          <h2 className="text-lg font-black text-slate-900 uppercase italic mt-4 border-b border-slate-200 pb-1">Licença L.U.P.A.</h2>
                       </div>

                       <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-2">
                          <div>
                             <p className="text-[7px] font-black text-slate-400 uppercase">Titular</p>
                             <p className="text-[11px] font-black text-slate-900 uppercase truncate">{selectedPermitWeapon.ownerName}</p>
                          </div>
                          <div>
                             <p className="text-[7px] font-black text-slate-400 uppercase">NIF</p>
                             <p className="text-[11px] font-mono font-black text-slate-900">{selectedPermitWeapon.ownerNif}</p>
                          </div>
                          <div>
                             <p className="text-[7px] font-black text-slate-400 uppercase">Modelo Autorizado</p>
                             <p className="text-[10px] font-bold text-emerald-700 uppercase italic leading-none">{selectedPermitWeapon.weaponType}</p>
                          </div>
                          <div>
                             <p className="text-[7px] font-black text-slate-400 uppercase">Série da Arma</p>
                             <p className="text-[10px] font-mono font-black text-slate-900 leading-none">{selectedPermitWeapon.serialNumber}</p>
                          </div>
                       </div>

                       <div className="mt-auto flex justify-between items-end border-t border-slate-100 pt-3">
                          <div>
                             <p className="text-[7px] font-black text-slate-400 uppercase">Válido Desde</p>
                             <p className="text-[9px] font-black text-slate-600">{selectedPermitWeapon.registrationDate}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[7px] font-black text-slate-400 uppercase">Identificador Digital</p>
                             <p className="text-[9px] font-mono font-bold text-slate-400">ID_{selectedPermitWeapon.id.slice(-8)}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Selo Holográfico */}
                 <div className="hologram-seal">
                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                 </div>

                 {/* Assinatura Smurf Oliveira (Sutil no fundo) */}
                 <p className="absolute bottom-12 left-44 font-signature text-2xl text-indigo-900/10 -rotate-6 pointer-events-none">
                   Smurf Oliveira
                 </p>
                 
                 {/* Micro-texto de Segurança */}
                 <div className="absolute left-0 bottom-0 w-full bg-slate-100 px-8 py-1">
                    <p className="text-[5px] text-slate-400 uppercase tracking-widest font-black">DOCUMENTO EMITIDO PELO COMANDO GERAL DA GNR DIAMOND • USO EXCLUSIVO DO TITULAR • FISCALIZAÇÃO ATIVA SIGP-S9</p>
                 </div>
              </div>
            </div>
            
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic no-print max-w-sm text-center">
              A licença LUPA permite ao cidadão o porte discreto do modelo especificado. O uso indevido anula a licença imediatamente.
            </p>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="bg-blue-950/10 border border-blue-900/10 p-10 rounded-[3rem] text-center shadow-inner">
         <p className="text-blue-800 text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic">Protocolo de Segurança Diamond v2.0</p>
         <p className="text-xs text-slate-500 italic leading-relaxed max-w-3xl mx-auto uppercase">
            O registo do número de série é <span className="text-white font-bold underline">exigido por lei</span> para toda e qualquer arma de fogo pessoal autorizada. Armas sem registo válido são consideradas de <span className="text-red-600 font-bold">origem ilícita</span> e os proprietários serão processados conforme o Código Penal.
         </p>
      </div>
    </div>
  );
};

export default WeaponsSection;
