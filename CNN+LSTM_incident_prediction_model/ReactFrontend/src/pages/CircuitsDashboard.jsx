import { useState, useEffect } from 'react';
import circuitService from '../services/circuitService';

const CircuitsDashboard = () => {
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCircuit, setEditCircuit] = useState(null);
  const [filters, setFilters] = useState({
    type: 'tous',
    actif: 'tous',
    search: ''
  });

  useEffect(() => {
    loadCircuits();
  }, []);

  const loadCircuits = async () => {
    try {
      const data = await circuitService.getAllCircuits();
      setCircuits(data.results || data);
    } catch (error) {
      console.error('Erreur:', error);
      setCircuits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce circuit ?')) return;
    try {
      await circuitService.deleteCircuit(id);
      loadCircuits();
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editCircuit) {
        await circuitService.updateCircuit(editCircuit.id, formData);
      } else {
        await circuitService.createCircuit(formData);
      }
      loadCircuits();
      setShowModal(false);
      setEditCircuit(null);
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
    }
  };

  // Filtrer les circuits
  const filteredCircuits = circuits.filter(circuit => {
    const matchType = filters.type === 'tous' || circuit.type_circuit === filters.type;
    const matchActif = filters.actif === 'tous' || 
      (filters.actif === 'actif' ? circuit.actif : !circuit.actif);
    const matchSearch = circuit.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
      circuit.pays.toLowerCase().includes(filters.search.toLowerCase());
    return matchType && matchActif && matchSearch;
  });

  // Calculer les statistiques
  const stats = {
    total: circuits.length,
    actifs: circuits.filter(c => c.actif).length,
    urbains: circuits.filter(c => c.type_circuit === 'urbain').length,
    permanents: circuits.filter(c => c.type_circuit === 'permanent').length
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
        {/* Header */}
        <Header />

        {/* Filtres */}
        <Filters filters={filters} setFilters={setFilters} onAdd={() => { setEditCircuit(null); setShowModal(true); }} />

        {/* Statistiques */}
        <Stats stats={stats} />

        {/* Liste des circuits */}
        <CircuitList 
          circuits={filteredCircuits} 
          onEdit={(circuit) => { setEditCircuit(circuit); setShowModal(true); }}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <CircuitModal
          circuit={editCircuit}
          onClose={() => { setShowModal(false); setEditCircuit(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

// Composant Header
const Header = () => (
  <div className="mb-8">
    <button onClick={() => window.location.href = '/dashboard'} className="text-red-500 hover:text-red-400 mb-4">
      ← Retour 
    </button>
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-white">
      <h1 className="text-4xl font-black tracking-wider">🏁 GESTION DES CIRCUITS</h1>
      <p className="text-blue-100 mt-2">Gérez tous les circuits de Formule 1</p>
    </div>
  </div>
);

// Composant Filtres
const Filters = ({ filters, setFilters, onAdd }) => (
  <div className="bg-gray-900/90 backdrop-blur-xl border-2 border-blue-500/50 rounded-xl p-6 mb-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <input
        type="text"
        placeholder="🔍 Rechercher..."
        value={filters.search}
        onChange={(e) => setFilters({...filters, search: e.target.value})}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
      />

      <select
        value={filters.type}
        onChange={(e) => setFilters({...filters, type: e.target.value})}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
      >
        <option value="tous">Tous les types</option>
        <option value="permanent">Permanent</option>
        <option value="urbain">Urbain</option>
        <option value="semi-permanent">Semi-permanent</option>
      </select>

      <select
        value={filters.actif}
        onChange={(e) => setFilters({...filters, actif: e.target.value})}
        className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
      >
        <option value="tous">Tous les circuits</option>
        <option value="actif">Actifs</option>
        <option value="inactif">Inactifs</option>
      </select>

      <button
        onClick={onAdd}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-all"
      >
        + Nouveau Circuit
      </button>
    </div>
  </div>
);

// Composant Statistiques
const Stats = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <StatCard label="Total Circuits" value={stats.total} color="blue" />
    <StatCard label="Actifs" value={stats.actifs} color="green" />
    <StatCard label="Urbains" value={stats.urbains} color="yellow" />
    <StatCard label="Permanents" value={stats.permanents} color="purple" />
  </div>
);

const StatCard = ({ label, value, color }) => (
  <div className={`bg-gray-900/90 border border-${color}-500/30 rounded-lg p-4`}>
    <p className="text-gray-400 text-sm">{label}</p>
    <p className={`text-3xl font-black text-${color}-500`}>{value}</p>
  </div>
);

// Composant Liste des circuits
const CircuitList = ({ circuits, onEdit, onDelete }) => {
  if (circuits.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-xl">Aucun circuit trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {circuits.map((circuit) => (
        <CircuitCard 
          key={circuit.id} 
          circuit={circuit} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

// Composant Carte de circuit
const CircuitCard = ({ circuit, onEdit, onDelete }) => (
  <div className="bg-gray-900/90 border-2 border-blue-500/30 rounded-xl overflow-hidden hover:border-blue-500 transition-all">
    {circuit.image_url && (
      <img src={circuit.image_url} alt={circuit.nom} className="w-full h-48 object-cover" />
    )}
    
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-black text-white mb-1">{circuit.nom}</h3>
          <p className="text-blue-400">📍 {circuit.pays}</p>
          {circuit.ville && <p className="text-gray-400 text-sm">{circuit.ville}</p>}
        </div>
        {circuit.actif && (
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            ACTIF
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4 text-gray-300 text-sm">
        <p>🏎️ <strong>Type:</strong> {circuit.type_circuit}</p>
        <p>📏 <strong>Longueur:</strong> {circuit.longueur} km</p>
        <p>🔄 <strong>Tours:</strong> {circuit.nombre_tours}</p>
        <p>📊 <strong>Distance totale:</strong> {circuit.distance_totale?.toFixed(2)} km</p>
        {circuit.premiere_course && (
          <p>📅 <strong>1ère course:</strong> {circuit.premiere_course}</p>
        )}
      </div>

      {circuit.record_tour && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4">
          <p className="text-yellow-400 text-xs font-bold mb-1">🏆 RECORD</p>
          <p className="text-white font-bold">{circuit.record_tour}</p>
          {circuit.detenteur_record && (
            <p className="text-gray-400 text-sm">{circuit.detenteur_record}</p>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(circuit)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-all"
        >
          ✏️ Modifier
        </button>
        <button
          onClick={() => onDelete(circuit.id)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-all"
        >
          🗑️
        </button>
      </div>
    </div>
  </div>
);

// Composant Modal
const CircuitModal = ({ circuit, onClose, onSave }) => {
  const [form, setForm] = useState({
    nom: circuit?.nom || '',
    pays: circuit?.pays || '',
    ville: circuit?.ville || '',
    longueur: circuit?.longueur || '',
    type_circuit: circuit?.type_circuit || 'permanent',
    nombre_tours: circuit?.nombre_tours || '',
    premiere_course: circuit?.premiere_course || '',
    record_tour: circuit?.record_tour || '',
    detenteur_record: circuit?.detenteur_record || '',
    description: circuit?.description || '',
    image_url: circuit?.image_url || '',
    actif: circuit?.actif ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-blue-500 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-black text-white">
            {circuit ? '✏️ Modifier Circuit' : '➕ Nouveau Circuit'}
          </h2>
          <button onClick={onClose} className="text-white text-3xl hover:text-gray-200">×</button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Nom *" value={form.nom} onChange={(v) => setForm({...form, nom: v})} required />
            <FormInput label="Pays *" value={form.pays} onChange={(v) => setForm({...form, pays: v})} required />
            <FormInput label="Ville" value={form.ville} onChange={(v) => setForm({...form, ville: v})} />
            
            <div>
              <label className="block text-white mb-2 font-bold">Type *</label>
              <select
                value={form.type_circuit}
                onChange={(e) => setForm({...form, type_circuit: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              >
                <option value="permanent">Permanent</option>
                <option value="urbain">Urbain</option>
                <option value="semi-permanent">Semi-permanent</option>
              </select>
            </div>

            <FormInput label="Longueur (km) *" type="number" step="0.001" value={form.longueur} onChange={(v) => setForm({...form, longueur: v})} required />
            <FormInput label="Nombre de tours *" type="number" value={form.nombre_tours} onChange={(v) => setForm({...form, nombre_tours: v})} required />
            <FormInput label="Première course" type="number" value={form.premiere_course} onChange={(v) => setForm({...form, premiere_course: v})} />
            <FormInput label="Record du tour" value={form.record_tour} onChange={(v) => setForm({...form, record_tour: v})} placeholder="1:24.123" />
            
            <div className="md:col-span-2">
              <FormInput label="Détenteur du record" value={form.detenteur_record} onChange={(v) => setForm({...form, detenteur_record: v})} />
            </div>
            
            <div className="md:col-span-2">
              <FormInput label="URL de l'image" value={form.image_url} onChange={(v) => setForm({...form, image_url: v})} />
            </div>

            <div className="md:col-span-2">
              <label className="block text-white mb-2 font-bold">Description</label>
              <textarea
                rows="3"
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center space-x-3 text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.actif}
                  onChange={(e) => setForm({...form, actif: e.target.checked})}
                  className="w-5 h-5"
                />
                <span className="font-bold">Circuit actif cette saison</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-all">
              💾 Enregistrer
            </button>
            <button onClick={onClose} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition-all">
              ✖️ Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Input réutilisable
const FormInput = ({ label, value, onChange, type = "text", required = false, placeholder = "", step = "" }) => (
  <div>
    <label className="block text-white mb-2 font-bold">{label}</label>
    <input
      type={type}
      required={required}
      placeholder={placeholder}
      step={step}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
    />
  </div>
);

export default CircuitsDashboard;