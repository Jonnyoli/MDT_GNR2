
import React, { useState, useEffect } from 'react';
import { Ticket, Officer } from '../types';
import { getLocalTickets, saveTicketLocally, updateTicketLocally, getDiscordConfig } from '../services/dataService';
import { apiService } from '../services/apiService';

interface TicketsSectionProps {
  currentUser: Officer | null;
  isAdmin: boolean;
}

const TicketsSection: React.FC<TicketsSectionProps> = ({ currentUser, isAdmin }) => {
  const [tickets, setTickets] = useState<Ticket[]>(() => getLocalTickets());
  const [showForm, setShowForm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'TODOS' | 'ABERTO' | 'FECHADO'>('TODOS');
  
  const [formData, setFormData] = useState<Partial<Ticket>>({
    title: '',
    category: 'Suporte Técnico',
    priority: 'BAIXA',
    description: ''
  });

  const config = getDiscordConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || isSending) return;

    setIsSending(true);
    const newTicket: Ticket = {
      id: `T-${Date.now().toString().slice(-6)}`,
      title: formData.title || 'Sem Título',
      author: currentUser.name,
      category: formData.category as any,
      priority: formData.priority as any,
      status: 'ABERTO',
      description: formData.description || '',
      timestamp: new Date().toLocaleString('pt-PT')
    };

    try {
      // Sincroniza com Discord se configurado
      if (config.token && config.ticketChannelId) {
        const discordId = await apiService.sendTicketToDiscord(
          config.token, 
          config.ticketChannelId, 
          newTicket
        );
        newTicket.discordMessageId = discordId;
      }
      
      setTickets(saveTicketLocally(newTicket));
      setShowForm(false);
      setFormData({ title: '', category: 'Suporte Técnico', priority: 'BAIXA', description: '' });
      alert("TICKET TRANSMITIDO PARA O COMANDO GERAL VIA DISCORD.");
    } catch (e: any) {
      alert("Erro ao sincronizar com Discord: " + e.message + "\nTicket salvo localmente.");
      setTickets(saveTicketLocally(newTicket));
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: Ticket['status']) => {
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      const updated = { ...ticket, status: newStatus };
      setTickets(updateTicketLocally(updated));
    }
  };

  const filteredTickets = tickets.filter(t => filterStatus === 'TODOS' || t.status === filterStatus);

  const priorityClasses = {
    'BAIXA': 'bg-blue-500/10 text-blue-500',
    'MÉDIA': 'bg-emerald-500/10 text-emerald-500',
    'ALTA': 'bg-amber-500/10 text-amber-500',
    'URGENTE': 'bg-red-500/10 text-red-500 animate-pulse'
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="border-b border-white/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div>
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Central de Tickets</h2>
          <p className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.4em] mt-5 flex items-center gap-4 italic">
             <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
             Comunicação Direta com o Comando • Discord Link Ativo
          </p>
        </div>

        <div className="flex gap-4">
           <div className="bg-black/40 p-1 rounded-xl border border-white/5 flex">
              {['TODOS', 'ABERTO', 'FECHADO'].map(s => (
                <button 
                  key={s}
                  onClick={() => setFilterStatus(s as any)}
                  className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-white'}`}
                >
                  {s}
                </button>
              ))}
           </div>
           <button 
             onClick={() => setShowForm(!showForm)}
             className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-2"
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
             {showForm ? 'CANCELAR' : 'ABRIR TICKET'}
           </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-black/40 border border-emerald-900/20 p-10 rounded-[2.5rem] space-y-8 animate-in slide-in-from-top-4 duration-500">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Título do Ticket</label>
                 <input 
                   required
                   value={formData.title}
                   onChange={e => setFormData({...formData, title: e.target.value})}
                   className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 outline-none"
                   placeholder="Ex: Falha no Terminal de Autos"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoria</label>
                 <select 
                   value={formData.category}
                   onChange={e => setFormData({...formData, category: e.target.value as any})}
                   className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 outline-none"
                 >
                    <option>Suporte Técnico</option>
                    <option>Denúncia</option>
                    <option>Solicitação</option>
                    <option>Outro</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Prioridade</label>
                 <select 
                   value={formData.priority}
                   onChange={e => setFormData({...formData, priority: e.target.value as any})}
                   className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:border-emerald-500 outline-none"
                 >
                    <option>BAIXA</option>
                    <option>MÉDIA</option>
                    <option>ALTA</option>
                    <option>URGENTE</option>
                 </select>
              </div>
           </div>
           <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Descrição Detalhada</label>
              <textarea 
                required
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-xs text-slate-300 outline-none focus:border-emerald-500 h-32 resize-none italic"
                placeholder="Descreva detalhadamente o seu problema ou solicitação..."
              />
           </div>
           <button 
             type="submit" 
             disabled={isSending}
             className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
           >
             {isSending ? (
               <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
             ) : (
               "TRANSMITIR PARA O COMANDO GERAL"
             )}
           </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTickets.map((t) => (
          <div key={t.id} className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] group hover:border-emerald-500/20 transition-all flex flex-col relative overflow-hidden">
             <div className="flex justify-between items-start mb-6">
                <span className="text-[9px] font-mono text-emerald-900">#{t.id}</span>
                <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${priorityClasses[t.priority]}`}>
                  {t.priority}
                </span>
             </div>
             
             <h3 className="text-xl font-black text-white italic uppercase tracking-tight truncate mb-2 group-hover:text-emerald-500 transition-colors">{t.title}</h3>
             <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-6 italic">{t.category} • {t.timestamp}</p>
             
             <div className="flex-1">
                <p className="text-[11px] text-slate-400 italic line-clamp-3 leading-relaxed mb-8">"{t.description}"</p>
             </div>

             <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                   <span className="text-[9px] font-black text-white uppercase italic">{t.author}</span>
                </div>
                
                <div className="flex items-center gap-4">
                   {isAdmin && t.status === 'ABERTO' && (
                     <button 
                       onClick={() => handleUpdateStatus(t.id, 'FECHADO')}
                       className="text-[8px] font-black text-red-500 uppercase tracking-widest hover:underline"
                     >
                       Fechar
                     </button>
                   )}
                   <span className={`text-[8px] font-black uppercase tracking-widest ${t.status === 'ABERTO' ? 'text-emerald-500 animate-pulse' : 'text-slate-700'}`}>
                     {t.status}
                   </span>
                </div>
             </div>
             
             {t.discordMessageId && (
               <div className="absolute top-0 right-0 p-3 opacity-20">
                  <svg className="w-3 h-3 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
               </div>
             )}
          </div>
        ))}
        {filteredTickets.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-10">
             <p className="text-xl font-black italic uppercase tracking-widest">Sem comunicações ativas no arquivo</p>
          </div>
        )}
      </div>

      <div className="bg-emerald-950/10 border border-emerald-500/10 p-10 rounded-[3rem] text-center">
         <p className="text-[10px] text-emerald-800 font-black uppercase tracking-[0.4em] mb-4 italic">Protocolo de Comunicação Unificada</p>
         <p className="text-xs text-slate-500 italic leading-relaxed max-w-3xl mx-auto uppercase">
            Utilize este canal para reportar falhas graves, solicitar promoções ou expor situações disciplinares. Todas as mensagens são <span className="text-white font-bold underline">logadas via Discord</span> com o carimbo de tempo operacional.
         </p>
      </div>
    </div>
  );
};

export default TicketsSection;
