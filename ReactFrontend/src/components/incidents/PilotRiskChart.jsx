import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PilotRiskChart = ({ data }) => {
  // Trier par risque décroissant
  const sortedData = [...data].sort((a, b) => 
    b.risks.risque_total - a.risks.risque_total
  ).slice(0, 15);

  const chartData = {
    labels: sortedData.map(p => p.pilot_code),
    datasets: [
      {
        label: 'Collision',
        data: sortedData.map(p => (p.risks.collision * 100).toFixed(1)),
        backgroundColor: '#FF4444',
      },
      {
        label: 'Panne Moteur',
        data: sortedData.map(p => (p.risks.panne_moteur * 100).toFixed(1)),
        backgroundColor: '#FF9944',
      },
      {
        label: 'Pneus',
        data: sortedData.map(p => (p.risks.probleme_pneus * 100).toFixed(1)),
        backgroundColor: '#FFDD44',
      },
      {
        label: 'Sortie Piste',
        data: sortedData.map(p => (p.risks.sortie_piste * 100).toFixed(1)),
        backgroundColor: '#44DDFF',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '🏎️ Probabilité d\'Incidents par Pilote (Top 15)',
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        title: { display: true, text: 'Pilote' }
      },
      y: {
        stacked: true,
        title: { display: true, text: 'Probabilité (%)' },
        max: 100
      },
    },
  };

  return (
    <div className="pilot-risk-chart" style={{ height: '400px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PilotRiskChart;