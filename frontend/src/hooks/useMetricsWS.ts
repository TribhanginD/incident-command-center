import { useEffect } from 'react';
import { useMetricsStore } from '../store';

export const useMetricsWS = () => {
    const addMetric = useMetricsStore((state) => state.addMetric);

    useEffect(() => {
        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/metrics';
        const ws = new WebSocket(wsUrl);

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                addMetric(data.name, data.value);
            } catch (err) {
                console.error('WS Error:', err);
            }
        };

        return () => ws.close();
    }, [addMetric]);
};
