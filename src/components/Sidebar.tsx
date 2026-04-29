
import React from 'react';
import { Officer, MenuItemConfig } from '../types';
import { getMenuConfig } from '../services/dataService';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  isAdminMode: boolean;
  onToggleAdmin: () => void;
  currentUser: Officer | null;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onLogout, isAdminMode, onToggleAdmin, currentUser }) => {
  const isNICSubMenu = activeTab.startsWith('nic-') || activeTab === 'nic-main';

  // Permissão estrita para ativação do modo Comando Geral (Botão Inferior)
  const canActivateAdmin = currentUser?.id === 'admin-root' || 
    ['Comandante Geral', 'Tenente General', 'Major General', 'Brigadeiro General'].includes(currentUser?.rank || '');

  // Carregar menu dinâmico do sistema
  const dynamicMenu = getMenuConfig();

  // Filtragem estrita por TAG e RANK
  const authorizedGnrMenu = dynamicMenu
    .filter(item => {
      // 1. Checar Rank
      const hasRank = item.allowedRanks.includes(currentUser?.rank || '');
      
      // 2. Checar Especialização (Tags) - Se a aba exige tags, o oficial PRECISA ter
      const hasRequiredTag = !item.allowedTags || item.allowedTags.length === 0 || 
                             item.allowedTags.some(tag => currentUser?.tags?.includes(tag));

      return hasRank && hasRequiredTag;
    })
    .sort((a, b) => a.order - b.order);

  const nicMenu = [
    { id: 'nic-main', label: 'DASHBOARD', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z' },
    { id: 'nic-cases', label: 'INVESTIGAÇÕES', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
    { id: 'nic-reports', label: 'RELATÓRIOS', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'nic-evidence', label: 'COFRE PROVAS', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 v2M7 7h10' },
    { id: 'nic-warrants', label: 'MANDADOS S9', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'nic-targets', label: 'ALVOS CRÍTICOS', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

  const activeMenu = isNICSubMenu ? nicMenu : authorizedGnrMenu;

  return (
    <aside className={`w-24 md:w-80 border-r flex flex-col h-screen sticky top-0 transition-all z-50 duration-700 ${isNICSubMenu ? 'bg-[#0a0f1c] border-white/5 shadow-[20px_0_50px_rgba(0,0,0,0.5)]' : 'bg-black/30 border-white/5 backdrop-blur-3xl'}`}>
      <div className="p-10 mb-8 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-5">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-700 ${isNICSubMenu ? 'bg-blue-900 border border-blue-400/20 shadow-blue-500/20' : (isAdminMode ? 'bg-amber-600 shadow-amber-600/20' : 'bg-emerald-600 shadow-emerald-600/20')}`}>
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="hidden md:block">
            <h2 className="text-2xl font-black italic tracking-tighter leading-none text-white">
              {isNICSubMenu ? 'N.I.C.' : 'G.N.R.'}
            </h2>
            <p className={`text-[9px] font-black uppercase tracking-[0.3em] mt-2 ${isNICSubMenu ? 'text-blue-500' : (isAdminMode ? 'text-amber-500' : 'text-emerald-500')}`}>
              {isNICSubMenu ? 'INTELIGÊNCIA E CRIMINALIDADE' : (isAdminMode ? 'COMANDO GERAL' : 'DIAMOND POST')}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-8 space-y-3 overflow-y-auto custom-scrollbar">
        {activeMenu.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl transition-all relative group ${
              activeTab === item.id 
              ? (isNICSubMenu ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)] border border-blue-400/20' : (isAdminMode ? 'bg-amber-600 text-white shadow-lg border border-amber-400/20' : 'bg-white/10 text-white shadow-lg border border-white/10')) 
              : `text-slate-500 hover:text-white hover:bg-white/5`
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
            </svg>
            <span className="hidden md:block font-black text-[10px] uppercase tracking-[0.15em] italic">{item.label}</span>
          </button>
        ))}

        {isAdminMode && !isNICSubMenu && (
          <div className="pt-6 mt-6 border-t border-white/[0.03] space-y-3">
            <button
              onClick={() => onTabChange('menu-editor')}
              className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl transition-all relative group ${
                activeTab === 'menu-editor' ? 'bg-amber-600 text-white shadow-xl' : 'text-amber-500 hover:text-white hover:bg-amber-600/10'
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="hidden md:block font-black text-[10px] uppercase tracking-[0.15em] italic">GESTOR ABAS</span>
            </button>
            <button
              onClick={() => onTabChange('bot-config')}
              className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl transition-all relative group ${
                activeTab === 'bot-config' ? 'bg-indigo-600 text-white shadow-xl' : 'text-indigo-400 hover:text-white hover:bg-indigo-500/10'
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="hidden md:block font-black text-[10px] uppercase tracking-[0.15em] italic">SINC BOT</span>
            </button>
            <button
              onClick={() => onTabChange('system-logs')}
              className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl transition-all relative group ${
                activeTab === 'system-logs' ? 'bg-slate-700 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-slate-700/10'
              }`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="hidden md:block font-black text-[10px] uppercase tracking-[0.15em] italic">AUDITORIA S9</span>
            </button>
          </div>
        )}
      </nav>

      <div className="p-10 mt-auto border-t border-white/[0.02] space-y-4">
        {isNICSubMenu ? (
          <button onClick={() => onTabChange('dashboard')} className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Sair do Terminal</button>
        ) : (
          canActivateAdmin && (
            <button onClick={onToggleAdmin} className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isAdminMode ? 'bg-amber-600/20 text-amber-500 border border-amber-500/30' : 'bg-black/20 text-slate-500 border border-white/5'}`}>
              Comando Geral
            </button>
          )
        )}
        <button onClick={onLogout} className="w-full py-4 bg-red-950/10 hover:bg-red-950/30 text-red-900 hover:text-red-600 border border-red-950/20 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all">Encerrar Sessão</button>
      </div>
    </aside>
  );
};

export default Sidebar;
