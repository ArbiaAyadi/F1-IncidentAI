import { useState, useEffect } from 'react';
import teamService from '../services/teamService';

const TeamsDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTeam, setEditTeam] = useState(null);
  const [filtreActif, setFiltreActif] = useState('tous');
  const [recherche, setRecherche] = useState('');

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const data = await teamService.getAllTeams();
      setTeams(data.results || data);
    } catch (error) {
      console.error('Erreur:', error);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette équipe ?')) return;
    try {
      await teamService.deleteTeam(id);
      loadTeams();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editTeam) {
        await teamService.updateTeam(editTeam.id, formData);
      } else {
        await teamService.createTeam(formData);
      }
      loadTeams();
      setShowModal(false);
      setEditTeam(null);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde: ' + JSON.stringify(error));
    }
  };

  const filteredTeams = teams.filter(team => {
    const matchActif = filtreActif === 'tous' || 
      (filtreActif === 'actif' ? team.actif : !team.actif);
    const matchRecherche = team.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      team.directeur.toLowerCase().includes(recherche.toLowerCase());
    return matchActif && matchRecherche;
  });

  const stats = {
    total: teams.length,
    actives: teams.filter(t => t.actif).length,
    budgetTotal: teams.reduce((sum, t) => sum + parseFloat(t.budget || 0), 0),
    championnats: teams.reduce((sum, t) => sum + (t.championnats_constructeurs || 0), 0),
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
          recherche={recherche}
          setRecherche={setRecherche}
          filtreActif={filtreActif}
          setFiltreActif={setFiltreActif}
          onAdd={() => { setEditTeam(null); setShowModal(true); }}
        />
        <Stats stats={stats} />
        <TeamList 
          teams={filteredTeams}
          onEdit={(team) => { setEditTeam(team); setShowModal(true); }}
          onDelete={handleDelete}
        />
      </div>

      {showModal && (
        <TeamModal
          team={editTeam}
          onClose={() => { setShowModal(false); setEditTeam(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

const Header = () => (
  <div className="mb-8">
    <button onClick={() => window.location.href = '/dashboard'} className="text-purple-400 hover:text-purple-300 mb-4">
      ← Retour 
    </button>
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-white">
      <h1 className="text-4xl font-black tracking-wider">🏎️ GESTION DES ÉQUIPES</h1>
      <p className="text-purple-100 mt-2">Gérez les écuries de Formule 1</p>
    </div>
  </div>
);

const Filters = ({ recherche, setRecherche, filtreActif, setFiltreActif, onAdd }) => (
  <div className="bg-gray-900/90 backdrop-blur-xl border-2 border-purple-500/50 rounded-xl p-6 mb-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        type="text"
        placeholder="🔍 Rechercher..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
      />

      <select
        value={filtreActif}
        onChange={(e) => setFiltreActif(e.target.value)}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
      >
        <option value="tous">Toutes les équipes</option>
        <option value="actif">Actives</option>
        <option value="inactif">Inactives</option>
      </select>

      <button
        onClick={onAdd}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-bold transition-all"
      >
        + Nouvelle Équipe
      </button>
    </div>
  </div>
);

const Stats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <StatCard label="Total Équipes" value={stats.total} color="purple" />
    <StatCard label="Actives" value={stats.actives} color="green" />
    <StatCard label="Budget Total" value={`$${stats.budgetTotal.toFixed(0)}M`} color="yellow" />
    <StatCard label="Championnats" value={stats.championnats} color="red" />
  </div>
);

const StatCard = ({ label, value, color }) => (
  <div className={`bg-gray-900/90 border border-${color}-500/30 rounded-lg p-4`}>
    <p className="text-gray-400 text-sm">{label}</p>
    <p className={`text-3xl font-black text-${color}-500`}>{value}</p>
  </div>
);

const TeamList = ({ teams, onEdit, onDelete }) => {
  if (teams.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-xl">Aucune équipe trouvée</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <TeamCard 
          key={team.id} 
          team={team}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

const TeamCard = ({ team, onEdit, onDelete }) => (
  <div className="bg-gray-900/90 border-2 border-purple-500/30 rounded-xl overflow-hidden hover:border-purple-500 transition-all">
    {team.logo_url && (
      <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
        <img src={team.logo_url} alt={team.nom} className="max-h-full max-w-full object-contain" />
      </div>
    )}
    
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-black text-white mb-1">{team.nom}</h3>
          <p className="text-gray-400 text-sm">{team.quartier_general}, {team.pays}</p>
        </div>
        {team.actif && (
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            ACTIF
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4 text-gray-300 text-sm">
        <p>👤 <strong>Directeur:</strong> {team.directeur}</p>
        <p>🔧 <strong>Moteur:</strong> {team.moteur}</p>
        <p>💰 <strong>Budget:</strong> ${team.budget}M</p>
        {team.sponsor_principal && (
          <p>🤝 <strong>Sponsor:</strong> {team.sponsor_principal}</p>
        )}
        <p>🏆 <strong>Championnats:</strong> {team.championnats_constructeurs}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(team)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all"
        >
          ✏️ Modifier
        </button>
        <button
          onClick={() => onDelete(team.id)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-all"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
);

const TeamModal = ({ team, onClose, onSave }) => {
  const [form, setForm] = useState({
    nom: team?.nom || '',
    nom_complet: team?.nom_complet || '',
    budget: team?.budget || '',
    quartier_general: team?.quartier_general || '',
    pays: team?.pays || '',
    directeur: team?.directeur || '',
    directeur_technique: team?.directeur_technique || '',
    chassis: team?.chassis || '',
    sponsor_principal: team?.sponsor_principal || '',
    autres_sponsors: team?.autres_sponsors || '',
    annee_creation: team?.annee_creation || '',
    championnats_constructeurs: team?.championnats_constructeurs || 0,
    championnats_pilotes: team?.championnats_pilotes || 0,
    couleur_principale: team?.couleur_principale || '',
    couleur_secondaire: team?.couleur_secondaire || '',
    logo_url: team?.logo_url || '',
    actif: team?.actif ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formattedData = {
      ...form,
      budget: parseFloat(form.budget),
      annee_creation: form.annee_creation ? parseInt(form.annee_creation) : null,
      championnats_constructeurs: parseInt(form.championnats_constructeurs),
      championnats_pilotes: parseInt(form.championnats_pilotes),
      nom_complet: form.nom_complet || null,
      directeur_technique: form.directeur_technique || null,
      chassis: form.chassis || null,
      sponsor_principal: form.sponsor_principal || null,
      autres_sponsors: form.autres_sponsors || null,
      couleur_principale: form.couleur_principale || null,
      couleur_secondaire: form.couleur_secondaire || null,
      logo_url: form.logo_url || null,
      moteur: 'N/A', // Valeur par défaut pour le backend
    };

    onSave(formattedData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-purple-500 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-purple-600 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-black text-white">
            {team ? '✏️ Modifier' : '➕ Nouvelle'} Équipe
          </h2>
          <button onClick={onClose} className="text-white text-3xl">×</button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Nom de l'équipe *" value={form.nom} onChange={(v) => setForm({...form, nom: v})} required />
            <FormInput label="Nom complet" value={form.nom_complet} onChange={(v) => setForm({...form, nom_complet: v})} />
            
            <FormInput label="Budget (millions USD) *" type="number" step="0.01" value={form.budget} onChange={(v) => setForm({...form, budget: v})} required />
            <FormInput label="Quartier général *" value={form.quartier_general} onChange={(v) => setForm({...form, quartier_general: v})} required />
            
            <FormInput label="Pays *" value={form.pays} onChange={(v) => setForm({...form, pays: v})} required />
            <FormInput label="Directeur d'équipe *" value={form.directeur} onChange={(v) => setForm({...form, directeur: v})} required />
            
            <FormInput label="Directeur technique" value={form.directeur_technique} onChange={(v) => setForm({...form, directeur_technique: v})} />
            <FormInput label="Châssis" value={form.chassis} onChange={(v) => setForm({...form, chassis: v})} />
            
            <FormInput label="Sponsor principal" value={form.sponsor_principal} onChange={(v) => setForm({...form, sponsor_principal: v})} />
            <FormInput label="Année de création" type="number" value={form.annee_creation} onChange={(v) => setForm({...form, annee_creation: v})} />
            
            <div className="md:col-span-2">
              <label className="block text-white mb-2 font-bold">Autres sponsors</label>
              <textarea
                rows="2"
                value={form.autres_sponsors}
                onChange={(e) => setForm({...form, autres_sponsors: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
                placeholder="Sponsors séparés par des virgules"
              />
            </div>

            <FormInput label="Championnats constructeurs" type="number" value={form.championnats_constructeurs} onChange={(v) => setForm({...form, championnats_constructeurs: v})} />
            <FormInput label="Championnats pilotes" type="number" value={form.championnats_pilotes} onChange={(v) => setForm({...form, championnats_pilotes: v})} />
            
            <FormInput label="URL du logo" value={form.logo_url} onChange={(v) => setForm({...form, logo_url: v})} />

            <div className="md:col-span-2">
              <label className="flex items-center space-x-3 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.actif}
                  onChange={(e) => setForm({...form, actif: e.target.checked})}
                  className="w-5 h-5"
                />
                <span className="font-bold">Équipe active</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button onClick={handleSubmit} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold">
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

const FormInput = ({ label, value, onChange, type = "text", required = false, step = "" }) => (
  <div>
    <label className="block text-white mb-2 font-bold">{label}</label>
    <input
      type={type}
      required={required}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
    />
  </div>
);

export default TeamsDashboard;