const CircuitRiskRadar = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-gray-500">Aucune donnée disponible</div>;
  }

  // Simuler des données circuit (à adapter selon tes besoins)
  const circuitData = {
    name: 'Monaco',
    risks: {
      collision: 0.35,
      panne_moteur: 0.15,
      probleme_pneus: 0.28,
      sortie_piste: 0.22
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">🗺️ Profil de Risque du Circuit</h3>
      <div className="text-center py-4">
        <p className="text-2xl font-bold text-gray-800">{circuitData.name}</p>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">🔴 Collision:</span>
            <span className="font-bold">{(circuitData.risks.collision * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">⚙️ Panne Moteur:</span>
            <span className="font-bold">{(circuitData.risks.panne_moteur * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">🛞 Pneus:</span>
            <span className="font-bold">{(circuitData.risks.probleme_pneus * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">💨 Sortie Piste:</span>
            <span className="font-bold">{(circuitData.risks.sortie_piste * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircuitRiskRadar;