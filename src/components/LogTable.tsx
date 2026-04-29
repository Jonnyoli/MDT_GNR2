
import React, { useState } from 'react';
import { LogEntry, LogType } from '../types';

interface LogTableProps {
  logs: LogEntry[];
}

const LogTable: React.FC<LogTableProps> = ({ logs }) => {
  const [filterType, setFilterType] = useState<LogType | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Table Controls */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900">Registos do Firestore</h2>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
            <input
              type="text"
              placeholder="Procurar utilizador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <button 
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${filterType === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFilterType('ponto')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${filterType === 'ponto' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Pontos
            </button>
            <button 
              onClick={() => setFilterType('patrulha')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${filterType === 'patrulha' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Patrulhas
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Utilizador</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Duração</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">ID Doc</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                      {log.userName.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{log.userName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    log.type === 'ponto' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {log.type === 'ponto' ? 'Ponto' : 'Patrulha'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {log.durationMinutes ? `${Math.floor(log.durationMinutes / 60)}h ${Math.round(log.durationMinutes % 60)}m` : '---'}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{log.date}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${log.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                    <span className="text-xs text-slate-600 capitalize">{log.status === 'active' ? 'Em curso' : 'Concluído'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right text-[10px] text-slate-300 font-mono">
                  {log.id.slice(0, 8)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLogs.length === 0 && (
        <div className="p-12 text-center">
          <div className="mx-auto w-12 h-12 text-slate-300 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-slate-500 font-medium">Nenhum registo encontrado no Firestore</p>
        </div>
      )}
    </div>
  );
};

export default LogTable;
