
import React, { useState } from 'react';

type HelpCategory = 'postura' | 'mdt' | 'penal' | 'abordagens' | 'radio' | 'radar' | 'veiculos' | 'operacoes' | 'detencoes' | 'cot' | 'diretrizes';

const UtilitiesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<HelpCategory>('postura');

  const categories = [
    { id: 'postura' as HelpCategory, label: 'Postura Militar', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0' },
    { id: 'mdt' as HelpCategory, label: 'Operação MDT', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'penal' as HelpCategory, label: 'Código Penal', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { id: 'abordagens' as HelpCategory, label: 'Abordagens', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
    { id: 'radio' as HelpCategory, label: 'Comunicação Rádio', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
    { id: 'radar' as HelpCategory, label: 'Radar', icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a9.192 9.192 0 0113.138 0M3.515 9.515a13.5 13.5 0 0118.97 0' },
    { id: 'operacoes' as HelpCategory, label: 'Assaltos & 10-35', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'detencoes' as HelpCategory, label: 'Detenções', icon: 'M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.268 0 2.49.234 3.62.661m-1.756 3.39a3 3 0 00-4.632 0m4.632 0a3 3 0 011.023 3.67m-1.164 2.025a10.003 10.003 0 01-1.746 3.419m-3.374-1.213a3 3 0 114.668 0m3.115 1.004a10.025 10.025 0 01-4.459 2.082' },
    { id: 'veiculos' as HelpCategory, label: 'Operação Veículos', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1' },
    { id: 'cot' as HelpCategory, label: 'C.O.T. Tático', icon: 'M9 20l-5.447-2.724A2 2 0 013 15.487V6.512a2 2 0 011.553-1.943L9 3m0 17l5.447-2.724A2 2 0 0016 15.487V6.512a2 2 0 00-1.553-1.943L9 3m0 17V3' },
    { id: 'diretrizes' as HelpCategory, label: 'Diretrizes', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  ];

  const penalData = {
    leves: [
      { art: 'Art. 1', crime: 'Sem Documentação', pena: '-', multa: '15.000€' },
      { art: 'Art. 2', crime: 'Excesso de Velocidade', pena: '-', multa: '10.000€ até 20.000€' },
      { art: 'Art. 3', crime: 'Condução Imprudente ou Perigosa', pena: '-', multa: '10.000€' },
      { art: 'Art. 4', crime: 'Modificações Ilegais', pena: '-', multa: '30.000€' },
      { art: 'Art. 5', crime: 'Veículo em más conduções para circular', pena: '-', multa: '10.000€' },
      { art: 'Art. 6', crime: 'Posse de droga (acima de 10 unidades)', pena: '0 até 4', multa: '25.000€' },
      { art: 'Art. 7', crime: 'Perjúrio a Civil', pena: '0 até 5', multa: '15.000€' },
      { art: 'Art. 7 a)', crime: 'Desrespeito', pena: '0 até 5', multa: '20.000€' },
      { art: 'Art. 7 b)', crime: 'Assédio', pena: '0 até 4', multa: '30.000€' },
      { art: 'Art. 7 c)', crime: 'Indecência Pública', pena: '0 até 4', multa: '25.000€' },
      { art: 'Art. 8', crime: 'Dano Patrimonial', pena: '0 até 3', multa: '25.000€' },
      { art: 'Art. 9', crime: 'Organização de Evento Ilegal', pena: '-', multa: '30.000€' },
      { art: 'Art. 10', crime: 'Permanência numa Zona Ilegal', pena: '-', multa: '20.000€' },
      { art: 'Art. 11', crime: 'Omissão de auxílio', pena: '0 até 4', multa: '10.000€' },
    ],
    graves: [
      { art: 'Art. 12', crime: 'Ameaça a Civil', pena: '4 até 8', multa: '25.000€' },
      { art: 'Art. 13', crime: 'Tentativa de Fuga', pena: '5 até 10', multa: '35.000€' },
      { art: 'Art. 14', crime: 'Posse de Arma Tipo 1 (Armas Brancas)', pena: '4 até 8', multa: '25.000€' },
      { art: 'Art. 15', crime: 'Posse de Acessórios, Munições, Coletes, Peças ou Blueprints', pena: '5 até 12', multa: '20.000€ até 50.000€' },
      { art: 'Art. 16', crime: 'Agressão a Civil / Participação em rixa', pena: '6', multa: '20.000€' },
      { art: 'Art. 17', crime: 'Assalto (A civil, casa e ATM)', pena: '4 até 10', multa: '25.000€' },
      { art: 'Art. 18', crime: 'Assalto a Estabelecimento (Loja e Fleeca)', pena: '6 até 12', multa: '35.000€' },
      { art: 'Art. 19', crime: 'Perjúrio a Autoridade', pena: '4 até 12', multa: '25.000€' },
      { art: 'Art. 19 a)', crime: 'Desrespeito', pena: '4 até 10', multa: '35.000€' },
      { art: 'Art. 19 b)', crime: 'Assédio', pena: '6 até 15', multa: '55.000€' },
      { art: 'Art. 19 c)', crime: 'Indecência Pública', pena: '5 até 12', multa: '40.000€' },
      { art: 'Art. 20', crime: 'Falsificação de Identidade', pena: '0 até 6', multa: '20.000€' },
      { art: 'Art. 20 a)', crime: 'Falsificação de Identidade de Autoridade', pena: '4 até 10', multa: '30.000€' },
      { art: 'Art. 21', crime: 'Resistência à Autoridade', pena: '6', multa: '25.000€' },
      { art: 'Art. 22', crime: 'Ocultação de Provas / Obstrução à Justiça', pena: '3 até 8', multa: '30.000€' },
      { art: 'Art. 23', crime: 'Falsas Declarações', pena: '0 até 8', multa: '20.000€' },
      { art: 'Art. 24', crime: 'Invasão de Propriedade Privada ou Estatal', pena: '0 até 6', multa: '25.000€' },
      { art: 'Art. 25', crime: 'Suborno', pena: '5', multa: '60.000€' },
      { art: 'Art. 26', crime: 'Uso indevido de arma de fogo', pena: '0 até 5', multa: '20.000€' },
      { art: 'Art. 27', crime: 'Furto/Roubo de Viatura', pena: '4', multa: '15.000€' },
      { art: 'Art. 28', crime: 'Associação Criminosa', pena: '3 até 6', multa: '20.000€' },
    ],
    muitoGraves: [
      { art: 'Art. 29', crime: 'Assalto Qualificado (Banco Principal e Joalharia)', pena: '8 até 15', multa: '45.000€' },
      { art: 'Art. 30', crime: 'Posse de Dinheiro Sujo', pena: '6 até 12', multa: '30.000€ até 55.000€' },
      { art: 'Art. 31', crime: 'Posse de Arma tipo 2 (Pistolas)', pena: '5 até 10', multa: '30.000€' },
      { art: 'Art. 32', crime: 'Posse de Arma Tipo 3 (SMG)', pena: '6 até 12', multa: '50.000€' },
      { art: 'Art. 33', crime: 'Posse de Arma Tipo 4 (Riffles)', pena: '7 até 14', multa: '75.000€' },
      { art: 'Art. 34', crime: 'Tráfico de Droga ou Dinheiro Sujo', pena: '6 até 14', multa: '85.000€' },
      { art: 'Art. 35', crime: 'Tráfico de Acessórios, Munições, Coletes, Peças ou Blueprints', pena: '7 até 14', multa: '65.000€' },
      { art: 'Art. 36', crime: 'Tráfico de Armas', pena: '10 até 16', multa: '100.000€' },
      { art: 'Art. 37', crime: 'Sequestro / Posse de reféns', pena: '10', multa: '25.000€' },
      { art: 'Art. 38', crime: 'Tentativa de Homicídio', pena: '15', multa: '45.000€' },
      { art: 'Art. 39', crime: 'Homicídio', pena: '20', multa: '80.000€' },
      { art: 'Art. 39 a)', crime: 'Homicídio Qualificado (Com intenção)', pena: '25', multa: '150.000€' },
      { art: 'Art. 39 b)', crime: 'Homicídio Involuntário', pena: '14', multa: '60.000€' },
      { art: 'Art. 40', crime: 'Ameaça à Autoridade', pena: '8 até 14', multa: '50.000€' },
      { art: 'Art. 41', crime: 'Corrupção', pena: '15', multa: '85.000€' },
      { art: 'Art. 41 a)', crime: 'Abuso de Poder', pena: '8 até 14', multa: '100.000€' },
      { art: 'Art. 41 b)', crime: 'Insubordinação', pena: '7 até 12', multa: '65.000€' },
    ]
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 max-w-5xl mx-auto pb-20">
      {/* Cabeçalho */}
      <div className="border-b border-white/5 pb-10">
        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Manual do Guarda</h2>
        <p className="text-emerald-700 text-[11px] font-black uppercase tracking-[0.4em] mt-5 flex items-center gap-4 italic">
           <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
           Centro de Suporte Operacional Diamond
        </p>
      </div>

      {/* Navegação por Categorias */}
      <div className="flex flex-wrap gap-4 bg-black/40 p-3 rounded-[2rem] border border-white/5 shadow-2xl">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeCategory === cat.id 
              ? 'bg-emerald-600 text-white shadow-lg' 
              : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={cat.icon} />
            </svg>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Conteúdo Dinâmico */}
      <div className="animate-in slide-in-from-bottom-4 duration-500">
        
        {/* CATEGORIA: COMUNICAÇÃO RÁDIO */}
        {activeCategory === 'radio' && (
          <div className="space-y-16">
            {/* Frequências */}
            <section className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">FREQUÊNCIAS</div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Canais de Comunicação</h3>
                <div className="h-px flex-1 bg-indigo-900/30"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { t: 'PSP', f: '1 MHz', c: 'text-blue-500', bg: 'bg-blue-950/20' },
                   { t: 'GNR (PRINCIPAL)', f: '6 MHz', c: 'text-emerald-500', bg: 'bg-emerald-950/20', shadow: 'shadow-[0_0_20px_#10b98120]' },
                   { t: 'NIC / OPS ESP.', f: '10 MHz', c: 'text-indigo-500', bg: 'bg-indigo-950/20' },
                   { t: 'EMS ALPHA', f: '11 MHz', c: 'text-red-500', bg: 'bg-red-950/20' },
                   { t: 'EMS BRAVO', f: '12 MHz', c: 'text-red-500', bg: 'bg-red-950/20' }
                 ].map((item, i) => (
                   <div key={i} className={`p-8 rounded-[2rem] border border-white/5 ${item.bg} ${item.shadow || ''} text-center space-y-4 transition-all group hover:scale-105`}>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{item.t}</p>
                      <p className={`text-3xl font-black italic tracking-tighter ${item.c}`}>{item.f}</p>
                      {item.t.includes('PRINCIPAL') && <p className="text-[8px] font-black text-emerald-700 uppercase animate-pulse">Entrada Obrigatória</p>}
                   </div>
                 ))}
              </div>
            </section>

            {/* Normas de Utilização */}
            <section className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-amber-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">NORMAS</div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Conduta e Etiqueta</h3>
                <div className="h-px flex-1 bg-amber-900/30"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-8">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic border-b border-white/5 pb-4">Sinalética Fonética</h4>
                  <div className="space-y-4">
                     <p className="text-sm text-slate-300 italic">Call signs [A-Z] devem ser lidos usando o <span className="text-white font-bold">alfabeto fonético</span>.</p>
                     <div className="bg-indigo-950/20 p-5 rounded-2xl border border-indigo-500/20">
                        <p className="text-[9px] text-indigo-400 font-black uppercase mb-3">Exemplo G-01:</p>
                        <p className="text-lg font-black text-white italic">"Golf Zero Um"</p>
                        <p className="text-[8px] text-slate-500 mt-2 font-bold uppercase">(Nunca diga apenas "G zero um")</p>
                     </div>
                  </div>
                </div>

                <div className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-8">
                  <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest italic border-b border-white/5 pb-4">Filtro de Comunicação</h4>
                  <div className="space-y-6">
                     <p className="text-sm text-slate-300 italic">Mantenha a rádio limpa. Evite expressões informais e diálogos excessivos.</p>
                     <div className="grid grid-cols-2 gap-3">
                        {['Sim', 'Não', 'E', 'Ok', 'Calão'].map(word => (
                          <div key={word} className="flex items-center gap-3 p-3 bg-red-950/10 border border-red-900/20 rounded-xl">
                             <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                             <span className="text-[10px] font-black text-red-400 uppercase line-through">{word}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-[#0a0f1c] border border-blue-900/30 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-10">
                 <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] shrink-0">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                 </div>
                 <div>
                    <h4 className="text-xl font-black text-white italic uppercase tracking-tighter">Identificação na Rádio</h4>
                    <p className="text-sm text-slate-400 mt-2 italic leading-relaxed">
                       É obrigatório configurar o nome na rádio seguindo o rigoroso padrão: <br/>
                       <span className="text-blue-500 font-mono font-black text-lg bg-blue-950/40 px-3 py-1 rounded-lg">[CALL-SIGN] | [Nome]</span>
                    </p>
                 </div>
              </div>
            </section>

            {/* Códigos de Status */}
            <section className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-emerald-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">CÓDIGOS</div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Status de Serviço</h3>
                <div className="h-px flex-1 bg-emerald-900/30"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-6">
                    <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">10-08 / 10-07 (Entrada/Saída)</h4>
                    <div className="space-y-4">
                       <div className="bg-emerald-950/20 p-6 rounded-2xl border border-emerald-500/20">
                          <p className="text-xs text-slate-300 italic mb-2">Entrada de Serviço:</p>
                          <p className="text-sm font-black text-white">"[CallSign] 10-08"</p>
                       </div>
                       <p className="text-[10px] text-slate-500 font-bold uppercase px-4 italic leading-relaxed">
                          Atenção: Deve também entrar de serviço no telemóvel e posteriormente abrir o tablet (letra K).
                       </p>
                    </div>
                 </div>

                 <div className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-6">
                    <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">10-41 (Início de Patrulha)</h4>
                    <div className="space-y-4">
                       <div className="bg-emerald-950/20 p-6 rounded-2xl border border-emerald-500/20">
                          <p className="text-xs text-slate-300 italic mb-2">Comunicação de Carro-Patrulha:</p>
                          <p className="text-sm font-black text-white">"CP-[Número] 10-41, [X] unidades."</p>
                       </div>
                       <p className="text-[10px] text-slate-500 font-bold uppercase px-4 italic leading-relaxed">
                          Substitua [X] pelo número de agentes a bordo da viatura.
                       </p>
                    </div>
                 </div>
              </div>
            </section>
          </div>
        )}

        {/* CATEGORIA: RADAR OPERACIONAL */}
        {activeCategory === 'radar' && (
          <div className="space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">SISTEMA</div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Utilização do Radar</h3>
                <div className="h-px flex-1 bg-indigo-900/30"></div>
              </div>

              <div className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic">Teclas e Atalhos</h4>
                      <p className="text-sm text-slate-400 italic leading-relaxed">
                        Para interagir com o radar, a tecla padrão é <span className="text-white font-bold px-2 py-0.5 bg-indigo-900 rounded">J</span>. 
                      </p>
                      <div className="p-6 bg-indigo-950/20 border border-indigo-500/20 rounded-3xl">
                         <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4 italic">Alterar Atalho</p>
                         <p className="text-xs text-slate-300 italic">GTA Settings → Teclado → FiveM → "Interagir com o radar".</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic">Configuração Recomendada</h4>
                      <div className="space-y-4">
                        <div className="flex gap-4 p-4 bg-white/5 rounded-2xl">
                           <div className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-500 flex items-center justify-center text-[10px] font-black">1</div>
                           <p className="text-xs text-slate-400 italic">Arraste as abas (Radar, Alertas, Logs) para posicionar ao seu gosto.</p>
                        </div>
                        <div className="flex gap-4 p-4 bg-white/5 rounded-2xl">
                           <div className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-500 flex items-center justify-center text-[10px] font-black">2</div>
                           <p className="text-xs text-slate-400 italic">Vá a "Definições" e <span className="text-white font-bold">desative a primeira opção</span> que aparece.</p>
                        </div>
                        <div className="flex gap-4 p-4 bg-white/5 rounded-2xl">
                           <div className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-500 flex items-center justify-center text-[10px] font-black">3</div>
                           <p className="text-xs text-slate-400 italic">Mantenha a aba <span className="text-white font-bold">"LOGS"</span> ativa para patrulhamento.</p>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-amber-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">LEGENDA</div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Sinalização de Matrículas</h3>
                <div className="h-px flex-1 bg-amber-900/30"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-8 bg-amber-950/10 border border-amber-500/20 rounded-[2.5rem] flex items-center gap-6">
                    <div className="w-4 h-24 bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] rounded-full"></div>
                    <div>
                       <h4 className="text-sm font-black text-white uppercase italic tracking-widest mb-2">Matrícula Amarela</h4>
                       <p className="text-xs text-slate-400 italic">Veículo detetado em <span className="text-yellow-500 font-bold">Excesso de Velocidade</span>.</p>
                    </div>
                 </div>
                 <div className="p-8 bg-red-950/10 border border-red-500/20 rounded-[2.5rem] flex items-center gap-6">
                    <div className="w-4 h-24 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3)] rounded-full"></div>
                    <div>
                       <h4 className="text-sm font-black text-white uppercase italic tracking-widest mb-2">Matrícula Vermelha</h4>
                       <p className="text-xs text-slate-400 italic">Veículo com <span className="text-red-500 font-bold">Mandado de Busca e Captura</span> ativo.</p>
                    </div>
                 </div>
              </div>

              <div className="bg-black/60 border border-white/5 p-10 rounded-[3rem] space-y-6">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic border-b border-white/5 pb-4">Gestão de Alertas</h4>
                 <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1 space-y-4">
                       <p className="text-sm text-slate-300 italic">Para inserir um mandado, clique com o <span className="text-white font-bold">Botão Direito</span> do rato sobre a matrícula no radar e selecione <span className="text-white font-bold">"Criar Alerta"</span>.</p>
                    </div>
                    <div className="p-5 bg-red-950/20 border border-red-900/30 rounded-2xl flex items-center gap-4 italic max-w-xs">
                       <svg className="w-6 h-6 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                       <p className="text-[9px] text-red-400 font-black uppercase tracking-widest">Proibido colocar mandados em veículos sem matrícula.</p>
                    </div>
                 </div>
              </div>
            </section>
          </div>
        )}

        {/* CATEGORIA: ABORDAGENS (10-10 & 10-11) */}
        {activeCategory === 'abordagens' && (
          <div className="space-y-16">
            {/* 10-10: TRÂNSITO */}
            <section className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-emerald-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">10-10</div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Abordagem de Trânsito</h3>
                <div className="h-px flex-1 bg-emerald-900/30"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[
                   { n: '01', t: 'Sinalização', d: 'Ligar rotativos e sinais sonoros. Posicionar CP imediatamente atrás da viatura abordada.' },
                   { n: '02', t: 'Posicionamento', d: 'Pedir ao civil para sair e deslocar-se para a direita da viatura (ou local seguro).' },
                   { n: '03', t: 'Identificação', d: 'Efetuar continência (e salute) e identificação formal (Patente/Nome) + Crachá (e idcardh).' },
                   { n: '04', t: 'Esclarecimento', d: 'Questionar o motivo da abordagem. Caso o civil ignore, explicar a infração detetada.' },
                   { n: '05', t: 'Documentação', d: 'Solicitar Cartão de Cidadão (BI/CC) e Carta de Condução.' },
                   { n: '06', t: 'Verificação MDT', d: 'Pendura verifica perfil no MDT. P1/P3 verifica matrícula e proprietário em simultâneo.' },
                   { n: '07', t: 'Autuação', d: 'Informar os artigos violados e as coimas correspondentes (e notepad).' },
                   { n: '08', t: 'Finalização', d: 'Passar faturas, informar prazo de 48h para pagamento e despedir formalmente (e salute).' }
                 ].map((step, i) => (
                   <div key={i} className="bg-black/40 border border-white/5 p-6 rounded-[2rem] flex items-start gap-5 hover:border-emerald-500/20 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-500 flex items-center justify-center font-black italic shadow-lg shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">{step.n}</div>
                      <div>
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1 italic">{step.t}</h4>
                        <p className="text-xs text-slate-400 italic leading-relaxed">{step.d}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="p-5 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl flex items-center gap-4 italic">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">"Da parte da Guarda é tudo, conduza com prudência!"</p>
              </div>
            </section>

            {/* 10-11: ALTO RISCO */}
            <section className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-red-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">10-11</div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Abordagem de Alto Risco</h3>
                <div className="h-px flex-1 bg-red-900/30"></div>
              </div>

              <div className="bg-[#0c0505] border border-red-900/20 p-10 rounded-[3rem] space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <h4 className="text-[11px] font-black text-red-500 uppercase tracking-widest italic flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></div>
                        Critérios de Ativação
                      </h4>
                      <ul className="space-y-3">
                        {[
                          'Indivíduo 10-18 (Máscara, Colete ou Coldre visível)',
                          'Veículo com Matrícula Vermelha (Mandado de Busca)',
                          'Suspeitos em fuga ou envolvidos em crimes violentos'
                        ].map((item, i) => (
                          <li key={i} className="flex gap-3 text-xs text-slate-300 italic">
                             <span className="text-red-500">•</span> {item}
                          </li>
                        ))}
                      </ul>
                   </div>
                   <div className="space-y-6">
                      <h4 className="text-[11px] font-black text-red-500 uppercase tracking-widest italic">Protocolo Operacional</h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                           <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Passo 01: Reforço</p>
                           <p className="text-xs text-white font-bold italic">Pedir 10-32 (Apoio) e enviar localização (/c1 ou /c2).</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                           <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Passo 02: Dissimulação</p>
                           <p className="text-xs text-white font-bold italic">Apelar ao encosto sem revelar o mandado para evitar fuga imediata.</p>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-red-950/30 border border-red-600/40 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8">
                   <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shrink-0">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-white uppercase italic tracking-tighter">Segurança Máxima</h4>
                      <p className="text-sm text-red-400 italic mt-2">
                        Se não for seguro avançar, utilize a <span className="text-white font-bold underline">porta do Carro-Patrulha como cobertura</span> e renda o suspeito à distância até à chegada do apoio ou oportunidade de algemagem.
                      </p>
                   </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* CATEGORIA: DETENÇÕES */}
        {activeCategory === 'detencoes' && (
          <div className="space-y-16">
            {/* Conceito e Motivos */}
            <section className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">CONCEITO</div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Aprisionamento Temporário</h3>
                <div className="h-px flex-1 bg-indigo-900/30"></div>
              </div>
              <div className="bg-black/40 border border-white/5 p-10 rounded-[3rem] space-y-6">
                <p className="text-slate-300 leading-relaxed italic">
                  Uma detenção inicia-se logo que o cidadão é algemado e transportado até ao posto. Os motivos principais são:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {[
                     { t: 'PRÁTICA DE CRIME', d: 'Suspeita ou flagrante delito.' },
                     { t: 'FALTA DE COMPARÊNCIA', d: 'Recusa de chamada para interrogatório ou ID.' },
                     { t: 'MANDADO JUDICIAL', d: 'Cumprimento de captura emitida pelo tribunal.' }
                   ].map((item, i) => (
                     <div key={i} className="bg-indigo-950/20 border border-indigo-500/10 p-6 rounded-2xl">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">{item.t}</p>
                        <p className="text-xs text-slate-400 italic">{item.d}</p>
                     </div>
                   ))}
                </div>
              </div>
            </section>

            {/* Direitos do Detento */}
            <section className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-amber-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">DIREITOS</div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Garantias do Cidadão</h3>
                <div className="h-px flex-1 bg-amber-900/30"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                 {[
                   { t: 'SILÊNCIO', i: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z' },
                   { t: 'ADVOGADO', i: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
                   { t: 'CHAMADA (2m)', i: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
                   { t: 'ALIMENTAÇÃO', i: 'M3 3h18v18H3V3z' },
                   { t: 'SAÚDE (Urg.)', i: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' }
                 ].map((item, i) => (
                   <div key={i} className="bg-black/60 border border-white/5 p-6 rounded-2xl text-center group hover:border-amber-500/20 transition-all">
                      <svg className="w-6 h-6 text-amber-600 mx-auto mb-4 opacity-50 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.i}/></svg>
                      <p className="text-[9px] font-black text-white uppercase tracking-widest italic">{item.t}</p>
                   </div>
                 ))}
              </div>
            </section>

            {/* Procedimento de Detenção */}
            <section className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-red-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">PROTOCOLO</div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Fluxo Operacional (10-25)</h3>
                <div className="h-px flex-1 bg-red-900/30"></div>
              </div>

              <div className="space-y-6">
                {[
                  { n: '01', t: 'Revista & Apreensão Local', d: 'Se seguro, revistar itens ilegais, meios de rádio e telemóveis. OBRIGATÓRIO fotografar o inventário para provas.' },
                  { n: '02', t: 'Transporte & Direitos', d: 'Efetuar transporte. Ler os direitos durante o trajeto ou imediatamente antes do embarque.' },
                  { n: '03', t: 'Chegada ao Posto', d: 'Revistar novamente antes de desalgemar. Iniciar processamento 10-25 no sistema.' },
                  { n: '04', t: 'Processamento MDT', d: 'Identificar via CC ou Impressão Digital. Anexar Provas (Apreensões) e MUGSHOT (Frente/Lados/Costas).' },
                  { n: '05', t: 'Elaboração de Incidente', d: 'Preencher guardas, testemunhas e criminoso. Inserir delitos, passar multa (radial Z) e explicar artigos.' },
                  { n: '06', t: 'Prisão Efetiva', d: 'Transportar à prisão. Anexar nº de incidente e meses correspondentes no sistema da prisão.' }
                ].map((step, i) => (
                  <div key={i} className="bg-[#0c0505] border border-red-900/10 p-8 rounded-[2rem] flex items-start gap-8 group hover:border-red-600/30 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-red-600/10 text-red-600 flex items-center justify-center font-black italic shadow-lg shrink-0 group-hover:bg-red-600 group-hover:text-white transition-all">{step.n}</div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase italic tracking-widest mb-2">{step.t}</h4>
                      <p className="text-xs text-slate-400 italic leading-relaxed">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-black/60 border-2 border-dashed border-red-900/30 p-10 rounded-[3rem] text-center">
                 <h4 className="text-xs font-black text-red-600 uppercase tracking-[0.4em] mb-4 flex items-center justify-center gap-4">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                   ATENÇÃO CRÍTICA
                 </h4>
                 <p className="text-sm text-slate-300 italic font-bold">Verificar sempre a disponibilidade do <span className="text-white underline decoration-red-600">TRIBUNAL</span> para casos que exijam julgamento judicial.</p>
              </div>
            </section>
          </div>
        )}

        {/* CATEGORIA: CÓDIGO PENAL */}
        {activeCategory === 'penal' && (
          <div className="space-y-16">
            {/* Limites Gerais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[
                 { label: 'Pena Máxima Prisão', val: '20 Meses', color: 'text-red-500', bg: 'bg-red-500/10' },
                 { label: 'Multa Máxima Acumulada', val: '200.000€', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                 { label: 'Teto via Julgamento', val: '300.000€', color: 'text-blue-500', bg: 'bg-blue-500/10' },
               ].map((item, i) => (
                 <div key={i} className={`p-6 rounded-3xl border border-white/5 ${item.bg} text-center space-y-2`}>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.label}</p>
                    <p className={`text-2xl font-black italic tracking-tighter ${item.color}`}>{item.val}</p>
                 </div>
               ))}
            </div>

            {/* CRIMES LEVES */}
            <section className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-emerald-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">LEVES</div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Artigos 1 ao 11</h3>
                <div className="h-px flex-1 bg-emerald-900/30"></div>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-emerald-600/10 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-4">Artigo</th>
                      <th className="px-8 py-4">Crime</th>
                      <th className="px-8 py-4">Pena (Meses)</th>
                      <th className="px-8 py-4 text-right">Multa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {penalData.leves.map((item, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors group">
                        <td className="px-8 py-4 text-xs font-mono font-bold text-emerald-500">{item.art}</td>
                        <td className="px-8 py-4 text-xs font-bold text-slate-300 italic uppercase">{item.crime}</td>
                        <td className="px-8 py-4 text-xs font-black text-slate-500">{item.pena}</td>
                        <td className="px-8 py-4 text-xs font-black text-white text-right">{item.multa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* CRIMES GRAVES */}
            <section className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-amber-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">GRAVES</div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Artigos 12 ao 28</h3>
                <div className="h-px flex-1 bg-amber-900/30"></div>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-amber-600/10 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-4">Artigo</th>
                      <th className="px-8 py-4">Crime</th>
                      <th className="px-8 py-4">Pena (Meses)</th>
                      <th className="px-8 py-4 text-right">Multa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {penalData.graves.map((item, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors group">
                        <td className="px-8 py-4 text-xs font-mono font-bold text-amber-500">{item.art}</td>
                        <td className="px-8 py-4 text-xs font-bold text-slate-300 italic uppercase">{item.crime}</td>
                        <td className="px-8 py-4 text-xs font-black text-slate-500">{item.pena}</td>
                        <td className="px-8 py-4 text-xs font-black text-white text-right">{item.multa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* CRIMES MUITO GRAVES */}
            <section className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-red-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">MUITO GRAVES</div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Artigos 29 ao 41</h3>
                <div className="h-px flex-1 bg-red-900/30"></div>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-red-600/10 text-[10px] font-black text-red-500 uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-4">Artigo</th>
                      <th className="px-8 py-4">Crime</th>
                      <th className="px-8 py-4">Pena (Meses)</th>
                      <th className="px-8 py-4 text-right">Multa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {penalData.muitoGraves.map((item, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors group">
                        <td className="px-8 py-4 text-xs font-mono font-bold text-red-500">{item.art}</td>
                        <td className="px-8 py-4 text-xs font-bold text-slate-300 italic uppercase">{item.crime}</td>
                        <td className="px-8 py-4 text-xs font-black text-slate-500">{item.pena}</td>
                        <td className="px-8 py-4 text-xs font-black text-white text-right">{item.multa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* CATEGORIA: OPERAÇÕES & ASSALTOS */}
        {activeCategory === 'operacoes' && (
          <div className="space-y-16">
            {/* ASSALTO A BANCOS */}
            <section className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-red-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">BANCOS</div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Protocolo de Assalto a Banco</h3>
                <div className="h-px flex-1 bg-red-900/30"></div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {[
                  { step: '1', title: 'Destacamento', desc: 'Superior ou Comandante destaca patrulhas via rádio. Unidades podem trocar para veículos especiais ou Eagle (com certificado).' },
                  { step: '2', title: 'Chegada e Perímetro', desc: 'Estabelecer o 10-35 (Teatro de Operações) bloqueando as vias de acesso ao banco.' },
                  { step: '3', title: 'Bloqueios Estratégicos', desc: 'Montagem de barreiras, cones e picos para impedir fuga de assaltantes ou entrada de intrusos.' },
                  { step: '4', title: 'Atribuição de Funções', desc: 'Divisão em: (1) Manutenção de Perímetro, (2) Receção de Reféns (exame, identificação e revista) ou (3) Segurança do Negociador.' },
                  { step: '5', title: 'Fim de Operação', desc: 'Início do 10-80 (Perseguição). Negociador destaca veículos perseguidores conforme a situação.' }
                ].map((item, i) => (
                  <div key={i} className="bg-black/40 border border-white/5 p-6 rounded-[2rem] flex items-start gap-6 group hover:border-red-500/20 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-red-600/10 text-red-500 flex items-center justify-center font-black italic shadow-lg shrink-0">{item.step}</div>
                    <div>
                      <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1 italic">{item.title}</h4>
                      <p className="text-sm text-slate-400 italic leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-red-950/20 border border-red-900/30 rounded-3xl flex items-center gap-6">
                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                </div>
                <div>
                   <p className="text-[10px] text-white font-black uppercase tracking-widest italic">Rádio Operacional</p>
                   <p className="text-xs text-red-400 font-bold italic">Utilizar frequência <span className="text-white">7 MHz</span> se não estiver ocupada.</p>
                </div>
              </div>
            </section>

            {/* LOJAS 24/7 */}
            <section className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">LOJAS 24/7</div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Protocolo de Loja de Conveniência</h3>
                <div className="h-px flex-1 bg-blue-900/30"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#05080c] border border-blue-900/20 p-8 rounded-[2.5rem] space-y-6">
                  <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">Limites de Efetivo</h4>
                  <p className="text-sm text-slate-300 italic leading-relaxed">
                    Apenas <span className="text-white font-bold">2 a 3 CPs</span> podem reagir (Máximo 6 agentes). Deve ser utilizada a frequência <span className="text-white font-bold">10-14</span>.
                  </p>
                  <div className="p-4 bg-red-950/10 border border-red-900/20 rounded-xl flex items-center gap-4">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636"/></svg>
                    <p className="text-[9px] text-red-400 font-black uppercase tracking-widest">COT não autorizado para este cenário.</p>
                  </div>
                </div>
                <div className="bg-[#05080c] border border-blue-900/20 p-8 rounded-[2.5rem] space-y-6">
                  <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">Negociação</h4>
                  <p className="text-sm text-slate-300 italic leading-relaxed">
                    O negociador é definido no local, sendo prioritário o superior com certificado oficial de negociação.
                  </p>
                </div>
              </div>
            </section>

            {/* PERÍMETROS (10-35) */}
            <section className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-emerald-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">10-35</div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Protocolo de Perímetros</h3>
                <div className="h-px flex-1 bg-emerald-900/30"></div>
              </div>

              <div className="bg-black/60 border border-white/5 p-10 rounded-[3rem] space-y-10">
                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic border-b border-white/5 pb-6">Engenharia do Perímetro</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <p className="text-sm text-slate-400 italic leading-relaxed">
                        Deve ser formada uma linha de <span className="text-white font-bold">barreiras</span> que impeça a circulação em ambos os sentidos. Entre elas, colocam-se <span className="text-white font-bold">cones</span> para fortalecer a sinalização.
                      </p>
                      <div className="p-6 bg-emerald-950/20 border border-emerald-500/20 rounded-3xl">
                         <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4 italic">Regra de Segurança</p>
                         <p className="text-xs text-slate-300 italic">Colocar cones na linha amarela (contínua) com uma distância de <span className="text-white font-bold">20-30 metros</span> das barreiras para sinalização antecipada.</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">Função dos Componentes:</p>
                      <div className="space-y-3">
                        {[
                          { item: 'Barreira', desc: 'Sinalização e impedimento físico da via' },
                          { item: 'Cone', desc: 'Sinalização visual de alerta' },
                          { item: 'Picos', desc: 'Prevenção de intrusão forçada (furar pneus)' }
                        ].map((obj, i) => (
                          <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                             <span className="text-xs text-white font-black italic">{obj.item}</span>
                             <span className="text-[9px] text-slate-500 font-bold uppercase">{obj.desc}</span>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 bg-amber-950/20 border border-amber-900/20 rounded-xl">
                        <p className="text-[9px] text-amber-500 font-black uppercase tracking-widest italic">DICA DE POSICIONAMENTO</p>
                        <p className="text-[10px] text-slate-400 italic">Os picos devem ser colocados obrigatoriamente à frente das barreiras.</p>
                      </div>
                   </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* CATEGORIA: POSTURA MILITAR */}
        {activeCategory === 'postura' && (
          <div className="space-y-12">
            <section className="bg-black/40 border border-white/5 p-10 rounded-[3rem] shadow-2xl">
              <p className="text-slate-300 leading-relaxed italic">
                Existem 2 tipos de formaturas (reunião de agentes com um determinado fim) com funções distintas, ambas serão aqui apresentadas. 
                De forma a que se distinga melhor uma da outra, cada uma tem um código atribuído: <span className="text-emerald-500 font-black">Código E</span> e <span className="text-emerald-500 font-black">Código F</span>.
              </p>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="bg-emerald-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">CÓDIGO E</div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Formatura Militar</h3>
                <div className="h-px flex-1 bg-emerald-900/30"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#050c09] border border-emerald-900/20 p-8 rounded-[2.5rem] space-y-6">
                  <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Contexto e Regras</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Um <span className="text-white font-bold">CÓDIGO E</span> é convocado para situações que requiram uma <span className="text-white font-bold">postura militar</span>: firmeza, silêncio e rigor superior ao normal.
                  </p>
                  <div className="p-5 bg-red-950/10 border border-red-900/20 rounded-2xl flex items-start gap-4">
                    <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <p className="text-[10px] text-red-400 font-black uppercase tracking-widest">Coletes visuais não são autorizados para Código E.</p>
                  </div>
                </div>

                <div className="bg-[#050c09] border border-emerald-900/20 p-8 rounded-[2.5rem] space-y-6">
                  <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Procedimento de Entrada</h4>
                  <p className="text-sm text-slate-400">A entrada deve ser pedida pelo <span className="text-white font-bold">lado esquerdo</span> dos superiores.</p>
                  <div className="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-3">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Animação & Frase</p>
                    <p className="text-xs font-mono text-emerald-400">Posição: Sentido (e airforce02)</p>
                    <p className="text-sm font-black text-white italic">"Permissão para ingressar na formatura?"</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#050c09] border border-emerald-900/20 p-10 rounded-[2.5rem] space-y-8">
                <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic text-center">Apresentação Formal</h4>
                <div className="flex flex-col md:flex-row items-center justify-around gap-10">
                  <div className="text-center space-y-4 max-w-xs">
                    <div className="w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-xl font-black">1</div>
                    <p className="text-sm text-slate-300 italic">Dê um passo à frente e coloque-se em Sentido.</p>
                  </div>
                  <div className="text-center space-y-4 max-w-xs">
                    <div className="w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-xl font-black">2</div>
                    <div className="bg-black/40 p-4 rounded-xl border border-emerald-500/10">
                      <p className="text-[10px] text-white font-bold italic">"[Patente] [Nome] apresenta-se ao seu serviço meu [patente do superior]!"</p>
                    </div>
                  </div>
                  <div className="text-center space-y-4 max-w-xs">
                    <div className="w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-xl font-black">3</div>
                    <p className="text-sm text-slate-300 italic">Retorne à formatura em posição de Descansar.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* CATEGORIA: OPERAÇÃO MDT */}
        {activeCategory === 'mdt' && (
          <div className="space-y-12">
            <div className="bg-indigo-950/10 border border-indigo-500/10 p-10 rounded-[3rem] space-y-8">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black italic shadow-lg">01</div>
                 <h4 className="text-sm font-black text-white uppercase italic tracking-widest">Preparação de Provas</h4>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed italic">
                 Antes de iniciar o incidente no MDT, deverá submeter as seguintes fotos nos canais Discord correspondentes:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {['Foto do Cidadão', 'Cartão de Cidadão', 'Bolsos (Inventário)', 'Viatura (se usada)'].map((item, i) => (
                    <div key={i} className="bg-black/40 border border-white/5 p-4 rounded-2xl text-center">
                       <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{item}</p>
                    </div>
                 ))}
              </div>
            </div>

            <div className="bg-black/60 border border-white/5 p-10 rounded-[3rem] space-y-10">
              <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest italic border-b border-white/5 pb-6">Preenchimento de Incidente (Mapeamento de Cores)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-1.5 h-auto bg-red-600 shadow-[0_0_10px_#dc2626]"></div>
                    <div>
                      <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">Bloco Vermelho: Provas</p>
                      <p className="text-xs text-slate-400 italic">Insira os links das fotos de detenção copiados do Discord.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1.5 h-auto bg-blue-600 shadow-[0_0_10px_#2563eb]"></div>
                    <div>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Bloco Azul: Agentes</p>
                      <p className="text-xs text-slate-400 italic">Adicione os camaradas envolvidos (dica: use data de nascimento).</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-1.5 h-auto bg-yellow-500 shadow-[0_0_10px_#eab308]"></div>
                    <div>
                      <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-2">Bloco Amarelo: Detento</p>
                      <p className="text-xs text-slate-400 italic">Adicione o cidadão e use "Modificar Multas" para artigos do Código Penal.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1.5 h-auto bg-purple-600 shadow-[0_0_10px_#9333ea]"></div>
                    <div>
                      <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-2">Bloco Roxo: Multas</p>
                      <p className="text-xs text-slate-400 italic">Valor total e tempo de custódia. Passe a fatura via menu radial (Z).</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CATEGORIA: OPERAÇÃO VEÍCULOS */}
        {activeCategory === 'veiculos' && (
          <div className="space-y-12">
             <section className="space-y-8">
               <div className="flex items-center gap-6">
                 <div className="bg-amber-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">LEVANTAMENTO</div>
                 <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Protocolo de Restituição</h3>
                 <div className="h-px flex-1 bg-amber-900/30"></div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-black/40 border border-amber-600/20 p-8 rounded-[2.5rem] space-y-6">
                    <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic">Checklist de Verificação</h4>
                    <div className="space-y-4">
                       {[
                         { t: 'Elegibilidade', d: 'Só levantar se "Recuperável pelo proprietário: Não" estiver AUSENTE.' },
                         { t: 'Propriedade', d: 'Verificar Cartão de Cidadão (CC) e confrontar com o registro da viatura.' },
                         { t: 'Segurança', d: 'Verificar Radar e MDT por mandados de busca/captura ativos no veículo.' },
                       ].map((step, i) => (
                         <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="w-6 h-6 rounded-lg bg-amber-600/20 text-amber-500 flex items-center justify-center text-[10px] font-black">{i+1}</div>
                            <div>
                               <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{step.t}</p>
                               <p className="text-xs text-slate-400 italic leading-tight">{step.d}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>

                  <div className="bg-black/40 border border-amber-600/20 p-8 rounded-[2.5rem] space-y-6">
                    <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest italic">Custos & Inspeção</h4>
                    <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                       <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Tabela de Faturamento</p>
                       <div className="flex justify-between items-end border-b border-white/5 pb-4">
                          <span className="text-xs text-slate-300 font-bold uppercase italic">Taxa Administrativa Base</span>
                          <span className="text-xl font-black text-white">15.000€</span>
                       </div>
                       <div className="flex justify-between items-end">
                          <span className="text-xs text-slate-300 font-bold uppercase italic">Adicional por Hora</span>
                          <span className="text-sm font-black text-amber-500">+3.500€</span>
                       </div>
                    </div>
                  </div>
               </div>
             </section>
          </div>
        )}

        {/* CATEGORIA: COT */}
        {activeCategory === 'cot' && (
          <div className="space-y-12">
            <section className="bg-emerald-950/10 border border-emerald-500/20 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                 <svg className="w-40 h-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 20l-5.447-2.724A2 2 0 013 15.487V6.512a2 2 0 011.553-1.943L9 3m0 17l5.447-2.724A2 2 0 0016 15.487V6.512a2 2 0 00-1.553-1.943L9 3m0 17V3"/></svg>
              </div>
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-6">C.O.T. — Centro Operacional Tático</h3>
              <p className="text-slate-300 leading-relaxed italic max-w-2xl">
                O Centro Operacional Tático é o núcleo estratégico da Diamond GNR, projetado para centralizar o comando em situações de extrema complexidade e alto risco.
              </p>
            </section>
          </div>
        )}

        {/* CATEGORIA: DIRETRIZES */}
        {activeCategory === 'diretrizes' && (
          <div className="space-y-12">
            <div className="bg-emerald-950/10 border border-emerald-900/20 p-10 rounded-[3rem] text-center space-y-4">
               <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Suporte Adicional</h4>
               <p className="text-sm text-slate-300 italic">Caso tenha dúvidas sobre algum procedimento, contacte um superior ou apresente uma reclamação no nosso departamento oficial.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UtilitiesSection;
