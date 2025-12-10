import { useState, useEffect } from 'react';
import incidentService from '../services/incidentService';
import raceService from '../services/raceService';  // ✅ Importer ton service races
import PilotRiskChart from '../components/incidents/PilotRiskChart';
import CircuitRiskRadar from '../components/incidents/CircuitRiskRadar';
import StrategyCard from '../components/incidents/StrategyCard';

const IncidentDashboard = () => {
  const [predictions, setPredictions] = useState(null);
  const [races, setRaces] = useState([]);  // ✅ Stocker TES courses
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);

  // ✅ Charger TES courses au montage
  useEffect(() => {
    loadRaces();
  }, []);

  // ✅ Charger les prédictions quand une course est sélectionnée
  useEffect(() => {
    if (selectedRace) {
      loadPredictions(selectedRace);
    }
  }, [selectedRace]);

  const loadRaces = async () => {
    try {
      const data = await raceService.getAllRaces();  // ✅ Utiliser TON service
      setRaces(data);
      
      // Auto-sélectionner la première course
      if (data && data.length > 0) {
        setSelectedRace(data[0].id);
      }
    } catch (err) {
      console.error('Erreur chargement courses:', err);
    }
  };

  const loadPredictions = async (raceId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await incidentService.predictRaceIncidents(raceId);
      setPredictions(data);
    } catch (err) {
      setError('Erreur lors du chargement: ' + err.message);
      console.error('Erreur API:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-white mb-3 tracking-tight">
            🏎️ F1 Incident Predictor
          </h1>
          <p className="text-xl text-gray-300">
            Intelligence Artificielle pour la Prédiction d'Incidents
          </p>
        </div>

        {/* SÉLECTEUR DE COURSE - AVEC TES VRAIES COURSES */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/20">
          <label className="block text-white font-bold mb-3 text-lg">
            Sélectionner une course :
          </label>
          <select
            value={selectedRace || ''}
            onChange={(e) => setSelectedRace(Number(e.target.value))}
            className="w-full md:w-96 px-4 py-3 bg-white/90 border-2 border-gray-300 rounded-lg text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          >
            <option value="">-- Choisir une course --</option>
            {races.map(race => (
              <option key={race.id} value={race.id}>
                {race.name} - {race.season?.year} ({race.circuit?.name})
              </option>
            ))}
          </select>
          
          {races.length === 0 && (
            <p className="mt-3 text-yellow-300 text-sm">
              ⚠️ Aucune course trouvée. Créez d'abord des courses dans le dashboard "Courses".
            </p>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-white text-xl font-semibold animate-pulse">
              🔄 Analyse en cours...
            </p>
          </div>
        )}

        {/* ERREUR */}
        {error && !loading && (
          <div className="bg-red-500/20 border-2 border-red-500 text-red-200 px-6 py-4 rounded-xl mb-6 backdrop-blur-sm">
            <p className="font-bold text-lg">❌ {error}</p>
          </div>
        )}

        {/* RÉSULTATS */}
        {predictions && !loading && (
          <div className="space-y-8">
            
            {/* STATISTIQUES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-xl p-6 shadow-2xl transform hover:scale-105 transition-transform">
                <div className="text-5xl font-black text-white">
                  {predictions.statistics.critical_count}
                </div>
                <div className="text-white/90 text-sm font-semibold mt-2 uppercase tracking-wide">
                  🔴 Critiques
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl p-6 shadow-2xl transform hover:scale-105 transition-transform">
                <div className="text-5xl font-black text-white">
                  {predictions.statistics.high_count}
                </div>
                <div className="text-white/90 text-sm font-semibold mt-2 uppercase tracking-wide">
                  🟠 Élevés
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-xl p-6 shadow-2xl transform hover:scale-105 transition-transform">
                <div className="text-5xl font-black text-white">
                  {predictions.statistics.moderate_count}
                </div>
                <div className="text-white/90 text-sm font-semibold mt-2 uppercase tracking-wide">
                  🟡 Modérés
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-6 shadow-2xl transform hover:scale-105 transition-transform">
                <div className="text-5xl font-black text-white">
                  {predictions.statistics.low_count}
                </div>
                <div className="text-white/90 text-sm font-semibold mt-2 uppercase tracking-wide">
                  🟢 Faibles
                </div>
              </div>
            </div>

            {/* GRAPHIQUES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PilotRiskChart data={predictions.predictions} />
              <CircuitRiskRadar data={predictions.predictions} />
            </div>

            {/* RECOMMANDATIONS */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-3xl font-black text-white mb-6">
                💡 Recommandations Stratégiques
              </h2>
              
              {predictions.predictions.filter(p => p.risk_level !== 'LOW').length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-lg">
                  ✅ Tous les pilotes sont en situation stable
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {predictions.predictions
                    .filter(p => p.risk_level !== 'LOW')
                    .slice(0, 9)
                    .map(pilot => (
                      <StrategyCard key={pilot.pilot_id} pilot={pilot} />
                    ))}
                </div>
              )}
            </div>

            {/* INFO MODÈLE */}
            {predictions.model_info && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-emerald-300 text-sm text-center">
                  <span className="font-bold">Mode: {predictions.model_info.mode}</span>
                  {predictions.model_info.version && (
                    <span className="ml-4">| Version: {predictions.model_info.version}</span>
                  )}
                </p>
              </div>
            )}

          </div>
        )}

        {/* MESSAGE INITIAL */}
        {!predictions && !loading && !error && races.length > 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏁</div>
            <p className="text-white text-2xl font-bold mb-2">
              Sélectionnez une course pour commencer
            </p>
            <p className="text-gray-400">
              L'analyse IA sera effectuée automatiquement
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default IncidentDashboard;