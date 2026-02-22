import React from 'react';
import { AlertCircle, Clock, ShieldAlert, ChevronRight, Activity } from 'lucide-react';

interface Incident {
    id: number;
    title: string;
    status: 'active' | 'investigating' | 'mitigated' | 'resolved';
    severity: 'P0' | 'P1' | 'P2' | 'P3';
    created_at: string;
}

interface Props {
    incidents: Incident[];
    onEscalate?: (id: number) => void;
    isAdmin: boolean;
}

export const IncidentList: React.FC<Props> = ({ incidents, onEscalate, isAdmin }) => {
    return (
        <div className="glass-card shadow-xl border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                        <ShieldAlert className="text-red-500 w-5 h-5" />
                    </div>
                    <h3 className="text-white font-bold tracking-tight">Active Critical Incidents</h3>
                </div>
                <span className="px-2.5 py-1 bg-white/5 rounded-md text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-white/5">
                    {incidents.length} Total
                </span>
            </div>

            <div className="divide-y divide-white/5">
                {incidents.map((incident) => (
                    <div key={incident.id} className="p-5 hover:bg-white/[0.02] transition-colors flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                            <div className={`w-1 h-12 rounded-full ${incident.severity === 'P0' ? 'bg-red-500' : 'bg-orange-500'}`} />
                            <div>
                                <div className="flex items-center gap-3 mb-1.5">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter ${incident.severity === 'P0' ? 'bg-red-500 text-white' :
                                        'bg-orange-500/20 text-orange-500 border border-orange-500/20'
                                        }`}>
                                        {incident.severity}
                                    </span>
                                    <h4 className="text-slate-100 font-semibold text-lg leading-none">{incident.title}</h4>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(incident.created_at).toLocaleTimeString()}
                                    </div>
                                    <div className="flex items-center gap-1.5 uppercase font-bold text-[10px] tracking-widest">
                                        <div className={`w-1.5 h-1.5 rounded-full ${incident.status === 'active' ? 'bg-red-500 pulse' : 'bg-blue-500'}`} />
                                        {incident.status}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {isAdmin && incident.severity !== 'P0' && (
                                <button
                                    onClick={() => onEscalate?.(incident.id)}
                                    className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all font-bold shadow-lg shadow-indigo-500/20 border border-indigo-400/20"
                                >
                                    Escalate Incident
                                </button>
                            )}
                            <ChevronRight size={18} className="text-slate-700 group-hover:text-slate-400 transition-colors" />
                        </div>
                    </div>
                ))}

                {incidents.length === 0 && (
                    <div className="p-12 text-center group">
                        <div className="mb-4 inline-flex p-4 bg-green-500/10 rounded-full group-hover:bg-green-500/20 transition-colors">
                            <Activity className="text-green-500 w-8 h-8" />
                        </div>
                        <h4 className="text-white font-semibold mb-1">Systems Nominal</h4>
                        <p className="text-slate-500 text-sm max-w-[240px] mx-auto">
                            No active incidents detected. All service mesh nodes reporting healthy state.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
