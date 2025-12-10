import { useState, useEffect } from 'react';
import raceService from '../services/raceService';
import pilotService from '../services/pilotService';

const StrategyDashboard = () => {
  const [strategies, setStrategies] = useState([]);
  const [races, setRaces] = useState([]);
  const [pilots, setPilots] = useState([]);
  const [selectedRace, setSelectedRace] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editStrategy, setEditStrategy] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedRace !== 'all') {
      loadStrategiesByRace(selectedRace);
    } else {
      loadAllStrategies();
    }
  }, [selectedRace]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [racesData, pilotsData] = await Promise.all([
        raceService.getAllRaces(),
        pilotService.getAllPilots()
      ]);
      setRaces(racesData.results || racesData);
      setPilots(pilotsData.results || pilotsData);
      await loadAllStrategies();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllStrategies = async () => {
    try {
      const data = await raceService.getAllStrategies();
      setStrategies(data.results || data);
    } catch (error) {
      console.error('Erreur:', error);
      setStrategies([]);
    }
  };

  const loadStrategiesByRace = async (raceId) => {
    try {
      const data = await raceService.getStrategiesByRace(raceId);
      setStrategies(data);
    } catch (error) {
      console.error('Erreur:', error);
      setStrategies([]);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette stratégie ?')) return;
    try {
      await raceService.deleteStrategy(id);
      if (selectedRace !== 'all') {
        loadStrategiesByRace(selectedRace);
      } else {
        loadAllStrategies();
      }
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editStrategy) {
        await raceService.updateStrategy(editStrategy.id, formData);
      } else {
        await raceService.createStrategy(formData);
      }
      if (selectedRace !== 'all') {
        loadStrategiesByRace(selectedRace);
      } else {
        loadAllStrategies();
      }
      setShowModal(false);
      setEditStrategy(null);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde: ' + JSON.stringify(error));
    }
  };

  const stats = {
    total: strategies.length,
    oneStop: strategies.filter(s => s.nombre_pitstops === 1).length,
    twoStops: strategies.filter(s => s.nombre_pitstops === 2).length,
    threeStops: strategies.filter(s => s.nombre_pitstops === 3).length,
    reussi: strategies.filter(s => s.resultat_strategie === 'reussi').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <Header />
        <Filters 
          races={races}
          selectedRace={selectedRace}
          setSelectedRace={setSelectedRace}
          onAdd={() => { setEditStrategy(null); setShowModal(true); }}
        />
        <Stats stats={stats} />
        <StrategyList 
          strategies={strategies}
          onEdit={(strategy) => { setEditStrategy(strategy); setShowModal(true); }}
          onDelete={handleDelete}
        />
      </div>

      {showModal && (
        <StrategyModal
          strategy={editStrategy}
          races={races}
          pilots={pilots}
          onClose={() => { setShowModal(false); setEditStrategy(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const Header = () => (
  <div className="mb-8">
    <button onClick={() => window.location.href = '/races'} className="text-purple-400 hover:text-purple-300 mb-4">
      ← Retour 
    </button>
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-white">
      <h1 className="text-4xl font-black tracking-wider">🎯 STRATÉGIES DE COURSE</h1>
      <p className="text-purple-100 mt-2">Gestion des stratégies de pneus, pitstops et carburant</p>
    </div>
  </div>
);

const Filters = ({ races, selectedRace, setSelectedRace, onAdd }) => (
  <div className="bg-gray-900/90 backdrop-blur-xl border-2 border-purple-500/50 rounded-xl p-6 mb-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <select
        value={selectedRace}
        onChange={(e) => setSelectedRace(e.target.value)}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
      >
        <option value="all">Toutes les courses</option>
        {races.map(r => (
          <option key={r.id} value={r.id}>{r.nom}</option>
        ))}
      </select>

      <div className="md:col-span-2 flex gap-2">
        <button
          onClick={onAdd}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-bold transition-all"
        >
          + Nouvelle Stratégie
        </button>
        <button
          onClick={() => window.location.href = '/races'}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold transition-all"
        >
          🏎️ Courses
        </button>
      </div>
    </div>
  </div>
);

const Stats = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
    <StatCard label="Total" value={stats.total} color="purple" />
    <StatCard label="1 Stop" value={stats.oneStop} color="blue" />
    <StatCard label="2 Stops" value={stats.twoStops} color="yellow" />
    <StatCard label="3 Stops" value={stats.threeStops} color="red" />
    <StatCard label="Réussis" value={stats.reussi} color="green" />
  </div>
);

const StatCard = ({ label, value, color }) => (
  <div className={`bg-gray-900/90 border border-${color}-500/30 rounded-lg p-4`}>
    <p className="text-gray-400 text-sm">{label}</p>
    <p className={`text-3xl font-black text-${color}-500`}>{value}</p>
  </div>
);

const StrategyList = ({ strategies, onEdit, onDelete }) => {
  if (strategies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-xl">Aucune stratégie trouvée</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {strategies.map((strategy) => (
        <StrategyCard 
          key={strategy.id} 
          strategy={strategy}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

const StrategyCard = ({ strategy, onEdit, onDelete }) => {
  const resultatColors = {
    'reussi': 'bg-green-500',
    'partiellement_reussi': 'bg-yellow-500',
    'echec': 'bg-red-500',
    'non_applique': 'bg-gray-500'
  };

  const resultatLabels = {
    'reussi': 'Réussi ✓',
    'partiellement_reussi': 'Partiel',
    'echec': 'Échec ✗',
    'non_applique': 'Non appliqué'
  };

  const pneuIcons = {
    'soft': '🔴',
    'medium': '🟡',
    'hard': '⚪',
    'intermediate': '🟢',
    'wet': '🔵'
  };

  return (
    <div className="bg-gray-900/90 border-2 border-purple-500/30 rounded-xl p-6 hover:border-purple-500 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white font-black text-lg">
            {strategy.pilot_prenom} {strategy.pilot_nom}
          </h3>
          <span className="text-gray-400 text-sm">N°{strategy.pilot_numero}</span>
        </div>
        <span className={`${resultatColors[strategy.resultat_strategie]} text-white px-3 py-1 rounded-full text-xs font-bold`}>
          {resultatLabels[strategy.resultat_strategie]}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-2">Pneumatiques</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{pneuIcons[strategy.pneu_depart]}</span>
            <span className="text-white font-bold text-sm">{strategy.pneu_depart.toUpperCase()}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-gray-400 text-xs">Pitstops</p>
            <p className="text-white font-black text-xl">{strategy.nombre_pitstops}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-gray-400 text-xs">Carburant</p>
            <p className="text-white font-black text-xl">{strategy.consommation_carburant} kg</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-gray-400 text-xs mb-1">Météo prévue</p>
          <p className="text-white font-bold">
            {strategy.meteo_prevue === 'ensoleille' && '☀️ Ensoleillé'}
            {strategy.meteo_prevue === 'nuageux' && '☁️ Nuageux'}
            {strategy.meteo_prevue === 'pluvieux' && '🌧️ Pluvieux'}
            {strategy.meteo_prevue === 'orage' && '⛈️ Orage'}
          </p>
          {strategy.temperature_piste && (
            <p className="text-gray-400 text-sm">🌡️ {strategy.temperature_piste}°C</p>
          )}
        </div>
      </div>

      {strategy.notes && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 mb-4">
          <p className="text-purple-300 text-sm italic">"{strategy.notes}"</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(strategy)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all"
        >
          ✏️ Modifier
        </button>
        <button
          onClick={() => onDelete(strategy.id)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-all"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

const StrategyModal = ({ strategy, races, pilots, onClose, onSave }) => {
  const [form, setForm] = useState({
    race: strategy?.race || '',
    pilot: strategy?.pilot || '',
    pneu_depart: strategy?.pneu_depart || 'soft',
    pneu_stint2: strategy?.pneu_stint2 || '',
    pneu_stint3: strategy?.pneu_stint3 || '',
    pneu_stint4: strategy?.pneu_stint4 || '',
    nombre_pitstops: strategy?.nombre_pitstops || 1,
    tour_pitstop1: strategy?.tour_pitstop1 || '',
    tour_pitstop2: strategy?.tour_pitstop2 || '',
    tour_pitstop3: strategy?.tour_pitstop3 || '',
    consommation_carburant: strategy?.consommation_carburant || '',
    meteo_prevue: strategy?.meteo_prevue || 'ensoleille',
    temperature_piste: strategy?.temperature_piste || '',
    resultat_strategie: strategy?.resultat_strategie || 'non_applique',
    notes: strategy?.notes || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formattedData = {
      ...form,
      race: parseInt(form.race),
      pilot: parseInt(form.pilot),
      nombre_pitstops: parseInt(form.nombre_pitstops),
      tour_pitstop1: form.tour_pitstop1 ? parseInt(form.tour_pitstop1) : null,
      tour_pitstop2: form.tour_pitstop2 ? parseInt(form.tour_pitstop2) : null,
      tour_pitstop3: form.tour_pitstop3 ? parseInt(form.tour_pitstop3) : null,
      consommation_carburant: parseFloat(form.consommation_carburant),
      temperature_piste: form.temperature_piste ? parseFloat(form.temperature_piste) : null,
      pneu_stint2: form.pneu_stint2 || null,
      pneu_stint3: form.pneu_stint3 || null,
      pneu_stint4: form.pneu_stint4 || null,
      notes: form.notes || null,
    };

    onSave(formattedData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-purple-500 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-purple-600 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-black text-white">
            {strategy ? '✏️ Modifier' : '➕ Nouvelle'} Stratégie
          </h2>
          <button onClick={onClose} className="text-white text-3xl">×</button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2 font-bold">Course *</label>
              <select
                value={form.race}
                onChange={(e) => setForm({...form, race: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
                required
              >
                <option value="">Sélectionner une course</option>
                {races.map(r => (
                  <option key={r.id} value={r.id}>{r.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white mb-2 font-bold">Pilote *</label>
              <select
                value={form.pilot}
                onChange={(e) => setForm({...form, pilot: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
                required
              >
                <option value="">Sélectionner un pilote</option>
                {pilots.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.prenom} {p.nom} (N°{p.numero})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white mb-2 font-bold">Pneu de départ *</label>
              <select
                value={form.pneu_depart}
                onChange={(e) => setForm({...form, pneu_depart: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
              >
                <option value="soft">🔴 Soft (Tendre)</option>
                <option value="medium">🟡 Medium (Moyen)</option>
                <option value="hard">⚪ Hard (Dur)</option>
                <option value="intermediate">🟢 Intermédiaire</option>
                <option value="wet">🔵 Pluie</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2 font-bold">Nombre de pitstops *</label>
              <input
                type="number"
                min="1"
                max="3"
                value={form.nombre_pitstops}
                onChange={(e) => setForm({...form, nombre_pitstops: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-bold">Consommation carburant (kg) *</label>
              <input
                type="number"
                step="0.01"
                value={form.consommation_carburant}
                onChange={(e) => setForm({...form, consommation_carburant: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-bold">Météo prévue *</label>
              <select
                value={form.meteo_prevue}
                onChange={(e) => setForm({...form, meteo_prevue: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
              >
                <option value="ensoleille">☀️ Ensoleillé</option>
                <option value="nuageux">☁️ Nuageux</option>
                <option value="pluvieux">🌧️ Pluvieux</option>
                <option value="orage">⛈️ Orage</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2 font-bold">Température piste (°C)</label>
              <input
                type="number"
                step="0.1"
                value={form.temperature_piste}
                onChange={(e) => setForm({...form, temperature_piste: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
              />
            </div>

            <div>
              <label className="block text-white mb-2 font-bold">Résultat</label>
              <select
                value={form.resultat_strategie}
                onChange={(e) => setForm({...form, resultat_strategie: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
              >
                <option value="non_applique">Non appliqué</option>
                <option value="reussi">✓ Réussi</option>
                <option value="partiellement_reussi">~ Partiellement réussi</option>
                <option value="echec">✗ Échec</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-white mb-2 font-bold">Notes</label>
              <textarea
                rows="3"
                value={form.notes}
                onChange={(e) => setForm({...form, notes: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
                placeholder="Notes sur la stratégie..."
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={handleSubmit} 
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold"
            >
              💾 Enregistrer
            </button>
            <button 
              onClick={onClose} 
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold"
            >
              ✖️ Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyDashboard;