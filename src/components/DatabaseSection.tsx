
import React, { useState } from 'react';
import { Citizen } from '../types';

const DatabaseSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Citizen[]>([]);
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);

  const mockDB: Citizen[] = [
    { id: '1', name: 'António Rodrigues', nif: '254110221', crime: 'Condução sem habilitação', status: 'Clean', address: 'Av. Brasil 12, Lisboa', notes: 'Frequentador assíduo da baixa lisboeta.' },
    { id: '2', name: 'Maria Silva', nif: '198776554', crime: 'Nenhum', status: 'Clean', address: 'Rua de Faro, Setúbal', notes: 'Sem antecedentes.' },
    { id: '3', name: 'Carlos Santos', nif: '233445556', crime: 'Tráfico (Art. 21)', status: 'Wanted', address: 'Bairro Alto, Lisboa', notes: 'Suspeito de pertencer a rede organizada.' },
  ];

  const searchDB = () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const filtered = mockDB.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.nif.includes(query)
    );
    setResults(filtered);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') searchDB();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">BASE DE DADOS INTEGRADA</h2>
        <p className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.5em] italic">Acesso Restrito • Monitorização de NIF/Matrícula</p>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative group">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="PESQUISAR POR NOME OU NIF..." 
          className="w-full bg-black/60 border-2 border-emerald-900/30 rounded-[2.5rem] px-10 py-8 text-xl font-black text-emerald-400 placeholder:text-emerald-900 uppercase focus:outline-none focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 transition-all shadow-2xl"
        />
        <button 
          onClick={searchDB}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-emerald-600 p-5 rounded-full text-white hover:bg-emerald-500 transition-all shadow-xl active:scale-90"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </button>
      </div>

      {/* Detalhes do Cidadão Selecionado (Modal Simulado) */}
      {selectedCitizen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-[#0b1612] border border-emerald-500/20 w-full max-w-2xl rounded-[3rem] p-10 relative shadow-[0_0_100px_rgba(16,185,129,0.1)]">
              <button 
                onClick={() => setSelectedCitizen(null)}
                className="absolute top-8 right-8 text-emerald-900 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              
              <div className="flex items-center gap-8 mb-10">
                 <div className="w-24 h-24 bg-emerald-900/20 rounded-3xl border border-emerald-500/20 flex items-center justify-center">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedCitizen.name}`} className="w-20 h-20" alt="" />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black text-white italic uppercase">{selectedCitizen.name}</h3>
                    <p className="text-emerald-500 text-xs font-black uppercase tracking-widest mt-2">NIF: {selectedCitizen.nif}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="bg-black/40 p-6 rounded-2xl border border-emerald-900/10">
                    <p className="text-[9px] text-emerald-900 font-black uppercase mb-2">Estado Jurídico</p>
                    <span className={`text-sm font-black uppercase italic ${selectedCitizen.status === 'Wanted' ? 'text-red-500' : 'text-emerald-500'}`}>
                      {selectedCitizen.status === 'Wanted' ? 'PROCURADO (MANDADO ATIVO)' : 'LIMPO'}
                    </span>
                 </div>
                 <div className="bg-black/40 p-6 rounded-2xl border border-emerald-900/10">
                    <p className="text-[9px] text-emerald-900 font-black uppercase mb-2">Carga Criminal</p>
                    <span className="text-sm font-black text-slate-200 uppercase">{selectedCitizen.crime}</span>
                 </div>
                 <div className="col-span-2 bg-black/40 p-6 rounded-2xl border border-emerald-900/10">
                    <p className="text-[9px] text-emerald-900 font-black uppercase mb-2">Morada Conhecida</p>
                    <span className="text-sm font-bold text-slate-400">{selectedCitizen.address}</span>
                 </div>
                 <div className="col-span-2 bg-black/40 p-6 rounded-2xl border border-emerald-900/10">
                    <p className="text-[9px] text-emerald-900 font-black uppercase mb-2">Observações do Comando</p>
                    <p className="text-xs text-slate-500 leading-relaxed italic">{selectedCitizen.notes}</p>
                 </div>
              </div>

              <div className="mt-10 flex gap-4">
                 <button className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all">EMITIR MULTA</button>
                 {selectedCitizen.status === 'Wanted' ? (
                   <button className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all">REGISTAR DETENÇÃO</button>
                 ) : (
                   <button className="flex-1 py-4 bg-emerald-900/20 text-emerald-500 border border-emerald-500/20 rounded-2xl font-black uppercase tracking-widest transition-all">LEVANTAR MANDADO</button>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Resultados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
        {results.length > 0 ? results.map(p => (
          <div 
            key={p.id} 
            onClick={() => setSelectedCitizen(p)}
            className="bg-emerald-950/10 border border-emerald-900/30 rounded-3xl p-8 hover:border-emerald-500/40 transition-all group relative overflow-hidden cursor-pointer active:scale-95"
          >
            <div className={`absolute top-0 right-0 px-6 py-2 text-[10px] font-black uppercase italic ${
              p.status === 'Wanted' ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-600 text-white'
            }`}>
              {p.status}
            </div>
            
            <div className="flex items-center gap-6 mb-8">
               <div className="w-16 h-16 bg-emerald-900/20 rounded-2xl border border-emerald-500/20 flex items-center justify-center">
                  <svg className="w-10 h-10 text-emerald-700" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
               </div>
               <div>
                 <h4 className="text-xl font-black text-white italic uppercase leading-none">{p.name}</h4>
                 <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-2">NIF: {p.nif}</p>
               </div>
            </div>

            <div className="space-y-3">
               <div className="flex justify-between items-center py-2 border-b border-emerald-900/10">
                  <span className="text-[9px] text-emerald-900 font-black uppercase">Residência</span>
                  <span className="text-[10px] text-slate-300 font-bold truncate ml-4">{p.address}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-emerald-900/10">
                  <span className="text-[9px] text-emerald-900 font-black uppercase">Carga Criminal</span>
                  <span className={`text-[10px] font-black uppercase italic ${p.crime === 'Nenhum' ? 'text-emerald-500' : 'text-red-500'}`}>{p.crime}</span>
               </div>
            </div>
            
            <p className="mt-4 text-[9px] text-emerald-700 font-black uppercase tracking-widest italic group-hover:text-emerald-400 text-center">Clique para ver ficha completa</p>
          </div>
        )) : query && (
          <div className="col-span-full py-20 text-center bg-black/20 rounded-[3rem] border border-dashed border-emerald-900/30">
             <p className="text-emerald-900 text-xl font-black italic uppercase tracking-widest opacity-30">Nenhum Registo Encontrado na Base Central</p>
          </div>
        )}
      </div>

      {/* Veículos Quick Check */}
      <div className="pt-20">
         <h3 className="text-xs font-black text-emerald-900 uppercase tracking-[0.4em] mb-8 italic">PESQUISA RÁPIDA DE VIATURA</h3>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['11-AA-22', 'ZZ-99-XX', 'LL-11-22', '00-00-AA'].map(plate => (
              <div key={plate} className="bg-black/40 border border-emerald-900/30 p-6 rounded-2xl text-center hover:border-emerald-500/50 transition-all cursor-pointer group">
                 <div className="text-[11px] font-mono text-white font-black bg-blue-900/20 px-3 py-1 rounded inline-block border border-blue-500/20 mb-2 group-hover:bg-blue-600 transition-colors">{plate}</div>
                 <p className="text-[8px] text-emerald-800 font-black uppercase">Seguro Válido</p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default DatabaseSection;
