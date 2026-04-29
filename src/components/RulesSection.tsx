
import React, { useState } from 'react';

const RulesSection: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'A' | 'B' | 'C' | 'D'>('A');

  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Header Estilizado */}
      <div className="border-b border-white/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div>
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Leis Orgânicas</h2>
          <p className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.4em] mt-5 flex items-center gap-4 italic">
             <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
             Edição: 25/05/2025 - Readaptação (GNR)
          </p>
        </div>

        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 gap-2">
           {['A', 'B', 'C', 'D'].map((s) => (
             <button 
               key={s}
               onClick={() => setActiveSection(s as any)}
               className={`w-12 h-12 rounded-xl text-xs font-black uppercase transition-all ${activeSection === s ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
               Sec {s}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Navegação Rápida Lateral */}
        <div className="hidden lg:block lg:col-span-3 space-y-8 sticky top-32 h-fit">
           <div className="bg-black/20 border border-white/5 p-8 rounded-[2.5rem]">
              <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-6 italic">Navegação Rápida</h3>
              <div className="space-y-2">
                 {activeSection === 'A' && (
                    <>
                       <button onClick={() => scrollToElement('art1a')} className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-[9px] font-black text-slate-400 uppercase italic transition-all">Art. 1º - A Guarda</button>
                       <button onClick={() => scrollToElement('art3a')} className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-[9px] font-black text-slate-400 uppercase italic transition-all">Art. 3º - Comandante-Geral</button>
                       <button onClick={() => scrollToElement('art4a')} className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-[9px] font-black text-slate-400 uppercase italic transition-all">Art. 4º - Hierarquia</button>
                       <button onClick={() => scrollToElement('art6a')} className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-[9px] font-black text-slate-400 uppercase italic transition-all">Art. 6º - Unidades</button>
                    </>
                 )}
                 {activeSection === 'C' && (
                    <>
                       <button onClick={() => scrollToElement('art4c')} className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-[9px] font-black text-slate-400 uppercase italic transition-all">Art. 4º - Armas de Fogo</button>
                       <button onClick={() => scrollToElement('art6c')} className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-[9px] font-black text-slate-400 uppercase italic transition-all">Art. 6º - Manobras PIT</button>
                       <button onClick={() => scrollToElement('art18c')} className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-[9px] font-black text-slate-400 uppercase italic transition-all">Art. 18º - Perseguições</button>
                    </>
                 )}
                 <p className="text-[7px] text-slate-600 font-bold uppercase mt-10 text-center tracking-[0.3em]">Protocolo S9-LEG</p>
              </div>
           </div>
        </div>

        {/* Corpo do Documento */}
        <div className="lg:col-span-9 space-y-12">
           
           {/* SECÇÃO A */}
           {activeSection === 'A' && (
             <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                <div className="bg-emerald-950/10 border-l-4 border-emerald-500 p-8 rounded-r-3xl">
                   <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Secção A - Lei estrutural da Guarda</h3>
                </div>

                <article id="art1a" className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-6 group hover:border-emerald-500/20 transition-all">
                   <h4 className="text-lg font-black text-emerald-500 italic uppercase">Art. 1º - A Guarda</h4>
                   <p className="text-slate-300 leading-relaxed italic text-sm">
                      A 12 de junho de 2024, estabeleceu-se o Departamento do Xerife do Condado de Blaine (BCSO) na sucessão à Guarda Nacional Republicana (GNR). Todas as atribuições da Guarda foram delegadas ao Departamento do Xerife.
                      <br/><br/>
                      A 25 de maio do ano a seguir, reestabelecera-se a GNR, findando as operações do Departamento do Xerife na cidade.
                   </p>
                </article>

                <article className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-6">
                   <h4 className="text-lg font-black text-emerald-500 italic uppercase">Art. 2º - Funções</h4>
                   <p className="text-slate-300 leading-relaxed italic text-sm">
                      As competências da GNR resumem-se à prevenção e combate a qualquer tipo de criminalidade, defesa dos interesses da cidade, manutenção e preservação da segurança dos cidadãos e a promoção do contacto de proximidade com todos os cidadãos.
                   </p>
                </article>

                <article id="art3a" className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-6">
                   <h4 className="text-lg font-black text-emerald-500 italic uppercase">Art. 3º - O Comandante-Geral</h4>
                   <p className="text-slate-300 leading-relaxed italic text-sm">
                      O Tenente-General Comandante-Geral é o mais elevado posto hierárquico na Guarda Nacional Republicana. O seu cargo, na hierarquia militar, é de Tenente-General (posto abaixo de General). 
                      <br/><br/>
                      A denominação "Comandante-Geral" é dada ao oficial-general que comande toda a Guarda.
                   </p>
                </article>

                <article id="art4a" className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-8">
                   <h4 className="text-lg font-black text-emerald-500 italic uppercase">Art. 4º - Hierarquia</h4>
                   <p className="text-slate-300 leading-relaxed italic text-sm">
                      A hierarquia da GNR é um elemento determinante na estrutura institucional e deve ser respeitada:
                   </p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden border border-white/5 flex items-center justify-center relative group">
                         <img src="https://i.imgur.com/K4Z7XqV.png" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all" alt="Hierarquia GNR 1" />
                         <div className="absolute bottom-4 left-4 bg-black/60 px-4 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest">Postos de Comando</div>
                      </div>
                      <div className="aspect-video bg-slate-900 rounded-3xl overflow-hidden border border-white/5 flex items-center justify-center relative group">
                         <img src="https://i.imgur.com/5V3X8P2.png" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all" alt="Hierarquia GNR 2" />
                         <div className="absolute bottom-4 left-4 bg-black/60 px-4 py-1 rounded-full text-[8px] font-black text-white uppercase tracking-widest">Postos de Base</div>
                      </div>
                   </div>
                </article>

                <article id="art6a" className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-6">
                   <h4 className="text-lg font-black text-emerald-500 italic uppercase">Art. 6º - Unidades operacionais</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { u: 'GIOE', d: 'Grupo de Intervenção de Operações Especiais' },
                        { u: 'DI', d: 'Destacamento de Intervenção' },
                        { u: 'GIOP', d: 'Grupo de Intervenção de Ordem Pública', s: '🛑' },
                        { u: 'GIC', d: 'Grupo de Intervenção Cinotécnico', s: '🛑' },
                        { u: 'UCC', d: 'Unidade de Controlo Costeiro', s: '🛑' },
                        { u: 'GSA', d: 'Grupo de Suporte Aéreo' },
                        { u: 'UEPS', d: 'Unidade de Emergência de Proteção e Socorro' },
                        { u: 'UNT', d: 'Unidade Nacional de Trânsito' },
                        { u: 'NIC', d: 'Núcleo de Investigação Criminal' },
                      ].map((unit, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                           <span className="text-xs font-black text-white italic">{unit.u}</span>
                           <span className="text-[10px] text-slate-500 font-bold uppercase italic">{unit.d} {unit.s}</span>
                        </div>
                      ))}
                   </div>
                </article>

                <article className="bg-[#0c0505] border border-red-900/20 p-10 rounded-[3rem] space-y-8">
                   <h4 className="text-lg font-black text-red-500 italic uppercase">Art. 7º - Ativações de unidades</h4>
                   <div className="space-y-6">
                      {[
                        { t: 'NIC', d: 'Somente quando especificamente e explicitamente autorizado por um oficial-general.' },
                        { t: 'GIOE / DI', d: 'Sempre que autorizado pelo Comandante, 2º Comandante, Líderes de esquadrão ou por um oficial-general.' },
                        { t: 'UNT / UEPS', d: 'Por qualquer elemento da unidade para patrulhas. Treinos/STOP só pela chefia ou oficial-general.' },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-6 items-start">
                           <div className="w-1.5 h-10 bg-red-600 rounded-full mt-1 shrink-0"></div>
                           <div>
                              <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">{item.t}</p>
                              <p className="text-sm text-slate-300 italic">{item.d}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </article>
             </div>
           )}

           {/* SECÇÃO B */}
           {activeSection === 'B' && (
             <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                <div className="bg-emerald-950/10 border-l-4 border-emerald-500 p-8 rounded-r-3xl">
                   <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Secção B - Código de vestuário</h3>
                </div>

                <article className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-6">
                   <h4 className="text-lg font-black text-emerald-500 italic uppercase">Art. 1º - Indumentária</h4>
                   <p className="text-slate-300 leading-relaxed italic text-sm">
                      Sempre que um guarda se encontra de serviço, este deve estar fardado com a farda a que o seu posto ou unidade operacional atribui.
                      <br/><br/>
                      Fora de serviço, nenhum guarda ou cidadão pode usufruir da indumentária da Guarda.
                   </p>
                </article>

                <article className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-8">
                   <h4 className="text-lg font-black text-emerald-500 italic uppercase">Art. 2º - Modificações à farda</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 bg-emerald-900/10 border border-emerald-500/20 rounded-[2.5rem] space-y-4">
                         <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic border-b border-emerald-500/20 pb-4">AUTORIZADO</p>
                         <ul className="space-y-3">
                            <li className="text-xs text-slate-300 italic">• Óculos apropriados</li>
                            <li className="text-xs text-slate-300 italic">• Relógios</li>
                            <li className="text-xs text-slate-300 italic">• Luvas Pretas</li>
                         </ul>
                      </div>
                      <div className="p-8 bg-red-900/10 border border-red-500/20 rounded-[2.5rem] space-y-4">
                         <p className="text-[10px] font-black text-red-500 uppercase tracking-widest italic border-b border-red-500/20 pb-4">PROIBIDO</p>
                         <p className="text-xs text-slate-400 italic">Trocar calças, cinto, camisola, colete ou divisa (que não for a sua).</p>
                         <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-xl">
                            <p className="text-[8px] text-red-500 font-black uppercase tracking-tighter">EXCEÇÃO: Inspetores do NIC em operação.</p>
                         </div>
                      </div>
                   </div>
                </article>
             </div>
           )}

           {/* SECÇÃO C */}
           {activeSection === 'C' && (
             <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                <div className="bg-emerald-950/10 border-l-4 border-emerald-500 p-8 rounded-r-3xl">
                   <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Secção C - Código ético e deontológico</h3>
                </div>

                <article className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-6">
                   <h4 className="text-lg font-black text-emerald-500 italic uppercase">Art. 1º - Patrulhas</h4>
                   <p className="text-slate-300 leading-relaxed italic text-sm">
                      As patrulhas são iniciadas em cada carro-patrulha (CP), por <span className="text-white font-bold underline">dois ou três guardas</span>. Um destes guardas deve obrigatoriamente ser Guarda ou superior.
                      <br/><br/>
                      <span className="text-[10px] font-black uppercase text-amber-500">Nota:</span> Patrulha conjunta com PSP requer autorização de Capitão ou superior.
                   </p>
                </article>

                <article id="art4c" className="bg-[#0c0505] border border-red-900/20 p-10 rounded-[3rem] space-y-6">
                   <h4 className="text-lg font-black text-red-600 italic uppercase">Art. 4º - Armas de fogo</h4>
                   <div className="p-8 bg-red-600/10 border-2 border-red-600 rounded-[2.5rem] text-center">
                      <p className="text-xs font-black text-white uppercase tracking-widest leading-relaxed">
                        É PROIBIDO O USO DE ARMA DE FOGO CONTRA ALGUÉM QUE NÃO A TENHA UTILIZADO.
                      </p>
                      <p className="text-[10px] text-red-500 font-bold uppercase mt-4 italic">
                        Exceto em caso de permissão do superior no local ou ameaça iminente à vida.
                      </p>
                   </div>
                </article>

                <article id="art6c" className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-6">
                   <h4 className="text-lg font-black text-emerald-500 italic uppercase">Art. 6º - Manobras PIT</h4>
                   <p className="text-slate-300 leading-relaxed italic text-sm">
                      Efetuada após <span className="text-white font-bold">dois minutos</span> de fuga na ZONA VERDE. Disparos contra veículos (3 minutos) só se o fugitivo já tiver disparado.
                      <br/><br/>
                      <span className="text-amber-500 font-black uppercase text-[9px]">Requisito:</span> Autorização via rádio por um <span className="text-white">Furriel ou superior</span>.
                   </p>
                </article>

                <article id="art18c" className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-6">
                   <h4 className="text-lg font-black text-emerald-500 italic uppercase">Art. 18º - Quantidade de patrulhas</h4>
                   <div className="flex items-center gap-10">
                      <div className="w-32 h-32 rounded-full border-8 border-emerald-500/20 flex items-center justify-center shrink-0">
                         <span className="text-5xl font-black text-emerald-500 italic">4</span>
                      </div>
                      <p className="text-sm text-slate-300 italic leading-relaxed">
                        É proibido que se excedam <span className="text-white font-bold">4 CPs</span> em um mesmo 10-80 (perseguição), exceto se ordenado especificamente contrário pelo superior ou quando os ocupantes estão potencialmente armados.
                      </p>
                   </div>
                </article>
             </div>
           )}

           {/* SECÇÃO D */}
           {activeSection === 'D' && (
             <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
                <div className="bg-red-950/20 border-l-4 border-red-600 p-8 rounded-r-3xl">
                   <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Secção D - Regulamento Geral (Regras da Cidade)</h3>
                </div>

                <div className="bg-black/40 border border-white/5 p-12 rounded-[4rem] space-y-12">
                   <div className="text-center">
                      <h4 className="text-4xl font-black text-red-600 italic uppercase tracking-widest underline decoration-red-900 underline-offset-8">PROIBIDO</h4>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        'Utilizar shotgun de borracha em fights (após 1º disparo inimigo).',
                        'Passar a mesma multa mais que uma vez.',
                        'Revistar veículos dentro de garagens (salvo se começou fora).',
                        'Custódia Investigativa > 10 min sem interação.',
                        'Intervir em redzones sem ser GIOE (salvo fuga para dentro).',
                        'Apreender comida ou bebida (Café incluído).',
                        'Usar capacetes blindados fora de UI (GIOE / DI).',
                        'Confrontar orgs em territórios ativos.',
                        'Possuir mais de 2 blindados por RP (Soma PSP+GNR).',
                        'Abordar orgs identificadas sem infração GRAVE (+5 guardas).',
                        'Seguir Orgs identificadas esperando infração.'
                      ].map((rule, i) => (
                        <div key={i} className="p-5 bg-red-600/5 border border-red-900/20 rounded-2xl flex gap-4 items-center group hover:bg-red-600/10 transition-all">
                           <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                           <p className="text-[11px] font-black text-slate-300 uppercase italic tracking-tight leading-tight">{rule}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-6">
                      <h4 className="text-xl font-black text-white italic uppercase tracking-tighter border-b border-white/5 pb-4">Assalto ao Iate</h4>
                      <p className="text-sm text-slate-400 italic leading-relaxed">
                        Obrigatória a retirada se {'>'} 2 assaltantes e fogo cruzado ativo. Exceção só via Comando.
                      </p>
                   </div>
                   <div className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-6">
                      <h4 className="text-xl font-black text-white italic uppercase tracking-tighter border-b border-white/5 pb-4">Assalto a Arte</h4>
                      <p className="text-sm text-slate-400 italic leading-relaxed">
                        Retirada imediata se houver barricada e PvP constante.
                      </p>
                   </div>
                </div>
             </div>
           )}

        </div>
      </div>

      {/* Footer do Regulamento */}
      <div className="bg-emerald-950/10 border border-emerald-500/10 p-10 rounded-[3rem] text-center">
         <p className="text-[10px] text-emerald-800 font-black uppercase tracking-[0.4em] mb-4 italic">Cláusula de Responsabilidade</p>
         <p className="text-xs text-slate-500 italic leading-relaxed max-w-3xl mx-auto uppercase">
            O desconhecimento deste regulamento não isenta qualquer elemento da Guarda de sanções disciplinares. A leitura e aplicação são <span className="text-white font-bold">OBRIGATÓRIAS</span>.
         </p>
      </div>
    </div>
  );
};

export default RulesSection;
