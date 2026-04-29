
import React from 'react';

const CodesSection: React.FC = () => {
  const codes10 = [
    { code: '10-00', desc: 'Código 0 (Crash)' },
    { code: '10-01', desc: 'Teste de comunicações / rádio' },
    { code: '10-02', desc: 'Negativo' },
    { code: '10-03', desc: 'Alguma unidade disponível para patrulha' },
    { code: '10-04', desc: 'OK / Recebido / Afirmativo' },
    { code: '10-05', desc: 'Situação sob-controlo' },
    { code: '10-06', desc: 'Ocupado' },
    { code: '10-07', desc: 'Saída de Serviço' },
    { code: '10-08', desc: 'Entrada de Serviço' },
    { code: '10-09', desc: 'Repita a última comunicação' },
    { code: '10-10', desc: 'Abordagem de trânsito' },
    { code: '10-11', desc: 'Abordagem de alto risco' },
    { code: '10-12', desc: 'Aguarde' },
    { code: '10-13', desc: 'Tiros disparados' },
    { code: '10-14', desc: 'Alteração de frequência' },
    { code: '10-15', desc: 'Transporte de detento ao posto' },
    { code: '10-17', desc: 'Luta em progresso (Rixa)' },
    { code: '10-18', desc: 'Indivíduo suspeito (máscara, colete ou coldre)' },
    { code: '10-20', desc: 'Localização' },
    { code: '10-22', desc: 'Ignore a última comunicação' },
    { code: '10-23', desc: 'Chegada ao local' },
    { code: '10-24', desc: 'Mesma comunicação (face à anterior)' },
    { code: '10-25', desc: 'Ocupado em processamento / relatório (MDT)' },
    { code: '10-26', desc: 'Tempo estimado de chegada (através de Mikes / Sierras)' },
    { code: '10-30', desc: 'Pessoa ou Veículo procurado' },
    { code: '10-31', desc: 'Solicitada presença de superior no local' },
    { code: '10-32', desc: 'Solicitado apoio / reforços (nível 1, 2 ou 3)' },
    { code: '10-35', desc: 'Criar perímetro' },
    { code: '10-41', desc: 'Iniciar patrulha' },
    { code: '10-42', desc: 'Terminar patrulha' },
    { code: '10-43', desc: 'Ponto de situação (Informação)' },
    { code: '10-44', desc: 'Civil Ferido' },
    { code: '10-50', desc: 'Acidente de viação' },
    { code: '10-51', desc: 'Apreensão de veículo (Reboque)' },
    { code: '10-52', desc: 'Manobra PIT' },
    { code: '10-57', desc: 'Tráfico / Venda de droga' },
    { code: '10-66', desc: 'Transporte prisional' },
    { code: '10-70', desc: 'Perseguição a pé' },
    { code: '10-76', desc: 'Perseguição marítima' },
    { code: '10-80', desc: 'Perseguição a um veículo' },
    { code: '10-90', desc: 'Assalto (Banco / Loja / ATM / etc)' },
    { code: '10-97', desc: 'A caminho' },
  ];

  const phonetic = [
    { l: 'A', n: 'Alpha' }, { l: 'B', n: 'Bravo' }, { l: 'C', n: 'Charlie' },
    { l: 'D', n: 'Delta' }, { l: 'E', n: 'Echo' }, { l: 'F', n: 'Fox-trot' },
    { l: 'G', n: 'Golf' }, { l: 'H', n: 'Hotel' }, { l: 'I', n: 'India' },
    { l: 'J', n: 'Juliet' }, { l: 'K', n: 'Kilo' }, { l: 'L', n: 'Lima' },
    { l: 'M', n: 'Mike' }, { l: 'N', n: 'November' }, { l: 'O', n: 'Oscar' },
    { l: 'P', n: 'Papa' }, { l: 'Q', n: 'Quebec' }, { l: 'R', n: 'Romeo' },
    { l: 'S', n: 'Sierra' }, { l: 'T', n: 'Tango' }, { l: 'U', n: 'Uniform' },
    { l: 'V', n: 'Victor' }, { l: 'W', n: 'Whiskey' }, { l: 'X', n: 'X-Ray' },
    { l: 'Y', n: 'Yankee' }, { l: 'Z', n: 'Zulu' },
  ];

  const supportCodes = [
    { c: 'Código 1', d: 'Apoio (10-32) nível 1 // Sem luzes e sirenes', color: 'text-blue-500' },
    { c: 'Código 2', d: 'Apoio (10-32) nível 2 // Somente luzes ativas', color: 'text-amber-500' },
    { c: 'Código 3', d: 'Apoio (10-32) nível 3 // Luzes e sirenes ativas', color: 'text-red-500' },
    { c: 'Código 4', d: 'Situação terminada', color: 'text-emerald-500' },
    { c: 'Código 7', d: 'Pausa de serviço (Por X Mikes - minutos)', color: 'text-slate-400' },
    { c: 'Código 8', d: 'Retorno da pausa', color: 'text-slate-400' },
  ];

  const emergencyCodes = [
    { c: '10-13 Alpha', d: 'Tiros disparados CONTRA GUARDAS', color: 'text-red-600' },
    { c: 'CÓDIGO 99', d: 'Apoio URGENTE (Botão de PÂNICO)', color: 'text-red-600 font-black' },
    { c: 'CÓDIGO 100', d: 'Rádio limpa, comunicações de PRIORIDADE', color: 'text-red-500' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="border-b border-white/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="flex items-center gap-6">
           <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>
           </div>
           <div>
              <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Protocolos de Rádio</h2>
              <p className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.4em] mt-4 flex items-center gap-4 italic">
                 <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
                 CÓDIGOS - PSP / GNR • DIAMOND POST
              </p>
           </div>
        </div>
        <div className="bg-black/40 border border-white/5 px-6 py-3 rounded-2xl text-[8px] font-black text-slate-500 uppercase tracking-widest italic">
           Padrão Operacional S9-RADIO
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* COLUNA PRINCIPAL: CÓDIGOS 10 */}
        <div className="xl:col-span-9 space-y-10">
           <div className="bg-black/40 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 p-10">
                 {/* Lado Esquerdo */}
                 <div className="space-y-2">
                    {codes10.slice(0, 21).map((item, i) => (
                       <div key={i} className="flex gap-4 p-3 hover:bg-white/5 rounded-xl transition-all group">
                          <span className="w-16 font-mono font-black text-red-500 text-xs shrink-0">{item.code}</span>
                          <span className="text-[11px] font-black text-slate-300 uppercase italic leading-tight group-hover:text-white">{item.desc}</span>
                       </div>
                    ))}
                 </div>
                 {/* Lado Direito */}
                 <div className="space-y-2">
                    {codes10.slice(21).map((item, i) => (
                       <div key={i} className="flex gap-4 p-3 hover:bg-white/5 rounded-xl transition-all group">
                          <span className="w-16 font-mono font-black text-red-500 text-xs shrink-0">{item.code}</span>
                          <span className="text-[11px] font-black text-slate-300 uppercase italic leading-tight group-hover:text-white">{item.desc}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* GRIDS INFERIORES */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Apoio / Reforços */}
              <div className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                 <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4 italic">Protocolos de Apoio</h3>
                 <div className="space-y-3">
                    {supportCodes.map((item, i) => (
                       <div key={i} className="flex items-center gap-4">
                          <span className={`text-xs font-black italic uppercase shrink-0 w-24 ${item.color}`}>{item.c}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase italic truncate">{item.d}</span>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Emergência Máxima */}
              <div className="bg-red-950/10 border border-red-900/20 p-8 rounded-[2.5rem] space-y-6">
                 <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest border-b border-red-900/20 pb-4 italic">Prioridade Máxima</h3>
                 <div className="space-y-4">
                    {emergencyCodes.map((item, i) => (
                       <div key={i} className="flex flex-col gap-1">
                          <span className={`text-sm italic uppercase ${item.color}`}>{item.c}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase italic">{item.d}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* FORMATURAS E VPV */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] flex items-center justify-between">
                 <div>
                    <h4 className="text-red-500 font-black text-lg italic uppercase">VPV</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Veículo Perdido de Vista</p>
                 </div>
                 <div className="w-12 h-12 bg-red-600/10 border border-red-600/20 rounded-xl flex items-center justify-center text-red-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                 </div>
              </div>
              <div className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] flex gap-10">
                 <div className="flex flex-col gap-2">
                    <span className="text-red-500 font-black text-xs uppercase italic">Código E</span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase italic">Formatura (parede)</span>
                 </div>
                 <div className="flex flex-col gap-2">
                    <span className="text-red-500 font-black text-xs uppercase italic">Código F</span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase italic">Formatura (reunião)</span>
                 </div>
              </div>
           </div>
        </div>

        {/* SIDEBAR: ALFABETO FONÉTICO */}
        <div className="xl:col-span-3 space-y-8">
           <div className="bg-[#05080c] border border-blue-900/30 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                 <svg className="w-24 h-24 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12.75 3h-1.5v18h1.5V3z"/><path d="M18.75 3h-1.5v18h1.5V3z"/><path d="M6.75 3h-1.5v18h1.5V3z"/></svg>
              </div>
              <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] mb-8 italic border-b border-blue-900/20 pb-4">Alfabeto Fonético</h3>
              <div className="grid grid-cols-1 gap-2 max-h-[1000px] overflow-y-auto pr-2 custom-scrollbar">
                 {phonetic.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:bg-blue-600/10 hover:border-blue-500/20 transition-all">
                       <span className="text-sm font-black text-white italic">{p.l}</span>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-blue-400">{p.n}</span>
                    </div>
                 ))}
              </div>
              <p className="text-[7px] text-slate-700 font-bold uppercase mt-10 text-center tracking-[0.2em]">Standard ICAO / NATO Protocol</p>
           </div>
        </div>

      </div>

      <div className="bg-red-950/10 border border-red-900/10 p-10 rounded-[3rem] text-center">
         <p className="text-[10px] text-red-800 font-black uppercase tracking-[0.4em] mb-4 italic">Diretrizes de Comunicação</p>
         <p className="text-xs text-slate-500 italic leading-relaxed max-w-3xl mx-auto uppercase">
            A rádio é um canal exclusivo para fins operacionais. O uso indevido, diálogos paralelos ou desrespeito aos códigos resultará em <span className="text-white font-bold underline">Suspensão de Serviço</span> imediata.
         </p>
      </div>
    </div>
  );
};

export default CodesSection;
