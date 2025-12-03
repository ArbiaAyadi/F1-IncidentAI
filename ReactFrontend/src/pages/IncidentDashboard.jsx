import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import incidentService from '../services/incidentService';
import raceService from '../services/raceService';
import PilotRiskChart from '../components/incidents/PilotRiskChart';
import CircuitRiskRadar from '../components/incidents/CircuitRiskRadar';
import StrategyCard from '../components/incidents/StrategyCard';

const IncidentDashboard = () => {
  const [searchParams] = useSearchParams();
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les courses au montage
  useEffect(() => {
    loadRaces();
  }, []);

  // Si race_id dans l'URL, charger directement
  useEffect(() => {
    const raceId = searchParams.get('race');
    if (raceId && races.length > 0) {
      const race = races.find(r => r.id === parseInt(raceId));
      if (race) {
        setSelectedRace(race);
        loadPredictions(race.id);
      }
    }
  }, [searchParams, races]);

  const loadRaces = async () => {
    try {
      const data = await raceService.getAllRaces();
      setRaces(data);
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
      setError('Erreur lors de la prédiction: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRaceChange = (e) => {
    const raceId = parseInt(e.target.value);
    const race = races.find(r => r.id === raceId);
    setSelectedRace(race);
    if (race) {
      loadPredictions(race.id);
    }
  };

  return (
    <div className="incident-predictor-page">
      <header className="page-header">
        <h1>🏎️ F1 Incident Predictor</h1>
        <p>Intelligence Artificielle pour la Prédiction d'Incidents</p>
      </header>

      {/* Sélecteur de course */}
      <div className="race-selector">
        <label htmlFor="race-select">Sélectionner une course :</label>
        <select 
          id="race-select"
          value={selectedRace?.id || ''} 
          onChange={handleRaceChange}
        >
          <option value="">-- Choisir une course --</option>
          {races.map(race => (
            <option key={race.id} value={race.id}>
              {race.name} - {race.season?.year} ({race.circuit?.name})
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">
          <p>🔄 Analyse en cours...</p>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="error">
          <p>❌ {error}</p>
        </div>
      )}

      {/* Résultats */}
      {predictions && !loading && (
        <div className="predictions-container">
          {/* Statistiques globales */}
          <div className="stats-summary">
            <h2>📊 Statistiques de la Course</h2>
            <div className="stats-grid">
              <div className="stat-card critical">
                <span className="stat-value">{predictions.statistics.critical_count}</span>
                <span className="stat-label">Critiques</span>
              </div>
              <div className="stat-card high">
                <span className="stat-value">{predictions.statistics.high_count}</span>
                <span className="stat-label">Élevés</span>
              </div>
              <div className="stat-card moderate">
                <span className="stat-value">{predictions.statistics.moderate_count}</span>
                <span className="stat-label">Modérés</span>
              </div>
              <div className="stat-card low">
                <span className="stat-value">{predictions.statistics.low_count}</span>
                <span className="stat-label">Faibles</span>
              </div>
            </div>
          </div>

          {/* Graphiques */}
          <div className="charts-container">
            <PilotRiskChart data={predictions.predictions} />
            <CircuitRiskRadar data={predictions.predictions} />
          </div>

          {/* Recommandations */}
          <div className="recommendations">
            <h2>💡 Recommandations Stratégiques</h2>
            <div className="strategy-cards">
              {predictions.predictions
                .filter(p => p.risk_level !== 'LOW')
                .map(pilot => (
                  <StrategyCard key={pilot.pilot_id} pilot={pilot} />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentDashboard;