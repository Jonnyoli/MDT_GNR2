
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { addToGlobalSeizureTotal, getDiscordConfig } from '../services/dataService';
import { apiService } from '../services/apiService';
import { Ticket } from '../types';

interface SeizureItem {
  name: string;
  quantity: number;
  value: number; 
  total: number;
}

interface MarketValue {
  id: string;
  category: string;
  price: number;
  unit: string; 
}

interface SeizuresSectionProps {
  isAdmin: boolean;
  currentUser?: any;
}

const DEFAULT_MARKET_VALUES: MarketValue[] = [
  { id: 'm1', category: 'MATERIAIS (FERRO/COBRE/ETC)', price: 50, unit: 'un' },
  { id: 'm2', category: 'PEDRA', price: 100, unit: 'un' },
  { id: 'm3', category: 'PEÇAS DE ARMAS', price: 3200, unit: 'un' },
  { id: 'b1', category: 'BP PISTOLA', price: 40000, unit: 'un' },
  { id: 'b2', category: 'BP SMG', price: 80000, unit: 'un' },
  { id: 'b3', category: 'BP RIFLE', price: 150000, unit: 'un' },
  { id: 'b4', category: 'BP SHOTGUN', price: 150000, unit: 'un' },
  { id: 'a1', category: 'COLETE', price: 17000, unit: 'un' },
  { id: 'a2', category: 'COLETE PESADO', price: 26000, unit: 'un' },
  { id: 'w1', category: 'PISTOLA', price: 180000, unit: 'un' },
  { id: 'w2', category: 'FIVE SEVEN', price: 150000, unit: 'un' },
  { id: 'w3', category: 'DEAGLE', price: 220000, unit: 'un' },
  { id: 'w11', category: 'AK-47 / QBZ', price: 530000, unit: 'un' },
  { id: 'am1', category: 'CAIXA 50X 9MM', price: 9000, unit: 'un' },
  { id: 'd1', category: 'DROGA (LOTE 100 UN)', price: 18000, unit: 'un' },
];

const SeizuresSection: React.FC<SeizuresSectionProps> = ({ isAdmin, currentUser }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showMarketConfig, setShowMarketConfig] = useState(false);
  const [marketValues, setMarketValues] = useState<MarketValue[]>(() => {
    const saved = localStorage.getItem('gnr_market_prices_v3');
    return saved ? JSON.parse(saved) : DEFAULT_MARKET_VALUES;
  });

  const [items, setItems] = useState<SeizureItem[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [description, setDescription] = useState('');
  const [seizureId, setSeizureId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('gnr_market_prices_v3', JSON.stringify(marketValues));
  }, [marketValues]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setItems([]);
        setTotalValue(0);
        setSeizureId('');
      };
      reader.readAsDataURL(file);
    }
  };

  const sendSeizureToDiscord = async (finalTotal: number, summary: string, itemsList: SeizureItem[]) => {
    const config = getDiscordConfig();
    if (!config.token || !config.ticketChannelId) return;

    const itemsText = itemsList.map(i => `• ${i.name} (x${i.quantity}) - ${i.total.toLocaleString()}€`).join('\n');
    
    const report: Ticket = {
      id: seizureId || `AP-${Date.now().toString().slice(-4)}`,
      title: `RELATÓRIO DE APREENSÃO IA`,
      author: currentUser?.name || 'Oficial em Patrulha',
      category: 'Solicitação',
      priority: 'ALTA',
      status: 'ABERTO',
      description: `**VALOR TOTAL LIQUIDADO:** ${finalTotal.toLocaleString()}€\n\n**INVENTÁRIO DETETADO:**\n${itemsText}\n\n**ANÁLISE FORENSE:**\n${summary}`,
      timestamp: new Date().toLocaleString('pt-PT')
    };

    try {
      await apiService.sendTicketToDiscord(config.token, config.ticketChannelId, report);
    } catch (e) {
      console.error("Erro ao notificar Comando via Discord:", e);
    }
  };

  const analyzeSeizure = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    const newId = `AP-${Date.now().toString().slice(-6)}`;
    setSeizureId(newId);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = image.split(',')[1];
      const priceContext = marketValues.map(v => `${v.category}: ${v.price}€`).join(', ');

      const prompt = `Atua como perito oficial da GNR. Analisa esta imagem de apreensão de forma EXAUSTIVA. 
      Identifica TODOS os itens presentes (armas, munições, substâncias, dinheiro, equipamentos, bens de valor, joias, etc.).
      
      TABELA DE PREÇOS OFICIAIS:
      ${priceContext}. 
      
      Regras:
      1. Dinheiro facial é somado diretamente.
      2. Itens na tabela usam o valor da tabela.
      3. Itens fora da tabela recebem valor unitário 0.
      
      Retorna um JSON com todos os itens detetados.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              detected_items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    quantity: { type: Type.NUMBER },
                    unit_value: { type: Type.NUMBER }
                  },
                  required: ["name", "quantity", "unit_value"]
                }
              },
              summary: { type: Type.STRING }
            },
            required: ["detected_items", "summary"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      const mappedItems = data.detected_items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        value: item.unit_value,
        total: item.quantity * item.unit_value
      }));

      const finalTotal = mappedItems.reduce((acc: number, curr: any) => acc + curr.total, 0);
      
      setItems(mappedItems);
      setTotalValue(finalTotal);
      setDescription(data.summary);

      addToGlobalSeizureTotal(finalTotal);
      sendSeizureToDiscord(finalTotal, data.summary, mappedItems);

    } catch (error) {
      console.error("Erro IA:", error);
      alert("Falha na ligação ao Laboratório Central.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getItemIcon = (name: string) => {
    const n = name.toUpperCase();
    if (n.includes('PISTOLA') || n.includes('ARMA') || n.includes('GLOCK')) 
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4M4 12l4-4m-4 4l4 4" /></svg>;
    if (n.includes('DINHEIRO') || n.includes('NOTAS') || n.includes('EURO'))
      return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.407 2.67 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.407-2.67-1M12 17V7" /></svg>;
    return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #official-document, #official-document * { visibility: visible; }
          #official-document { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            background: white !important; 
            color: black !important; 
            padding: 40px !important; 
            display: block !important;
            font-family: 'Inter', sans-serif !important;
          }
          .no-print { display: none !important; }
        }
        @keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
        
        #official-document { display: none; }
        
        .print-table th { background: #f1f5f9; border-bottom: 2px solid #000; text-align: left; padding: 12px 8px; font-size: 10px; text-transform: uppercase; }
        .print-table td { border-bottom: 1px solid #e2e8f0; padding: 10px 8px; font-size: 11px; }
      `}</style>

      {/* DOCUMENTO DE IMPRESSÃO (ESCONDIDO) */}
      <div id="official-document" className="bg-white text-black p-10 font-sans">
         <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-10">
            <div className="flex items-center gap-6">
               <div className="w-16 h-16 border-2 border-black flex items-center justify-center p-2">
                  <svg fill="black" viewBox="0 0 24 24" className="w-12 h-12"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/></svg>
               </div>
               <div>
                  <h1 className="text-xl font-black uppercase tracking-tighter">República Portuguesa</h1>
                  <h2 className="text-lg font-bold uppercase tracking-tight">Guarda Nacional Republicana</h2>
                  <p className="text-[9px] font-black uppercase opacity-60">Direção de Investigação Criminal • Diamond Territory</p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-[8px] font-black uppercase text-slate-500">Auto de Apreensão N.º</p>
               <p className="text-lg font-mono font-black">{seizureId}</p>
               <p className="text-[10px] font-bold mt-4">{new Date().toLocaleString('pt-PT')}</p>
            </div>
         </div>

         <div className="mb-10 text-center py-4 border-y-2 border-black">
            <h3 className="text-xl font-black uppercase tracking-[0.2em]">Inventário de Provas e Bens Apreendidos</h3>
         </div>

         <div className="grid grid-cols-2 gap-10 mb-10">
            <div className="space-y-2">
               <p className="text-[9px] font-black uppercase text-slate-500">Oficial Autuante</p>
               <p className="text-sm font-bold uppercase italic border-b border-black/10 pb-1">{currentUser?.name || 'Oficial em Patrulha'}</p>
            </div>
            <div className="space-y-2">
               <p className="text-[9px] font-black uppercase text-slate-500">Unidade Operacional</p>
               <p className="text-sm font-bold uppercase border-b border-black/10 pb-1">COMANDO GNR DIAMOND</p>
            </div>
         </div>

         <table className="w-full print-table mb-10">
            <thead>
               <tr>
                  <th>Descrição do Item</th>
                  <th>Quantidade</th>
                  <th>Vlr. Unitário</th>
                  <th className="text-right">Vlr. Total</th>
               </tr>
            </thead>
            <tbody>
               {items.map((item, idx) => (
                  <tr key={idx}>
                     <td className="font-bold uppercase italic">{item.name}</td>
                     <td className="font-mono">{item.quantity}</td>
                     <td className="font-mono">{item.value.toLocaleString()}€</td>
                     <td className="text-right font-black">{item.total.toLocaleString()}€</td>
                  </tr>
               ))}
               <tr className="bg-slate-50">
                  <td colSpan={3} className="text-right font-black uppercase text-xs">Valor Total de Apreensão</td>
                  <td className="text-right font-black text-lg">{totalValue.toLocaleString()}€</td>
               </tr>
            </tbody>
         </table>

         <div className="space-y-4 mb-12">
            <p className="text-[9px] font-black uppercase text-slate-500">Análise Forense (SINC IA)</p>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
               <p className="text-xs italic leading-relaxed text-justify">{description || "Itens processados via terminal de inteligência forense diamond. Verificação de autenticidade concluída."}</p>
            </div>
         </div>

         <div className="mt-20 pt-10 border-t border-black/10 grid grid-cols-2 gap-20 text-center">
            <div className="space-y-2">
               <div className="h-0.5 bg-black/20 w-full mb-1"></div>
               <p className="text-[9px] font-black uppercase">O Oficial Instrutor</p>
               <p className="text-[10px] font-serif italic">{currentUser?.name || '---'}</p>
            </div>
            <div className="space-y-2 relative">
               <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-30 rotate-[-10deg]">
                  <div className="border-4 border-blue-800 text-blue-800 p-2 font-black uppercase text-xs">SINC VALIDATED</div>
               </div>
               <div className="h-0.5 bg-black/20 w-full mb-1"></div>
               <p className="text-[9px] font-black uppercase">Autenticação Digital</p>
               <p className="text-[8px] font-mono text-slate-400">HASH: {btoa(seizureId).slice(0, 16).toUpperCase()}</p>
            </div>
         </div>

         <div className="absolute bottom-10 left-0 w-full px-10 flex justify-between opacity-30 text-[7px] font-black uppercase">
            <p>GNR-DIAMOND-SEIZURE-REPORT v9.5</p>
            <p>Página 1 de 1</p>
         </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 no-print">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-4">
             INVENTÁRIO GNR IA
             <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-lg font-black tracking-[0.2em] italic uppercase">SIGP-V9.0</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-3 italic tracking-tight">Análise Total de Provas • Relatório Automático ao Comando Geral.</p>
        </div>
        
        <div className="flex gap-3">
          {isAdmin && (
            <button onClick={() => setShowMarketConfig(!showMarketConfig)} className="bg-slate-800/50 border border-white/5 text-slate-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all flex items-center gap-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0"/></svg>
              Tabela de Preços
            </button>
          )}
          {totalValue > 0 && (
            <button onClick={handlePrint} className="bg-white text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-2xl flex items-center gap-3">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/></svg>
               Gerar Comprovativo
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 no-print">
        <div className="space-y-6">
           <div onClick={() => !isAnalyzing && fileInputRef.current?.click()} className={`h-[500px] border-2 border-dashed rounded-[3rem] overflow-hidden flex flex-col items-center justify-center cursor-pointer relative group transition-all ${image ? 'border-emerald-500 bg-black/40' : 'border-slate-800 bg-slate-900/10 hover:border-emerald-900'}`}>
              {image ? (
                <>
                  <img src={image} className="w-full h-full object-cover opacity-60" alt="" />
                  {isAnalyzing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/20 backdrop-blur-sm">
                       <div className="w-32 h-1 bg-emerald-500 animate-[scan_2s_linear_infinite] shadow-[0_0_20px_#10b981]"></div>
                       <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mt-8 animate-pulse italic">Motor IA a Analisar...</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center p-12 space-y-6 opacity-40 group-hover:opacity-100 transition-opacity">
                   <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto"><svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0"/></svg></div>
                   <p className="text-xs font-black uppercase tracking-widest text-white italic">Carregar Foto de Apreensão</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
           </div>
           {image && !isAnalyzing && !totalValue && (
              <button onClick={analyzeSeizure} className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95">
                IDENTIFICAR E REPORTAR AO COMANDO
              </button>
           )}
           {totalValue > 0 && (
              <button onClick={() => { setImage(null); setItems([]); setTotalValue(0); }} className="w-full py-6 bg-slate-800 hover:bg-slate-700 text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] transition-all active:scale-95">
                LIMPAR E NOVA ANÁLISE
              </button>
           )}
        </div>

        <div className="bg-[#020604]/80 border border-emerald-500/10 p-8 rounded-[3rem] h-[500px] flex flex-col shadow-inner">
           <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-8 border-b border-white/5 pb-6 italic">Inventário Detetado</h3>
           <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-10 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">Aguardando Prova...</p>
                </div>
              ) : (
                items.map((item, i) => (
                  <div key={i} className="bg-black/40 p-5 rounded-2xl border border-white/5 flex items-center justify-between group">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-500 flex items-center justify-center">{getItemIcon(item.name)}</div>
                        <div>
                           <h4 className="text-xs font-black text-white italic uppercase truncate">{item.name}</h4>
                           <p className="text-[8px] text-slate-500 uppercase tracking-widest mt-1">Ref: {item.value.toLocaleString()}€</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-white">x{item.quantity}</p>
                        <p className="text-[10px] font-black text-emerald-500 italic mt-1">{item.total.toLocaleString()}€</p>
                     </div>
                  </div>
                ))
              )}
           </div>
           {totalValue > 0 && (
             <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Total Liquidado nesta Apreensão</p>
                <p className="text-4xl font-black text-emerald-500 italic tracking-tighter">{totalValue.toLocaleString()}€</p>
             </div>
           )}
        </div>
      </div>

      {showMarketConfig && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300 overflow-y-auto no-print">
           <div className="bg-[#0f172a] border border-blue-500/20 w-full max-w-4xl rounded-[3rem] p-12 relative shadow-2xl my-auto">
              <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
                 <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Gestão de Valores de Mercado</h3>
                 <button onClick={() => setShowMarketConfig(false)} className="text-slate-500 hover:text-white transition-all"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                 {marketValues.map(v => (
                   <div key={v.id} className="flex flex-col gap-2 p-4 bg-black/40 border border-white/5 rounded-2xl group hover:border-emerald-500/20 transition-all">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{v.category}</label>
                      <div className="flex items-center gap-4">
                         <input 
                           type="number" 
                           value={v.price}
                           onChange={e => {
                              const newVal = parseInt(e.target.value) || 0;
                              setMarketValues(prev => prev.map(m => m.id === v.id ? { ...m, price: newVal } : m));
                           }}
                           className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-sm font-mono font-black text-emerald-500 outline-none focus:border-emerald-500"
                         />
                         <span className="text-[10px] font-black text-slate-600 uppercase">€ / {v.unit}</span>
                      </div>
                   </div>
                 ))}
              </div>
              
              <div className="mt-12 flex gap-4">
                 <button onClick={() => setMarketValues(DEFAULT_MARKET_VALUES)} className="flex-1 py-4 bg-white/5 border border-white/10 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Restaurar Predefinidos</button>
                 <button onClick={() => { localStorage.setItem('gnr_market_prices_v3', JSON.stringify(marketValues)); setShowMarketConfig(false); }} className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all">Sincronizar Novos Preços</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SeizuresSection;
