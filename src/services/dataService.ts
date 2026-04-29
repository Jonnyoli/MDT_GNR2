import { Officer, LogEntry, Target, InvestigationCase, Warrant, IncidentReport, Ticket, SocialPost, IllegalSpot, WeaponRegistry, HRNote, DigitalEvidence, NICShift, ForensicSeizure, PatrolCar, GNRShift, SystemLog, MenuItemConfig } from '../types';
import { apiService } from './apiService';

export const KEYS = {
  OFFICERS: 'gnr_data_officers',
  AUTOS: 'gnr_data_autos',
  TARGETS: 'gnr_data_targets',
  CASES: 'gnr_data_cases',
  WARRANTS: 'gnr_data_warrants',
  REPORTS: 'gnr_data_reports',
  TICKETS: 'gnr_data_tickets',
  POSTS: 'gnr_data_social_posts',
  SPOTS: 'gnr_data_illegal_spots',
  WEAPONS: 'gnr_data_weapons_registry',
  HR_NOTES: 'gnr_data_hr_notes',
  WARNINGS: 'gnr_data_warnings',
  EVIDENCES: 'gnr_data_nic_evidences',
  NIC_SHIFTS: 'gnr_data_nic_shifts',
  GNR_SHIFTS: 'gnr_data_gnr_shifts',
  NIC_FORENSIC: 'gnr_data_nic_forensic_seizures',
  CPS: 'gnr_data_patrol_cars',
  SEIZURE_TOTAL: 'gnr_data_seizure_cumulative_total',
  CONFIG_BOT: 'gnr_bot_token',
  CONFIG_GUILD: 'gnr_guild_id',
  CONFIG_ROLE: 'gnr_role_id',
  CONFIG_TICKET_CHANNEL: 'gnr_ticket_channel_id',
  CONFIG_OAUTH_ID: 'gnr_oauth_client_id',
  CONFIG_OAUTH_SECRET: 'gnr_oauth_client_secret',
  CONFIG_REDIRECT_URI: 'gnr_redirect_uri',
  SYSTEM_LOGS: 'gnr_system_audit_logs',
  MENU_CONFIG: 'gnr_system_menu_v1'
};

// --- GENERIC HELPERS ---
const get = (key: string) => JSON.parse(localStorage.getItem(key) || '[]');
const set = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

// --- MENU CONFIG ---
export const getMenuConfig = (): MenuItemConfig[] => {
  const data = localStorage.getItem(KEYS.MENU_CONFIG);
  return data ? JSON.parse(data) : [];
};

export const saveMenuConfig = (config: MenuItemConfig[]) => set(KEYS.MENU_CONFIG, config);

// --- AUDIT LOGS ---
export const getSystemLogs = (): SystemLog[] => get(KEYS.SYSTEM_LOGS);

export const addSystemLog = (action: SystemLog['action'], resourceType: string, resourceId: string, details: string, officerName: string = 'SISTEMA') => {
  const logs = getSystemLogs();
  const newLog: SystemLog = {
    id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    officerName,
    action,
    resourceType,
    resourceId,
    details,
    timestamp: new Date().toISOString()
  };
  set(KEYS.SYSTEM_LOGS, [newLog, ...logs].slice(0, 1000)); 
};

export const getLocalOfficers = async (): Promise<Officer[]> => {
  try {
    const data = await apiService.getOfficersFromBackend();
    if (data.officers) {
      saveOfficersLocally(data.officers);
      return data.officers;
    }
  } catch (e) {
    console.warn("Backend offline. Usando cache local.");
  }
  return get(KEYS.OFFICERS);
};
export const saveOfficersLocally = (o: Officer[]) => set(KEYS.OFFICERS, o);

// --- GNR SHIFTS ---
export const getLocalGNRShifts = async (): Promise<GNRShift[]> => {
  try {
    return await apiService.getData('gnr_shift');
  } catch (e) {
    return get(KEYS.GNR_SHIFTS);
  }
};
export const saveGNRShiftLocally = async (s: GNRShift) => {
  try {
    const saved = await apiService.saveData('gnr_shift', s);
    const current = await getLocalGNRShifts();
    addSystemLog('CREATE', 'SHIFT_GNR', s.id, `Início de ponto GNR: ${s.officerName}`, s.officerName);
    return current;
  } catch (e) {
    const current = get(KEYS.GNR_SHIFTS);
    const idx = current.findIndex((x: any) => x.id === s.id);
    let next;
    if (idx > -1) {
      next = [...current];
      next[idx] = s;
    } else {
      next = [s, ...current];
      addSystemLog('CREATE', 'SHIFT_GNR', s.id, `Início de ponto GNR: ${s.officerName}`, s.officerName);
    }
    set(KEYS.GNR_SHIFTS, next);
    return next;
  }
};
export const deleteGNRShiftLocally = async (id: string) => {
  try {
    await apiService.deleteData('gnr_shift', id);
    addSystemLog('DELETE', 'SHIFT_GNR', id, `Eliminação de registo de ponto.`);
    return await getLocalGNRShifts();
  } catch (e) {
    const next = get(KEYS.GNR_SHIFTS).filter((x: any) => x.id !== id);
    addSystemLog('DELETE', 'SHIFT_GNR', id, `Eliminação de registo de ponto.`);
    set(KEYS.GNR_SHIFTS, next);
    return next;
  }
};

// --- PATROL CARS (CPS) ---
export const getLocalCPs = async (): Promise<PatrolCar[]> => {
  try {
    return await apiService.getData('patrol_car');
  } catch (e) {
    return get(KEYS.CPS);
  }
};
export const saveCPLocally = async (cp: PatrolCar) => {
  try {
    await apiService.saveData('patrol_car', cp);
    addSystemLog('CREATE', 'CP_UNIT', cp.id, `Unidade CP-${cp.cpNumber} ativada por ${cp.commanderName}`, cp.commanderName);
    return await getLocalCPs();
  } catch (e) {
    const current = get(KEYS.CPS);
    const idx = current.findIndex((x: any) => x.id === cp.id);
    let next;
    if (idx > -1) {
      next = [...current];
      next[idx] = cp;
    } else {
      next = [cp, ...current];
      addSystemLog('CREATE', 'CP_UNIT', cp.id, `Unidade CP-${cp.cpNumber} ativada por ${cp.commanderName}`, cp.commanderName);
    }
    set(KEYS.CPS, next);
    return next;
  }
};

export const deleteCPLocally = async (id: string) => {
  try {
    await apiService.deleteData('patrol_car', id);
    addSystemLog('DELETE', 'CP_UNIT', id, `Unidade removida do mapa.`);
    return await getLocalCPs();
  } catch (e) {
    const current = get(KEYS.CPS);
    const cp = current.find((x: any) => x.id === id);
    const next = current.filter((x: any) => x.id !== id);
    if (cp) addSystemLog('DELETE', 'CP_UNIT', id, `Unidade CP-${cp.cpNumber} removida do mapa.`);
    set(KEYS.CPS, next);
    return next;
  }
};

// --- AUTOS ---
export const getLocalAutos = async (): Promise<LogEntry[]> => {
  try {
    return await apiService.getData('relatorio');
  } catch (e) {
    return get(KEYS.AUTOS);
  }
};

export const saveAutoLocally = async (a: LogEntry) => {
  try {
    const saved = await apiService.saveData('relatorio', a);
    addSystemLog('CREATE', 'AUTO_NOTICIA', a.id, `Novo auto em ${a.location}`, a.userName);
    return await getLocalAutos();
  } catch (e) {
    const data = [a, ...get(KEYS.AUTOS)];
    set(KEYS.AUTOS, data);
    return data;
  }
};

export const updateAutoLocally = async (updated: LogEntry) => {
  try {
    const data = await apiService.saveData('relatorio', updated);
    addSystemLog('UPDATE', 'AUTO_NOTICIA', updated.id, `Auto validado por ${updated.signedBy}`, updated.signedBy || 'SISTEMA');
    return await getLocalAutos();
  } catch (e) {
    const autos = await getLocalAutos();
    const data = autos.map((a: any) => a.id === updated.id ? updated : a);
    set(KEYS.AUTOS, data);
    return data;
  }
};

export const deleteAutoLocally = async (id: string) => {
  try {
    await apiService.deleteData('relatorio', id);
    addSystemLog('DELETE', 'AUTO_NOTICIA', id, `Auto removido do arquivo.`);
    return await getLocalAutos();
  } catch (e) {
    const autos = await getLocalAutos();
    const data = autos.filter((a: any) => a.id !== id);
    set(KEYS.AUTOS, data);
    return data;
  }
};

// --- NIC FORENSIC ---
export const getLocalForensicSeizures = (): ForensicSeizure[] => get(KEYS.NIC_FORENSIC);
export const saveForensicSeizureLocally = (s: ForensicSeizure) => {
  const data = [s, ...getLocalForensicSeizures()];
  addSystemLog('CREATE', 'FORENSIC_AI', s.id, `Análise IA: Valor ${s.totalValue}€`, s.officer);
  set(KEYS.NIC_FORENSIC, data);
  return data;
};

// --- NIC EVIDENCES ---
export const getLocalEvidences = (): DigitalEvidence[] => get(KEYS.EVIDENCES);
export const saveEvidenceLocally = (e: DigitalEvidence) => {
  const data = [e, ...getLocalEvidences()];
  addSystemLog('CREATE', 'EVIDENCE', e.id, `Evidência digital protocolada: ${e.title}`, e.officer);
  set(KEYS.EVIDENCES, data);
  return data;
};
export const updateEvidenceLocally = (e: DigitalEvidence) => {
  const data = getLocalEvidences().map((x: any) => x.id === e.id ? e : x);
  addSystemLog('UPDATE', 'EVIDENCE', e.id, `Evidência atualizada: ${e.title}`, e.officer);
  set(KEYS.EVIDENCES, data);
  return data;
};
export const deleteEvidenceLocally = (id: string) => {
  const data = getLocalEvidences().filter((x: any) => x.id !== id);
  addSystemLog('DELETE', 'EVIDENCE', id, `Evidência removida do cofre.`);
  set(KEYS.EVIDENCES, data);
  return data;
};

// --- NIC CASES ---
export const getLocalCases = (): InvestigationCase[] => get(KEYS.CASES);
export const saveCaseLocally = (c: InvestigationCase) => {
  const data = [c, ...getLocalCases()];
  addSystemLog('CREATE', 'CASE', c.id, `Investigação aberta: ${c.title}`, c.assignedAgent);
  set(KEYS.CASES, data);
  return data;
};

// --- NIC SHIFTS (FOLHA DE PONTO) ---
export const getLocalNICShifts = (): NICShift[] => get(KEYS.NIC_SHIFTS);
export const saveNICShiftLocally = (s: NICShift) => {
  const shifts = getLocalNICShifts();
  const existing = shifts.findIndex((x: any) => x.id === s.id);
  let next;
  if (existing > -1) {
    next = [...shifts];
    next[existing] = s;
  } else {
    next = [s, ...shifts];
    addSystemLog('CREATE', 'NIC_SHIFT', s.id, `Início de turno NIC.`, s.officerName);
  }
  set(KEYS.NIC_SHIFTS, next);
  return next;
};

export const deleteNICShiftLocally = (id: string) => {
  const shifts = getLocalNICShifts().filter(s => s.id !== id);
  addSystemLog('DELETE', 'NIC_SHIFT', id, `Registo NIC removido.`);
  set(KEYS.NIC_SHIFTS, shifts);
  return shifts;
};

// --- SEIZURE CUMULATIVE TOTAL ---
export const getGlobalSeizureTotal = async (): Promise<number> => {
  try {
     const data = await apiService.getData('CONFIG_STATS');
     const entry = data.find(d => d.key === KEYS.SEIZURE_TOTAL);
     return entry ? entry.value : parseFloat(localStorage.getItem(KEYS.SEIZURE_TOTAL) || '0');
  } catch (e) {
     return parseFloat(localStorage.getItem(KEYS.SEIZURE_TOTAL) || '0');
  }
};

export const addToGlobalSeizureTotal = async (amount: number) => {
  const current = await getGlobalSeizureTotal();
  const next = current + amount;
  try {
     await apiService.saveData('CONFIG_STATS', { key: KEYS.SEIZURE_TOTAL, value: next });
  } catch (e) {}
  localStorage.setItem(KEYS.SEIZURE_TOTAL, next.toString());
  return next;
};

// --- WARNINGS / REPRIMANDS ---
export const getLocalWarnings = (): any[] => get(KEYS.WARNINGS);
export const saveWarningLocally = (w: any) => {
  const current = getLocalWarnings();
  const existingIdx = current.findIndex((x: any) => x.id === w.id);
  let next;
  if (existingIdx > -1) {
    next = [...current];
    next[existingIdx] = w;
    addSystemLog('UPDATE', 'WARNING', w.id, `Aviso disciplinar atualizado para ${w.target}`, w.signerName);
  } else {
    next = [w, ...current];
    addSystemLog('CREATE', 'WARNING', w.id, `Aviso disciplinar emitido para ${w.target}`, w.signerName);
  }
  set(KEYS.WARNINGS, next);
  return next;
};
export const deleteWarningLocally = (id: string) => {
  const data = getLocalWarnings().filter((w: any) => w.id !== id);
  addSystemLog('DELETE', 'WARNING', id, `Aviso disciplinar revogado.`);
  set(KEYS.WARNINGS, data);
  return data;
};

// --- HR NOTES ---
export const getLocalHRNotes = (): HRNote[] => get(KEYS.HR_NOTES);
export const saveHRNoteLocally = (note: HRNote) => {
  const data = [note, ...getLocalHRNotes()];
  addSystemLog('CREATE', 'HR_NOTE', note.id, `Anotação DRH arquivada.`, note.author);
  set(KEYS.HR_NOTES, data);
  return data;
};
export const deleteHRNoteLocally = (id: string) => {
  const data = getLocalHRNotes().filter((n: HRNote) => n.id !== id);
  addSystemLog('DELETE', 'HR_NOTE', id, `Anotação DRH eliminada.`);
  set(KEYS.HR_NOTES, data);
  return data;
};

// --- WEAPONS REGISTRY ---
export const getLocalWeapons = (): WeaponRegistry[] => get(KEYS.WEAPONS);
export const saveWeaponLocally = (w: WeaponRegistry) => {
  const data = [w, ...getLocalWeapons()];
  addSystemLog('CREATE', 'WEAPON', w.id, `Arma ${w.serialNumber} registada para ${w.ownerName}`);
  set(KEYS.WEAPONS, data);
  return data;
};
export const updateWeaponLocally = (w: WeaponRegistry) => {
  const data = getLocalWeapons().map((x: any) => x.id === w.id ? w : x);
  addSystemLog('UPDATE', 'WEAPON', w.id, `Estado da arma ${w.serialNumber} alterado para ${w.status}`);
  set(KEYS.WEAPONS, data);
  return data;
};
export const deleteWeaponLocally = (id: string) => {
  const data = getLocalWeapons().filter((x: any) => x.id !== id);
  addSystemLog('DELETE', 'WEAPON', id, `Registo de arma removido.`);
  set(KEYS.WEAPONS, data);
  return data;
};

// --- SPOTS ILEGAIS ---
export const getLocalSpots = (): IllegalSpot[] => get(KEYS.SPOTS);
export const saveSpotLocally = (s: IllegalSpot) => {
  const data = [s, ...getLocalSpots()];
  addSystemLog('CREATE', 'INTEL_SPOT', s.id, `Spot ilegal identificado: ${s.name}`);
  set(KEYS.SPOTS, data);
  return data;
};
export const deleteSpotLocally = (id: string) => {
  const data = getLocalSpots().filter((s: any) => s.id !== id);
  addSystemLog('DELETE', 'INTEL_SPOT', id, `Spot removido do mapeamento.`);
  set(KEYS.SPOTS, data);
  return data;
};

// --- SOCIAL POSTS ---
export const getLocalPosts = (): SocialPost[] => get(KEYS.POSTS);
export const savePostLocally = (p: SocialPost) => {
  const data = [p, ...getLocalPosts()];
  addSystemLog('CREATE', 'SOCIAL_POST', p.id, `Nova publicação no mural.`, p.author);
  set(KEYS.POSTS, data);
  return data;
};
export const deletePostLocally = (id: string) => {
  const data = getLocalPosts().filter((p: any) => p.id !== id);
  addSystemLog('DELETE', 'SOCIAL_POST', id, `Publicação removida do mural.`);
  set(KEYS.POSTS, data);
  return data;
};

// --- TICKETS ---
export const getLocalTickets = (): Ticket[] => get(KEYS.TICKETS);
export const saveTicketLocally = (t: Ticket) => {
  const data = [t, ...getLocalTickets()];
  addSystemLog('CREATE', 'TICKET', t.id, `Ticket aberto: ${t.title}`, t.author);
  set(KEYS.TICKETS, data);
  return data;
};
export const updateTicketLocally = (t: Ticket) => {
  const data = getLocalTickets().map((x: any) => x.id === t.id ? t : x);
  addSystemLog('UPDATE', 'TICKET', t.id, `Ticket estado: ${t.status}`);
  set(KEYS.TICKETS, data);
  return data;
};

// --- CONFIG ---
export const getDiscordConfig = () => ({
  token: localStorage.getItem(KEYS.CONFIG_BOT) || '',
  guildId: localStorage.getItem(KEYS.CONFIG_GUILD) || '',
  roleId: localStorage.getItem(KEYS.CONFIG_ROLE) || '',
  ticketChannelId: localStorage.getItem(KEYS.CONFIG_TICKET_CHANNEL) || '',
  oauthClientId: localStorage.getItem(KEYS.CONFIG_OAUTH_ID) || '',
  oauthClientSecret: localStorage.getItem(KEYS.CONFIG_OAUTH_SECRET) || '',
  redirectUri: localStorage.getItem(KEYS.CONFIG_REDIRECT_URI) || window.location.origin
});

export const saveDiscordConfig = (token: string, g: string, r: string, t?: string, oId?: string, oSecret?: string, oRedir?: string) => {
  localStorage.setItem(KEYS.CONFIG_BOT, token);
  localStorage.setItem(KEYS.CONFIG_GUILD, g);
  localStorage.setItem(KEYS.CONFIG_ROLE, r);
  if (t) localStorage.setItem(KEYS.CONFIG_TICKET_CHANNEL, t);
  if (oId) localStorage.setItem(KEYS.CONFIG_OAUTH_ID, oId);
  if (oSecret) localStorage.setItem(KEYS.CONFIG_OAUTH_SECRET, oSecret);
  if (oRedir) localStorage.setItem(KEYS.CONFIG_REDIRECT_URI, oRedir);
};

// --- OTHER SECTIONS ---
export const getLocalWarrants = async (): Promise<Warrant[]> => {
  try {
    return await apiService.getData('warrant');
  } catch (e) {
    return get(KEYS.WARRANTS);
  }
};
export const saveWarrantLocally = async (w: Warrant) => {
  try {
    await apiService.saveData('warrant', w);
    addSystemLog('CREATE', 'WARRANT', w.id, `Mandado emitido para ${w.targetName}`, w.issuedBy);
    return await getLocalWarrants();
  } catch (e) {
    const data = [w, ...get(KEYS.WARRANTS)];
    addSystemLog('CREATE', 'WARRANT', w.id, `Mandado emitido para ${w.targetName}`, w.issuedBy);
    set(KEYS.WARRANTS, data);
    return data;
  }
};
export const updateWarrantLocally = async (w: Warrant) => {
  try {
    await apiService.saveData('warrant', w);
    addSystemLog('UPDATE', 'WARRANT', w.id, `Mandado estado: ${w.status}`, w.issuedBy);
    return await getLocalWarrants();
  } catch (e) {
    const data = (await getLocalWarrants()).map((x: any) => x.id === w.id ? w : x);
    addSystemLog('UPDATE', 'WARRANT', w.id, `Mandado estado: ${w.status}`, w.issuedBy);
    set(KEYS.WARRANTS, data);
    return data;
  }
};
export const deleteWarrantLocally = async (id: string) => {
  try {
    await apiService.deleteData('warrant', id);
    addSystemLog('DELETE', 'WARRANT', id, `Mandado removido.`);
    return await getLocalWarrants();
  } catch (e) {
    const data = (await getLocalWarrants()).filter((x: any) => x.id !== id);
    addSystemLog('DELETE', 'WARRANT', id, `Mandado removido.`);
    set(KEYS.WARRANTS, data);
    return data;
  }
};

export const getLocalReports = async (): Promise<IncidentReport[]> => {
  try {
    return await apiService.getData('report');
  } catch (e) {
    return get(KEYS.REPORTS);
  }
};
export const saveReportLocally = async (r: IncidentReport) => {
  try {
    await apiService.saveData('report', r);
    addSystemLog('CREATE', 'REPORT', r.id, `Relatório protocolado por ${r.author}`, r.author);
    return await getLocalReports();
  } catch (e) {
    const data = [r, ...get(KEYS.REPORTS)];
    addSystemLog('CREATE', 'REPORT', r.id, `Relatório protocolado por ${r.author}`, r.author);
    set(KEYS.REPORTS, data);
    return data;
  }
};
export const deleteReportLocally = async (id: string) => {
  try {
    await apiService.deleteData('report', id);
    addSystemLog('DELETE', 'REPORT', id, `Relatório removido.`);
    return await getLocalReports();
  } catch (e) {
    const data = (await getLocalReports()).filter((x: any) => x.id !== id);
    addSystemLog('DELETE', 'REPORT', id, `Relatório removido.`);
    set(KEYS.REPORTS, data);
    return data;
  }
};

export const getLocalTargets = async (): Promise<Target[]> => {
  try {
    return await apiService.getData('target');
  } catch (e) {
    return get(KEYS.TARGETS);
  }
};
export const saveTargetLocally = async (t: Target) => {
  try {
    await apiService.saveData('target', t);
    addSystemLog('CREATE', 'TARGET', t.id, `Alvo registado no NIC: ${t.name}`);
    return await getLocalTargets();
  } catch (e) {
    const data = [t, ...get(KEYS.TARGETS)];
    addSystemLog('CREATE', 'TARGET', t.id, `Alvo registado no NIC: ${t.name}`);
    set(KEYS.TARGETS, data);
    return data;
  }
};
export const updateTargetLocally = async (t: Target) => {
  try {
    await apiService.saveData('target', t);
    addSystemLog('UPDATE', 'TARGET', t.id, `Dados de alvo ${t.name} atualizados.`);
    return await getLocalTargets();
  } catch (e) {
    const data = (await getLocalTargets()).map((x: any) => x.id === t.id ? t : x);
    addSystemLog('UPDATE', 'TARGET', t.id, `Dados de alvo ${t.name} atualizados.`);
    set(KEYS.TARGETS, data);
    return data;
  }
};
export const deleteTargetLocally = async (id: string) => {
  try {
    await apiService.deleteData('target', id);
    addSystemLog('DELETE', 'TARGET', id, `Alvo removido do sistema.`);
    return await getLocalTargets();
  } catch (e) {
    const data = (await getLocalTargets()).filter((x: any) => x.id !== id);
    addSystemLog('DELETE', 'TARGET', id, `Alvo removido do sistema.`);
    set(KEYS.TARGETS, data);
    return data;
  }
};
