```
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
    data: number[];
    title: string;
    color: string;
}

export const LiveMetricChart: React.FC<Props> = ({ data, title, color }) => {
    const chartData = data.map((val, i) => ({ time: i, value: val }));
    const gradientId = `color - ${ title.replace(/\s+/g, '-') } `;

    return (
        <div className="glass-card p-6 shadow-2xl shadow-black/20 group hover:border-white/10 transition-colors">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">{title}</h3>
                <div className="flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">LIVE</span>
                </div>
            </div>

            <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis dataKey="time" hide />
                        <YAxis
                            stroke="rgba(255,255,255,0.2)"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `${ val } `}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                backdropFilter: 'blur(8px)',
                                fontSize: '12px'
                            }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill={`url(#${ gradientId })`}
                            animationDuration={400}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
