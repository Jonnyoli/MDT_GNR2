/**
 * BACKEND: GNR DASHBOARD SERVER
 * Dependências necessárias: npm install express discord.js cors dotenv helmet
 */

import express from 'express';
import { Client, GatewayIntentBits } from 'discord.js';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB com sucesso.'))
    .catch(err => console.error('Erro ao ligar ao MongoDB:', err));

// Esquema Genérico para Registos do Sistema
const GenericDataSchema = new mongoose.Schema({
    type: { type: String, required: true, index: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const SystemData = mongoose.model('SystemData', GenericDataSchema);

// Esquemas do Bot do Discord (Tabelas Nativas das quais o Bot grava)
const BotPontoSchema = new mongoose.Schema({
    userId: String,
    startTime: Date,
    status: { type: String, default: 'ABERTO' },
    isPaused: { type: Boolean, default: false }
}, { strict: false });
const BotPonto = mongoose.model('BotPonto', BotPontoSchema, 'pontos');

const BotCPSchema = new mongoose.Schema({
    number: String,
    participants: String, // Formato: "<@ID>|18:00 <@ID2>|18:00"
    status: { type: String, default: 'ABERTO' },
    vehicle: String,
    startTime: Date
}, { strict: false });
const BotCP = mongoose.model('BotCP', BotCPSchema, 'cps');

const app = express();
const PORT = process.env.PORT || 5023;

// Configurações de Segurança e Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`[SERVER] ${req.method} ${req.url}`);
    next();
});

// Estado em Memória (Cache)
let officersCache = [];
let lastSync = null;

// Função para carregar cache inicial da DB
async function loadInitialCache() {
    try {
        const doc = await SystemData.findOne({ type: 'OFFICER_CACHE' });
        if (doc) {
            officersCache = doc.data.officers;
            lastSync = doc.data.lastSync;
            console.log(`[SERVER] Cache inicial carregado: ${officersCache.length} membros.`);
        }
    } catch (e) {
        console.error('[SERVER] Erro ao carregar cache inicial:', e);
    }
}
loadInitialCache();

// Inicialização do Bot Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});

/**
 * Função de Sincronização com Discord
 */
async function syncDiscordData() {
    try {
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        if (!guild) return console.log("ERRO: Guild não encontrada.");

        const members = await guild.members.fetch();
        
        // Mapeamento de Roles (vindo do .env)
        const roleMap = {
            [process.env.ROLE_ID_COMANDO]: 'COMANDO GERAL (T)',
            [process.env.ROLE_ID_OFICIAIS]: 'OFICIAIS (K)',
            [process.env.ROLE_ID_SARGENTOS]: 'SARGENTOS (Z)',
            [process.env.ROLE_ID_GUARDAS]: 'CORPO DE GUARDAS (G)',
            [process.env.ROLE_ID_CFG]: 'CFG (H)'
        };

        const roleIds = Object.keys(roleMap).filter(id => id && id !== "undefined");
        
        // Obter todas as horas acumuladas da base de dados
        const allClosedPontos = await BotPonto.find({ status: 'FECHADO' });
        const hoursMap = {};
        allClosedPontos.forEach(p => {
            if (!hoursMap[p.userId]) hoursMap[p.userId] = 0;
            const duration = (p.endTime - p.startTime) - (p.totalPauseTime || 0);
            if (duration > 0) hoursMap[p.userId] += duration;
        });

        const matched = members.filter(m => !m.user.bot);

        officersCache = matched.map(m => {
            const currentName = (m.nickname || m.user.globalName || m.user.username || "MEMBRO DESCONHECIDO").toUpperCase();
            const rank = m.nickname?.split('|')[0]?.trim() || 'Guarda';
            
            // Deteção por Prefixo (T-01, K-02, etc)
            let category = "OUTROS";
            if (rank.startsWith('T-')) category = 'COMANDO GERAL (T)';
            else if (rank.startsWith('K-')) category = 'OFICIAIS (K)';
            else if (rank.startsWith('Z-')) category = 'SARGENTOS (Z)';
            else if (rank.startsWith('G-')) category = 'GUARDAS (G)';
            else if (rank.startsWith('H-')) category = 'CFG (H)';
            else {
                // Deteção por Cargo (Role)
                for (const rid of roleIds) {
                    if (m.roles.cache.has(rid)) {
                        category = roleMap[rid];
                        break;
                    }
                }
            }

            const totalMs = hoursMap[m.user.id] || 0;

            return {
                id: m.user.id,
                name: currentName,
                nip: m.user.username?.replace(/\D/g, '')?.slice(0, 5) || m.user.id.slice(-5),
                rank: rank,
                category: category,
                status: m.presence?.status === 'online' ? 'online' : 'offline',
                avatar: m.user.displayAvatarURL({ extension: 'png' }),
                totalHours: (totalMs / 3600000).toFixed(1),
                joinedDate: m.joinedAt ? new Date(m.joinedAt).toLocaleDateString('pt-PT') : 'N/A',
                discordId: m.user.username,
                tags: m.roles.cache.filter(r => r.name !== '@everyone').map(r => r.name)
            };
        });

        // Filtrar apenas quem tem categoria definida
        officersCache = officersCache.filter(o => o.category !== "OUTROS");
        
        console.log(`[SYNC] Sincronizados ${officersCache.length} oficiais do Discord.`);
        
        lastSync = new Date().toISOString();
        
        await SystemData.findOneAndUpdate(
            { type: 'OFFICER_CACHE' },
            { data: { officers: officersCache, lastSync }, updatedAt: new Date() },
            { upsert: true }
        );

        console.log(`Sucesso: ${officersCache.length} membros sincronizados por categorias.`);
        return { success: true, count: officersCache.length };
    } catch (error) {
        console.error('Erro na sincronização:', error);
        if (error.message.includes('rate limit') || error.code === 429) {
            await loadInitialCache();
            return { success: true, count: officersCache.length, error: 'RATE_LIMIT_FALLBACK' };
        }
        
        let lastError = null;
        return { success: false, error: error.message };
    }
}

// Auto-Sync Recorrente (A cada 5 minutos para manter o Efetivo fresco)
setInterval(() => {
    if (client.isReady()) syncDiscordData();
}, 5 * 60 * 1000);

// Forçar uma tentativa extra se a cache estiver vazia ao fim de 30 segundos
setTimeout(() => {
    if (officersCache.length === 0 && client.isReady()) {
        console.log('[SYNC] Cache vazia detetada. Forçando tentativa de recuperação...');
        syncDiscordData();
    }
}, 30000);

// --- ENDPOINTS DA API ---

// 1. Obter lista de oficiais (Mistura de Discord + MongoDB se necessário)
app.get('/api/officers', (req, res) => {
    res.json({
        officers: officersCache,
        lastSync,
        botStatus: client.isReady() ? 'ONLINE' : 'OFFLINE'
    });
});

// 2. Operações CRUD de Dados Genéricos (Reports, Warrants, etc)
app.get('/api/data/:type', async (req, res) => {
    try {
        const docs = await SystemData.find({ type: req.params.type.toUpperCase() }).sort({ updatedAt: -1 });
        res.json(docs.map(d => d.data));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/data/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const data = req.body;
        
        // Se já existir (por ID), atualizamos. Se não, criamos.
        let doc;
        if (data.id) {
            doc = await SystemData.findOneAndUpdate(
                { type: type.toUpperCase(), "data.id": data.id },
                { data, updatedAt: new Date() },
                { upsert: true, new: true }
            );
        } else {
            doc = new SystemData({ type: type.toUpperCase(), data });
            await doc.save();
        }
        res.json(doc.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/data/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;
        await SystemData.deleteOne({ type: type.toUpperCase(), "data.id": id });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. Trigger de Sincronização Manual (Permite GET e POST)
app.all('/api/sync', async (req, res) => {
    console.log('[SYNC] Sincronização manual solicitada via API.');
    const result = await syncDiscordData();
    if (result.success) {
        res.json({ ...result, message: 'Sincronização concluída com sucesso.' });
    } else {
        res.status(500).json(result);
    }
});

// Endpoint de Diagnóstico para o Bot
app.get('/api/debug/db', async (req, res) => {
    try {
        const isConnected = mongoose.connection.readyState === 1;
        let collections = [];
        let pCount = 0;
        let cpCount = 0;

        if (isConnected) {
            const dbCols = await mongoose.connection.db.listCollections().toArray();
            collections = dbCols.map(c => c.name);
            // Verificar contagem real na DB
            pCount = await mongoose.connection.db.collection('pontos').countDocuments({ status: 'ABERTO' });
            cpCount = await mongoose.connection.db.collection('cps').countDocuments({ status: 'ABERTO' });
        }
        
        res.json({
            mongooseState: mongoose.connection.readyState, 
            connected: isConnected,
            dbName: mongoose.connection.name,
            collections: collections,
            activePontos: pCount,
            activeCPs: cpCount,
            officersSynced: officersCache.length,
            lastSync: lastSync,
            botReady: client.isReady(),
            botUser: client.user?.tag,
            guildFound: !!client.guilds.cache.get(process.env.DISCORD_GUILD_ID),
            envCheck: {
                hasMongoUri: !!process.env.MONGODB_URI,
                hasDiscordToken: !!process.env.DISCORD_TOKEN,
                guildId: process.env.DISCORD_GUILD_ID
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message, stack: err.stack });
    }
});

// 4. Endpoints Ao Vivo das Operações do Bot (MongoDB Nativo)
app.get('/api/live/pontos', async (req, res) => {
    try {
        // Encontrar pontos que estão com status ABERTO
        const agoras = await BotPonto.find({ status: 'ABERTO' }).sort({ startTime: -1 });
        
        // Deduplicar por userId (Garante apenas um turno ativo por pessoa na API)
        const uniqueMap = new Map();
        agoras.forEach(p => {
            if (!uniqueMap.has(p.userId)) {
                uniqueMap.set(p.userId, p);
            }
        });
        
        const activeShifts = Array.from(uniqueMap.values()).map(p => {
            const currentUserId = p.userId;
            const officer = officersCache.find(o => o.id === currentUserId || o.discordId === currentUserId) || {
                id: currentUserId,
                name: "GUARDA DESCONHECIDO",
                rank: ""
            };
            
            return {
                id: p._id ? p._id.toString() : `SHIFT-${currentUserId}`,
                officerId: officer.id,
                officerName: officer.name,
                officerRank: officer.rank,
                officerCategory: (officer as any).category || '',
                officerAvatar: officer.avatar,
                status: p.isPaused ? 'PAUSED' : 'RUNNING',
                startedAt: p.startTime,
                totalHours: officer.totalHours || '0.0'
            };
        });
        res.json(activeShifts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Endpoint para puxar Avisos do Discord
app.get('/api/discord/avisos', async (req, res) => {
    try {
        const channelId = process.env.DISCORD_AVISOS_CHANNEL_ID;
        if (!channelId) throw new Error('ID do canal de avisos não configurado.');

        const channel = await client.channels.fetch(channelId);
        if (!channel || !channel.isTextBased()) throw new Error('Canal não encontrado ou inválido.');

        const messages = await channel.messages.fetch({ limit: 20 });
        const avisos = messages.map(m => ({
            id: m.id,
            author: m.author.username,
            content: m.content,
            timestamp: m.createdAt,
            attachments: m.attachments.map(a => a.url)
        }));

        res.json(avisos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 6. Relatório Avançado de RH (Por Datas)
app.get('/api/reports/hr', async (req, res) => {
    try {
        const { start, end } = req.query;
        if (!start || !end) throw new Error('Datas de início e fim são necessárias.');

        const startDate = new Date(start);
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);

        // Buscar Pontos e Patrulhas no intervalo
        const [pontos, patrols] = await Promise.all([
            BotPonto.find({ 
                startTime: { $gte: startDate, $lte: endDate },
                status: 'FECHADO' 
            }),
            mongoose.connection.db.collection('cps').find({ 
                startTime: { $gte: startDate, $lte: endDate }
            }).toArray()
        ]);

        // Agrupar por Militar
        const report = {};
        
        // Processar Horas
        pontos.forEach(p => {
            if (!report[p.userId]) report[p.userId] = { userId: p.userId, totalMs: 0, patrolCount: 0 };
            const duration = (p.endTime - p.startTime) - (p.totalPauseTime || 0);
            report[p.userId].totalMs += Math.max(0, duration);
        });

        // Processar Patrulhas
        patrols.forEach(cp => {
            const participantsStr = cp.participants || '';
            const commanderId = cp.commanderId;
            
            // Extrair todos os IDs de utilizador do Discord (formato <@123...>)
            const foundIds = participantsStr.match(/\d{17,19}/g) || [];
            if (commanderId) foundIds.push(commanderId);

            // Garantir que contamos apenas uma patrulha por pessoa por CP
            const uniqueParticipants = [...new Set(foundIds)];
            
            uniqueParticipants.forEach(mId => {
                if (!report[mId]) report[mId] = { userId: mId, totalMs: 0, patrolCount: 0 };
                report[mId].patrolCount += 1;
            });
        });

        // Enriquecer com nomes da cache
        const finalReport = Object.values(report).map((r) => {
            const officer = officersCache.find(o => o.id === r.userId || o.discordId === r.userId);
            return {
                ...r,
                name: officer?.name || 'DESCONHECIDO',
                rank: officer?.rank || 'N/A',
                totalHours: (r.totalMs / 3600000).toFixed(2)
            };
        });

        res.json(finalReport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/live/cps', async (req, res) => {
    try {
        // Encontrar CPs que estão com status ABERTO na coleção 'cps'
        const cpsAtivas = await BotCP.find({ status: 'ABERTO' }).limit(50);
        
        const activeCPs = cpsAtivas.map(cp => {
            // No Bot atual, participants é uma string: "<@ID1>|time <@ID2>|time"
            const participantString = cp.participants || "";
            const ids = [...participantString.matchAll(/<@!?(\d+)>/g)].map(m => m[1]);
            
            let commanderName = "SISTEMA";
            if (ids.length > 0) {
                const firstOff = officersCache.find(o => o.id === ids[0] || o.discordId === ids[0]);
                if (firstOff) commanderName = firstOff.name;
            }

            return {
                id: cp._id ? cp._id.toString() : `CP-${cp.number}`,
                cpNumber: cp.number || "1",
                commanderName: commanderName,
                status: 'OPEN',
                members: ids.map(memberId => {
                    const off = officersCache.find(o => o.id === memberId || o.discordId === memberId) || { name: "Desconhecido" };
                    return { id: memberId, name: off.name, status: 'ACTIVE' };
                })
            };
        });
        res.json(activeCPs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 5. Status do Sistema
app.get('/api/status', (req, res) => {
    res.json({
        status: 'UP',
        botReady: client.isReady(),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024 + ' MB'
    });
});

// Login do Bot
if (process.env.DISCORD_TOKEN) {
    client.on('ready', async () => {
    console.log(`Bot MDT logado como ${client.user.tag}`);
    await loadInitialCache();
    
    // Sincronização inicial automática
    syncDiscordData();
});

// EVENTOS PARA ATUALIZAÇÃO EM TEMPO REAL
client.on('guildMemberUpdate', (oldM, newM) => {
    console.log(`[REALTIME] Membro atualizado: ${newM.user.tag}. Sincronizando...`);
    syncDiscordData();
});

client.on('guildMemberAdd', (member) => {
    console.log(`[REALTIME] Novo membro: ${member.user.tag}. Sincronizando...`);
    syncDiscordData();
});

client.on('guildMemberRemove', (member) => {
    console.log(`[REALTIME] Membro saiu: ${member.user.tag}. Sincronizando...`);
    syncDiscordData();
});

    client.login(process.env.DISCORD_TOKEN).catch(err => {
        console.error('Falha ao autenticar Bot Discord:', err.message);
    });
} else {
    console.log('AVISO: DISCORD_TOKEN não configurado. Sincronização Discord desativada.');
}

app.listen(PORT, () => {
    console.log(`Servidor API GNR a correr na porta ${PORT}`);
});
