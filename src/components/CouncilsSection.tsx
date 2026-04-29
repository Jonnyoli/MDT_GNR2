
import React, { useState } from 'react';

type CouncilType = 'SUPERIOR' | 'ELITE';

interface CouncilMember {
  name: string;
  rank: string;
  role: string;
  avatar: string;
  status: 'ATIVO' | 'RESERVA' | 'HONORÁRIO';
  nip: string;
}

const CouncilsSection: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => {
  const [activeCouncil, setActiveCouncil] = useState<CouncilType>('SUPERIOR');

  const superiorMembers: CouncilMember[] = [
    { name: 'JACK REACHER', rank: 'TENENTE-CORONEL', role: 'Líder do Conselho', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=reacher', status: 'ATIVO', nip: 'T-01' },
    { name: 'JOÃO SANTOS', rank: 'MAJOR', role: 'Conselheiro Superior', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=santos', status: 'ATIVO', nip: 'K-05' },
    { name: 'TOCAR OBIXO', rank: 'CAPITÃO', role: 'Conselheiro Superior', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=obixo', status: 'ATIVO', nip: 'K-04' },
    { name: 'ABÍLIO FERNANDES', rank: 'TENENTE', role: 'Conselheiro Superior', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=abilio', status: 'ATIVO', nip: 'K-06' },
    { name: 'SERGIO CALADO', rank: 'TENENTE', role: 'Conselheiro Superior', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=calado', status: 'ATIVO', nip: 'K-07' },
    { name: 'DIOGO SILVA', rank: 'ALFERES', role: 'Conselheiro Superior', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diogo', status: 'ATIVO', nip: 'K-08' },
    { name: 'DOMANIC TORRESMO', rank: 'ALFERES', role: 'Conselheiro Superior', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=torresmo', status: 'ATIVO', nip: 'K-10' },
    { name: 'ARMANDO PINTO', rank: 'ASPIRANTE', role: 'Conselheiro Superior', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=armando', status: 'ATIVO', nip: 'K-09' },
  ];

  const eliteMembers: CouncilMember[] = [
    { name: 'SMURF OLIVEIRA', rank: 'COMANDANTE-GERAL', role: 'Superintendência Geral', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=smurf', status: 'ATIVO', nip: 'T-02' },
    { name: 'CARLOS FONSECA', rank: 'CORONEL', role: 'Conselheiro de Elite', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos', status: 'ATIVO', nip: 'K-02' },
    { name: 'JUSEFINO GOMES', rank: 'TENENTE-CORONEL', role: 'Conselheiro de Elite', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jusefino', status: 'ATIVO', nip: 'K-03' },
    { name: 'XEXII SILVEIRA', rank: 'MAJOR', role: 'Logística de Elite', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xexii', status: 'ATIVO', nip: 'T-04' },
  ];

  const currentMembers = activeCouncil === 'SUPERIOR' ? superiorMembers : eliteMembers;

  const getCouncilTheme = () => {
    if (activeCouncil === 'SUPERIOR') {
      return {
        main: 'border-amber-500/30 bg-amber-950/5',
        accent: 'text-amber-500',
        glow: 'shadow-[0_0_30px_rgba(245,158,11,0.1)]',
        header: 'COMANDO E PROMOÇÕES'
      };
    }
    return {
      main: 'border-red-600/30 bg-red-950/5',
      accent: 'text-red-500',
      glow: 'shadow-[0_0_30px_rgba(220,38,38,0.1)]',
      header: 'ELITE E FISCALIZAÇÃO'
    };
  };

  const theme = getCouncilTheme();

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* HEADER DINÂMICO */}
      <div className="border-b border-white/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div>
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Conselhos da Guarda</h2>
          <p className={`${theme.accent} text-[10px] font-black uppercase tracking-[0.4em] mt-5 flex items-center gap-4 italic transition-all`}>
             <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${activeCouncil === 'SUPERIOR' ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'bg-red-600 shadow-[0_0_10px_#dc2626]'}`}></span>
             Órgão Colegiado • {theme.header}
          </p>
        </div>

        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 gap-2">
           <button 
             onClick={() => setActiveCouncil('SUPERIOR')}
             className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeCouncil === 'SUPERIOR' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
           >
             C. Superior de Oficiais
           </button>
           <button 
             onClick={() => setActiveCouncil('ELITE')}
             className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeCouncil === 'ELITE' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
           >
             C. de Elite da Guarda
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* COLUNA DE MEMBROS (DOSSIÊS) */}
        <div className="lg:col-span-8 space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] italic">Composição do Colegiado</h3>
              <span className="text-[10px] font-mono text-slate-700">ORDEM_BATALHAO_{activeCouncil}_2025</span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
              {currentMembers.map((m, i) => (
                <div key={i} className={`p-8 rounded-[2.5rem] border ${theme.main} ${theme.glow} group hover:border-white/20 transition-all flex flex-col relative overflow-hidden`}>
                   <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                      <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                   </div>

                   <div className="flex items-center gap-6 mb-8 relative z-10">
                      <div className="w-20 h-20 rounded-2xl bg-black border border-white/5 overflow-hidden shadow-2xl">
                         <img src={m.avatar} className="w-full h-full object-cover" alt={m.name} />
                      </div>
                      <div>
                         <h4 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">{m.name}</h4>
                         <p className={`${theme.accent} text-[9px] font-black uppercase tracking-widest mt-2`}>{m.rank} • NIP {m.nip}</p>
                      </div>
                   </div>

                   <div className="space-y-4 relative z-10 flex-1">
                      <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                         <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1">Status de Membro</p>
                         <p className="text-xs text-white font-bold italic uppercase">{m.role}</p>
                      </div>
                      <div className="flex justify-between items-center px-2">
                         <span className="text-[8px] font-black text-slate-600 uppercase">Estado Operacional</span>
                         <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${m.status === 'ATIVO' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                           {m.status}
                         </span>
                      </div>
                   </div>

                   <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                      <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest italic">Protocolo Diamond S9</p>
                      <button className="text-[8px] font-black text-white uppercase tracking-widest hover:underline decoration-current">Ver Dossiê →</button>
                   </div>
                </div>
              ))}
           </div>

           {activeCouncil === 'ELITE' && (
             <div className="bg-[#0c0505] border border-red-900/20 p-10 rounded-[3rem] space-y-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 border-b border-red-900/30 pb-4">
                   <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                   <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Modelo de Repreensão Escrita (CEG)</h3>
                </div>
                <div className="bg-black/60 p-8 rounded-2xl border border-white/5 font-mono text-[10px] text-slate-400 space-y-4 leading-relaxed overflow-x-auto whitespace-pre">
{`# [1ª REPREENSÃO ESCRITA]
**Guarda visado**: NOME, PATENTE;

**Conduta sancionada**:
a) **DESCUMPRIMENTO DE NORMA A (ART. Xº DA SECÇÃO Y)**;
b) **DESCUMPRIMENTO DE NORMA B (ART. Xº DA SECÇÃO Y)**.

**Sanção aplicada**: INSERIR PUNIÇÃO

**CONSELHO DE ÉTICA, DEONTOLOGIA E DISCIPLINA**
**GUARDA NACIONAL REPUBLICANA**`}
                </div>
             </div>
           )}
        </div>

        {/* COLUNA DE DIRETRIZES E PODERES */}
        <div className="lg:col-span-4 space-y-8">
           <div className={`p-10 rounded-[3rem] border ${theme.main} shadow-2xl relative overflow-hidden flex flex-col h-full`}>
              <h3 className={`text-sm font-black ${theme.accent} uppercase tracking-[0.2em] mb-8 italic border-b border-white/5 pb-4`}>
                Regulamento do {activeCouncil === 'SUPERIOR' ? 'CSO' : 'CEG'}
              </h3>
              
              <div className="space-y-8 flex-1">
                 {activeCouncil === 'SUPERIOR' ? (
                   <>
                      <div className="space-y-6">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Principais Funções</p>
                        <div className="flex gap-4">
                           <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-amber-500"></div>
                           <p className="text-xs text-slate-300 italic leading-relaxed">Elaborar proposta semanal de subidas (promoções) através de reuniões regulares.</p>
                        </div>
                        <div className="flex gap-4">
                           <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-amber-500"></div>
                           <p className="text-xs text-slate-300 italic leading-relaxed">Responder diretamente ao Comando-Geral em situações de auditoria de atividade.</p>
                        </div>
                        <div className="flex gap-4">
                           <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-amber-500"></div>
                           <p className="text-xs text-slate-300 italic leading-relaxed">Realizar proposta sobre Cabo-Mor aptos para o CFS (Escola de Sargentos).</p>
                        </div>
                      </div>

                      <div className="space-y-4 pt-6 border-t border-white/5">
                        <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">Observações Críticas</p>
                        <p className="text-[10px] text-slate-400 italic">O CSO não gere queixas/tickets sobre outros guardas (função do CEG/Comando).</p>
                        <p className="text-[10px] text-slate-400 italic">Obrigatória a presença de 1 membro do CEG nas reuniões semanais para integridade.</p>
                      </div>
                   </>
                 ) : (
                   <>
                      <div className="space-y-6">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Funções Operativas</p>
                        {[
                          'Representar o Comando-Geral na sua ausência.',
                          'Colaborar e supervisionar em ⚜️┃votacao-queixas.',
                          'Auxiliar e supervisionar o trabalho dos Recursos Humanos (DRH).',
                          'Fiscalizar as sub-unidades do departamento (exceto NIC).',
                          'Fazer cumprir os desafios mensais das sub-unidades.',
                          'Superintender o CSO com apoio do Comando Geral.'
                        ].map((f, idx) => (
                          <div key={idx} className="flex gap-4">
                             <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-red-600"></div>
                             <p className="text-xs text-slate-300 italic leading-relaxed">{f}</p>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4 pt-6 border-t border-white/5">
                        <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Poderes Administrativos</p>
                        <p className="text-[10px] text-slate-400 italic leading-relaxed">O CEG e o DRH são órgãos distintos. O CEG detém poderes de demissão (oficializando junto ao DRH).</p>
                        <p className="text-[10px] text-slate-400 italic leading-relaxed">Nenhum membro exerce funções do DRH sem informe prévio ao Comando-Geral.</p>
                        <div className="p-4 bg-red-950/20 border border-red-600/10 rounded-xl mt-4">
                           <p className="text-[8px] text-red-500 font-black uppercase mb-2">Protocolo de Queixas contra Comando</p>
                           <p className="text-[7px] text-slate-500 uppercase leading-relaxed">03/04/05: Tratado por todo o comando exceto o visado. 01/02: Analisado por Comando+CEG, veredito final pelo par (01/02).</p>
                        </div>
                      </div>
                   </>
                 )}
              </div>

              <div className="mt-12 p-6 bg-black/40 rounded-3xl border border-white/5 text-center">
                 <p className="text-[9px] text-slate-500 font-black uppercase mb-2">Estado do Colegiado</p>
                 <p className="text-lg font-black text-white italic">{activeCouncil === 'ELITE' ? 'ALTA SUPERVISÃO' : 'REUNIÃO SEMANAL'}</p>
                 <p className="text-[8px] text-emerald-900 font-bold uppercase mt-2">Protocolo S9-ACTIVO</p>
              </div>
           </div>
        </div>

      </div>

      <div className={`${activeCouncil === 'SUPERIOR' ? 'bg-amber-950/10 border-amber-500/10' : 'bg-red-950/10 border-red-600/10'} border p-10 rounded-[3rem] text-center transition-all`}>
         <p className={`${theme.accent} text-[10px] font-black uppercase tracking-[0.4em] mb-4 italic`}>Estatuto de Fidelidade e Atividade</p>
         <p className="text-xs text-slate-500 italic leading-relaxed max-w-3xl mx-auto uppercase">
            O Conselho de Elite da Guarda garante a <span className="text-white font-bold underline">Integridade e Excelência</span> da força. Membros em inatividade ou conduta indevida serão exonerados sumariamente.
         </p>
      </div>
    </div>
  );
};

export default CouncilsSection;
