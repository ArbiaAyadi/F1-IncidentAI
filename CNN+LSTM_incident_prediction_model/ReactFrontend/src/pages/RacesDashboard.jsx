import { useState, useEffect } from 'react';
import raceService from '../services/raceService';
import circuitService from '../services/circuitService';
import pilotService from '../services/pilotService';

const RacesDashboard = () => {
  const [races, setRaces] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [circuits, setCircuits] = useState([]);
  const [pilots, setPilots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [editRace, setEditRace] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [racesData, seasonsData, circuitsData, pilotsData] = await Promise.all([
        raceService.getAllRaces(),
        raceService.getAllSeasons(),
        circuitService.getAllCircuits(),
        pilotService.getAllPilots()
      ]);
      setRaces(racesData.results || racesData);
      setSeasons(seasonsData.results || seasonsData);
      setCircuits(circuitsData.results || circuitsData);
      setPilots(pilotsData.results || pilotsData);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette course ?')) return;
    try {
      await raceService.deleteRace(id);
      loadData();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editRace) {
        await raceService.updateRace(editRace.id, formData);
      } else {
        await raceService.createRace(formData);
      }
      loadData();
      setShowModal(false);
      setEditRace(null);
    } catch (error) {
      console.error('Erreur détaillée:', error);
      alert('Erreur lors de la sauvegarde: ' + (error.message || JSON.stringify(error)));
    }
  };

  const handleSaveSeason = async (year) => {
    try {
      console.log('Création saison:', year);
      const response = await raceService.createSeason({ annee: parseInt(year), actif: false });
      console.log('Réponse:', response);
      loadData();
      setShowSeasonModal(false);
    } catch (error) {
      console.error('Erreur complète:', error);
      alert('Erreur lors de la création de la saison: ' + JSON.stringify(error));
    }
  };

  const filteredRaces = selectedSeason === 'all' 
    ? races 
    : races.filter(r => r.season === parseInt(selectedSeason));

  const stats = {
    total: races.length,
    planifies: races.filter(r => r.statut === 'planifie').length,
    termines: races.filter(r => r.statut === 'termine').length,
    enCours: races.filter(r => r.statut === 'en_cours').length
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
          seasons={seasons}
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
          onAdd={() => { setEditRace(null); setShowModal(true); }}
          onAddSeason={() => setShowSeasonModal(true)}
        />
        <Stats stats={stats} />
        <RaceList 
          races={filteredRaces}
          onEdit={(race) => { setEditRace(race); setShowModal(true); }}
          onDelete={handleDelete}
          onViewResults={(race) => { setSelectedRace(race); setShowResultModal(true); }}
        />
      </div>

      {showModal && (
        <RaceModal
          race={editRace}
          seasons={seasons}
          circuits={circuits}
          onClose={() => { setShowModal(false); setEditRace(null); }}
          onSave={handleSave}
        />
      )}

      {showResultModal && selectedRace && (
        <ResultsModal
          race={selectedRace}
          pilots={pilots}
          onClose={() => { setShowResultModal(false); setSelectedRace(null); }}
          onRefresh={loadData}
        />
      )}
      {showSeasonModal && (
        <SeasonModal
          onClose={() => setShowSeasonModal(false)}
          onSave={handleSaveSeason}
        />
      )}
      {showSeasonModal && (
        <SeasonModal
          onClose={() => setShowSeasonModal(false)}
          onSave={handleSaveSeason}
        />
      )}
    </div>
  );
};

const Header = () => (
  <div className="mb-8">
    <button onClick={() => window.location.href = '/dashboard'} className="text-red-500 hover:text-red-400 mb-4">
      ← Retour au Dashboard
    </button>
    <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-white">
      <h1 className="text-4xl font-black tracking-wider">🏎️ GESTION DES COURSES</h1>
      <p className="text-orange-100 mt-2">Calendrier, résultats et classements F1</p>
    </div>
  </div>
);

const Filters = ({ seasons, selectedSeason, setSelectedSeason, onAdd, onAddSeason }) => (
  <div className="bg-gray-900/90 backdrop-blur-xl border-2 border-red-500/50 rounded-xl p-6 mb-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <select
        value={selectedSeason}
        onChange={(e) => setSelectedSeason(e.target.value)}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
      >
        <option value="all">Toutes les saisons</option>
        {seasons.map(s => (
          <option key={s.id} value={s.id}>Saison {s.annee}</option>
        ))}
      </select>

      <button
        onClick={onAddSeason}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-bold transition-all"
      >
        + Nouvelle Saison
      </button>

      <button
        onClick={onAdd}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold transition-all"
      >
        + Nouvelle Course
      </button>

      <button
        onClick={() => window.location.href = '/strategies'}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-bold transition-all"
      >
        🎯 Stratégies
      </button>

      <button
        onClick={() => window.location.href = '/championship'}
        className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-bold transition-all"
      >
        🏆 Classement
      </button>
    </div>
  </div>
);

const Stats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <StatCard label="Total Courses" value={stats.total} color="red" />
    <StatCard label="Planifiées" value={stats.planifies} color="blue" />
    <StatCard label="En cours" value={stats.enCours} color="yellow" />
    <StatCard label="Terminées" value={stats.termines} color="green" />
  </div>
);

const StatCard = ({ label, value, color }) => (
  <div className={`bg-gray-900/90 border border-${color}-500/30 rounded-lg p-4`}>
    <p className="text-gray-400 text-sm">{label}</p>
    <p className={`text-3xl font-black text-${color}-500`}>{value}</p>
  </div>
);

const RaceList = ({ races, onEdit, onDelete, onViewResults }) => {
  if (races.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-xl">Aucune course trouvée</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {races.map((race) => (
        <RaceCard 
          key={race.id} 
          race={race} 
          onEdit={onEdit} 
          onDelete={onDelete}
          onViewResults={onViewResults}
        />
      ))}
    </div>
  );
};

const RaceCard = ({ race, onEdit, onDelete, onViewResults }) => {
  const statusColors = {
    'planifie': 'bg-blue-500',
    'en_cours': 'bg-yellow-500',
    'termine': 'bg-green-500',
    'annule': 'bg-gray-500'
  };

  const statusLabels = {
    'planifie': 'Planifié',
    'en_cours': 'En cours',
    'termine': 'Terminé',
    'annule': 'Annulé'
  };

  const meteoIcons = {
    'ensoleille': '☀️',
    'nuageux': '☁️',
    'pluvieux': '🌧️',
    'orage': '⛈️'
  };

  return (
    <div className="bg-gray-900/90 border-2 border-red-500/30 rounded-xl p-6 hover:border-red-500 transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              Round {race.numero_manche}
            </span>
            <span className={`${statusColors[race.statut]} text-white px-3 py-1 rounded-full text-sm font-bold`}>
              {statusLabels[race.statut]}
            </span>
            <span className="text-2xl">{meteoIcons[race.meteo]}</span>
          </div>
          
          <h3 className="text-2xl font-black text-white mb-2">{race.nom}</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-300 text-sm">
            <div>
              <p className="text-gray-500">Circuit</p>
              <p className="font-bold">{race.circuit_nom}</p>
            </div>
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-bold">{new Date(race.date).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <p className="text-gray-500">Saison</p>
              <p className="font-bold">{race.season_annee}</p>
            </div>
            <div>
              <p className="text-gray-500">Participants</p>
              <p className="font-bold">{race.nombre_participants || 0}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:w-48">
          {race.statut === 'termine' && (
            <button
              onClick={() => onViewResults(race)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-bold transition-all"
            >
              📊 Résultats
            </button>
          )}
          <button
            onClick={() => onEdit(race)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all"
          >
            ✏️ Modifier
          </button>
          <button
            onClick={() => onDelete(race.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-all"
          >
            🗑️ Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

const RaceModal = ({ race, seasons, circuits, onClose, onSave }) => {
  const [form, setForm] = useState({
    nom: race?.nom || '',
    season: race?.season || '',
    circuit: race?.circuit || '',
    date: race?.date || '',
    heure: race?.heure || '',
    meteo: race?.meteo || 'ensoleille',
    statut: race?.statut || 'planifie',
    numero_manche: race?.numero_manche || 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convertir les champs
    const formattedData = {
      ...form,
      season: parseInt(form.season),
      circuit: parseInt(form.circuit),
      numero_manche: parseInt(form.numero_manche),
      heure: form.heure || null,
    };
    
    console.log('Données course formatées:', formattedData);
    onSave(formattedData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-red-500 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-red-600 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-black text-white">
            {race ? '✏️ Modifier' : '➕ Nouvelle'} Course
          </h2>
          <button onClick={onClose} className="text-white text-3xl">×</button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormInput label="Nom de la course *" value={form.nom} onChange={(v) => setForm({...form, nom: v})} required />
            </div>

            <div>
              <label className="block text-white mb-2 font-bold">Saison *</label>
              <select
                value={form.season}
                onChange={(e) => setForm({...form, season: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
                required
              >
                <option value="">Sélectionner une saison</option>
                {seasons.map(s => (
                  <option key={s.id} value={s.id}>{s.annee}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white mb-2 font-bold">Circuit *</label>
              <select
                value={form.circuit}
                onChange={(e) => setForm({...form, circuit: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
                required
              >
                <option value="">Sélectionner un circuit</option>
                {circuits.map(c => (
                  <option key={c.id} value={c.id}>{c.nom} ({c.pays})</option>
                ))}
              </select>
            </div>

            <FormInput label="Date *" type="date" value={form.date} onChange={(v) => setForm({...form, date: v})} required />
            <FormInput label="Heure" type="time" value={form.heure} onChange={(v) => setForm({...form, heure: v})} />
            <FormInput label="N° Manche *" type="number" value={form.numero_manche} onChange={(v) => setForm({...form, numero_manche: v})} required />

            <div>
              <label className="block text-white mb-2 font-bold">Météo</label>
              <select
                value={form.meteo}
                onChange={(e) => setForm({...form, meteo: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
              >
                <option value="ensoleille">☀️ Ensoleillé</option>
                <option value="nuageux">☁️ Nuageux</option>
                <option value="pluvieux">🌧️ Pluvieux</option>
                <option value="orage">⛈️ Orage</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2 font-bold">Statut</label>
              <select
                value={form.statut}
                onChange={(e) => setForm({...form, statut: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
              >
                <option value="planifie">Planifié</option>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
                <option value="annule">Annulé</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button onClick={handleSubmit} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold">
              💾 Enregistrer
            </button>
            <button onClick={onClose} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold">
              ✖️ Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultsModal = ({ race, pilots, onClose, onRefresh }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const data = await raceService.getRaceResults(race.id);
      setResults(data);
    } catch (error) {
      console.error('Erreur:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-yellow-500 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-yellow-600 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-black text-white">
            📊 Résultats - {race.nom}
          </h2>
          <button onClick={onClose} className="text-white text-3xl">×</button>
        </div>

        <div className="p-6">
          {loading ? (
            <p className="text-white text-center">Chargement...</p>
          ) : results.length === 0 ? (
            <p className="text-gray-400 text-center">Aucun résultat disponible</p>
          ) : (
            <div className="space-y-2">
              {results.map((result, idx) => (
                <div key={result.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-white w-12">P{result.position}</span>
                    <div>
                      <p className="text-white font-bold">{result.pilot_prenom} {result.pilot_nom}</p>
                      <p className="text-gray-400 text-sm">N°{result.pilot_numero}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-bold">{result.points} pts</p>
                    {result.meilleur_tour && (
                      <p className="text-gray-400 text-sm">⏱️ {result.meilleur_tour}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FormInput = ({ label, value, onChange, type = "text", required = false, step = "" }) => (
  <div>
    <label className="block text-white mb-2 font-bold">{label}</label>
    <input
      type={type}
      required={required}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
    />
  </div>
);

const SeasonModal = ({ onClose, onSave }) => {
  const [year, setYear] = useState(new Date().getFullYear());

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-purple-500 rounded-xl max-w-md w-full">
        <div className="bg-purple-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-black text-white">➕ Nouvelle Saison</h2>
          <button onClick={onClose} className="text-white text-3xl">×</button>
        </div>

        <div className="p-6">
          <FormInput 
            label="Année *" 
            type="number" 
            value={year} 
            onChange={setYear} 
            required 
          />

          <div className="flex gap-4 mt-6">
            <button 
              onClick={() => onSave(year)} 
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold"
            >
              💾 Créer
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

export default RacesDashboard;