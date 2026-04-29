
import React from 'react';

const PartnershipsSection: React.FC = () => {
  const alDentePizzas = [
    { name: 'Marguerita', desc: 'Molho de tomate, mussarela, tomate em rodelas, manjericão fresco, orégano.', priceP: '1400€', priceSP: '1700€' },
    { name: 'Napolitana', desc: 'Molho de tomate, mussarela, rodelas de tomate, parmesão, orégano.', priceP: '1400€', priceSP: '1700€' },
    { name: 'Pepperoni', desc: 'Molho de tomate, pepperoni fatiado, mussarela, orégano.', priceP: '1400€', priceSP: '1700€' },
    { name: 'Vegetariana', desc: 'Molho de tomate, mussarela, rúcula, tomatem.', priceP: '1400€', priceSP: '1700€' },
  ];

  const pearlsMenus = [
    { name: 'Poupança', price: '1150€', items: ['Sopa de Lagosta', 'Cerveja S/Álcool'], icon: '🛡️' },
    { name: 'Marisco', price: '1650€', items: ['Camarão', 'Cerveja S/Álcool'], icon: '🦐' },
    { name: 'Maré Alta', price: '2150€', items: ['Bacalhau', 'Cerveja S/Álcool'], icon: '🌊' },
    { name: 'Pescador', price: '2650€', items: ['Cavalinha Grelhada', 'Cerveja S/Álcool'], icon: '🎣' },
  ];

  const pearlsExtras = [
    { name: 'Sopa de Lagosta', price: '800€' },
    { name: 'Camarão', price: '1200€' },
    { name: 'Bacalhau', price: '1800€' },
    { name: 'Cvl. Grelhada', price: '2200€' },
    { name: 'Cerveja S/Álcool', price: '600€' },
    { name: 'Vinho', price: '600€' },
    { name: 'Expresso', price: '200€' },
    { name: 'Frappuccino Morango', price: '600€' },
    { name: 'Frappuccino Caramelo', price: '600€' },
    { name: 'Chocolate Quente', price: '600€' },
  ];

  const inemPrices = {
    hospital: [
      { name: 'Tratamento', price: '4.000$' },
      { name: 'Reanimação', price: '8.000$' },
      { name: 'Consulta Geral', price: '40.000$' },
      { name: 'Psicologia', price: '50.000$' },
      { name: 'Cirurgia Geral', price: '60.000$' },
      { name: 'Psicotécnico p/ Tribunal', price: '50.000$' },
      { name: 'Psicotécnico p/ Porte Arma', price: '70.000$' },
      { name: 'Cirurgia Facial', price: '90.000$' },
    ],
    outside: [
      { name: 'Tratamento', price: '7.000$' },
      { name: 'Reanimação', price: '11.000$' },
    ],
    equipment: [
      { name: 'Ligaduras (Unidade)', price: '1.250$' }
    ]
  };

  const ammuStandard = [
    { name: 'Glock', price: '90K', icon: '🔫' },
    { name: 'Balas (9mm)', price: '8K', icon: '🔋' },
    { name: 'Faca', price: '50K', icon: '🔪' },
    { name: 'Paraquedas', price: '15K', icon: '🪂' },
    { name: 'Drone Civil', price: '200K', icon: '🛸' },
    { name: 'Drone Policial', price: '300K', icon: '🛡️' },
    { name: 'Lanterna', price: '10K', icon: '🔦' },
  ];

  const ammuMaterial = [
    { name: 'Glock (2 Bodys)', price: '70K', req: '2 Body Glocks' },
    { name: 'Glock (Full)', price: '40K', req: '2 Body + 1 BP' },
    { name: 'Balas (9mm)', price: '2K', req: '70 Chumbo + 70 Pólvora' },
    { name: 'Faca', price: '20K', req: '200 Mineiros + 50 Plástico' },
    { name: 'Paraquedas', price: '7,5K', req: '100 Tecido' },
    { name: 'Drone Civil', price: '100K', req: '100 Min + 100 Plas + 80K Limpo' },
    { name: 'Drone Policial', price: '150K', req: '100 Min + 100 Plas' },
    { name: 'Lanterna', price: '7K', req: '50 Mineiros + 10 Plástico' },
  ];

  const undergroundPrices = [
    { name: 'Reparação', price: '1.500 €' },
    { name: 'Kits de limpeza', price: '1.500 €' },
    { name: 'Kits (1-19 uni.)', price: '1.650 €' },
    { name: 'Kits (20-40 uni.)', price: '1.500 €' },
    { name: 'Kits (41-99 uni.)', price: '1.400 €' },
    { name: 'Kits (100 ou + uni.)', price: '1.400 €*', note: '*+ Oferta de 2' },
    { name: 'Fulltune -2M', price: '304.000 €' },
    { name: 'Fulltune +2M', price: '325.000 €' },
    { name: 'Botija de Nitro', price: '42.000 €' },
  ];

  return (
    <div className="space-y-24 animate-in fade-in duration-700 pb-20">
      <div className="border-b border-white/5 pb-10">
        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Parcerias e Regalias</h2>
        <p className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.4em] mt-5 flex items-center gap-4 italic">
           <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
           Protocolos de Apoio Logístico, Saúde e Alimentação
        </p>
      </div>

      {/* PARCERIA: AL DENTE'S */}
      <div className="bg-gradient-to-br from-[#1a1105] to-[#0c0802] border border-amber-600/20 rounded-[3rem] overflow-hidden shadow-2xl relative group">
        <div className="absolute top-0 right-0 p-12 text-amber-500/5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
           <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        </div>

        <div className="p-12 md:p-20 relative z-10">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20">
              <div className="flex items-center gap-8">
                 <div className="w-24 h-24 bg-gradient-to-tr from-green-600 via-white to-red-600 rounded-[2rem] flex items-center justify-center p-1 shadow-2xl shrink-0">
                    <div className="bg-black w-full h-full rounded-[1.8rem] flex items-center justify-center">
                       <span className="text-3xl">🍕</span>
                    </div>
                 </div>
                 <div>
                    <h3 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">AL DENTE'S</h3>
                    <p className="text-amber-500 text-xs font-black uppercase tracking-[0.5em] mt-4">Pizzaria Tradicional • Aguja Street</p>
                 </div>
              </div>
              
              <div className="bg-black/60 border border-amber-500/30 p-8 rounded-[2rem] text-center max-w-sm shadow-2xl">
                 <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest mb-2 italic">Código de Confirmação (Off-Duty)</p>
                 <p className="text-4xl font-black text-white italic tracking-tighter">"PIZZA NORTE"</p>
                 <p className="text-[8px] text-slate-500 font-bold uppercase mt-3 leading-relaxed">Deve ser validado junto dos funcionários para preços de parceria.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {alDentePizzas.map((pizza, i) => (
                <div key={i} className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] hover:border-amber-500/20 transition-all group flex flex-col justify-between">
                   <div className="space-y-4">
                      <div className="flex justify-between items-start">
                         <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-amber-500 transition-colors">{pizza.name}</h4>
                         <div className="flex gap-2">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
                               <p className="text-[8px] text-emerald-500 font-black uppercase tracking-widest text-center">P</p>
                               <p className="text-xs font-black text-white font-mono">{pizza.priceP}</p>
                            </div>
                            <div className="bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-lg opacity-40">
                               <p className="text-[8px] text-red-500 font-black uppercase tracking-widest text-center">SP</p>
                               <p className="text-xs font-black text-white font-mono">{pizza.priceSP}</p>
                            </div>
                         </div>
                      </div>
                      <p className="text-[11px] text-slate-400 font-bold uppercase italic leading-relaxed">{pizza.desc}</p>
                   </div>
                   <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest italic">CP 8220 • Aguja Street</span>
                      <span className="text-[10px] text-amber-900 font-black italic">DELIVERY DISPONÍVEL</span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-black/80 p-8 text-center border-t border-amber-950">
           <p className="text-[9px] text-amber-900 font-black uppercase tracking-[0.3em]">Protocolo de alimentação estratégica v1.5 • GNR Diamond & Al Dente's.</p>
        </div>
      </div>

      {/* PARCERIA: UNDERGROUND PERFORMANCE */}
      <div className="bg-gradient-to-br from-[#0a1a05] to-[#020502] border border-lime-500/20 rounded-[3rem] overflow-hidden shadow-2xl relative group">
        <div className="absolute top-0 right-0 p-12 text-lime-500/5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
           <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
        </div>

        <div className="p-12 md:p-20 relative z-10">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20">
              <div className="flex items-center gap-8">
                 <div className="w-24 h-24 bg-lime-600 rounded-[2rem] flex items-center justify-center text-black shadow-[0_0_40px_rgba(101,163,13,0.3)] shrink-0">
                    <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0"/></svg>
                 </div>
                 <div>
                    <h3 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">UNDERGROUND</h3>
                    <p className="text-lime-500 text-xs font-black uppercase tracking-[0.5em] mt-4">Oficina Estratégica e Performance</p>
                 </div>
              </div>
              
              <div className="bg-black/60 border border-lime-500/30 p-8 rounded-[2rem] text-center max-w-sm shadow-2xl">
                 <p className="text-[10px] text-lime-500 font-black uppercase tracking-widest mb-2 italic">Código de Confirmação (Off-Duty)</p>
                 <p className="text-4xl font-black text-white italic tracking-tighter">"UnderGNR"</p>
                 <p className="text-[8px] text-slate-500 font-bold uppercase mt-3 leading-relaxed">Deve ser validado junto dos mecânicos para descontos pessoais.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Tabela de Preços Oficina */}
              <div className="lg:col-span-2 space-y-8">
                 <h4 className="text-xs font-black text-lime-500 uppercase tracking-[0.4em] flex items-center gap-4 italic">
                    <div className="w-2 h-2 bg-lime-600 rounded-full"></div>
                    Precário de Serviços e Peças
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {undergroundPrices.map((item, i) => (
                       <div key={i} className="bg-black/40 border border-white/5 p-6 rounded-2xl flex justify-between items-center group hover:border-lime-500/20 transition-all">
                          <div>
                             <span className="text-xs font-black text-slate-300 uppercase italic group-hover:text-white transition-colors">{item.name}</span>
                             {item.note && <p className="text-[8px] text-lime-600 font-bold uppercase mt-1">{item.note}</p>}
                          </div>
                          <span className="text-sm font-black text-lime-500 font-mono">{item.price}</span>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Deveres Operacionais */}
              <div className="bg-[#050d05] border border-lime-900/30 p-10 rounded-[2.5rem] space-y-10">
                 <h4 className="text-[11px] font-black text-white uppercase tracking-widest italic border-b border-white/5 pb-4">Protocolo de Deveres</h4>
                 
                 <div className="space-y-8">
                    <div className="flex gap-5">
                       <div className="w-8 h-8 rounded-xl bg-lime-950 flex items-center justify-center text-lime-500 shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                       </div>
                       <div>
                          <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Prioridade Mecânica</p>
                          <p className="text-xs text-slate-300 italic">Apoiar os mecânicos da Underground, com prioridade, a nível de apreensões de veículos da oficina.</p>
                       </div>
                    </div>

                    <div className="flex gap-5">
                       <div className="w-8 h-8 rounded-xl bg-lime-950 flex items-center justify-center text-lime-500 shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                       </div>
                       <div>
                          <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Patrulhamento Ativo</p>
                          <p className="text-xs text-slate-300 italic">Tentar patrulhar a zona regularmente para garantir a segurança do estabelecimento e staff.</p>
                       </div>
                    </div>
                 </div>

                 <div className="mt-12 p-6 bg-lime-600 rounded-3xl text-center shadow-xl">
                    <p className="text-[10px] text-black font-black uppercase tracking-widest italic mb-1">Underground Performance</p>
                    <p className="text-[8px] text-lime-900 font-bold uppercase">Manutenção e Tuning Superior</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-black/80 p-8 text-center border-t border-lime-950">
           <p className="text-[9px] text-lime-900 font-black uppercase tracking-[0.3em]">Acordo de reciprocidade tática v1.0 • Efetivo GNR & Underground Performance.</p>
        </div>
      </div>

      {/* PARCERIA: AMMU-NATION */}
      <div className="bg-gradient-to-br from-[#1a0505] to-[#0a0202] border border-red-500/20 rounded-[3rem] overflow-hidden shadow-2xl relative group">
        <div className="absolute top-0 right-0 p-12 text-red-500/5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
           <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
        </div>

        <div className="p-12 md:p-20 relative z-10">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20">
              <div className="flex items-center gap-8">
                 <div className="w-24 h-24 bg-red-600 rounded-[2rem] flex items-center justify-center text-white shadow-[0_0_40px_rgba(220,38,38,0.3)] shrink-0">
                    <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                 </div>
                 <div>
                    <h3 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">AMMU-NATION</h3>
                    <p className="text-red-500 text-xs font-black uppercase tracking-[0.5em] mt-4">Fornecedor Bélico Oficial • Unidade 01</p>
                 </div>
              </div>
              
              <div className="bg-black/60 border border-red-500/30 p-8 rounded-[2rem] text-center max-w-sm shadow-2xl">
                 <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-2 italic">Código de Confirmação (Off-Duty)</p>
                 <p className="text-4xl font-black text-white italic tracking-tighter">"PIRILAMPO"</p>
                 <p className="text-[8px] text-slate-500 font-bold uppercase mt-3 leading-relaxed">Deve ser facultado aos funcionários para validar a regalia fora de serviço.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
              {/* Tabela Padrão */}
              <div className="space-y-8">
                 <h4 className="text-xs font-black text-red-500 uppercase tracking-[0.4em] flex items-center gap-4 italic">
                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    Tabela de Preços (Pronto a Usar)
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ammuStandard.map((item, i) => (
                       <div key={i} className="bg-black/40 border border-white/5 p-6 rounded-2xl flex justify-between items-center group hover:border-red-500/20 transition-all">
                          <div className="flex items-center gap-4">
                             <span className="text-xl">{item.icon}</span>
                             <span className="text-xs font-black text-slate-300 uppercase italic group-hover:text-white transition-colors">{item.name}</span>
                          </div>
                          <span className="text-lg font-black text-red-500 font-mono">{item.price}</span>
                       </div>
                    ))}
                 </div>
              </div>

              {/* Tabela com Material */}
              <div className="space-y-8">
                 <h4 className="text-xs font-black text-amber-500 uppercase tracking-[0.4em] flex items-center gap-4 italic">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    Preços com Material (Fabrico)
                 </h4>
                 <div className="space-y-3">
                    {ammuMaterial.map((item, i) => (
                       <div key={i} className="bg-black/40 border border-white/5 p-5 rounded-2xl flex flex-col gap-2 hover:border-amber-500/20 transition-all">
                          <div className="flex justify-between items-center">
                             <span className="text-xs font-black text-white uppercase italic">{item.name}</span>
                             <span className="text-lg font-black text-amber-500 font-mono">{item.price}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="w-1 h-1 bg-amber-900 rounded-full"></div>
                             <p className="text-[8px] text-slate-500 font-bold uppercase italic">Requisito: {item.req}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-black/80 p-8 text-center border-t border-red-950">
           <p className="text-[9px] text-red-900 font-black uppercase tracking-[0.3em]">Protocolo de armamento GNR-Diamond v2.0 • Proibido uso de materiais da GNR para fins civis.</p>
        </div>
      </div>

      {/* PARCERIA 01: PEARLS */}
      <div className="bg-gradient-to-br from-[#0a1a14] to-[#050c09] border border-emerald-500/20 rounded-[3rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 p-12 text-emerald-500/10 pointer-events-none">
           <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        </div>

        <div className="p-12 md:p-20">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20">
              <div>
                 <h3 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">PEARLS</h3>
                 <p className="text-emerald-500 text-xs font-black uppercase tracking-[0.5em] mt-4">Catering Oficial PSP / GNR / INEM</p>
                 <div className="mt-8 bg-emerald-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest w-fit italic shadow-lg">
                    REGALIAS EXCLUSIVAS ATIVAS
                 </div>
              </div>
              <div className="bg-black/40 border border-emerald-500/10 p-8 rounded-3xl text-center">
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Desconto em Serviço</p>
                 <p className="text-4xl font-black text-white italic">Até 30%</p>
                 <p className="text-[8px] text-emerald-900 font-bold uppercase mt-2">Mediante Apresentação de NIP</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pearlsMenus.map((menu, i) => (
                <div key={i} className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] hover:border-emerald-500/30 transition-all group flex flex-col items-center text-center">
                   <div className="text-4xl mb-6 group-hover:scale-125 transition-transform duration-500">{menu.icon}</div>
                   <h4 className="text-xl font-black text-white uppercase italic mb-2 tracking-tighter">{menu.name}</h4>
                   <p className="text-2xl font-black text-emerald-500 italic mb-6 shadow-emerald-500/20">{menu.price}</p>
                   <div className="space-y-2 w-full pt-6 border-t border-white/5">
                      {menu.items.map((item, j) => (
                        <p key={j} className="text-[10px] text-slate-400 font-bold uppercase italic">{item}</p>
                      ))}
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-20">
              <h4 className="text-xs font-black text-emerald-900 uppercase tracking-[0.5em] mb-10 text-center flex items-center justify-center gap-6">
                 <div className="h-px w-20 bg-emerald-900/30"></div>
                 EXTRAS & INDIVIDUAIS
                 <div className="h-px w-20 bg-emerald-900/30"></div>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {pearlsExtras.map((extra, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex justify-between items-center hover:bg-white/5 transition-all">
                       <span className="text-[10px] font-black text-slate-300 uppercase italic">{extra.name}</span>
                       <span className="text-xs font-black text-emerald-500 font-mono">{extra.price}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* PARCERIA 02: INEM SANDY */}
      <div className="bg-gradient-to-br from-[#0a121a] to-[#05080c] border border-blue-500/20 rounded-[3rem] overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 p-12 text-blue-500/10 pointer-events-none">
           <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
        </div>

        <div className="p-12 md:p-20">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20">
              <div className="flex items-center gap-8">
                 <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-[0_0_40px_rgba(37,99,235,0.3)] shrink-0">
                    <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                 </div>
                 <div>
                    <h3 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">INEM SANDY</h3>
                    <p className="text-blue-500 text-xs font-black uppercase tracking-[0.5em] mt-4">Protocolo Hospitalar GNR</p>
                 </div>
              </div>
              <div className="bg-red-600/10 border border-red-500/20 p-8 rounded-3xl max-w-sm">
                 <p className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    Aviso de Seguro
                 </p>
                 <p className="text-xs text-white font-bold italic leading-relaxed">
                    Devem apresentar-se <span className="underline decoration-red-500">obrigatoriamente fardados</span> para usufruir do seguro de saúde e descontos acordados.
                 </p>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Precário Interno */}
              <div className="space-y-6 lg:col-span-2">
                 <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-8 italic flex items-center gap-4">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Tabela de Serviços (No Hospital)
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inemPrices.hospital.map((item, i) => (
                       <div key={i} className="bg-black/40 border border-white/5 p-6 rounded-2xl flex justify-between items-center group hover:border-blue-500/20 transition-all">
                          <span className="text-xs font-black text-slate-300 uppercase italic group-hover:text-white transition-colors">{item.name}</span>
                          <span className="text-sm font-black text-blue-500 font-mono">{item.price}</span>
                       </div>
                    ))}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] italic flex items-center gap-4">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          Fora do Hospital
                       </h4>
                       <div className="space-y-3">
                          {inemPrices.outside.map((item, i) => (
                             <div key={i} className="bg-black/40 border border-white/5 p-5 rounded-2xl flex justify-between items-center">
                                <span className="text-xs font-black text-slate-300 uppercase italic">{item.name}</span>
                                <span className="text-sm font-black text-blue-500 font-mono">{item.price}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] italic flex items-center gap-4">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          Equipamento
                       </h4>
                       <div className="space-y-3">
                          {inemPrices.equipment.map((item, i) => (
                             <div key={i} className="bg-black/40 border border-white/5 p-5 rounded-2xl flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                   <span className="text-xs font-black text-slate-300 uppercase italic">{item.name}</span>
                                   <span className="text-sm font-black text-blue-500 font-mono">{item.price}</span>
                                </div>
                                <p className="text-[8px] text-slate-600 font-bold uppercase italic">* Pagamento em dinheiro ou transferência</p>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Regras Operacionais */}
              <div className="bg-[#05080c] border border-blue-900/30 p-10 rounded-[2.5rem] space-y-10">
                 <h4 className="text-[11px] font-black text-white uppercase tracking-widest italic border-b border-white/5 pb-4">Protocolo de Operações</h4>
                 
                 <div className="space-y-8">
                    <div className="flex gap-5">
                       <div className="w-8 h-8 rounded-xl bg-blue-950 flex items-center justify-center text-blue-500 shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                       </div>
                       <div>
                          <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Identificação</p>
                          <p className="text-xs text-slate-300 italic">Não existe código de confirmação. A identificação visual da farda GNR é o único requisito.</p>
                       </div>
                    </div>

                    <div className="flex gap-5">
                       <div className="w-8 h-8 rounded-xl bg-blue-950 flex items-center justify-center text-blue-500 shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1"/></svg>
                       </div>
                       <div>
                          <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Estacionamento</p>
                          <p className="text-xs text-slate-300 italic">Viatutas na área do hospital <span className="text-white font-bold">NÃO são para apreender</span>, salvo se houver clara javardice ou pedido de funcionário.</p>
                       </div>
                    </div>
                 </div>

                 <div className="mt-12 p-6 bg-blue-600 rounded-3xl text-center shadow-xl">
                    <p className="text-[10px] text-white font-black uppercase tracking-widest italic mb-1">Centro Integrado de Sandy</p>
                    <p className="text-[8px] text-blue-200 font-bold uppercase">Emergência Médica 24/7</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-black/60 p-8 text-center border-t border-white/5">
           <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">Acordo de cooperação mútua entre a Guarda Nacional Republicana e a Unidade INEM de Sandy.</p>
        </div>
      </div>
    </div>
  );
};

export default PartnershipsSection;
