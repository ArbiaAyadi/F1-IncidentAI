import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.username, formData.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Effet de grille */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      
      {/* Lignes racing */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
        <div className="absolute bottom-20 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Card principale */}
        <div className="bg-gray-900/90 backdrop-blur-xl border-2 border-red-500/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header avec bande rouge */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 px-8 py-6 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
            <div className="flex items-center justify-center gap-3">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
              </svg>
              <h2 className="text-3xl font-black text-white text-center tracking-wider">
                CONNEXION
              </h2>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white"></div>
          </div>

          {/* Formulaire */}
          <div className="px-8 py-8">
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border-l-4 border-red-500 rounded">
                <p className="text-sm text-red-300 font-semibold">⚠️ {error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                  Nom d'utilisateur
                </label>
                <input
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                  placeholder="Entrez votre username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                  Mot de passe
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {/* Bouton submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-lg rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none uppercase tracking-wider"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 64 64">
                      <path d="M58 32c0-3-2-5-5-5h-8l-6-8h-14l-4 8H8c-3 0-5 2-5 5v8c0 3 2 5 5 5h2c0 3 2 5 5 5s5-2 5-5h24c0 3 2 5 5 5s5-2 5-5h2c3 0 5-2 5-5v-8z"/>
                    </svg>
                    Démarrer
                  </span>
                )}
              </button>
            </form>

            {/* Ligne de séparation */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            </div>

            {/* Lien inscription */}
            <p className="text-center text-gray-400">
              Pas encore de compte ?{' '}
              <Link
                to="/register"
                className="text-red-500 hover:text-red-400 font-bold transition-colors duration-300"
              >
                Créer un compte →
              </Link>
            </p>
          </div>
        </div>

        {/* Effet de lumière */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Login;