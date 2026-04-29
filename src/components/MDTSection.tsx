
import React, { useState } from 'react';
import { LogEntry, Officer } from '../types';

interface MDTSectionProps {
  title: string;
  type: string;
  records: LogEntry[];
  onAddRecord?: (record: LogEntry) => void;
  onUpdateRecord?: (record: LogEntry) => void;
  onDeleteRecord?: (id: string) => void;
  currentUser?: Officer | null;
  isAdmin?: boolean;
}

const MDTSection: React.FC<MDTSectionProps> = ({ title, records, onAddRecord, onUpdateRecord, currentUser, isAdmin, onDeleteRecord }) => {
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [involved, setInvolved] = useState('');
  const [selectedAuto, setSelectedAuto] = useState<LogEntry | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddRecord || !currentUser) return;

    const newRecord: LogEntry = {
      id: `AUTO-${Date.now()}`,
      userName: currentUser.name,
      type: 'relatorio',
      date: new Date().toLocaleString('pt-PT'),
      status: 'completed',
      description: `ENVOLVIDOS: ${involved}\n\nRELATO:\n${description}`,
      location: location,
      isAnnulled: false
    };

    onAddRecord(newRecord);
    setDescription('');
    setLocation('');
    setInvolved('');
    setShowForm(false);
  };

  const handleValidate = () => {
    if (!selectedAuto || !onUpdateRecord || !currentUser) return;
    
    const validatedAuto: LogEntry = {
      ...selectedAuto,
      signedBy: currentUser.name,
      signedDate: new Date().toLocaleString('pt-PT')
    };

    onUpdateRecord(validatedAuto);
    setSelectedAuto(validatedAuto);
    alert("AUTO VALIDADO PELO COMANDO GERAL.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <style>{`
        .a4-document {
          background: white;
          color: #1a1a1a;
          font-family: 'Times New Roman', Times, serif;
          line-height: 1.6;
          box-shadow: 0 0 50px rgba(0,0,0,0.5);
        }
        .a4-document h1, .a4-document h2 {
          font-family: 'Inter', sans-serif;
        }
        .stamp-validated {
          border: 4px double #059669;
          color: #059669;
          text-transform: uppercase;
          font-weight: 900;
          padding: 10px 20px;
          transform: rotate(-15deg);
          display: inline-block;
          font-family: 'Inter', sans-serif;
        }
        @media print {
          body * { visibility: hidden; }
          .print-container, .print-container * { visibility: visible; }
          .print-container { position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 0 !important; margin: 0 !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">{title}</h2>
          <p className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.4em] mt-4 italic">Sistema de Arquivo Operacional Diamond</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
          {showForm ? 'CANCELAR REGISTO' : 'NOVO AUTO DE OCORRÊNCIA'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-black/40 border border-emerald-900/20 p-10 rounded-[2.5rem] space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Localização da Ocorrência</label>
              <input 
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Ex: Praça da Legião / Garagem Central"
                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Indivíduos Envolvidos</label>
              <input 
                required
                value={involved}
                onChange={e => setInvolved(e.target.value)}
                placeholder="Nomes ou IDs dos suspeitos/vítimas"
                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Relatório Descritivo</label>
            <textarea 
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-xs text-white h-32 focus:border-emerald-500 outline-none transition-all resize-none italic"
              placeholder="Descreva detalhadamente a ocorrência e medidas tomadas..."
            />
          </div>
          <button type="submit" className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">Protocolar Auto no Sistema</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {records.map((record) => (
          <div 
            key={record.id} 
            onClick={() => setSelectedAuto(record)}
            className={`bg-black/40 border p-8 rounded-[2.5rem] hover:border-emerald-500/20 transition-all group relative overflow-hidden flex flex-col cursor-pointer active:scale-95 ${record.signedBy ? 'border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]' : 'border-white/5'}`}
          >
            {record.signedBy && (
              <div className="absolute top-0 right-0 px-4 py-1 bg-emerald-600 text-white text-[7px] font-black uppercase tracking-widest italic rounded-bl-xl">
                 VALIDADO PELO COMANDO
              </div>
            )}

            <div className="flex justify-between items-start mb-6">
              <span className="text-[10px] font-mono text-emerald-500/40">#{record.id.slice(-6)}</span>
              <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">{record.date}</span>
            </div>
            
            <div className="mb-4">
               <p className="text-[9px] text-emerald-700 font-black uppercase mb-1">Localização</p>
               <p className="text-xs font-black text-white uppercase italic truncate">{record.location || 'NÃO ESPECIFICADO'}</p>
            </div>

            <div className="flex-1">
               <p className="text-[9px] text-slate-600 font-black uppercase mb-2">Sumário dos Factos</p>
               <p className="text-[11px] text-slate-400 italic line-clamp-3 leading-relaxed">"{record.description}"</p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${record.signedBy ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-emerald-900'}`}></div>
                 <span className="text-[9px] font-black text-white uppercase italic">{record.userName}</span>
              </div>
              <div className="flex gap-4">
                 <span className="text-[8px] text-emerald-500 font-black uppercase opacity-0 group-hover:opacity-100 transition-all">Abrir Auto →</span>
                 {onDeleteRecord && (isAdmin || record.userName === currentUser?.name) && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteRecord(record.id); }}
                    className="text-red-900 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                 )}
              </div>
            </div>
          </div>
        ))}
        {records.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-10">
            <p className="text-xl font-black italic uppercase tracking-widest">Sem registos no arquivo central</p>
          </div>
        )}
      </div>

      {/* MODAL DE VISUALIZAÇÃO A4 */}
      {selectedAuto && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300 overflow-y-auto">
          <div className="w-full max-w-4xl h-fit my-auto">
            <div className="flex justify-between items-center mb-6 no-print">
               <div className="flex gap-4">
                  <button onClick={() => window.print()} className="bg-white text-black px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-2xl flex items-center gap-2">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
                     Imprimir Auto
                  </button>
                  {isAdmin && !selectedAuto.signedBy && (
                    <button onClick={handleValidate} className="bg-emerald-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-2xl flex items-center gap-2">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                       Validar (Comando Geral)
                    </button>
                  )}
               </div>
               <button onClick={() => setSelectedAuto(null)} className="text-white hover:text-red-500 transition-all p-2">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
               </button>
            </div>

            <div className="print-container a4-document p-16 md:p-24 bg-white text-black min-h-[1100px] flex flex-col relative overflow-hidden">
               {/* Cabeçalho Oficial */}
               <div className="flex justify-between items-start border-b-2 border-black pb-10 mb-16">
                  <div className="flex items-center gap-8">
                     <div className="w-20 h-20 border-2 border-black flex items-center justify-center">
                        <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                     </div>
                     <div>
                        <h1 className="text-2xl font-black uppercase leading-none tracking-tighter">Guarda Nacional Republicana</h1>
                        <p className="text-sm font-bold uppercase mt-1">Comando Territorial de Diamond</p>
                        <p className="text-[10px] font-bold opacity-60 uppercase mt-4 tracking-widest font-sans">Sistema Integrado de Gestão de Autos</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[9px] font-bold uppercase mb-1 font-sans">Auto de Notícia n.º</p>
                     <p className="text-xl font-black font-mono tracking-tighter">{selectedAuto.id}</p>
                     <p className="text-[10px] font-bold uppercase mt-4 font-sans italic opacity-60">{selectedAuto.date}</p>
                  </div>
               </div>

               {/* Corpo do Documento */}
               <div className="flex-1 space-y-12 text-lg">
                  <div className="grid grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase border-b border-black/10 pb-2 font-sans tracking-widest">Localização dos Factos</h4>
                        <p className="font-bold uppercase italic text-sm">{selectedAuto.location || "NÃO DECLARADO"}</p>
                     </div>
                     <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase border-b border-black/10 pb-2 font-sans tracking-widest">Oficial Instrutor</h4>
                        <p className="font-bold uppercase italic text-sm">{selectedAuto.userName}</p>
                     </div>
                  </div>

                  <div className="space-y-6 pt-6">
                     <h4 className="text-[11px] font-black uppercase border-b-2 border-black pb-2 font-sans tracking-[0.2em] italic">Relatório Detalhado da Ocorrência</h4>
                     <p className="text-justify whitespace-pre-wrap leading-relaxed text-sm italic">
                        {selectedAuto.description}
                     </p>
                  </div>

                  {selectedAuto.signedBy && (
                    <div className="pt-20 text-center animate-in zoom-in-50 duration-500">
                       <div className="stamp-validated">
                          <p className="text-[8px] font-black tracking-widest">Autenticado pelo Comando</p>
                          <p className="text-lg leading-none mt-1">SISTEMA VALIDADO</p>
                          <p className="text-[7px] font-black mt-2 font-mono">HASH: {btoa(selectedAuto.id).slice(0, 16)}</p>
                       </div>
                    </div>
                  )}
               </div>

               {/* Rodapé de Assinaturas */}
               <div className="mt-24 pt-10 border-t border-black/10 grid grid-cols-2 gap-20 text-center">
                  <div className="space-y-4">
                     <div className="h-0.5 bg-black/20 w-full mb-2"></div>
                     <p className="text-[10px] font-black uppercase font-sans">O Oficial Autuante</p>
                     <p className="text-xs font-bold font-serif italic">{selectedAuto.userName}</p>
                  </div>
                  <div className="space-y-4">
                     <div className="h-0.5 bg-black/20 w-full mb-2"></div>
                     <p className="text-[10px] font-black uppercase font-sans">Validação Superior</p>
                     <p className="text-xs font-bold font-serif italic">
                       {selectedAuto.signedBy ? selectedAuto.signedBy : "Aguardando Visto de Comando"}
                     </p>
                     {selectedAuto.signedDate && <p className="text-[8px] font-mono opacity-50">{selectedAuto.signedDate}</p>}
                  </div>
               </div>
               
               <div className="absolute bottom-10 left-0 w-full px-24 flex justify-between items-end opacity-20 pointer-events-none">
                  <p className="text-[8px] font-black uppercase font-sans">GNR-Diamond-OS v9.5</p>
                  <p className="text-[8px] font-black uppercase font-sans">Página 1 de 1</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MDTSection;
