import React, { useEffect } from 'react';
import axios from 'axios';
import { useMetricsStore, useAuthStore } from '../store';
import { useMetricsWS } from '../hooks/useMetricsWS';
import { LiveMetricChart } from '../components/LiveMetricChart';
import { IncidentList } from '../components/IncidentList';
import { Activity, Server, Zap, LogOut, Shield, Wifi } from 'lucide-react';

const Dashboard: React.FC = () => {
    useMetricsWS();
    const { metrics, incidents, setIncidents } = useMetricsStore();
    const { user, logout, token } = useAuthStore();

    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/incidents/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIncidents(res.data);
            } catch (err) {
                console.error("Failed to fetch incidents:", err);
            }
        };

        fetchIncidents();
        const interval = setInterval(fetchIncidents, 30000); // Poll every 30s as fallback
        return () => clearInterval(interval);
    }, [token, setIncidents]);

    const handleEscalate = async (id: number) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/incidents/${id}/escalate`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refresh list
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/incidents/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIncidents(res.data);
        } catch (err) {
            console.error("Failed to escalate incident:", err);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-indigo-500/30">
            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4 mb-8">
                <div className="max-w-[1600px] mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                            <Zap className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                Antigravity Command Center
                            </h1>
                            <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-medium tracking-widest uppercase">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </span>
                                Live System Monitor
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                            <Wifi size={14} className="text-green-500 animate-pulse" />
                            <span className="text-xs font-medium text-slate-400">Cloud Node: US-East-1</span>
                        </div>

                        <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-white">{user?.username || 'Admin'}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user?.role || 'Administrator'}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="p-2.5 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl transition-all text-slate-400 hover:text-red-400 group"
                                title="Sign Out"
                            >
                                <LogOut size={20} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-6 pb-12 space-y-8">
                {/* Hero Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'System Health', value: '99.98%', sub: 'SLA Status', color: 'text-green-400', icon: Shield },
                        { label: 'P95 Latency', value: '124ms', sub: 'Stable', color: 'text-blue-400', icon: Activity },
                        { label: 'Error Rate', value: '0.04%', sub: '+0.01% / 24h', color: 'text-red-400', icon: Server },
                        { label: 'Active Alerts', value: incidents.filter(i => i.status === 'active').length.toString(), sub: 'Live Count', color: 'text-indigo-400', icon: Zap },
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-6 group hover:border-white/20 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                                <stat.icon size={16} className="text-slate-600 group-hover:text-white transition-colors" />
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-3xl font-bold tracking-tight ${stat.color}`}>{stat.value}</span>
                                <span className="text-xs text-slate-600 font-medium">{stat.sub}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-12 gap-8">
                    {/* Left Column: Charts */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <LiveMetricChart
                                    data={metrics.request_latency || []}
                                    title="Real-time Latency (ms)"
                                    color="#6366f1"
                                />
                            </div>
                            <div className="space-y-4">
                                <LiveMetricChart
                                    data={metrics.cpu_usage || []}
                                    title="Core Load (%)"
                                    color="#a855f7"
                                />
                            </div>
                        </div>

                        <IncidentList
                            incidents={incidents}
                            isAdmin={user?.role === 'admin'}
                            onEscalate={handleEscalate}
                        />
                    </div>

                    {/* Right Column: Status & Feed */}
                    <div className="col-span-12 lg:col-span-4 space-y-8">
                        <div className="glass-card p-6 border-white/5">
                            <h3 className="text-white font-semibold mb-6 flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                    <Activity size={18} className="text-indigo-400" />
                                </div>
                                Infrastructure Nodes
                            </h3>
                            <div className="space-y-4">
                                {['API Gateway', 'User Service', 'Orders DB', 'Kafka Cluster', 'Redis Main'].map(svc => (
                                    <div key={svc} className="flex justify-between items-center group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1 h-3 bg-indigo-500/20 rounded-full group-hover:bg-indigo-500 transition-colors" />
                                            <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">{svc}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-green-500/60 font-medium uppercase tracking-tighter">Operational</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)] animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card p-6 bg-gradient-to-br from-indigo-600/10 to-transparent">
                            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">System Broadcast</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                {incidents.length > 0
                                    ? `Alert: ${incidents[0].title} is active. Response team notified.`
                                    : "All cloud regions report nominal performance. Kafka throughput is stable at 240k eps."
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
