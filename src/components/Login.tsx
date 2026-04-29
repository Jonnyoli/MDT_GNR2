
import React, { useState, useEffect } from 'react';
import { getDiscordConfig } from '../services/dataService';
import { apiService } from '../services/apiService';

interface LoginProps {
  onLoginByNip: (nip: string, pass: string) => boolean;
  onLoginByDiscord: (discordUser: any) => boolean;
}

const Login: React.FC<LoginProps> = ({ onLoginByNip, onLoginByDiscord }) => {
  const [badgeNumber, setBadgeNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginMode, setLoginMode] = useState<'CHOICE' | 'NIP'>('CHOICE');
  const [error, setError] = useState<string | null>(null);
  
  const config = getDiscordConfig();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code && config.oauthClientId && config.oauthClientSecret) {
      handleDiscordAuth(code);
    }
  }, []);

  const handleDiscordAuth = async (code: string) => {
    setIsLoggingIn(true);
    setError(null);
    try {
      const tokenData = await apiService.exchangeCodeForToken(code, config.oauthClientId, config.oauthClientSecret, config.redirectUri);
      const discordUser = await apiService.getDiscordUser(tokenData.access_token);
      const success = onLoginByDiscord(discordUser);
      if (!success) {
        setError("Usuário Discord não encontrado no efetivo.");
        setIsLoggingIn(false);
      }
    } catch (e: any) {
      setError("Falha na autenticação: " + e.message);
      setIsLoggingIn(false);
    }
  };

  const handleNipLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeNumber || !password) return;
    setIsLoggingIn(true);
    setError(null);
    setTimeout(() => {
      const success = onLoginByNip(badgeNumber, password);
      if (!success) {
        setError("Credenciais inválidas ou não autorizadas.");
        setIsLoggingIn(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8 relative overflow-hidden font-sans">
      <style>{`
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(300%); } }
        .night-vision-overlay {
          background: radial-gradient(circle, transparent 30%, rgba(0,0,0,0.8) 100%);
          mix-blend-mode: multiply;
        }
        .grain-overlay {
          background-image: url('https://grainy-gradients.vercel.app/noise.svg');
          opacity: 0.15;
          pointer-events: none;
        }
      `}</style>

      {/* Background Cinematográfico de Vídeo */}
      <div className="absolute inset-0 z-0">
         <video 
           autoPlay muted loop playsInline
           className="w-full h-full object-cover grayscale contrast-150 brightness-50"
           style={{ filter: 'hue-rotate(90deg) saturate(2) brightness(0.6) contrast(1.2)' }}
         >
           <source src="https://assets.mixkit.co/videos/preview/mixkit-police-car-at-night-with-flashing-lights-42562-large.mp4" type="video/mp4" />
         </video>
         <div className="absolute inset-0 bg-emerald-950/40 mix-blend-color z-10"></div>
         <div className="absolute inset-0 night-vision-overlay z-11"></div>
         <div className="absolute inset-0 grain-overlay z-12"></div>
      </div>

      <div className="relative z-20 w-full max-w-[1100px] flex h-[650px] rounded-[3rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.9)] border border-emerald-500/10">
         
         {/* Lado Esquerdo: Marca/Info */}
         <div className="hidden lg:flex w-1/2 bg-[#064e3b]/80 backdrop-blur-xl p-20 flex-col justify-between relative overflow-hidden border-r border-white/5">
            <div className="relative z-10">
               <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-2xl flex items-center justify-center mb-12 border border-white/20 shadow-2xl">
                  <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
               </div>
               <h1 className="text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85] mb-8">SISTEMA <br/> DIAMOND</h1>
               <p className="text-emerald-100/60 text-lg font-medium max-w-sm leading-relaxed italic">Portal de Inteligência e Gestão de Efetivo • GNR S9</p>
            </div>
            <div className="relative z-10">
               <div className="bg-black/40 px-6 py-3 rounded-2xl text-[9px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/10 w-fit">TERMINAL_SECURE_LINK</div>
            </div>
            {/* Overlay de Scan */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/5 to-transparent h-full w-full pointer-events-none" style={{ animation: 'scanline 4s linear infinite' }}></div>
         </div>

         {/* Lado Direito: Formulários */}
         <div className="flex-1 bg-[#020806]/95 backdrop-blur-3xl p-16 flex flex-col justify-center relative overflow-hidden">
            
            {loginMode === 'CHOICE' && (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-12">
                   <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Identificação</h2>
                   <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-3 italic">Autenticação de Terminal S9</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                   <button onClick={() => setLoginMode('NIP')} className="flex items-center gap-6 p-6 bg-emerald-600/10 border border-emerald-500/20 rounded-[2rem] hover:bg-emerald-600 hover:text-white transition-all group shadow-xl active:scale-95">
                      <div className="w-14 h-14 bg-emerald-600/20 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
                      </div>
                      <div className="text-left">
                         <p className="text-xs font-black uppercase tracking-widest italic leading-none">Acesso via Crachá</p>
                         <p className="text-[10px] opacity-40 uppercase font-bold mt-2">Login Manual (NIP + PASS)</p>
                      </div>
                   </button>
                   <button onClick={() => window.location.href = `https://discord.com/oauth2/authorize?client_id=${config.oauthClientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=code&scope=identify`} className="flex items-center gap-6 p-6 bg-[#5865F2]/10 border border-[#5865F2]/20 rounded-[2rem] hover:bg-[#5865F2] hover:text-white transition-all group shadow-xl active:scale-95">
                      <div className="w-14 h-14 bg-[#5865F2]/20 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                         <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                      </div>
                      <div className="text-left">
                         <p className="text-xs font-black uppercase tracking-widest italic leading-none">Sync Discord</p>
                         <p className="text-[10px] opacity-40 uppercase font-bold mt-2">Identidade Centralizada</p>
                      </div>
                   </button>
                </div>
              </div>
            )}

            {loginMode === 'NIP' && (
              <div className="animate-in slide-in-from-right-10 duration-500">
                <button onClick={() => setLoginMode('CHOICE')} className="text-emerald-900 hover:text-emerald-500 flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-widest transition-all">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
                   Retornar
                </button>
                <form onSubmit={handleNipLogin} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-emerald-900 uppercase tracking-widest ml-1 italic">Número de Crachá Operacional</label>
                      <input 
                        autoFocus
                        type="text" 
                        value={badgeNumber}
                        onChange={(e) => { setBadgeNumber(e.target.value); setError(null); }}
                        placeholder="EX: 25492" 
                        className={`w-full bg-emerald-950/10 border ${error ? 'border-red-500' : 'border-emerald-900/30'} rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 transition-all uppercase placeholder:text-emerald-950/40`}
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-emerald-900 uppercase tracking-widest ml-1 italic">Palavra-Passe</label>
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(null); }}
                        placeholder="••••••••" 
                        className={`w-full bg-emerald-950/10 border ${error ? 'border-red-500' : 'border-emerald-900/30'} rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-emerald-950/40`}
                      />
                   </div>
                   <button type="submit" disabled={isLoggingIn || !badgeNumber || !password} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 disabled:opacity-50">
                      {isLoggingIn ? "VALIDANDO ACESSO..." : "AUTENTICAR TERMINAL"}
                   </button>
                </form>
              </div>
            )}

            {error && <p className="absolute bottom-10 left-0 w-full text-[10px] text-red-500 font-black uppercase tracking-widest text-center animate-bounce italic">{error}</p>}
         </div>
      </div>
      
      <div className="absolute bottom-10 left-0 w-full text-center pointer-events-none">
         <p className="text-[9px] text-emerald-900 font-bold uppercase tracking-[0.8em] opacity-40">Guarda Nacional Republicana • Diamond Command Hub v9.5</p>
      </div>
    </div>
  );
};

export default Login;
