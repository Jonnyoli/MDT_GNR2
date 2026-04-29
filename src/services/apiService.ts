
import { Officer, Ticket } from '../types';

const PROXIES = [
  "https://corsproxy.io/?",
  "https://api.codetabs.com/v1/proxy?quest="
];

export interface ApiResponse {
  officers: Officer[];
  lastSync: string;
  botStatus: 'ONLINE' | 'OFFLINE';
}

// Se estivermos em produção (Vercel), usamos a variável de ambiente, senão usamos o IP local
const API_HOST = (import.meta as any).env?.VITE_API_URL || `http://${window.location.hostname}:3002`;
const BACKEND_URL = `${API_HOST}/api`;

export const apiService = {
  async getOfficersFromBackend(): Promise<ApiResponse> {
    console.log(`[API] Fetching officers from ${BACKEND_URL}/officers`);
    try {
      const resp = await fetch(`${BACKEND_URL}/officers`);
      if (!resp.ok) throw new Error("Falha ao contactar o servidor backend.");
      const data = await resp.json();
      console.log(`[API] Sync sucess: ${data.officers?.length || 0} officers retrieved.`);
      return data;
    } catch (e) {
      console.error("[API] Fetch error:", e);
      throw e;
    }
  },

  async syncBackend(): Promise<any> {
    const resp = await fetch(`${BACKEND_URL}/sync`, { method: 'POST' });
    if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Falha na sincronização via backend.");
    }
    return await resp.json();
  },

  async getLivePontos(): Promise<any[]> {
    try {
      const resp = await fetch(`${BACKEND_URL}/live/pontos`); // Fix: api is /api, so it's /api/live/pontos
      if (resp.ok) return await resp.json();
      return [];
    } catch(e) {
      console.error("Erro ao ler pontos ao vivo:", e);
      return [];
    }
  },

  async getLiveCPs(): Promise<any[]> {
    try {
      const resp = await fetch(`${BACKEND_URL}/live/cps`);
      if (resp.ok) return await resp.json();
      return [];
    } catch(e) {
      console.error("Erro ao ler cps ao vivo:", e);
      return [];
    }
  },

  async getData(type: string): Promise<any[]> {
    const resp = await fetch(`${BACKEND_URL}/data/${type}`);
    if (!resp.ok) throw new Error(`Falha ao carregar dados do tipo ${type}`);
    return await resp.json();
  },

  async saveData(type: string, data: any): Promise<any> {
    const resp = await fetch(`${BACKEND_URL}/data/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!resp.ok) throw new Error(`Falha ao guardar dados do tipo ${type}`);
    return await resp.json();
  },

  async deleteData(type: string, id: string): Promise<void> {
    const resp = await fetch(`${BACKEND_URL}/data/${type}/${id}`, {
      method: 'DELETE'
    });
    if (!resp.ok) throw new Error(`Falha ao eliminar dados do tipo ${type}`);
  },

  async getOfficersFromDiscord(token: string, guildId: string, roleId: string): Promise<ApiResponse> {
    const endpoint = `/guilds/${guildId}/members?limit=1000`;
    const targetUrl = `https://discord.com/api/v10${endpoint}`;
    
    let responseData = null;
    let error = null;

    for (const proxy of PROXIES) {
      try {
        const resp = await fetch(`${proxy}${encodeURIComponent(targetUrl)}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bot ${token.trim()}`,
            'Accept': 'application/json'
          }
        });

        if (resp.ok) {
          responseData = await resp.json();
          break;
        } else {
          const errData = await resp.json();
          error = errData.message || 'Erro na API do Discord';
        }
      } catch (e) {
        error = "Falha de conexão com o Proxy.";
        continue;
      }
    }

    if (!responseData) throw new Error(error || "Não foi possível contactar o Discord.");

    const officers: Officer[] = responseData
      .filter((m: any) => m.roles.includes(roleId))
      .map((m: any) => ({
        id: m.user.id,
        name: (m.nick || m.user.global_name || m.user.username).toUpperCase(),
        nip: m.user.username.replace(/\D/g, '').slice(0, 5) || m.user.id.slice(-5),
        rank: m.nick?.split('|')[0]?.trim() || 'Guarda',
        status: 'online',
        avatar: m.user.avatar 
          ? `https://cdn.discordapp.com/avatars/${m.user.id}/${m.user.avatar}.png` 
          : `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.user.id}`,
        totalHours: 0,
        joinedDate: new Date(m.joined_at).toLocaleDateString('pt-PT'),
        discordId: m.user.username,
        discordRoles: m.roles.map((r: string) => ({ name: r, color: '#6366f1' }))
      }));

    return {
      officers,
      lastSync: new Date().toISOString(),
      botStatus: 'ONLINE'
    };
  },

  async exchangeCodeForToken(code: string, clientId: string, clientSecret: string, redirectUri: string) {
    const targetUrl = `https://discord.com/api/v10/oauth2/token`;
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);

    const resp = await fetch(`${PROXIES[0]}${encodeURIComponent(targetUrl)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.error_description || "Falha ao trocar código OAuth.");
    }

    return await resp.json();
  },

  async getDiscordUser(accessToken: string) {
    const targetUrl = `https://discord.com/api/v10/users/@me`;
    const resp = await fetch(`${PROXIES[0]}${encodeURIComponent(targetUrl)}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!resp.ok) throw new Error("Falha ao obter perfil do Discord.");
    return await resp.json();
  },

  async sendTicketToDiscord(token: string, channelId: string, ticket: Ticket): Promise<string> {
    const targetUrl = `https://discord.com/api/v10/channels/${channelId}/messages`;
    const priorityColors = { 'BAIXA': 3066993, 'MÉDIA': 15844367, 'ALTA': 15105570, 'URGENTE': 15548997 };

    const body = {
      embeds: [{
        title: `📌 NOVO TICKET: ${ticket.title}`,
        description: ticket.description,
        color: priorityColors[ticket.priority],
        fields: [
          { name: "ID Interno", value: `#${ticket.id}`, inline: true },
          { name: "Autor", value: ticket.author, inline: true },
          { name: "Categoria", value: ticket.category, inline: true },
          { name: "Prioridade", value: ticket.priority, inline: true },
          { name: "Estado", value: ticket.status, inline: true }
        ],
        footer: { text: "GNR Diamond MDT • Sistema de Suporte" },
        timestamp: new Date().toISOString()
      }]
    };

    try {
      const resp = await fetch(`${PROXIES[0]}${encodeURIComponent(targetUrl)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bot ${token.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.message || 'Erro ao enviar ticket');
      }

      const data = await resp.json();
      return data.id;
    } catch (e: any) {
      throw new Error("Discord Sync falhou: " + e.message);
    }
  }
};
