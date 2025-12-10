import { useState, useEffect } from 'react';
import { pilotesService } from '../services/pilotService';
import { F1_TEAMS, NATIONALITIES } from '../data/f1Data';
import { RaceCarIcon, TrophyIcon, MedalIcon } from '../components/icons';

const PilotesDashboard = () => {
  const [pilotes, setPilotes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPilote, setEditingPilote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTeam, setFilterTeam] = useState('');

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    nationalite: '',
    date_naissance: '',
    equipe: '',
    numero: '',
    victoires: 0,
    podiums: 0,
    points: 0,
  });

  // Charger les données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pilotesRes, statsRes] = await Promise.all([
        pilotesService.getAllPilotes(),
        pilotesService.getStats(),
      ]);
      setPilotes(pilotesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPilote) {
        await pilotesService.updatePilote(editingPilote.id, formData);
      } else {
        await pilotesService.createPilote(formData);
      }
      loadData();
      closeModal();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce pilote ?')) {
      try {
        await pilotesService.deletePilote(id);
        loadData();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  const openModal = (pilote = null) => {
    if (pilote) {
      setEditingPilote(pilote);
      setFormData(pilote);
    } else {
      setEditingPilote(null);
      setFormData({
        nom: '',
        prenom: '',
        nationalite: '',
        date_naissance: '',
        equipe: '',
        numero: '',
        victoires: 0,
        podiums: 0,
        points: 0,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPilote(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Filtrer les pilotes
  const filteredPilotes = pilotes.filter((pilote) => {
    const matchSearch =
      pilote.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pilote.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pilote.equipe.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchTeam = filterTeam ? pilote.equipe === filterTeam : true;
    
    return matchSearch && matchTeam;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black py-8 px-4 relative overflow-hidden">
      {/* Grille de fond */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      
      {/* Lignes racing */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-0 w-full h-1 bg-red-500"></div>
        <div className="absolute bottom-20 left-0 w-full h-1 bg-red-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
              <button onClick={() => window.location.href = '/dashboard'} className="text-red-500 hover:text-red-400 mb-4">
               ← Retour 
              </button>
          <div className="inline-block bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-lg transform -skew-x-6 shadow-2xl border-2 border-white mb-4">
            <h1 className="text-4xl font-black skew-x-6 tracking-wider flex items-center gap-3">
              <RaceCarIcon className="w-10 h-10" />
              GESTION DES PILOTES
            </h1>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-6 border-2 border-white/20 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-bold uppercase">Total Pilotes</p>
                  <p className="text-4xl font-black text-white mt-2">{stats.total_pilotes}</p>
                </div>
                <RaceCarIcon className="w-12 h-12 text-white/30" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-6 border-2 border-white/20 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-bold uppercase">Victoires</p>
                  <p className="text-4xl font-black text-white mt-2">{stats.total_victoires}</p>
                </div>
                <TrophyIcon className="w-12 h-12 text-white/30" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 border-2 border-white/20 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-bold uppercase">Podiums</p>
                  <p className="text-4xl font-black text-white mt-2">{stats.total_podiums}</p>
                </div>
                <MedalIcon className="w-12 h-12 text-white/30" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 border-2 border-white/20 transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-bold uppercase">Équipes</p>
                  <p className="text-4xl font-black text-white mt-2">{stats.total_equipes}</p>
                </div>
                <svg className="w-12 h-12 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Filtres et Actions */}
        <div className="bg-gray-900/90 backdrop-blur-xl border-2 border-red-500/50 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Recherche */}
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un pilote..."
                  className="w-full px-4 py-3 pl-12 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>

            {/* Filtre par équipe */}
            <select
              className="px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
            >
              <option value="">Toutes les équipes</option>
              {F1_TEAMS.map((team) => (
                <option key={team.value} value={team.value}>
                  {team.label}
                </option>
              ))}
            </select>

            {/* Bouton Ajouter */}
            <button
              onClick={() => openModal()}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 uppercase tracking-wider flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
              Ajouter Pilote
            </button>
          </div>
        </div>

        {/* Table des pilotes */}
        <div className="bg-gray-900/90 backdrop-blur-xl border-2 border-red-500/50 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-red-600 to-red-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">Pilote</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">Nationalité</th>
                  <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">Équipe</th>
                  <th className="px-6 py-4 text-center text-xs font-black text-white uppercase tracking-wider">Victoires</th>
                  <th className="px-6 py-4 text-center text-xs font-black text-white uppercase tracking-wider">Podiums</th>
                  <th className="px-6 py-4 text-center text-xs font-black text-white uppercase tracking-wider">Points</th>
                  <th className="px-6 py-4 text-center text-xs font-black text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredPilotes.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-8 text-center text-gray-400">
                      Aucun pilote trouvé
                    </td>
                  </tr>
                ) : (
                  filteredPilotes.map((pilote) => (
                    <tr key={pilote.id} className="hover:bg-gray-800/50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white font-bold">
                          {pilote.numero}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                            <span className="text-white font-black">{pilote.prenom?.[0] ?? ''}{pilote.nom?.[0] ?? ''}</span>
                          </div>
                          <div>
                            <p className="text-white font-bold">{pilote.prenom} {pilote.nom}</p>
                            <p className="text-gray-400 text-sm">{new Date(pilote.date_naissance).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-white">{NATIONALITIES.find(n => n.value === pilote.nationalite)?.flag} {pilote.nationalite}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-red-600/20 border border-red-600 text-red-400 rounded-full text-sm font-bold">
                          {pilote.equipe}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-yellow-500 font-bold">{pilote.victoires}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-purple-500 font-bold">{pilote.podiums}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-blue-500 font-bold">{pilote.points}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openModal(pilote)}
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                            title="Modifier"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(pilote.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                            title="Supprimer"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Ajout/Édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border-2 border-red-500/50 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header Modal */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                {editingPilote ? 'Modifier Pilote' : 'Ajouter Pilote'}
              </h3>
              <button
                onClick={closeModal}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Prénom */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                    placeholder="Max"
                    value={formData.prenom}
                    onChange={handleChange}
                  />
                </div>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                    placeholder="Verstappen"
                    value={formData.nom}
                    onChange={handleChange}
                  />
                </div>

                {/* Nationalité */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">
                    Nationalité *
                  </label>
                  <select
                    name="nationalite"
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                    value={formData.nationalite}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionner...</option>
                    {NATIONALITIES.map((nat) => (
                      <option key={nat.value} value={nat.value}>
                        {nat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date de naissance */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">
                    Date de naissance *
                  </label>
                  <input
                    type="date"
                    name="date_naissance"
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                    value={formData.date_naissance}
                    onChange={handleChange}
                  />
                </div>

                {/* Équipe */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">
                    Équipe *
                  </label>
                  <select
                    name="equipe"
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                    value={formData.equipe}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionner...</option>
                    {F1_TEAMS.map((team) => (
                      <option key={team.value} value={team.value}>
                        {team.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Numéro */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">
                    Numéro *
                  </label>
                  <input
                    type="number"
                    name="numero"
                    required
                    min="0"
                    max="99"
                    className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                    placeholder="1"
                    value={formData.numero}
                    onChange={handleChange}
                  />
                </div>

                {/* Victoires */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">
                    Victoires
                  </label>
                  <input
                    type="number"
                    name="victoires"
                    min="0"
                    className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                    placeholder="0"
                    value={formData.victoires}
                    onChange={handleChange}
                  />
                </div>

                {/* Podiums */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">
                    Podiums
                  </label>
                  <input
                    type="number"
                    name="podiums"
                    min="0"
                    className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                    placeholder="0"
                    value={formData.podiums}
                    onChange={handleChange}
                  />
                </div>

                {/* Points */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">
                    Points
                  </label>
                  <input
                    type="number"
                    name="points"
                    min="0"
                    className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                    placeholder="0"
                    value={formData.points}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Boutons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-black rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 uppercase"
                >
                  {editingPilote ? 'Mettre à jour' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-black rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 uppercase"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PilotesDashboard;



      