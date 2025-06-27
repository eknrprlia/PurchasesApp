import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Filler, Tooltip, Legend);

export default function SalesChart() {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/chart-data/sales-data');
                const data = await response.json();

                const formattedLabels = data.labels.map(date =>
                    new Date(date).toLocaleDateString("id-ID", { day: '2-digit', month: 'short' })
                );

                setChartData({
                    labels: formattedLabels,
                    datasets: [{
                        label: "Penjualan (Rp)",
                        data: data.data.map(d => parseFloat(d)),
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2.5,
                        borderColor: "#8e44ad",
                        backgroundColor: function(context) {
                            const chart = context.chart;
                            const { ctx, chartArea } = chart;
                            if (!chartArea) return null;

                            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                            gradient.addColorStop(0, 'rgba(142, 68, 173, 0.25)');
                            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                            return gradient;
                        },
                        pointBackgroundColor: "#8e44ad",
                        pointRadius: 3.5,
                        pointHoverRadius: 6,
                    }]
                });
            } catch (error) {
                console.error('Failed to fetch sales chart data:', error);
            }
        };
        fetchData();
    }, []);

    const options = {
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: ctx => `Rp ${ctx.parsed.y.toLocaleString("id-ID")}`,
                },
                backgroundColor: "#ffffff",
                titleColor: "#333",
                bodyColor: "#444",
                borderColor: "#ccc",
                borderWidth: 1,
                padding: 10,
                cornerRadius: 6,
            },
            legend: { display: false }
        },
        scales: {
            x: {
                grid: { color: "rgba(0,0,0,0.04)" },
                ticks: { color: "#555", font: { size: 11 } }
            },
            y: {
                grid: { color: "rgba(0,0,0,0.04)" },
                ticks: { color: "#555", font: { size: 11 } }
            },
        },
    };

    return (
        <div style={{
            background: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            padding: "20px",
            height: "320px",
            color: "#333"
        }}>
            <h6 style={{
                color: "#5d3a8e",
                fontWeight: "600",
                fontSize: "14px",
                marginBottom: "12px",
                textAlign: "center",
                letterSpacing: "0.5px"
            }}>
                Grafik Penjualan (Sales Performance)
            </h6>
            {chartData ? (
                <Line data={chartData} options={options} />
            ) : (
                <p style={{
                    color: '#888',
                    textAlign: 'center',
                    marginTop: '120px',
                    fontSize: "13px"
                }}>
                    Memuat data penjualan...
                </p>
            )}
        </div>
    );
}
