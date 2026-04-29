
import React, { useState, useEffect, useRef } from 'react';

interface NICAuthProps {
  onComplete: () => void;
  onCancel: () => void;
}

const NICAuth: React.FC<NICAuthProps> = ({ onComplete, onCancel }) => {
  const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [progress, setProgress] = useState(0);
  const [randomHex, setRandomHex] = useState('');
  const [authLogs, setAuthLogs] = useState<string[]>(['AGUARDANDO ENTRADA BIOMÉTRICA...']);
  const logEndRef = useRef<HTMLDivElement>(null);

  const analysisSteps = [
    'INICIANDO PROTOCOLO DE CONEXÃO S9...',
    'ACESSANDO BANCO DE DADOS CENTRAL...',
    'ANALISANDO CRISTAS PAPILARES...',
    'IDENTIFICANDO PONTOS DE MINÚCIAS...',
    'VERIFICANDO INTEGRIDADE DO SENSOR...',
    'CALCULANDO HASH DE IDENTIDADE...',
    'VALIDANDO ASSINATURA DIGITAL...',
    'COMPARANDO COM REGISTO DE ALTA PATENTE...',
    'SINCRONIZANDO COM TERMINAL N.I.C...',
    'ACESSO AUTORIZADO PELO COMANDO.'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRandomHex(Math.random().toString(16).toUpperCase().substring(2, 12));
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (status === 'SCANNING') {
      const logInterval = setInterval(() => {
        const stepIdx = Math.floor((progress / 100) * analysisSteps.length);
        const currentMsg = analysisSteps[stepIdx] || 'FINALIZANDO AUTENTICAÇÃO...';
        setAuthLogs(prev => {
          if (prev[prev.length - 1] !== currentMsg) {
            return [...prev, currentMsg].slice(-8);
          }
          return prev;
        });
      }, 400);
      return () => clearInterval(logInterval);
    }
  }, [status, progress]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (status === 'SCANNING') {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus('SUCCESS');
            setTimeout(onComplete, 1000);
            return 100;
          }
          const increment = Math.random() * 2;
          return prev + increment;
        });
      }, 30);
    } else if (status === 'IDLE') {
      setProgress(0);
      setAuthLogs(['SISTEMA PRONTO: AGUARDANDO BIOMETRIA']);
    }
    return () => clearInterval(interval);
  }, [status, onComplete]);

  const handleStart = () => {
    if (status === 'IDLE' || status === 'ERROR') {
      setStatus('SCANNING');
    }
  };

  const handleStop = () => {
    if (status === 'SCANNING' && progress < 100) {
      setStatus('ERROR');
      setAuthLogs(prev => [...prev, '!! ERRO: CONTACTO INTERROMPIDO !!', 'POR FAVOR, MANTENHA O PRESSIONAMENTO.']);
      setTimeout(() => setStatus('IDLE'), 2000);
    }
  };

  // Pontos de minúcias decorativos que aparecem durante o scan
  const minutiaePoints = [
    { t: 15, l: 40 }, { t: 25, l: 60 }, { t: 45, l: 30 }, 
    { t: 60, l: 70 }, { t: 75, l: 45 }, { t: 35, l: 20 },
    { t: 55, l: 55 }, { t: 85, l: 25 }, { t: 20, l: 80 }
  ];

  return (
    <div className="fixed inset-0 z-[500] bg-[#01040a]/99 backdrop-blur-3xl flex items-center justify-center font-mono overflow-hidden select-none">
      <style>{`
        @keyframes scan-line { 0% { top: 0; } 100% { top: 100%; } }
        @keyframes pulse-ring { 0% { transform: scale(0.9); opacity: 0.5; } 100% { transform: scale(1.6); opacity: 0; } }
        @keyframes subtle-glitch { 0% { transform: translate(0); } 2% { transform: translate(-2px, 1px); } 4% { transform: translate(2px, -1px); } 6% { transform: translate(0); } }
        .scanner-glow { box-shadow: 0 0 40px rgba(59, 130, 246, 0.1), inset 0 0 20px rgba(59, 130, 246, 0.05); }
        .success-glow { box-shadow: 0 0 60px rgba(16, 185, 129, 0.2), inset 0 0 30px rgba(16, 185, 129, 0.1); }
        .error-glow { box-shadow: 0 0 60px rgba(220, 38, 38, 0.2), inset 0 0 30px rgba(220, 38, 38, 0.1); }
        .terminal-text { text-shadow: 0 0 5px currentColor; }
        .laser-gradient { background: linear-gradient(90deg, transparent 0%, #60a5fa 50%, transparent 100%); }
      `}</style>

      {/* Grid HUD de Fundo */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className={`w-full max-w-5xl h-[800px] flex gap-12 p-12 relative z-10 transition-all duration-500 ${status === 'ERROR' ? 'animate-[subtle-glitch_0.3s_infinite]' : ''}`}>
        
        {/* Painel Esquerdo: Logs e Dados */}
        <div className="flex-1 flex flex-col justify-between py-10">
           <div className="space-y-12">
              <div>
                 <div className="flex items-center gap-4 mb-3">
                    <div className={`h-1 w-12 rounded-full transition-all duration-700 ${status === 'SCANNING' ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-slate-800'}`}></div>
                    <span className="text-[10px] font-black tracking-[0.8em] text-blue-500/50 uppercase">Secured Terminal</span>
                 </div>
                 <h1 className="text-6xl font-black text-white italic tracking-tighter leading-none">N.I.C. AUTH</h1>
                 <p className="text-[10px] text-slate-500 mt-4 tracking-[0.4em] font-bold uppercase italic">Protocolo de Alta Patente • Terminal S9</p>
              </div>

              {/* Feed do Terminal */}
              <div className="bg-black/40 border border-white/5 p-8 rounded-[2rem] h-64 flex flex-col shadow-inner">
                 <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <span className="text-[9px] font-black text-blue-500/60 uppercase tracking-widest italic flex items-center gap-2">
                       <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span>
                       Análise de Fluxo
                    </span>
                    <span className="text-[8px] font-mono text-slate-700">0x{randomHex}</span>
                 </div>
                 <div className="flex-1 space-y-2 overflow-hidden text-[10px] font-bold italic">
                    {authLogs.map((log, i) => (
                      <div key={i} className={`flex gap-3 transition-all duration-300 ${i === authLogs.length - 1 ? (status === 'ERROR' ? 'text-red-500' : 'text-blue-400') : 'text-slate-600 opacity-40'}`}>
                         <span className="shrink-0">[{new Date().toLocaleTimeString()}]</span>
                         <span className="uppercase tracking-tight">{log}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                 <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Status do Sensor</p>
                 <p className={`text-xs font-black italic ${status === 'SCANNING' ? 'text-blue-500' : 'text-slate-500'}`}>S9-LIDAR: ACTIVE</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/5 rounded-2xl">
                 <p className="text-[8px] text-slate-600 font-black uppercase mb-1">Criptografia</p>
                 <p className="text-xs font-black text-slate-500 italic">AES-512-RSA</p>
              </div>
           </div>
        </div>

        {/* Painel Central: A Impressão Digital */}
        <div className="relative flex flex-col items-center justify-center">
           <div 
             onMouseDown={handleStart}
             onMouseUp={handleStop}
             onMouseLeave={handleStop}
             onTouchStart={handleStart}
             onTouchEnd={handleStop}
             className={`relative w-96 h-[580px] border-2 rounded-[5rem] transition-all duration-700 flex flex-col items-center justify-center cursor-pointer overflow-hidden group 
               ${status === 'SUCCESS' ? 'border-emerald-500 success-glow bg-emerald-500/5' : 
                 status === 'SCANNING' ? 'border-blue-500 scanner-glow bg-blue-500/10' : 
                 status === 'ERROR' ? 'border-red-600 error-glow bg-red-600/10' : 
                 'border-white/5 bg-black/40 hover:border-white/20'}`}
           >
              {/* Scan Line Laser */}
              {status === 'SCANNING' && (
                <div className="absolute inset-x-0 h-1 z-30 laser-gradient shadow-[0_0_20px_#3b82f6]" 
                     style={{ top: `${progress}%`, transition: 'top 0.1s linear' }}></div>
              )}

              {/* Impressão Digital Layered */}
              <div className="relative transform group-active:scale-95 transition-transform duration-500">
                 {/* Camada Fantasma */}
                 <svg className={`w-52 h-52 transition-all duration-1000 ${status === 'IDLE' ? 'opacity-5' : 'opacity-10'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.268 0 2.49.234 3.62.661m-1.756 3.39a3 3 0 00-4.632 0m4.632 0a3 3 0 011.023 3.67m-1.164 2.025a10.003 10.003 0 01-1.746 3.419m-3.374-1.213a3 3 0 114.668 0m3.115 1.004a10.025 10.025 0 01-4.459 2.082" />
                 </svg>

                 {/* Camada de Progresso / Calor */}
                 <div className="absolute inset-0 overflow-hidden" style={{ height: `${progress}%`, opacity: status === 'IDLE' ? 0 : 1 }}>
                    <svg className={`w-52 h-52 transition-colors duration-500 ${status === 'SUCCESS' ? 'text-emerald-500' : 'text-blue-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.268 0 2.49.234 3.62.661m-1.756 3.39a3 3 0 00-4.632 0m4.632 0a3 3 0 011.023 3.67m-1.164 2.025a10.003 10.003 0 01-1.746 3.419m-3.374-1.213a3 3 0 114.668 0m3.115 1.004a10.025 10.025 0 01-4.459 2.082" />
                    </svg>
                 </div>

                 {/* Pontos de Minúcias (Aparecem durante o scan) */}
                 {status === 'SCANNING' && minutiaePoints.map((p, i) => (
                   <div key={i} 
                        className={`absolute w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6] transition-all duration-500 
                                   ${progress > p.t ? 'scale-100 opacity-80' : 'scale-0 opacity-0'}`}
                        style={{ top: `${p.t}%`, left: `${p.l}%` }}>
                      <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-30"></div>
                   </div>
                 ))}
              </div>

              {/* Status HUD Inferior */}
              <div className="mt-16 text-center space-y-2">
                 <p className={`text-[10px] font-black uppercase tracking-[0.5em] transition-all duration-500 
                   ${status === 'SUCCESS' ? 'text-emerald-500' : (status === 'SCANNING' ? 'text-blue-500 animate-pulse' : 'text-slate-700')}`}>
                    {status === 'IDLE' ? 'Aguardando Pressão' : 
                     status === 'SCANNING' ? 'Identificando...' : 
                     status === 'SUCCESS' ? 'Acesso Concedido' : 'Falha de Identificação'}
                 </p>
                 <div className="flex flex-col items-center">
                    <h3 className={`text-5xl font-black italic tracking-tighter transition-all duration-700 
                      ${status === 'SUCCESS' ? 'text-emerald-500' : 'text-white opacity-80'}`}>
                       {status === 'SCANNING' ? `${Math.floor(progress)}%` : status === 'SUCCESS' ? 'OK' : '---'}
                    </h3>
                    <div className="w-12 h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                       <div className={`h-full transition-all duration-300 ${status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                            style={{ width: `${progress}%` }}></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Anéis de Pulso Biométrico */}
           {status === 'SCANNING' && (
             <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="w-[500px] h-[500px] rounded-full border border-blue-500/10" style={{ animation: 'pulse-ring 2s infinite' }}></div>
                <div className="w-[450px] h-[450px] rounded-full border border-blue-500/5" style={{ animation: 'pulse-ring 2s infinite 1s' }}></div>
             </div>
           )}
        </div>

        {/* Painel Direito: Instruções e Ações */}
        <div className="flex-1 flex flex-col justify-between py-10 text-right">
           <div className="space-y-12">
              <div className="p-8 bg-[#0a0f1c] border border-blue-500/20 rounded-[3rem] shadow-2xl space-y-6">
                 <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest italic border-b border-white/5 pb-4">Instrução de Segurança</h4>
                 <p className="text-xs text-slate-400 italic leading-relaxed uppercase">
                    O Terminal N.I.C. requer a validação biométrica de um Oficial Registado. 
                    <br/><br/>
                    <span className="text-white font-bold underline">Mantenha pressionado</span> o painel central até que a verificação de hash alcance 100%. 
                    <br/><br/>
                    A libertação precoce anula o processo.
                 </p>
              </div>

              <div className="space-y-4">
                 <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Identificador de Sessão</span>
                    <span className="text-xs font-mono text-slate-500">SID-{randomHex.slice(0, 8)}</span>
                 </div>
                 <div className="flex flex-col gap-2">
                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Link Satélite</span>
                    <div className="flex justify-end gap-1">
                       {Array.from({length: 6}).map((_, i) => (
                         <div key={i} className={`h-1 w-4 rounded-full ${i < 5 ? 'bg-blue-600' : 'bg-slate-800'}`}></div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <button 
             onClick={onCancel}
             className="ml-auto px-10 py-4 border border-red-900/30 text-red-900 hover:text-red-500 hover:bg-red-950/20 hover:border-red-600 transition-all rounded-2xl text-[10px] font-black uppercase tracking-[0.3em]"
           >
              Abortar Operação
           </button>
        </div>
      </div>

      {/* Micro-Efeitos de CRT Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(59,130,246,0)_50%,rgba(59,130,246,0.1)_50%)] bg-[length:100%_4px]"></div>
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(90deg,rgba(59,130,246,0.1),rgba(59,130,246,0),rgba(59,130,246,0.1))]"></div>
    </div>
  );
};

export default NICAuth;
