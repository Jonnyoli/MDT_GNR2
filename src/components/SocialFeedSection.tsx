
import React, { useState, useEffect } from 'react';
import { Officer, SocialPost } from '../types';
import { getLocalPosts, savePostLocally, deletePostLocally } from '../services/dataService';

interface SocialFeedSectionProps {
  currentUser: Officer | null;
  isAdmin: boolean;
}

const SocialFeedSection: React.FC<SocialFeedSectionProps> = ({ currentUser, isAdmin }) => {
  const [posts, setPosts] = useState<SocialPost[]>(() => getLocalPosts());
  const [showForm, setShowForm] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const [formData, setFormData] = useState<Partial<SocialPost>>({
    content: '',
    image: '',
    category: 'OPERACIONAL'
  });

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || isPosting) return;

    setIsPosting(true);
    const newPost: SocialPost = {
      id: `POST-${Date.now()}`,
      author: currentUser.name,
      authorRank: currentUser.rank,
      authorAvatar: currentUser.avatar,
      category: formData.category as any,
      content: formData.content || '',
      image: formData.image || 'https://images.unsplash.com/photo-1518005020251-5844898e0582?auto=format&fit=crop&q=80&w=2070',
      likes: 0,
      timestamp: new Date().toLocaleString('pt-PT')
    };

    setTimeout(() => {
      setPosts(savePostLocally(newPost));
      setShowForm(false);
      setFormData({ content: '', image: '', category: 'OPERACIONAL' });
      setIsPosting(false);
    }, 800);
  };

  const handleLike = (id: string) => {
    // Implementação simples de like local
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja remover este registo do mural?")) {
      setPosts(deletePostLocally(id));
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* HEADER */}
      <div className="border-b border-white/5 pb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div>
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Mural da Guarda</h2>
          <p className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.4em] mt-5 flex items-center gap-4 italic transition-all">
             <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse shadow-[0_0_10px_#10b981]"></span>
             Atividade Operacional e Transparência Pública
          </p>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/></svg>
          {showForm ? 'CANCELAR' : 'NOVA PUBLICAÇÃO'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handlePost} className="bg-black/40 border border-emerald-900/20 p-10 rounded-[2.5rem] space-y-8 animate-in slide-in-from-top-4 duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">URL da Imagem / Captura de Ecrã</label>
                 <input 
                   required
                   value={formData.image}
                   onChange={e => setFormData({...formData, image: e.target.value})}
                   className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-4 text-xs text-white focus:border-emerald-500 outline-none"
                   placeholder="https://i.imgur.com/..."
                 />
              </div>
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoria</label>
                 <select 
                   value={formData.category}
                   onChange={e => setFormData({...formData, category: e.target.value as any})}
                   className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-4 text-xs text-white focus:border-emerald-500 outline-none"
                 >
                    <option value="OPERACIONAL">OPERACIONAL</option>
                    <option value="PATRULHA">PATRULHA</option>
                    <option value="EVENTO">EVENTO PÚBLICO</option>
                    <option value="PROMOÇÃO">PROMOÇÃO</option>
                 </select>
              </div>
           </div>
           <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Legenda Operacional</label>
              <textarea 
                required
                value={formData.content}
                onChange={e => setFormData({...formData, content: e.target.value})}
                className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-xs text-slate-300 outline-none focus:border-emerald-500 h-32 resize-none italic"
                placeholder="Descreva o que aconteceu nesta captura..."
              />
           </div>
           <button 
             type="submit" 
             disabled={isPosting}
             className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
           >
             {isPosting ? (
               <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
             ) : (
               "PUBLICAR NO MURAL DA GUARDA"
             )}
           </button>
        </form>
      )}

      {/* GRID DE POSTS (TIPO INSTAGRAM) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {posts.length > 0 ? posts.map((post) => (
          <div key={post.id} className="bg-black/40 border border-white/5 rounded-[3rem] overflow-hidden group hover:border-emerald-500/20 transition-all flex flex-col shadow-2xl relative">
            
            {/* Header do Post */}
            <div className="p-8 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-emerald-500/20 overflow-hidden">
                     <img src={post.authorAvatar} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-white italic uppercase">{post.author}</p>
                     <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest">{post.authorRank}</p>
                  </div>
               </div>
               <div className="bg-emerald-500/10 px-3 py-1 rounded-lg">
                  <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">{post.category}</span>
               </div>
            </div>

            {/* Imagem do Post */}
            <div className="aspect-square relative overflow-hidden bg-slate-900">
               <img 
                 src={post.image} 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80 group-hover:opacity-100" 
                 alt="Post GNR" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <p className="text-white text-[11px] italic font-medium leading-relaxed">
                     {post.content}
                  </p>
               </div>
            </div>

            {/* Ações do Post */}
            <div className="p-8 flex flex-col gap-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <button 
                       onClick={() => handleLike(post.id)}
                       className="flex items-center gap-2 text-white hover:text-emerald-500 transition-colors"
                     >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                        <span className="text-xs font-black italic">{post.likes} <span className="text-[8px] uppercase ml-1 opacity-40">Vénias</span></span>
                     </button>
                     <button className="text-slate-500 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                     </button>
                  </div>
                  
                  { (isAdmin || post.author === currentUser?.name) && (
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="text-red-900 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  )}
               </div>
               
               <div className="flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{post.timestamp}</p>
                  <p className="text-[7px] font-mono text-emerald-900">MDT_POST_SIGP_V9</p>
               </div>
            </div>

            {/* Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_2px]"></div>
          </div>
        )) : (
          <div className="col-span-full py-32 text-center opacity-10">
             <svg className="w-24 h-24 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
             <p className="text-2xl font-black italic uppercase tracking-widest">Sem memórias operacionais registadas</p>
          </div>
        )}
      </div>

      <div className="bg-emerald-950/10 border border-emerald-500/10 p-10 rounded-[3rem] text-center">
         <p className="text-[10px] text-emerald-800 font-black uppercase tracking-[0.4em] mb-4 italic">Protocolo de Imagem e Conduta</p>
         <p className="text-xs text-slate-500 italic leading-relaxed max-w-3xl mx-auto uppercase">
            O Mural da Guarda é um espaço de exaltação do serviço público. Publicações que desrespeitem a honra da Guarda Nacional Republicana serão removidas e os autores <span className="text-white font-bold underline">sancionados disciplinarmente</span>.
         </p>
      </div>
    </div>
  );
};

export default SocialFeedSection;
