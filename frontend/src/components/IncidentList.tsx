import React from 'react';
import { AlertCircle, Clock, ShieldAlert } from 'lucide-react';

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
        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-slate-200 font-semibold flex items-center gap-2">
                    <ShieldAlert className="text-red-500 w-5 h-5" />
                    Active Incidents
                </h3>
            </div>
            <div className="divide-y divide-slate-800">
                {incidents.map((incident) => (
                    <div key={incident.id} className="p-4 hover:bg-slate-800/50 transition-colors flex justify-between items-center">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${incident.severity === 'P0' ? 'bg-red-500/20 text-red-500 border border-red-500/50' :
                                        'bg-orange-500/20 text-orange-500 border border-orange-500/50'
                                    }`}>
                                    {incident.severity}
                                </span>
                                <h4 className="text-slate-200 font-medium">{incident.title}</h4>
                            </div>
                            <p className="text-slate-500 text-xs flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(incident.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${incident.status === 'active' ? 'text-red-400 bg-red-400/10' : 'text-blue-400 bg-blue-400/10'
                                }`}>
                                {incident.status}
                            </span>
                            {isAdmin && incident.severity !== 'P0' && (
                                <button
                                    onClick={() => onEscalate?.(incident.id)}
                                    className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-all font-medium"
                                >
                                    Escalate
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {incidents.length === 0 && (
                    <div className="p-8 text-center text-slate-500 text-sm">
                        All systems operational. No active incidents.
                    </div>
                )}
            </div>
        </div>
    );
};
