
import React from 'react';

const CasesSection: React.FC = () => {
  const cases = [
    { id: '#23-901', title: 'Homicídio Qualificado', loc: 'Vinewood Hills', suspect: 'Desconhecido', officer: 'Det. Silva', date: '24/10/2023', priority: 'ALTA', status: 'Em Aberto' },
    { id: '#23-884', title: 'Tráfico de Armas (Classe 2)', loc: 'Porto de LS', suspect: 'Gangue Vagos', officer: 'Sgt. Oliveira', date: '22/10/2023', priority: 'CRÍTICA', status: 'Investigação' },
    { id: '#23-850', title: 'Roubo a Banco (Fleeca)', loc: 'Highway West', suspect: 'João Ninguém', officer: 'Ten. Costa', date: '15/10/2023', priority: 'MÉDIA', status: 'Pendente' },
    { id: '#23-799', title: 'Sequestro', loc: 'Mirror Park', suspect: 'The Lost MC', officer: 'Cap. Almeida', date: '05/10/2023', priority: 'ALTA', status: 'Em Aberto' },
    { id: '#23-812', title: 'Furto de Veículo', loc: 'Praça da Legião', suspect: 'Maria Souza', officer: 'Cb. Santos', date: '10/10/2023', priority: 'BAIXA', status: 'Concluído' },
  ];

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-4">
             CASOS EM ANDAMENTO
             <span className="text-[10px] bg-amber-500/20 text-amber-500 px-3 py-1 rounded-lg font-black tracking-[0.2em] italic">AO VIVO</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-3 max-w-2xl">Gestão, análise e atualização de investigações criminais ativas. Todos os dados são confidenciais.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-800/50 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
             Exportar CSV
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all shadow-xl flex items-center gap-2">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
             Novo Caso
          </button>
        </div>
      </div>

      {/* Filters Area */}
      <div className="flex flex-wrap items-center gap-4 bg-[#1a1f2e] p-6 rounded-[2rem] border border-slate-800/50 shadow-2xl">
         <div className="relative flex-1 min-w-[300px]">
            <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input 
               type="text" 
               placeholder="Pesquisar por ID, suspeito ou oficial..." 
               className="w-full bg-black/30 border border-slate-700 rounded-xl pl-12 pr-6 py-4 text-xs font-bold text-white focus:outline-none focus:border-blue-500 transition-all"
            />
         </div>
         <div className="flex items-center gap-2">
            {['Todos', 'Homicídios', 'Tráfico', 'Roubos'].map((f, i) => (
               <button key={f} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${i === 0 ? 'bg-blue-600 text-white' : 'bg-slate-800/50 text-slate-500 hover:text-white'}`}>
                  {f} {i > 0 && <span className="ml-2 opacity-50 font-mono">({i * 4})</span>}
               </button>
            ))}
         </div>
      </div>

      {/* Cases Table */}
      <div className="bg-[#1a1f2e] border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-slate-800/50 bg-black/10">
                     <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">ID</th>
                     <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Crime / Título</th>
                     <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Suspeito Principal</th>
                     <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Encarregado</th>
                     <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Data Abertura</th>
                     <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Prioridade</th>
                     <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                     <th className="px-10 py-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Ações</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/30">
                  {cases.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/20 transition-all group cursor-pointer">
                       <td className="px-10 py-8 text-[11px] font-mono font-black text-slate-500">{c.id}</td>
                       <td className="px-10 py-8">
                          <div>
                             <h4 className="text-sm font-black text-white uppercase italic">{c.title}</h4>
                             <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-tighter">Local: {c.loc}</p>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                <svg className="w-4 h-4 text-slate-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                             </div>
                             {/* Fix: use c.suspect instead of c.suspeito to match the defined property name */}
                             <span className="text-xs font-black text-slate-300 italic uppercase">{c.suspect}</span>
                          </div>
                       </td>
                       <td className="px-10 py-8 text-xs font-black text-blue-500 italic underline underline-offset-4">{c.officer}</td>
                       <td className="px-10 py-8 text-xs font-bold text-slate-500">{c.date}</td>
                       <td className="px-10 py-8">
                          <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase italic ${
                             c.priority === 'CRÍTICA' ? 'bg-purple-500/10 text-purple-500' :
                             c.priority === 'ALTA' ? 'bg-red-500/10 text-red-500' :
                             c.priority === 'MÉDIA' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-700/20 text-slate-500'
                          }`}>
                             {c.priority}
                          </span>
                       </td>
                       <td className="px-10 py-8">
                          <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${c.status === 'Em Aberto' ? 'bg-blue-500 animate-pulse' : 'bg-slate-500'}`}></div>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.status}</span>
                          </div>
                       </td>
                       <td className="px-10 py-8 text-right">
                          <button className="p-3 hover:bg-slate-800 rounded-xl transition-all">
                             <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="bg-black/20 p-8 flex items-center justify-between">
            <p className="text-[10px] text-slate-600 font-black uppercase">Mostrando 1 a 5 de 24 resultados</p>
            <div className="flex gap-2">
               <button className="px-6 py-3 bg-slate-800/50 text-slate-500 rounded-xl text-[10px] font-black uppercase hover:text-white transition-all">Anterior</button>
               <button className="px-6 py-3 bg-slate-800/50 text-slate-500 rounded-xl text-[10px] font-black uppercase hover:text-white transition-all">Próximo</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default CasesSection;
