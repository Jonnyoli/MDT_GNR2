
import React, { useState } from 'react';
import { Notification, Officer } from '../types';

interface HeaderProps {
  activeTab: string;
  notifications: Notification[];
  currentUser: Officer;
  themeColor: string;
  onUpdateTheme: (color: string) => void;
  scanlines: boolean;
  onToggleScanlines: () => void;
  brightness: number;
  onUpdateBrightness: (value: number) => void;
  onUpdateAvatar: (url: string) => void;
  backendStatus: 'ONLINE' | 'OFFLINE' | 'LOADING';
}

const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  notifications, 
  currentUser, 
  themeColor, 
  onUpdateTheme, 
  scanlines, 
  onToggleScanlines,
  brightness,
  onUpdateBrightness,
  onUpdateAvatar,
  backendStatus
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const isNIC = activeTab.startsWith('nic');

  const tacticalThemes = [
    { id: 'gnr', color: '#020806', label: 'Forest Alpha' },
    { id: 'midnight', color: '#0b0f19', label: 'Midnight Bravo' },
    { id: 'obsidian', color: '#0a0a0a', label: 'Void Delta' },
    { id: 'incursion', color: '#1a0505', label: 'Incursion Zulu' },
    { id: 'arctic', color: '#05101a', label: 'Arctic Sigma' },
    { id: 'desert', color: '#140f05', label: 'Desert Echo' },
    { id: 'neon', color: '#10051a', label: 'Neon Gamma' },
    { id: 'sea', color: '#051a14', label: 'Deep Sea Omega' },
    { id: 'steel', color: '#111111', label: 'Steel Tau' },
    { id: 'toxic', color: '#0a1a05', label: 'Toxic Lambda' },
    { id: 'sunset', color: '#1a0e05', label: 'Sunset Rho' },
    { id: 'plasma', color: '#1a0515', label: 'Plasma Xi' },
  ];

  const SettingToggle = ({ label, value, onToggle }: { label: string, value: boolean, onToggle: () => void }) => (
    <div className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-white/10 transition-all group">
       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">{label}</span>
       <button 
         onClick={onToggle}
         className={`w-12 h-6 rounded-full relative p-1 transition-all ${value ? 'bg-emerald-600' : 'bg-slate-800'}`}
       >
         <div className={`w-4 h-4 bg-white rounded-full shadow-lg transition-all ${value ? 'translate-x-6' : 'translate-x-0'}`}></div>
       </button>
    </div>
  );

  return (
    <header className={`h-24 backdrop-blur-3xl border-b flex items-center justify-between px-12 sticky top-0 z-40 transition-all duration-700 ${isNIC ? 'bg-black/90 border-indigo-500/10' : 'bg-black/40 border-white/5'}`}>
      
      <div className="flex items-center gap-8 w-1/2">
        <div className="relative w-full max-w-xl group">
           <svg className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 group-focus-within:text-indigo-400 transition-colors ${isNIC ? 'text-indigo-900' : 'text-white/20 group-focus-within:text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
           <input 
             type="text" 
             placeholder={isNIC ? "PESQUISAR ALVO OU INTERCEPÇÃO..." : "PESQUISAR CRACHÁ, MATRÍCULA OU NOME DO GUARDA..."}
             className={`w-full border rounded-2xl pl-12 pr-6 py-3.5 text-xs font-bold text-white focus:outline-none transition-all uppercase ${isNIC ? 'bg-indigo-950/10 border-indigo-500/20 focus:border-indigo-500/50' : 'bg-black/20 border-white/5 focus:border-white/20'}`}
           />
        </div>
        
        {/* Backend Status Indicator */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
          backendStatus === 'ONLINE' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 
          backendStatus === 'LOADING' ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' :
          'bg-red-500/5 border-red-500/20 text-red-500'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            backendStatus === 'ONLINE' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 
            backendStatus === 'LOADING' ? 'bg-amber-500 animate-pulse' :
            'bg-red-500 shadow-[0_0_8px_#ef4444]'
          }`}></span>
          <span className="text-[9px] font-black uppercase tracking-widest leading-none">
            {backendStatus === 'ONLINE' ? 'SERVIDOR LIGADO' : backendStatus === 'LOADING' ? 'A LIGAR...' : 'SERVIDOR OFFLINE'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`w-12 h-12 border rounded-2xl flex items-center justify-center transition-all ${showSettings ? 'bg-white text-black shadow-[0_0_20px_white]' : (isNIC ? 'bg-indigo-950/20 border-indigo-500/20 text-indigo-800' : 'bg-black/20 border-white/5 text-white/30 hover:text-white')}`}
          >
             <svg className={`w-5 h-5 transition-transform duration-700 ${showSettings ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0"/></svg>
          </button>

          {showSettings && (
            <div className={`absolute right-0 mt-4 w-[28rem] border rounded-[2.5rem] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-4 duration-300 ${isNIC ? 'bg-[#040812] border-indigo-500/30' : 'bg-black/95 border-white/10 backdrop-blur-3xl'}`}>
               <h4 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-10 flex items-center gap-3 ${isNIC ? 'text-indigo-500' : 'text-white'}`}>
                  Consola de Configuração
               </h4>
               
               <div className="space-y-8">
                  {!isNIC && (
                    <div className="space-y-4">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
                         <span>Esquema Operacional Ativo</span>
                         <span className="text-white">{tacticalThemes.find(t => t.color === themeColor)?.label}</span>
                      </p>
                      <div className="grid grid-cols-4 gap-3">
                        {tacticalThemes.map(t => (
                          <button
                            key={t.id}
                            onClick={() => onUpdateTheme(t.color)}
                            title={t.label}
                            className={`h-10 rounded-xl border-2 transition-all relative overflow-hidden group ${themeColor === t.color ? 'border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'border-white/5 hover:border-white/20'}`}
                            style={{ backgroundColor: t.color }}
                          >
                             {themeColor === t.color && (
                               <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                 <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                               </div>
                             )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                     <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-widest">
                        <span>Brilho do Hardware</span>
                        <span className="text-white">{brightness}%</span>
                     </div>
                     <input 
                       type="range" 
                       min="40" 
                       max="130" 
                       value={brightness} 
                       onChange={(e) => onUpdateBrightness(parseInt(e.target.value))} 
                       className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" 
                     />
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <SettingToggle label="Efeito Scanlines (CRT)" value={scanlines} onToggle={onToggleScanlines} />
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className={`h-8 w-px ${isNIC ? 'bg-indigo-500/10' : 'bg-white/5'}`}></div>

        <div className="flex items-center gap-4 cursor-pointer group">
           <div className="text-right">
              <p className="text-xs font-black text-white italic uppercase group-hover:text-indigo-400 transition-colors">{currentUser.name}</p>
              <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${isNIC ? 'text-indigo-800' : 'text-white/20'}`}>{currentUser.rank}</p>
           </div>
           <div className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all ${isNIC ? 'border-indigo-600' : 'border-white/5 group-hover:border-white/20'}`}>
              <img src={currentUser.avatar} className="w-full h-full" alt="Avatar" />
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
