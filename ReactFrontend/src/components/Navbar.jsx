import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-2xl border-b-4 border-red-600 relative">
      {/* Ligne racing en haut */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-white to-red-600"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo F1 */}
          <Link to="/" className="group flex items-center space-x-3">
            {/* Icône F1 SVG */}
            <div className="relative">
              <svg className="w-12 h-12 transform group-hover:scale-110 transition-transform duration-300" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" fill="url(#gradient1)" stroke="#fff" strokeWidth="2"/>
                <path d="M20 28 L30 20 L42 28 L38 38 L26 38 Z" fill="#fff"/>
                <circle cx="32" cy="32" r="8" fill="#DC2626"/>
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DC2626"/>
                    <stop offset="100%" stopColor="#991B1B"/>
                  </linearGradient>
                </defs>
              </svg>
              {/* Effet de vitesse */}
              <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </div>
            
            {/* Texte logo */}
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white tracking-wider transform group-hover:translate-x-2 transition-transform duration-300">
                F1 RACE
              </span>
              <span className="text-xs font-bold text-red-500 tracking-widest -mt-1 transform group-hover:translate-x-2 transition-transform duration-300">
                MANAGER
              </span>
            </div>
          </Link>

          {/* Menu navigation */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {/* Nom utilisateur avec icône */}
                <div className="hidden md:flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 mr-2">
                  {/* Icône pilote SVG */}
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                  </svg>
                  <span className="text-white font-bold">{user?.username}</span>
                </div>

                {/* Bouton Dashboard */}
                <Link
                  to="/dashboard"
                  className="group relative inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-bold rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-600"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  
                  {/* Icône dashboard SVG */}
                  <svg className="relative w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                  
                  <span className="relative">Portail de gestion</span>
                </Link>

                {/* Bouton Profil */}
                <Link
                  to="/profile"
                  className="group relative inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-bold rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-600"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  
                  {/* Icône profil SVG */}
                  <svg className="relative w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  
                  <span className="relative">Profil</span>
                </Link>

                {/* Bouton Déconnexion */}
                <button
                  onClick={handleLogout}
                  className="group relative inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-red-800 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  
                  {/* Icône logout SVG */}
                  <svg className="relative w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </svg>
                  
                  <span className="relative">Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                {/* Bouton Connexion */}
                <Link
                  to="/login"
                  className="group relative inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-bold rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300 border border-gray-600"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  
                  {/* Icône login SVG */}
                  <svg className="relative w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
                  </svg>
                  
                  <span className="relative">Connexion</span>
                </Link>

                {/* Bouton Inscription */}
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  
                  {/* Icône user add SVG */}
                  <svg className="relative w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  
                  <span className="relative">Inscription</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Ligne racing en bas */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
    </nav>
  );
};

export default Navbar;