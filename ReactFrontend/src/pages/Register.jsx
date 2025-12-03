import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrors({});

  const result = await register(formData);

  if (result.success) {
    // ✅ AMÉLIORATION : Message styled au lieu d'alert
    setMessage('success');
    setTimeout(() => {
      navigate('/login');
    }, 2000); // Attend 2 secondes avant de rediriger
  } else {
    setErrors(result.error);
    setMessage('error');
  }

  setLoading(false);
};

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Effet de grille */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      
      {/* Lignes racing animées */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
        <div className="absolute top-32 left-0 w-full h-1 bg-white animate-pulse"></div>
        <div className="absolute bottom-32 left-0 w-full h-1 bg-white animate-pulse"></div>
        <div className="absolute bottom-10 left-0 w-full h-1 bg-red-500 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-2xl">
        {/* Card principale */}
        <div className="bg-gray-900/90 backdrop-blur-xl border-2 border-red-500/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header avec bande rouge */}
         <div className="bg-gradient-to-r from-red-600 to-red-800 px-8 py-6 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
            <div className="flex items-center justify-center gap-3">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <h2 className="text-3xl font-black text-white text-center tracking-wider">
                INSCRIPTION
              </h2>
            </div>
            <p className="text-center text-white/80 mt-2 text-sm">
              Accédez à votre espace de gestion
            </p>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white"></div>
          </div>
           
          {message === 'success' && (
  <div className="mb-6 p-4 bg-green-500/20 border-l-4 border-green-500 rounded animate-pulse">
    <p className="text-green-300 font-semibold flex items-center gap-2">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
      </svg>
      ✅ Compte créé avec succès ! Redirection vers la connexion...
    </p>
  </div>
)}


          {/* Formulaire */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username & Email en ligne */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                    Username *
                  </label>
                  <input
                    name="username"
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                    placeholder="manager01"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-400">⚠️ {errors.username}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                    placeholder="manager@company.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">⚠️ {errors.email}</p>
                  )}
                </div>
              </div>

              {/* Prénom & Nom en ligne */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                    Prénom
                  </label>
                  <input
                    name="first_name"
                    type="text"
                    className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                    placeholder="Votre prénom"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                    Nom
                  </label>
                  <input
                    name="last_name"
                    type="text"
                    className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                    placeholder="Votre nom"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Mots de passe en ligne */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                    Mot de passe *
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
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-400">⚠️ {errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                    Confirmer *
                  </label>
                  <input
                    name="password2"
                    type="password"
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/50 transition-all duration-300"
                    placeholder="••••••••"
                    value={formData.password2}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Bouton submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-lg rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none uppercase tracking-wider mt-6"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Inscription...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 64 64">
                      <rect x="8" y="8" width="8" height="8"/>
                      <rect x="24" y="8" width="8" height="8"/>
                      <rect x="40" y="8" width="8" height="8"/>
                      <rect x="16" y="16" width="8" height="8"/>
                      <rect x="32" y="16" width="8" height="8"/>
                      <rect x="48" y="16" width="8" height="8"/>
                      <rect x="4" y="8" width="4" height="48"/>
                    </svg>
                    Activer mon espace manager
                  </span>
                )}
              </button>
            </form>

            {/* Ligne de séparation */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
            </div>

            {/* Lien connexion */}
            <p className="text-center text-gray-400">
              Vous avez déjà un compte ?{' '}
              <Link
                to="/login"
                className="text-red-500 hover:text-red-400 font-bold transition-colors duration-300"
              >
                Se connecter →
              </Link>
            </p>
          </div>
        </div>

        {/* Effet de lumière */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default Register;