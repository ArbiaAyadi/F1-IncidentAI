import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await updateProfile(formData);

    if (result.success) {
      setMessage('success');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('error');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black py-12 px-4 relative overflow-hidden">
      {/* Effet de grille */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      
      {/* Lignes racing */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-0 w-full h-1 bg-red-500"></div>
        <div className="absolute bottom-20 left-0 w-full h-1 bg-red-500"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header avec stats */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-lg transform -skew-x-6 shadow-2xl border-2 border-white mb-4">
            <h1 className="text-4xl font-black skew-x-6 tracking-wider">
               TABLEAU DE BORD
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Manager : <span className="text-white font-bold">{user?.username}</span>
          </p>
        </div>

        {/* Message de succès/erreur */}
        {message === 'success' && (
          <div className="mb-6 p-4 bg-green-500/20 border-l-4 border-green-500 rounded-lg backdrop-blur-sm animate-pulse">
            <p className="text-green-300 font-semibold">✅ Profil mis à jour avec succès !</p>
          </div>
        )}

        {message === 'error' && (
          <div className="mb-6 p-4 bg-red-500/20 border-l-4 border-red-500 rounded-lg backdrop-blur-sm">
            <p className="text-red-300 font-semibold">❌ Erreur lors de la mise à jour</p>
          </div>
        )}

        {/* Card principale */}
        <div className="bg-gray-900/90 backdrop-blur-xl border-2 border-red-500/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 px-8 py-6 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white tracking-wider">
                INFORMATIONS PILOTE
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                >
                  ✏️ Modifier
                </button>
              )}
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white"></div>
          </div>

          {/* Contenu */}
          <div className="px-8 py-8">
            {!isEditing ? (
              // Mode affichage
              <div className="space-y-6">
                {/* Grille d'informations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div className="bg-gray-800/50 border-2 border-gray-700 rounded-lg p-4">
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                      Username
                    </label>
                    <p className="text-xl font-bold text-white">{user?.username}</p>
                  </div>

                  {/* Email */}
                  <div className="bg-gray-800/50 border-2 border-gray-700 rounded-lg p-4">
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                      Email
                    </label>
                    <p className="text-xl font-bold text-white">
                      {user?.email || <span className="text-gray-500">Non renseigné</span>}
                    </p>
                  </div>

                  {/* Prénom */}
                  <div className="bg-gray-800/50 border-2 border-gray-700 rounded-lg p-4">
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                      Prénom
                    </label>
                    <p className="text-xl font-bold text-white">
                      {user?.first_name || <span className="text-gray-500">Non renseigné</span>}
                    </p>
                  </div>

                  {/* Nom */}
                  <div className="bg-gray-800/50 border-2 border-gray-700 rounded-lg p-4">
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                      Nom
                    </label>
                    <p className="text-xl font-bold text-white">
                      {user?.last_name || <span className="text-gray-500">Non renseigné</span>}
                    </p>
                  </div>
                </div>

                {/* Date d'inscription */}
                <div className="bg-gray-800/50 border-2 border-gray-700 rounded-lg p-4">
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                    🏁 Membre depuis
                  </label>
                  <p className="text-xl font-bold text-white">
                    {new Date(user?.date_joined).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                {/* Ligne de séparation */}
                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate('/change-password')}
                    className="flex-1 py-4 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white font-black text-lg rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 uppercase tracking-wider"
                  >
                    🔐 Changer le mot de passe
                  </button>
                </div>
              </div>
            ) : (
              // Mode édition
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Prénom */}
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                      Prénom
                    </label>
                    <input
                      name="first_name"
                      type="text"
                      className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                      Nom
                    </label>
                    <input
                      name="last_name"
                      type="text"
                      className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Boutons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-black text-lg rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none uppercase tracking-wider"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enregistrement...
                      </span>
                    ) : (
                      '💾 Enregistrer'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        first_name: user?.first_name || '',
                        last_name: user?.last_name || '',
                        email: user?.email || '',
                      });
                    }}
                    className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 text-white font-black text-lg rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 uppercase tracking-wider"
                  >
                    ❌ Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Stats cards en dessous */}
        <div className="mt-8 bg-gradient-to-r from-red-900/50 to-orange-900/50 backdrop-blur-xl border-2 border-red-500/50 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-600 rounded-full p-3 flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                Responsabilités du Manager
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Gestion complète de l'équipe de pilotes
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Suivi des performances et statistiques
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Organisation de la stratégie d'équipe
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Effet de lumière */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default Profile;