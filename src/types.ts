
export type LogType = 'ponto' | 'patrulha' | 'relatorio' | 'auto';

export interface MenuItemConfig {
  id: string;
  label: string;
  icon: string;
  allowedRanks: string[]; 
  allowedTags?: string[]; // Lista de tags obrigatórias (Especializações)
  order: number;
  isLocked?: boolean; 
}

export interface SystemLog {
  id: string;
  officerName: string;
  action: 'CREATE' | 'DELETE' | 'UPDATE' | 'AUTH';
  resourceType: string;
  resourceId: string;
  details: string;
  timestamp: string;
}

export interface LogEntry {
  id: string;
  userName: string;
  type: LogType;
  durationMinutes?: number;
  date: string;
  status: 'active' | 'completed';
  description: string;
  location?: string;
  signedBy?: string;
  signedDate?: string;
  isAnnulled?: boolean;
}

export interface PatrolMember {
  id: string;
  name: string;
  rank: string;
  entryTime: string;
  exitTime?: string;
  status: 'ACTIVE' | 'REMOVED';
}

export interface PatrolCar {
  id: string;
  cpNumber: string;
  commanderName: string;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  startTime: string;
  endTime?: string;
  members: PatrolMember[];
}

export interface NICShift {
  id: string;
  officerId: string;
  officerName: string;
  startTime: string; 
  endTime?: string;  
  status: 'RUNNING' | 'PAUSED' | 'COMPLETED';
  totalActiveSeconds: number;
  lastToggleTime: string; 
  history: { action: 'START' | 'PAUSE' | 'RESUME' | 'END', time: string }[];
}

export interface GNRShift {
  id: string;
  officerId: string;
  officerName: string;
  officerRank: string;
  startTime: string;
  endTime?: string;
  status: 'RUNNING' | 'PAUSED' | 'COMPLETED';
  totalActiveSeconds: number;
  totalPausedSeconds: number;
  lastToggleTime: string;
  history: { action: 'START' | 'PAUSE' | 'RESUME' | 'END', time: string }[];
}

export interface ForensicSeizure {
  id: string;
  title: string;
  officer: string;
  timestamp: string;
  items: { name: string; qty: number; value: number; type: string }[];
  totalValue: number;
  aiSummary: string;
  evidenceImage: string;
  caseId: string;
}

export interface HRNote {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  category: 'GERAL' | 'DISCIPLINAR' | 'SUGESTÃO' | 'ELOGIO';
}

export interface WeaponRegistry {
  id: string;
  serialNumber: string;
  weaponType: string;
  ownerName: string;
  ownerNif: string;
  status: 'LEGALIZADA' | 'PENDENTE' | 'APREENDIDA' | 'ILEGAL';
  registrationDate: string;
  notes?: string;
}

export interface IllegalSpot {
  id: string;
  name: string;
  type: 'DROGA' | 'DESMANCHE' | 'GANGUE' | 'LAVAGEM' | 'OUTRO';
  risk: 'BAIXO' | 'MÉDIO' | 'ALTO' | 'EXTREMO';
  location: string;
  coords?: string;
  description: string;
  lastSeen: string;
  intelLevel: number; 
  image: string;
}

export interface SocialPost {
  id: string;
  author: string;
  authorRank: string;
  authorAvatar: string;
  category: 'OPERACIONAL' | 'PATRULHA' | 'EVENTO' | 'PROMOÇÃO';
  content: string;
  image: string;
  likes: number;
  timestamp: string;
}

export interface Ticket {
  id: string;
  title: string;
  author: string;
  category: 'Suporte Técnico' | 'Denúncia' | 'Solicitação' | 'Outro';
  priority: 'BAIXA' | 'MÉDIA' | 'ALTA' | 'URGENTE';
  status: 'ABERTO' | 'EM ANÁLISE' | 'FECHADO';
  description: string;
  timestamp: string;
  discordMessageId?: string;
}

export interface Warrant {
  id: string;
  targetName: string;
  birthDate?: string;
  nif?: string;
  crime: string; 
  priority: 'BAIXA' | 'MÉDIA' | 'ALTA' | 'CRÍTICA';
  status: 'ATIVO' | 'EXECUTADO' | 'EXPIRADO';
  issuedBy: string;
  issuedDate: string;
  notes: string;
}

export interface IncidentReport {
  id: string;
  caseNumber: string;
  dateTime: string;
  location: string;
  type: string;
  involved: { name: string; id: string; role: string; rg?: string }[];
  description: string;
  status: 'EM ANDAMENTO' | 'CONCLUÍDO' | 'ARQUIVADO';
  author: string;
}

export interface TargetAttachment {
  id: string;
  name: string;
  type: string;
  data: string; 
  date: string;
}

export interface DigitalEvidence {
  id: string;
  title: string;
  caseId: string;
  description: string;
  type: 'IMAGEM' | 'ÁUDIO' | 'DOCUMENTO' | 'OUTRO';
  officer: string;
  timestamp: string;
  attachments: TargetAttachment[];
}

export interface Target {
  id: string;
  name: string;
  level: 'BAIXA' | 'MÉDIA' | 'ALTA' | 'CRÍTICA';
  status: string;
  intel: number;
  threat: 'BAIXA' | 'MÉDIA' | 'ALTA' | 'EXTREMA';
  connections: number;
  lastSeen: string;
  img: string;
  notes: string;
  attachments: TargetAttachment[];
  createdAt: string;
}

export interface InvestigationCase {
  id: string;
  title: string;
  priority: 'BAIXA' | 'MÉDIA' | 'ALTA' | 'CRÍTICA';
  status: 'ABERTO' | 'EM CURSO' | 'ARQUIVADO' | 'CONCLUÍDO';
  primarySuspect: string;
  summary: string;
  details: string;
  attachments: TargetAttachment[];
  createdAt: string;
  updatedAt: string;
  assignedAgent: string;
}

export interface DiscordRole {
  name: string;
  color: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warn' | 'error' | 'success';
  date: string;
}

export interface Officer {
  id: string;
  name: string;
  nip: string;
  rank: string;
  status: 'online' | 'offline' | 'busy';
  avatar: string;
  totalHours: number;
  joinedDate: string;
  discordId?: string;
  discordRoles?: DiscordRole[];
  password?: string;
  needsPasswordChange?: boolean;
  tags?: string[];
}

export interface Citizen {
  id: string;
  name: string;
  nif: string;
  crime: string;
  status: 'Clean' | 'Wanted' | 'Arrested';
  address: string;
  notes?: string;
}
