import { useState, useEffect } from "react";
import { Chart as ChartJS, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function RevenueChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/chart-data/revenue-data');
        const data = await response.json();

        const formattedLabels = data.labels.map(date =>
          new Date(date).toLocaleDateString("id-ID", { day: '2-digit', month: 'short' })
        );

        const values = data.data.map(d => parseFloat(d));

        setChartData({
          labels: formattedLabels,
          datasets: [
            {
              type: 'bar',
              label: 'Purchase',
              data: values,
              backgroundColor: 'rgba(168, 51, 255, 0.2)',
              borderRadius: 8,
              borderSkipped: false,
              barThickness: 24
            },
            {
              type: 'line',
              label: 'Trend',
              data: values,
              borderColor: '#a833ff',
              backgroundColor: '#a833ff',
              tension: 0.3,
              fill: false,
              pointBackgroundColor: '#a833ff',
              pointRadius: 3,
              pointHoverRadius: 6,
              borderWidth: 2
            }
          ]
        });
      } catch (error) {
        console.error('Failed to fetch revenue chart data:', error);
      }
    };
    fetchData();
  }, []);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        borderColor: "#ddd",
        borderWidth: 1,
        titleColor: "#333",
        bodyColor: "#333",
        callbacks: {
          label: ctx => `Rp ${ctx.raw.toLocaleString("id-ID")}`
        }
      }
    },
    scales: {
      x: {
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { color: "#444", font: { size: 11 } }
      },
      y: {
        grid: { color: "rgba(0,0,0,0.05)" },
        ticks: { color: "#444", font: { size: 11 } }
      }
    }
  };

  return (
    <div style={{
      background: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
      padding: "20px",
      height: "320px"
    }}>
      <h6 style={{
        color: "#4b0082",
        fontWeight: "600",
        fontSize: "14px",
        marginBottom: "12px",
        textAlign: "center",
        letterSpacing: "0.5px"
      }}>
        Grafik Pembelian (Purchasing Activity)
      </h6>
      {chartData ? (
        <Chart type='bar' data={chartData} options={options} />
      ) : (
        <p style={{
          color: '#999',
          textAlign: 'center',
          marginTop: '120px',
          fontSize: "13px"
        }}>
          Memuat data pembelian...
        </p>
      )}
    </div>
  );
}
