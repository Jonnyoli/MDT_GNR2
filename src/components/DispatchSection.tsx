
import React, { useState } from 'react';

interface Unit {
  id: string;
  type: string;
  status: 'Available' | 'Busy';
  officers: string;
}

interface Call {
  id: string;
  type: string;
  loc: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  time: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  assigned: string[];
}

const DispatchSection: React.FC = () => {
  const [activeCalls, setActiveCalls] = useState<Call[]>([
    { id: '#994', type: '10-31', loc: 'Rossio, Lisboa', priority: 'HIGH', time: '12m', status: 'Pending', assigned: [] },
    { id: '#995', type: '10-20', loc: 'A1 Norte KM 14', priority: 'MEDIUM', time: '5m', status: 'In Progress', assigned: ['SI-102'] },
    { id: '#996', type: '10-15', loc: 'Posto Territorial', priority: 'LOW', time: '2m', status: 'Completed', assigned: ['SI-HQ'] },
  ]);

  const [units, setUnits] = useState<Unit[]>([
    { id: 'SI-101', type: 'Patrulha', status: 'Available', officers: 'Cabo Silva / G. Martins' },
    { id: 'SI-102', type: 'Patrulha', status: 'Busy', officers: 'Sgt. Costa' },
    { id: 'SI-201', type: 'Intervenção', status: 'Available', officers: 'G. Ferreira' },
    { id: 'SI-K9', type: 'Cinotécnica', status: 'Available', officers: 'Cabo Pereira / Rex' },
  ]);

  const [assigningCallId, setAssigningCallId] = useState<string | null>(null);

  const assignUnit = (unitId: string) => {
    if (!assigningCallId) return;

    // Update call
    setActiveCalls(prev => prev.map(c => {
      if (c.id === assigningCallId) {
        return { 
          ...c, 
          assigned: [...c.assigned, unitId],
          status: c.status === 'Pending' ? 'In Progress' : c.status
        };
      }
      return c;
    }));

    // Update unit status
    setUnits(prev => prev.map(u => {
      if (u.id === unitId) return { ...u, status: 'Busy' };
      return u;
    }));

    setAssigningCallId(null);
  };

  const completeCall = (callId: string) => {
    setActiveCalls(prev => prev.map(c => {
      if (c.id === callId) {
        // Free up assigned units
        setUnits(uPrev => uPrev.map(u => {
          if (c.assigned.includes(u.id)) return { ...u, status: 'Available' };
          return u;
        }));
        return { ...c, status: 'Completed' };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">CENTRAL DE DESPACHO</h2>
          <p className="text-emerald-700 text-[10px] font-black uppercase tracking-[0.4em] mt-3 italic">Controlo de Incidências em Tempo Real</p>
        </div>
        <button className="bg-emerald-600 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-500 transition-all shadow-xl active:scale-95">Criar Nova Ocorrência</button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Chamadas Ativas */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <h3 className="text-xs font-black text-emerald-900 uppercase tracking-[0.3em] mb-4">OCORRÊNCIAS EM LISTA</h3>
          {activeCalls.map(call => (
            <div key={call.id} className={`bg-black/40 border rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-emerald-500/30 transition-all group ${call.status === 'Completed' ? 'opacity-40 grayscale' : 'border-emerald-900/30'}`}>
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl italic shadow-2xl ${
                  call.priority === 'HIGH' ? 'bg-red-600 text-white' : 
                  call.priority === 'MEDIUM' ? 'bg-amber-500 text-black' : 'bg-emerald-900/40 text-emerald-500 border border-emerald-500/20'
                }`}>
                  {call.type}
                </div>
                <div>
                  <h4 className="text-white font-black text-lg italic uppercase leading-none">{call.id} • {call.loc}</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[9px] text-emerald-900 font-black uppercase tracking-widest italic">{call.time} Decorridos</span>
                    <div className="w-1 h-1 bg-emerald-900 rounded-full"></div>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                      call.status === 'Pending' ? 'text-red-500' : 'text-emerald-500'
                    }`}>{call.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {call.assigned.length > 0 ? call.assigned.map(a => (
                    <div key={a} className="w-10 h-10 rounded-full bg-emerald-600 border-2 border-[#020806] flex items-center justify-center text-[10px] font-black text-white italic shadow-xl">{a}</div>
                  )) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-950 border-2 border-[#020806] flex items-center justify-center text-[10px] font-black text-emerald-900 italic">N/A</div>
                  )}
                </div>
                <div className="flex gap-2">
                  {call.status !== 'Completed' && (
                    <>
                      <button 
                        onClick={() => setAssigningCallId(call.id)}
                        className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                          assigningCallId === call.id ? 'bg-emerald-500 text-white animate-pulse' : 'bg-white text-emerald-900 hover:bg-emerald-50'
                        }`}
                      >
                        {assigningCallId === call.id ? 'Selecionar Unidade...' : 'Gerir Unidades'}
                      </button>
                      <button 
                        onClick={() => completeCall(call.id)}
                        className="p-3 bg-emerald-950/40 text-emerald-500 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                      >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status das Unidades */}
        <div className="col-span-12 lg:col-span-4 bg-[#050b09] border border-emerald-900/30 rounded-3xl p-8 shadow-2xl h-fit sticky top-8">
          <h3 className="text-xs font-black text-emerald-900 uppercase tracking-[0.3em] mb-8">ESTADO DO DISPOSITIVO</h3>
          <div className="space-y-4">
            {units.map(u => (
              <div 
                key={u.id} 
                onClick={() => assigningCallId && assignUnit(u.id)}
                className={`p-4 bg-black/40 border rounded-2xl flex items-center justify-between transition-all cursor-pointer group ${
                  assigningCallId ? 'hover:border-emerald-500 hover:bg-emerald-950/20' : 'border-emerald-900/20'
                } ${u.status === 'Busy' && !assigningCallId ? 'opacity-60' : ''}`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white italic">{u.id}</span>
                    <span className="text-[8px] bg-emerald-900/20 text-emerald-600 px-1.5 py-0.5 rounded font-black uppercase tracking-widest">{u.type}</span>
                  </div>
                  <p className="text-[9px] text-emerald-900 font-bold uppercase mt-1 italic">{u.officers}</p>
                </div>
                <div className="text-right">
                   <span className={`text-[8px] font-black uppercase tracking-widest ${
                     u.status === 'Available' ? 'text-emerald-500' : 'text-amber-500'
                   }`}>{u.status}</span>
                   <div className={`w-1.5 h-1.5 rounded-full ml-auto mt-1 ${
                     u.status === 'Available' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                   }`}></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-5 bg-emerald-900/10 border border-emerald-900/30 rounded-2xl text-center">
             <p className="text-[9px] text-emerald-700 font-black uppercase tracking-[0.2em] mb-2 italic">Capacidade de Resposta</p>
             <div className="text-2xl font-black text-emerald-500 italic leading-none">ALFA-1</div>
             <p className="text-[8px] text-emerald-900 font-bold uppercase mt-2">Prontidão Total Detetada</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispatchSection;
