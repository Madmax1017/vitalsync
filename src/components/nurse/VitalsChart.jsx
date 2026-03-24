import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const hrData = [
    { t: '6AM', v: 72 }, { t: '7AM', v: 78 }, { t: '8AM', v: 85 },
    { t: '9AM', v: 80 }, { t: '10AM', v: 76 }, { t: '11AM', v: 82 },
    { t: '12PM', v: 74 },
];

const bpData = [
    { t: '6AM', v: 120 }, { t: '7AM', v: 125 }, { t: '8AM', v: 130 },
    { t: '9AM', v: 128 }, { t: '10AM', v: 122 }, { t: '11AM', v: 126 },
    { t: '12PM', v: 118 },
];

const tempData = [
    { t: '6AM', v: 98.2 }, { t: '7AM', v: 98.4 }, { t: '8AM', v: 99.1 },
    { t: '9AM', v: 98.8 }, { t: '10AM', v: 98.6 }, { t: '11AM', v: 98.9 },
    { t: '12PM', v: 98.4 },
];

const ChartTooltip = ({ active, payload, label }) => {
    if (active && payload?.[0]) {
        return (
            <div className="glass-strong rounded-lg px-2.5 py-1.5 shadow-lg border border-white/30 text-[10px]">
                <p className="font-bold text-[#1e1b32]">{label}</p>
                <p className="font-semibold" style={{ color: payload[0].color }}>{payload[0].value}</p>
            </div>
        );
    }
    return null;
};

const MiniChart = ({ title, data, color, unit }) => (
    <div className="p-4 rounded-xl bg-white/30 border border-white/20 transition-all duration-300 hover:bg-white/50 hover:shadow-sm">
        <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#1e1b32]">{title}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/50 text-[#6b6490]">{data[data.length - 1].v}{unit}</span>
        </div>
        <ResponsiveContainer width="100%" height={80}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.05)" />
                <XAxis dataKey="t" hide />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

export default function VitalsChart() {
    return (
        <div className="p-5 rounded-2xl glass">
            <h3 className="text-[15px] font-extrabold text-[#1e1b32] tracking-tight mb-4">Vitals Monitoring</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <MiniChart title="Heart Rate" data={hrData} color="#f43f5e" unit=" bpm" />
                <MiniChart title="Blood Pressure" data={bpData} color="#8b5cf6" unit=" mmHg" />
                <MiniChart title="Temperature" data={tempData} color="#f59e0b" unit="°F" />
            </div>
        </div>
    );
}
