
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MDTSection from './components/MDTSection';
import UsersSection from './components/UsersSection';
import WeaponsSection from './components/WeaponsSection';
import HRSection from './components/HRSection';
import SeizuresSection from './components/SeizuresSection';
import EvaluationsSection from './components/EvaluationsSection';
import TicketsSection from './components/TicketsSection';
import WarningsSection from './components/WarningsSection';
import MuralSection from './components/SocialFeedSection';
import IllegalSpotsSection from './components/IllegalSpotsSection';
import NICSection from './components/NICSection';
import DiscordBotSection from './components/DiscordBotSection';
import MenuEditorSection from './components/MenuEditorSection';
import NICAuth from './components/NICAuth';
import CPRegistrySection from './components/CPRegistrySection';
import GNRTimesheetSection from './components/GNRTimesheetSection';
import SystemLogsSection from './components/SystemLogsSection';
import Login from './components/Login';
import { LogEntry, Officer, MenuItemConfig } from './types';
import { getLocalOfficers, saveOfficersLocally, getLocalAutos, addSystemLog, getMenuConfig, saveMenuConfig } from './services/dataService';
import { apiService } from './services/apiService';

const ALL_RANKS = ['Comandante Geral', 'Tenente General', 'Major General', 'Brigadeiro General', 'Coronel', 'Tenente Coronel', 'Major', 'Capitão', 'Tenente', 'Alferes', 'Aspirante a Oficial', 'Sargento Mor', 'Sargento Chefe', 'Primeiro Sargento', 'Segundo Sargento', 'Furriel', 'Cabo Mor', 'Cabo Chefe', 'Cabo', 'Guarda Principal', 'Guarda', 'Guarda Provisório'];

// Lista de Ranks que PODEM aceder aos Recursos Humanos e Avaliações (Sargentos para cima)
const MANAGEMENT_RANKS = [
  'Comandante Geral', 'Tenente General', 'Major General', 'Brigadeiro General', 
  'Coronel', 'Tenente Coronel', 'Major', 'Capitão', 'Tenente', 'Alferes', 'Aspirante a Oficial',
  'Sargento Mor', 'Sargento Chefe', 'Primeiro Sargento', 'Segundo Sargento', 'Furriel'
];

const INITIAL_MENU_CONFIG: MenuItemConfig[] = [
  { id: 'dashboard', label: 'CENTRAL DE COMANDO', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', allowedRanks: [...ALL_RANKS], order: 0, isLocked: true },
  { id: 'membros', label: 'EFETIVO DA GUARDA', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0', allowedRanks: [...ALL_RANKS], order: 1 },
  { id: 'nic', label: 'TERMINAL N.I.C.', icon: 'M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.268 0 2.49.234 3.62.661m-1.756 3.39a3 3 0 00-4.632 0m4.632 0a3 3 0 011.023 3.67m-1.164 2.025a10.003 10.003 0 01-1.746 3.419m-3.374-1.213a3 3 0 114.668 0m3.115 1.004a10.025 10.025 0 01-4.459 2.082', allowedRanks: [...ALL_RANKS], allowedTags: ['Núcleo de Investigação Criminal'], order: 2 },
  { id: 'mural', label: 'MURAL DA GUARDA', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', allowedRanks: [...ALL_RANKS], order: 3 },
  { id: 'ponto', label: 'FOLHA DE PONTO', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', allowedRanks: [...ALL_RANKS], order: 4 },
  { id: 'cps', label: 'REGISTO DE CPS', icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1', allowedRanks: [...ALL_RANKS], order: 5 },
  { id: 'drh', label: 'RECURSOS HUMANOS', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', allowedRanks: [...MANAGEMENT_RANKS], order: 6 },
  { id: 'relatorios', label: 'AUTOS E RELATÓRIOS', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', allowedRanks: [...ALL_RANKS], order: 7 },
  { id: 'registo-armas', label: 'REGISTO DE ARMAS', icon: 'M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.268 0 2.49.234 3.62.661m-1.756 3.39a3 3 0 00-4.632 0m4.632 0a3 3 0 011.023 3.67m-1.164 2.025a10.003 10.003 0 01-1.746 3.419m-3.374-1.213a3 3 0 114.668 0m3.115 1.004a10.025 10.025 0 01-4.459 2.082', allowedRanks: [...ALL_RANKS], order: 8 },
  { id: 'avaliacoes', label: 'AVALIAÇÕES SGT', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', allowedRanks: [...MANAGEMENT_RANKS], order: 9 },
  { id: 'avisos', label: 'AVISOS DISCIPLINARES', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', allowedRanks: [...ALL_RANKS], order: 10 },
  { id: 'spots-ilegais', label: 'SPOTS ILEGAIS', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', allowedRanks: [...ALL_RANKS], order: 11 },
  { id: 'tickets', label: 'TICKETS', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', allowedRanks: [...ALL_RANKS], order: 12 },
];

const LoadingScreen: React.FC<{ onFinished: () => void }> = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      const duration = video.duration;
      if (duration > 0) {
        const percent = (current / duration) * 100;
        setProgress(percent);
      }
    };

    const handleEnded = () => {
      setProgress(100);
      setTimeout(onFinished, 500);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onFinished]);

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center font-mono overflow-hidden">
      <video 
        ref={videoRef}
        autoPlay 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      >
        <source src="./video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
      <div className="relative z-60 flex flex-col items-center">
         <div className="relative mb-16">
            <div className="w-56 h-56 bg-emerald-500/10 rounded-full absolute inset-0 blur-[80px] animate-pulse"></div>
            <svg className="w-44 h-44 text-emerald-400 relative z-10 drop-shadow-[0_0_30px_rgba(52,211,153,0.9)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
         </div>
         <div className="w-80 text-center">
            <h2 className="text-white text-xs font-black uppercase tracking-[0.8em] mb-8 italic drop-shadow-md">GNR DIAMOND POST</h2>
            <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden blur-[0.3px]">
               <div className="h-full bg-emerald-500 transition-all duration-300 shadow-[0_0_20px_#10b981]" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-emerald-400 text-[9px] font-black uppercase tracking-widest mt-6 animate-pulse drop-shadow-md">A carregar módulos de inteligência...</p>
         </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isNICAuthenticating, setIsNICAuthenticating] = useState(false);
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [menuVersion, setMenuVersion] = useState(0); 
  const isNICMode = activeTab.startsWith('nic');
  
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('gnr_theme_color') || '#020806');
  const [scanlines, setScanlines] = useState(() => localStorage.getItem('gnr_scanlines') !== 'false');
  const [brightness, setBrightness] = useState(() => parseInt(localStorage.getItem('gnr_brightness') || '100'));

  const [officers, setOfficers] = useState<Officer[]>([]);
  const [autos, setAutos] = useState<LogEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<Officer | null>(null);
  const [backendStatus, setBackendStatus] = useState<'ONLINE' | 'OFFLINE' | 'LOADING'>('LOADING');

  useEffect(() => {
    // Resetar ou inicializar config de menu se necessário
    saveMenuConfig(INITIAL_MENU_CONFIG);
  }, []);

  useEffect(() => {
    localStorage.setItem('gnr_theme_color', themeColor);
    localStorage.setItem('gnr_scanlines', scanlines.toString());
    localStorage.setItem('gnr_brightness', brightness.toString());
  }, [themeColor, scanlines, brightness]);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const resp = await fetch(`http://${window.location.hostname}:3002/api/status`);
        if (resp.ok) setBackendStatus('ONLINE');
        else setBackendStatus('OFFLINE');
      } catch (e) {
        setBackendStatus('OFFLINE');
      }
    };
    checkBackend();
    const timer = setInterval(checkBackend, 10000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    const [loadedOfficers, loadedAutos] = await Promise.all([
      getLocalOfficers(),
      getLocalAutos()
    ]);
    setOfficers(loadedOfficers || []);
    setAutos(loadedAutos || []);
  };

  useEffect(() => {
    fetchData();
    const poller = setInterval(fetchData, 10000);
    return () => clearInterval(poller);
  }, []);

  const handleForceSync = async () => {
    try {
      setBackendStatus('LOADING');
      await apiService.syncBackend();
      await fetchData();
      setBackendStatus('ONLINE');
    } catch (e) {
      setBackendStatus('OFFLINE');
      throw e;
    }
  };

  const handleBadgeLogin = (badgeNumber: string, pass: string): boolean => {
    if (badgeNumber === "1111" || badgeNumber === "admin") {
      const adminOfficer: Officer = { 
        id: 'admin-root', name: 'Comando de Sistema', nip: '1111', rank: 'Brigadeiro General', status: 'online', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', totalHours: 0, joinedDate: new Date().toLocaleDateString(), tags: ['Conselho Superior da Guarda']
      };
      const adminDefaultPass = "COMANDO1111";
      const currentAdminPass = localStorage.getItem('gnr_admin_pass') || adminDefaultPass;
      if (pass.toUpperCase() === currentAdminPass.toUpperCase() || pass === "admin") {
        setCurrentUser(adminOfficer);
        setIsInitializing(true);
        if (pass.toUpperCase() === adminDefaultPass || pass === "admin") setShowChangePassModal(true);
        return true;
      }
      return false;
    }

    const officer = (officers || []).find(o => o.nip === badgeNumber);
    if (officer) {
      const defaultPass = (officer.name.split(' ')[0] + officer.nip).toUpperCase();
      const currentPass = officer.password || defaultPass;
      if (pass.toUpperCase() === currentPass.toUpperCase()) {
        setCurrentUser(officer);
        setIsInitializing(true);
        if (pass.toUpperCase() === defaultPass) setShowChangePassModal(true);
        return true;
      }
    }
    return false;
  };

  const handleUpdateOfficer = (updated: Officer) => {
    const nextOfficers = officers.map(o => o.id === updated.id ? updated : o);
    setOfficers(nextOfficers);
    saveOfficersLocally(nextOfficers);
    addSystemLog('UPDATE', 'OFFICER', updated.id, `Perfil do oficial ${updated.name} atualizado.`, currentUser?.name);
  };

  const handlePasswordChange = (newPass: string) => {
    if (!currentUser) return;
    const formattedPass = newPass.toUpperCase();
    if (currentUser.id === 'admin-root') {
      localStorage.setItem('gnr_admin_pass', formattedPass);
    } else {
      const updated = { ...currentUser, password: formattedPass };
      handleUpdateOfficer(updated);
      setCurrentUser(updated);
    }
    setShowChangePassModal(false);
    addSystemLog('AUTH', 'SECURITY', currentUser.id, `Palavra-passe alterada com sucesso.`, currentUser.name);
    alert("IDENTIDADE DIGITAL ATUALIZADA.");
  };

  if (!isAuthenticated && !isInitializing) return <Login onLoginByNip={handleBadgeLogin} onLoginByDiscord={() => false} />;
  if (isInitializing) return <LoadingScreen onFinished={() => { setIsInitializing(false); setIsAuthenticated(true); }} />;

  return (
    <div className="flex min-h-screen overflow-hidden font-sans" style={{ backgroundColor: isNICMode ? '#010204' : themeColor, filter: `brightness(${brightness}%)` }}>
      {scanlines && <div className="scanlines-overlay" />}
      {isNICAuthenticating && <NICAuth onComplete={() => { setIsNICAuthenticating(false); setActiveTab('nic-main'); }} onCancel={() => setIsNICAuthenticating(false)} />}
      
      {showChangePassModal && (
        <div className="fixed inset-0 z-[2000] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-8">
           <div className="bg-[#05080c] border border-indigo-500/20 w-full max-w-lg rounded-[3rem] p-12 space-y-10 text-center animate-in zoom-in-95">
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Primeiro Acesso</h2>
              <input type="password" id="first-login-pass" className="w-full bg-black border border-white/10 rounded-xl px-6 py-5 text-white outline-none focus:border-indigo-500 text-center text-lg uppercase" placeholder="NOVA SENHA" autoFocus />
              <button onClick={() => {
                const val = (document.getElementById('first-login-pass') as HTMLInputElement).value;
                if(val.length < 4) alert("Mínimo 4 caracteres.");
                else handlePasswordChange(val);
              }} className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em]">ATUALIZAR IDENTIDADE</button>
           </div>
        </div>
      )}

      <Sidebar activeTab={activeTab} onTabChange={t => { if (t === 'nic') setIsNICAuthenticating(true); else setActiveTab(t); }} onLogout={() => setIsAuthenticated(false)} isAdminMode={isAdminMode} onToggleAdmin={() => setIsAdminMode(!isAdminMode)} currentUser={currentUser} />
      
      <div className="flex-1 flex flex-col min-w-0 relative z-10 h-screen">
        {currentUser && <Header activeTab={activeTab} notifications={[]} currentUser={currentUser} themeColor={themeColor} onUpdateTheme={setThemeColor} scanlines={scanlines} onToggleScanlines={() => setScanlines(!scanlines)} brightness={brightness} onUpdateBrightness={setBrightness} onUpdateAvatar={() => {}} backendStatus={backendStatus} />}
        <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto">
            {!isNICMode ? (
              <>
                {activeTab === 'dashboard' && <Dashboard onSOS={() => setIsSOSActive(!isSOSActive)} isSOSActive={isSOSActive} />}
                {activeTab === 'membros' && <UsersSection officers={officers} isAdmin={isAdminMode} onRegister={o => setOfficers([...officers, o])} onUpdate={handleUpdateOfficer} currentUser={currentUser} onForceSync={handleForceSync} />}
                {activeTab === 'mural' && <MuralSection currentUser={currentUser} isAdmin={isAdminMode} />}
                {activeTab === 'ponto' && <GNRTimesheetSection currentUser={currentUser} isAdmin={isAdminMode} />}
                {activeTab === 'cps' && <CPRegistrySection currentUser={currentUser} officers={officers} isAdmin={isAdminMode} />}
                {activeTab === 'drh' && <HRSection isAdmin={isAdminMode} />}
                {activeTab === 'relatorios' && <MDTSection title="REGISTO DE AUTOS" type="relatorio" records={autos} currentUser={currentUser} isAdmin={isAdminMode} />}
                {activeTab === 'registo-armas' && <WeaponsSection isAdmin={isAdminMode} />}
                {activeTab === 'avaliacoes' && <EvaluationsSection isAdmin={isAdminMode} currentUser={currentUser} />}
                {activeTab === 'avisos' && <WarningsSection isAdmin={isAdminMode} currentUser={currentUser} />}
                {activeTab === 'spots-ilegais' && <IllegalSpotsSection isAdmin={isAdminMode} />}
                {activeTab === 'tickets' && <TicketsSection currentUser={currentUser} isAdmin={isAdminMode} />}
                {activeTab === 'bot-config' && <DiscordBotSection />}
                {activeTab === 'menu-editor' && <MenuEditorSection onMenuUpdate={() => setMenuVersion(v => v + 1)} currentUser={currentUser} />}
                {activeTab === 'system-logs' && <SystemLogsSection />}
              </>
            ) : <NICSection activeTab={activeTab} currentUser={currentUser} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
