import React from 'react';
import { useMetricsStore, useAuthStore } from '../store';
import { useMetricsWS } from '../hooks/useMetricsWS';
import { LiveMetricChart } from '../components/LiveMetricChart';
import { IncidentList } from '../components/IncidentList';
import { Activity, Server, Zap, LogOut } from 'lucide-react';

const Dashboard: React.FC = () => {
    useMetricsWS();
    const metrics = useMetricsStore((state) => state.metrics);
    const { user, logout } = useAuthStore();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
            {/* Header */}
            <header className="max-w-7xl mx-auto flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <Zap className="text-white w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Antigravity Command <span className="text-slate-500 font-normal">Center</span></h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-medium">{user?.username || 'Admin'}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user?.role || 'Administrator'}</p>
                    </div>
                    <button onClick={logout} className="p-2 hover:bg-slate-900 rounded-full transition-colors text-slate-500 hover:text-red-400">
                        <LogOut size={18} />
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <p className="text-slate-500 text-xs font-semibold uppercase mb-1">System Health</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-green-400">99.98%</span>
                            <span className="text-xs text-slate-600">SLA</span>
                        </div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <p className="text-slate-500 text-xs font-semibold uppercase mb-1">P95 Latency</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-blue-400">124ms</span>
                            <span className="text-xs text-slate-600">stable</span>
                        </div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Error Rate</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-red-400">0.04%</span>
                            <span className="text-xs text-slate-600">+0.01%</span>
                        </div>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                        <p className="text-slate-500 text-xs font-semibold uppercase mb-1">Active Alerts</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-indigo-400">0</span>
                            <span className="text-xs text-slate-600">critical</span>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LiveMetricChart
                        data={metrics.request_latency || []}
                        title="Request Latency (ms)"
                        color="#3b82f6"
                    />
                    <LiveMetricChart
                        data={metrics.cpu_usage || []}
                        title="CPU Load (%)"
                        color="#8b5cf6"
                    />
                </div>

                {/* Incidents Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <IncidentList
                            incidents={[]}
                            isAdmin={user?.role === 'admin'}
                            onEscalate={(id) => console.log('Escalate', id)}
                        />
                    </div>
                    <div className="space-y-6">
                        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                            <h3 className="text-slate-200 font-semibold mb-4 flex items-center gap-2">
                                <Activity size={18} className="text-indigo-500" />
                                Service Status
                            </h3>
                            <div className="space-y-3">
                                {['API Gateway', 'User Service', 'Orders DB', 'Kafka Cluster', 'Redis Main'].map(svc => (
                                    <div key={svc} className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400">{svc}</span>
                                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
