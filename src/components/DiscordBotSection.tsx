
import React, { useState, useEffect, useCallback } from 'react';
import { apiService, ApiResponse } from '../services/apiService';
import { saveOfficersLocally, getDiscordConfig, saveDiscordConfig } from '../services/dataService';
import { isFirebaseConfigured, syncAllToFirestore, db } from '../services/firebaseService';
import { collection, getCountFromServer } from "firebase/firestore";
import { Officer } from '../types';

const DiscordBotSection: React.FC = () => {
  const [config, setConfig] = useState(() => getDiscordConfig());
  const [isSyncing, setIsSyncing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [autoSync, setAutoSync] = useState(false);
  const [firestoreCount, setFirestoreCount] = useState<number | null>(null);
  const [botStatus, setBotStatus] = useState<'ONLINE' | 'OFFLINE' | 'CHECKING'>('CHECKING');
   const [officerCount, setOfficerCount] = useState(0);
  const [syncSource, setSyncSource] = useState<'PROXY' | 'BACKEND'>('BACKEND');

  const addLog = useCallback((msg: string, type: 'info' | 'error' | 'success' | 'warn' = 'info') => {
    const icons = { info: '🔹', error: '❌', success: '✅', warn: '⚠️' };
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${icons[type]} ${msg}`, ...prev].slice(0, 30));
  }, []);

  const refreshFirestoreStats = async () => {
    if (!isFirebaseConfigured() || !db) return;
    try {
      const coll = collection(db, "membros");
      const snapshot = await getCountFromServer(coll);
      setFirestoreCount(snapshot.data().count);
    } catch (e: any) {
      if (e.code === 'permission-denied') {
        console.warn("Firestore: Acesso de leitura negado (Permissões).");
      }
    }
  };

  const handleSync = async (silent = false) => {
    if (syncSource === 'PROXY') {
        if (!config.token || !config.guildId || !config.roleId) {
          if (!silent) addLog("Configurações Proxy incompletas.", "error");
          setBotStatus('OFFLINE');
          return;
        }
    }

    if (!silent) setIsSyncing(true);
    if (!silent) addLog(`Iniciando sincronização via ${syncSource}...`);

    try {
      let result: ApiResponse;
      
      if (syncSource === 'BACKEND') {
        const syncRes = await apiService.syncBackend();
        result = await apiService.getOfficersFromBackend();
        
        if (syncRes.fromCache) {
          addLog("Nota: Dados lidos da Cache (Cooldown de 5min ativo).", "warn");
        } else if (syncRes.error === 'RATE_LIMIT_FALLBACK') {
          addLog("Discord Rate Limit: Usando dados da Base de Dados.", "warn");
        } else {
          addLog("Backend: Sincronização Discord concluída com sucesso.", "success");
        }
      } else {
        result = await apiService.getOfficersFromDiscord(
          config.token,
          config.guildId,
          config.roleId
        );
        addLog("Proxy Bridge: Dados obtidos com sucesso.", "success");
      }

      setBotStatus('ONLINE');
      setOfficerCount(result.officers.length);
      saveOfficersLocally(result.officers);
      
      if (syncSource === 'PROXY') {
          saveDiscordConfig(
            config.token, 
            config.guildId, 
            config.roleId, 
            config.ticketChannelId,
            config.oauthClientId,
            config.oauthClientSecret,
            config.redirectUri
          );
      }

      if (isFirebaseConfigured()) {
        const syncResult = await syncAllToFirestore(result.officers);
        if (syncResult === true) {
          await refreshFirestoreStats();
          if (!silent) addLog(`${result.officers.length} registos enviados para a Cloud.`, "success");
        }
      }

      if (!silent) addLog("Resumo: Operação finalizada.", "info");
    } catch (e: any) {
      setBotStatus('OFFLINE');
      if (!silent) addLog(e.message, "error");
    } finally {
      if (!silent) setIsSyncing(false);
    }
  };

  useEffect(() => {
    handleSync(true);
    refreshFirestoreStats();
  }, []);

  useEffect(() => {
    let interval: any;
    if (autoSync) {
      interval = setInterval(() => handleSync(true), 30000);
    }
    return () => clearInterval(interval);
  }, [autoSync, config, syncSource]);

  const handleSaveConfig = () => {
    saveDiscordConfig(
      config.token, 
      config.guildId, 
      config.roleId, 
      config.ticketChannelId,
      config.oauthClientId,
      config.oauthClientSecret,
      config.redirectUri
    );
    addLog("Configurações salvas localmente.", "success");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 font-mono">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-4">
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-tight">Virtual Bot Engine</h2>
          <div className="flex gap-2">
            <button 
                onClick={() => setSyncSource('BACKEND')}
                className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${syncSource === 'BACKEND' ? 'bg-emerald-500 text-black' : 'bg-white/5 text-slate-500 hover:text-white'}`}
            >
                Motor: Backend Server (v3001)
            </button>
            <button 
                onClick={() => setSyncSource('PROXY')}
                className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${syncSource === 'PROXY' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-500 hover:text-white'}`}
            >
                Motor: Proxy Bridge (Browser)
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
           <div className="bg-black/40 border border-white/5 px-6 py-4 rounded-2xl">
              <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Firestore Cloud</p>
              <p className="text-xl font-black text-white italic">
                {firestoreCount !== null ? firestoreCount : 'ERR'} 
                <span className="text-[10px] text-indigo-500 ml-2">Docs</span>
              </p>
           </div>
           <button 
             onClick={() => setAutoSync(!autoSync)}
             className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${autoSync ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'bg-white/5 text-slate-500'}`}
           >
              {autoSync ? 'Auto-Sync: ATIVO' : 'Auto-Sync: MANUAL'}
           </button>
           <button 
             onClick={() => handleSync()}
             disabled={isSyncing}
             className="px-8 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
           >
              {isSyncing ? "A TRANSMITIR..." : "Sincronizar Agora"}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
           {/* SEÇÃO OAUTH2 */}
           <div className="bg-[#05060d] border border-indigo-500/20 p-10 rounded-[2.5rem] space-y-8 shadow-2xl">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Login via Discord (OAuth2)</h3>
                 <button onClick={handleSaveConfig} className="text-[8px] font-black text-emerald-500 uppercase tracking-widest hover:text-white transition-all">Guardar</button>
              </div>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-500 uppercase ml-2 tracking-widest">Client ID</label>
                    <input type="text" value={config.oauthClientId} onChange={e => setConfig({...config, oauthClientId: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white outline-none focus:border-indigo-500 transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-500 uppercase ml-2 tracking-widest">Client Secret</label>
                    <input type="password" value={config.oauthClientSecret} onChange={e => setConfig({...config, oauthClientSecret: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs text-indigo-400 outline-none focus:border-indigo-500 transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-500 uppercase ml-2 tracking-widest">Redirect URI (Default: Origem Atual)</label>
                    <input type="text" value={config.redirectUri} onChange={e => setConfig({...config, redirectUri: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs text-slate-400 outline-none focus:border-indigo-500 transition-all" />
                 </div>
              </div>
           </div>

           {/* SEÇÃO BOT CORE */}
           <div className="bg-[#05060d] border border-indigo-500/20 p-10 rounded-[2.5rem] space-y-8 shadow-2xl">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Bot Core Access</h3>
              </div>
              
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-500 uppercase ml-2 tracking-widest">Discord Bot Token</label>
                    <input 
                      type="password" 
                      value={config.token} 
                      onChange={e => setConfig({...config, token: e.target.value})} 
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs text-indigo-400 focus:border-indigo-500 outline-none transition-all" 
                      placeholder="MTQzODU1M..." 
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[8px] font-black text-slate-500 uppercase ml-2 tracking-widest">ID do Servidor</label>
                       <input type="text" value={config.guildId} onChange={e => setConfig({...config, guildId: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white outline-none focus:border-white/30 transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[8px] font-black text-slate-500 uppercase ml-2 tracking-widest">ID Cargo Sync</label>
                       <input type="text" value={config.roleId} onChange={e => setConfig({...config, roleId: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white outline-none focus:border-white/30 transition-all" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-500 uppercase ml-2 tracking-widest">ID Canal de Tickets</label>
                    <input 
                      type="text" 
                      value={config.ticketChannelId} 
                      onChange={e => setConfig({...config, ticketChannelId: e.target.value})} 
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-xs text-indigo-400 focus:border-indigo-500 outline-none transition-all" 
                      placeholder="1147878..." 
                    />
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6">
           <div className="bg-black border border-white/5 rounded-[2.5rem] p-10 h-[700px] flex flex-col shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
                    Log de Eventos (Virtual Bridge)
                 </h3>
                 <span className="text-[10px] text-emerald-500 font-black italic">{officerCount} Agentes Mapeados</span>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-4">
                 {logs.length === 0 ? (
                   <div className="h-full flex items-center justify-center opacity-10">
                      <p className="text-[10px] font-black uppercase tracking-widest">Aguardando Protocolo de Sync...</p>
                   </div>
                 ) : (
                   logs.map((log, i) => (
                     <div key={i} className={`py-3 border-l-2 pl-4 text-[10px] transition-all animate-in slide-in-from-left-2 ${
                       log.includes('❌') ? 'border-red-600 text-red-500 bg-red-500/5' : 
                       log.includes('✅') ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 
                       log.includes('⚠️') ? 'border-amber-500 text-amber-500 bg-amber-500/5' :
                       'border-indigo-900/40 text-slate-400'
                     }`}>
                       {log}
                     </div>
                   ))
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DiscordBotSection;
