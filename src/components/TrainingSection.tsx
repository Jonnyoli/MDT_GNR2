
import React, { useState } from 'react';
import { Officer, Ticket } from '../types';
import { apiService } from '../services/apiService';
import { getDiscordConfig, saveTicketLocally } from '../services/dataService';

interface TrainingModule {
  id: string;
  title: string;
  icon: string;
  category: 'INICIAL' | 'ESPECIALIZADA';
  desc: string;
  details: string[];
  protocol?: string;
  isLocked?: boolean;
}

interface TrainingSectionProps {
  currentUser: Officer | null;
}

const TrainingSection: React.FC<TrainingSectionProps> = ({ currentUser }) => {
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  const modules: TrainingModule[] = [
    {
      id: 'mdt',
      title: 'Terminal de Dados (MDT)',
      icon: '💻',
      category: 'INICIAL',
      desc: 'Base de dados central das instituições do Estado.',
      details: [
        'O que é: O MDT (Mobile Database Terminal) é a ferramenta oficial de consulta e registo do Estado.',
        'Funções: Registo de detenções, queixas, mandados, gestão de unidades e perfis de cidadãos/viaturas.',
        'Dashboard: Visualização de unidades online, anúncios (BCSO-LSPD-GOV-EMS) e localização GPS de camaradas.',
        'Callsign: Ao receber sua identificação, clique com o botão direito no seu nome no Dashboard e selecione "Colocar Callsign".',
        'Civis: Consulta de cadastro, veículos, contacto e DATA DE NASCIMENTO (essencial para associar a incidentes).',
        'Incidentes: Local de registo formal de detenções via formulário próprio.',
        'Relatórios: Registo de queixas e denúncias efetuadas por civis no posto.',
        'Mandados: Registo de busca/captura (Prioridade: Inserir no RADAR primeiro, depois no MDT).',
        'Veículos: Pesquisa por matrícula para identificar proprietário e mandados ativos.',
        'Logs: Registo histórico de todas as ações governamentais no sistema (auditoria).'
      ]
    },
    {
      id: 'abordagens',
      title: 'Abordagens (10-10 / 10-11)',
      icon: '潮流',
      category: 'INICIAL',
      desc: 'Protocolos de fiscalização de trânsito e alto risco.',
      details: [
        'Tipos: 10-10 (Trânsito Normal) e 10-11 (Abordagem de Alto Risco).',
        'Comunicação: "CP [X] a iniciar 10-10" ou "CP [X] 10-11 no último 10-20, solicito 10-32 (Apoio)".',
        'Motivos 10-10: Condução imprudente, excesso de velocidade, modificações ilegais ou viatura sem condições.',
        'Procedimento Trânsito: Apresentação formal, motivo, solicitar documentos, verificação MDT, multa e despedida.',
        'Critérios Alto Risco (10-11): Uso de máscara, colete visível, coldre ou mandado de busca e captura.',
        'Procedimento 10-11: Solicitar apoio imediato, abordagem agressiva com cobertura da porta e rendição à distância.'
      ]
    },
    {
      id: 'apreensoes',
      title: 'Apreensões de Veículos',
      icon: '🪝',
      category: 'INICIAL',
      desc: 'Sanções sobre a propriedade pessoal do infrator.',
      details: [
        'Definição: Sanção aplicável à propriedade (viatura pessoal) de criminosos ou infratores.',
        'Casos Aplicáveis: Mau estacionamento, fuga às autoridades, uso em crimes ou falta de documentos.',
        'Comando Operacional: Use /apreender próximo à viatura (deve estar vazia).',
        'Revista de Inventário: Permitida apenas em casos de DETENÇÃO ou MANDADO. Proibida em mau estacionamento.',
        'Formulário: Preenchimento objetivo com motivo, tempo e local de destino.',
        'Destino: Cidade (Detenção/Crimes Graves) ou Posto (Infrações menores). Ver Guia-Apreensões.',
        'Tabela de Horas: Consultar o guia oficial para aplicar o tempo correto de apreensão.'
      ]
    },
    {
      id: 'formatura',
      title: 'Formatura e Postura',
      icon: '💂',
      category: 'INICIAL',
      desc: 'Organização, disciplina e hierarquia militar.',
      details: [
        'O que é: Reunião uniforme e alinhada de agentes para fins de coordenação.',
        'Objetivos: Reorganização de unidades, passagens de ordens ou inspeções.',
        'Início: Superior comunica via rádio "Código E" ou "10-16".',
        'Entrada: Pedir permissão ao superior posicionado no LADO ESQUERDO da formatura.',
        'Movimentação: Sempre por trás dos camaradas. Apenas os menos graduados se movem para abrir espaço.',
        'Apresentação: "Cadete [Nome] ao seu dispor meu [Patente do Superior]!".',
        'Regras de Ouro: Proibido uso de colete visível, silêncio absoluto e proibido sair sem autorização.'
      ]
    },
    {
      id: 'detencao',
      title: 'Detenções e Direitos',
      icon: '⛓️',
      category: 'INICIAL',
      desc: 'Protocolo de privação de liberdade e garantias.',
      details: [
        'Definição: Sanção penal que priva o cidadão de liberdades conforme o código penal.',
        'Deter vs Prender: DETER é estadia temporária nas celas; PRENDER é o envio para a prisão por meses.',
        'Quando Deter: Flagrante, suspeita justificada, falta de documentação ou mandado.',
        'Direitos: Devem ser lidos obrigatoriamente (No transporte ou nas celas).',
        'Itens Apreendidos: Telemóveis, rádio e itens ilegais (✅); Comida, água e itens não perigosos (❌).',
        'Mugshot: Obtenção de foto frontal e lateral com placa de identificação.',
        'Participantes: Adicionar criminosos ao MDT via NIF ou Data de Nascimento.',
        'Multas: F8 -> Faturas -> Nova Fatura. Inserir valor total e números dos artigos.',
        'Esclarecimento: Explicar ao detento todas as acusações e o tempo exato de prisão.',
        'Canais de Prova: Uso obrigatório dos canais #fotos-civil e #provas-civil para histórico criminal.'
      ]
    },
    {
      id: 'banco',
      title: 'Assalto a Banco / Ammu-Nation',
      icon: '🏦',
      category: 'ESPECIALIZADA',
      desc: 'Protocolos de 10-35 e Negociação em 10-90.',
      details: [
        'Posicionamento de viaturas (10-35) bloqueando vias de acesso.',
        'Instalação estratégica de barreiras e picos.',
        'Regras de 10-90: Limite de unidades conforme diretriz do Comando.',
        'Negociações frequentes: Fuga limpa e Via limpa.',
        'Prioridade para agentes com curso de Negociador.'
      ],
      protocol: 'Requer agendamento para partilha de mapa e explicação de perímetros.'
    },
    {
      id: 'perseguicao',
      title: 'Perseguições (10-80/10-70)',
      icon: '🚓',
      category: 'ESPECIALIZADA',
      desc: 'Táticas de captura de veículos e pé.',
      details: [
        'Regra dos 8-12 segundos: Se o sujeito não parar, inicia-se o 10-80.',
        'Comunicação: Modelo, Cor, Direção e Ponto de Referência (Ex: Ponto Alpha).',
        'Envio de localização constante via /g1 ou /g2.',
        '10-70 (A pé): Descrição de vestuário e acessórios (Chapéu, Máscara).',
        'Taser: Uso após 1-3 min de fuga ou condições de segurança (não usar se molhado/chuva).'
      ],
      protocol: 'Treino prático realizado no Forte Zancudo com viatura civil de apoio.'
    },
    {
      id: 'panico',
      title: 'Resposta a 10-99 (Pânico)',
      icon: '🚨',
      category: 'ESPECIALIZADA',
      desc: 'Táticas de avanço, recuo e cobertura.',
      details: [
        'Rádio Limpa: Proibido repetir informações (Ex: "Abati! Abati!").',
        'Entrada Estratégica: Ir ao encontro das unidades que acionaram o pânico.',
        'Tática da Tartaruga: Viatura em movimento dá cobertura ao agente agachado.',
        'Avanço em Parelhas: Um agente cobre a frente, outro os flancos.',
        'Critérios de Recuo: Falta de unidades ou desvantagem tática extrema.'
      ]
    },
    {
      id: 'refens',
      title: 'Resposta a Reféns',
      icon: '🙍',
      category: 'ESPECIALIZADA',
      desc: 'Negociação e proteção de vidas.',
      details: [
        'Silêncio absoluto na rádio para ouvir o negociador.',
        'Posicionamento: Viaturas próximas mas fora do núcleo de fogo.',
        'Manutenção do 10-35 coeso enquanto dura a negociação.',
        'Gestão de situações extraordinárias (Morte de refém ou veículos furando perímetro).'
      ],
      protocol: 'Simulações práticas apenas em treinos de academia agendados.'
    },
    {
      id: 'tiroteio',
      title: 'Instrução de Tiroteio',
      icon: '🔫',
      category: 'ESPECIALIZADA',
      desc: 'Combate armado e supressão.',
      details: [
        'Treino em grupo com múltiplos agentes.',
        'Foco em pontaria e uso de cobertura.',
        'Necessária supervisão de deuses (Admins) para reviver agentes.',
        'Não inclui táticas avançadas (solicitar Formação Tática separadamente).'
      ],
      isLocked: false
    }
  ];

  const handleRequestTrainer = async () => {
    if (!currentUser || !selectedModule || isRequesting) return;

    const config = getDiscordConfig();
    setIsRequesting(true);

    const requestTicket: Ticket = {
      id: `REQ-${Date.now().toString().slice(-6)}`,
      title: `SOLICITAÇÃO DE FORMAÇÃO: ${selectedModule.title}`,
      author: currentUser.name,
      category: 'Solicitação',
      priority: 'ALTA',
      status: 'ABERTO',
      description: `O oficial ${currentUser.rank} ${currentUser.name} (NIP: ${currentUser.nip}) solicita formalmente um formador para o módulo: **${selectedModule.title}**.\n\nInformando: Comando Geral e Escola da Guarda.`,
      timestamp: new Date().toLocaleString('pt-PT')
    };

    try {
      if (config.token && config.ticketChannelId) {
        await apiService.sendTicketToDiscord(config.token, config.ticketChannelId, requestTicket);
      }
      saveTicketLocally(requestTicket);
      alert(`SOLICITAÇÃO ENVIADA!\nO Comando Geral e a Escola da Guarda foram notificados sobre o seu pedido para a formação de ${selectedModule.title}. Aguarde contacto.`);
    } catch (error: any) {
      alert("Falha ao notificar via Discord, mas o pedido foi registrado no terminal local.");
      saveTicketLocally(requestTicket);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* HEADER */}
      <div className="border-b border-white/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div>
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Academia da Guarda</h2>
          <p className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.4em] mt-5 flex items-center gap-4 italic transition-all">
             <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse shadow-[0_0_10px_#10b981]"></span>
             Centro de Instrução Tática e Progressão
          </p>
        </div>
        <div className="bg-emerald-950/20 border border-emerald-900/30 px-6 py-3 rounded-2xl">
           <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest italic">Protocolo de Ensino S9-ACTIVO</p>
        </div>
      </div>

      {!selectedModule ? (
        <div className="space-y-16">
          {/* CATEGORIA: OBRIGATÓRIAS / INICIAIS */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="h-1.5 w-6 bg-emerald-500 rounded-full"></div>
               <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.4em] italic">Formações Iniciais (Recrutas/Cadetes)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {modules.filter(m => m.category === 'INICIAL').map((m) => (
                 <div key={m.id} onClick={() => setSelectedModule(m)} className="bg-[#050c09] border border-emerald-900/20 p-8 rounded-[2.5rem] hover:border-emerald-500/40 transition-all cursor-pointer group shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity text-4xl">{m.icon}</div>
                    <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{m.icon}</div>
                    <h4 className="text-lg font-black text-white uppercase italic tracking-tighter mb-2">{m.title}</h4>
                    <p className="text-[10px] text-slate-500 italic leading-relaxed">{m.desc}</p>
                    <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center opacity-40 group-hover:opacity-100">
                       <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Abrir Dossiê de Instrução →</span>
                       <span className="text-[7px] font-black bg-emerald-500 text-black px-2 py-0.5 rounded">OBRIGATÓRIO</span>
                    </div>
                 </div>
               ))}
            </div>
          </section>

          {/* CATEGORIA: ESPECIALIZADAS */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="h-1.5 w-6 bg-blue-500 rounded-full"></div>
               <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] italic">Especializações e Táticas Avançadas</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {modules.filter(m => m.category === 'ESPECIALIZADA').map((m) => (
                 <div key={m.id} onClick={() => setSelectedModule(m)} className="bg-[#080c14] border border-white/5 p-8 rounded-[2.5rem] hover:border-blue-500/40 transition-all cursor-pointer group shadow-xl relative overflow-hidden">
                    <div className="text-3xl mb-6 group-hover:scale-110 transition-transform opacity-50 group-hover:opacity-100">{m.icon}</div>
                    <h4 className="text-sm font-black text-white uppercase italic tracking-tighter mb-2">{m.title}</h4>
                    <p className="text-[9px] text-slate-500 italic leading-relaxed">{m.desc}</p>
                    <div className="mt-8 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Ver Manual Operacional</span>
                    </div>
                 </div>
               ))}
            </div>
          </section>

          {/* GUIA DE SOLICITAÇÃO REFINADO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-black/60 border border-white/5 p-10 rounded-[3rem] space-y-6">
                <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic border-b border-white/5 pb-4">Como obter formação?</h4>
                <p className="text-sm text-slate-300 italic leading-relaxed">
                   Deves solicitar a um <span className="text-white font-bold underline decoration-indigo-500">@Formador</span> ou <span className="text-white font-bold underline decoration-indigo-500">@Formador Estagiário</span> para que as possas realizar, preferencialmente durante uma patrulha.
                </p>
             </div>
             <div className="bg-[#0c0505] border border-red-900/20 p-10 rounded-[3rem] flex flex-col justify-center space-y-4">
                <p className="text-sm text-slate-300 italic font-bold">
                   É necessário ter estas formações para abrir exame?
                </p>
                <p className="text-sm text-slate-400 italic">
                   <span className="text-red-500 font-black">SIM.</span> Ao realizares estas formações estarás apto à realização do exame final.
                </p>
             </div>
          </div>
        </div>
      ) : (
        /* VISUALIZADOR DE DOSSIÊ */
        <div className="animate-in zoom-in-95 duration-500">
           <button 
             onClick={() => setSelectedModule(null)}
             className="mb-8 flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all"
           >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
              Voltar ao Catálogo de Academia
           </button>

           <div className="bg-[#050c09] border border-emerald-500/20 rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative">
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_2px]"></div>
              
              <div className="p-12 md:p-20 flex flex-col lg:flex-row gap-16 relative z-10">
                 <div className="lg:w-1/3 space-y-10">
                    <div className="w-32 h-32 bg-emerald-600/10 border border-emerald-500/20 rounded-[2.5rem] flex items-center justify-center text-6xl shadow-2xl">
                       {selectedModule.icon}
                    </div>
                    <div>
                       <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-tight">{selectedModule.title}</h3>
                       <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mt-5">CÓDIGO_MÓDULO: {selectedModule.id.toUpperCase()}_S9</p>
                    </div>
                    <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                       <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Estado de Instrução</p>
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-xs font-black text-white italic">DISPONÍVEL PARA TREINO</span>
                       </div>
                    </div>
                    {selectedModule.protocol && (
                      <div className="p-6 bg-amber-600/5 border border-amber-600/20 rounded-3xl space-y-2">
                         <p className="text-[9px] text-amber-500 font-black uppercase tracking-widest">Protocolo de Agendamento</p>
                         <p className="text-[11px] text-slate-400 italic leading-relaxed">{selectedModule.protocol}</p>
                      </div>
                    )}
                 </div>

                 <div className="flex-1 bg-black/40 border border-white/5 rounded-[3rem] p-10 md:p-16 space-y-12">
                    <div className="flex justify-between items-center border-b border-white/5 pb-8">
                       <h4 className="text-xs font-black text-emerald-500 uppercase tracking-[0.4em] italic">Diretrizes Operacionais</h4>
                       <span className="text-[8px] font-mono text-slate-700">SIGP_TERM_ACADEMY_V2025</span>
                    </div>

                    <div className="space-y-8">
                       {selectedModule.details.map((detail, idx) => (
                         <div key={idx} className="flex gap-6 items-start group">
                            <div className="w-8 h-8 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-black text-[10px] italic shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                               {idx + 1}
                            </div>
                            <p className="text-sm text-slate-300 italic leading-relaxed pt-1.5">
                               {detail}
                            </p>
                         </div>
                       ))}
                    </div>

                    <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-60">
                       <div className="text-center md:text-left">
                          <p className="text-[10px] font-black text-white italic">Coronel Joey</p>
                          <p className="text-[8px] text-slate-500 uppercase font-black">Diretor da Academia de Formação</p>
                       </div>
                       <div className="flex gap-4">
                          <button 
                            onClick={handleRequestTrainer}
                            disabled={isRequesting}
                            className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all disabled:opacity-50 flex items-center gap-2"
                          >
                            {isRequesting ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                Transmitindo...
                              </>
                            ) : (
                              "Solicitar Formador"
                            )}
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* FOOTER ACADEMIA */}
      <div className="bg-emerald-950/10 border border-emerald-500/10 p-10 rounded-[3rem] text-center">
         <p className="text-[10px] text-emerald-800 font-black uppercase tracking-[0.4em] mb-4 italic">Estatuto da Academia</p>
         <p className="text-xs text-slate-500 italic leading-relaxed max-w-3xl mx-auto uppercase">
            O empenho nas formações reflete a tua <span className="text-white font-bold underline">Proficiência Operacional</span>. Recrutas sem progressão em tempo útil poderão ser desligados do corpo ativo.
         </p>
      </div>
    </div>
  );
};

export default TrainingSection;
