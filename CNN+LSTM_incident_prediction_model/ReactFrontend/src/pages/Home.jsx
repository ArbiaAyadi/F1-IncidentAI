import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RaceCarIcon, TrophyIcon, StatsIcon, TargetIcon } from '../components/icons';


const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-black relative overflow-hidden">
      {/* Effet de lignes de circuit */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
        <div className="absolute top-20 left-0 w-full h-1 bg-white"></div>
        <div className="absolute top-40 left-0 w-full h-1 bg-red-500"></div>
        <div className="absolute bottom-40 left-0 w-full h-1 bg-white"></div>
        <div className="absolute bottom-20 left-0 w-full h-1 bg-red-500"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white"></div>
      </div>

      {/* Effet de grille racing */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          {/* Logo F1 stylisé */}
          <div className="inline-block">
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-lg transform -skew-x-12 shadow-2xl border-2 border-white">
              <h1 className="text-6xl font-black skew-x-12 tracking-wider">
                F1 RACE MANAGER
              </h1>
            </div>
          </div>

          {/* Ligne rouge de séparation */}
          <div className="flex items-center justify-center space-x-4">
            <div className="h-1 w-32 bg-gradient-to-r from-transparent via-red-500 to-red-500"></div>
            <div className="w-4 h-4 bg-red-500 rotate-45"></div>
            <div className="h-1 w-32 bg-gradient-to-l from-transparent via-red-500 to-red-500"></div>
          </div>

          {/* Message de bienvenue */}
          <div className="space-y-4">
            {isAuthenticated ? (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 inline-block">
                <p className="text-3xl font-bold text-white mb-2">
                  🏁 Bienvenue, {user?.first_name || user?.username} !
                </p>
                <p className="text-lg text-gray-300">
                  Prêt pour la prochaine course ?
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-4xl font-bold text-white drop-shadow-lg">
                  Gérez votre écurie de Formule 1
                </p>
                <p className="text-xl text-gray-300">
                  Stratégie • Performance • Victoire
                </p>
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-center gap-6 pt-8">
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center gap-2">
                  <span>🏎️</span>
                  <span>Mon Tableau de Bord</span>
                </span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative">Se connecter</span>
                </Link>
                
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-red-600 bg-white rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-red-600"
                >
                  <span className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative group-hover:text-white transition-colors duration-300">
                    Créer un compte
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Stats ou features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="mb-4 flex justify-center">
                <TrophyIcon className="w-16 h-16 text-yellow-500" /></div>
              <h3 className="text-xl font-bold text-white mb-2">Gestion d'équipe</h3>
              <p className="text-gray-300">Gérez vos pilotes et votre stratégie de course</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="mb-4 flex justify-center">
                <StatsIcon className="w-16 h-16 text-blue-500" /></div>
              <h3 className="text-xl font-bold text-white mb-2">Statistiques</h3>
              <p className="text-gray-300">Analysez les performances en temps réel</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="mb-4 flex justify-center">
                <TargetIcon className="w-16 h-16 text-red-500" /></div>
              <h3 className="text-xl font-bold text-white mb-2">Championnats</h3>
              <p className="text-gray-300">Participez aux compétitions mondiales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Effet de lumière de phare */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/20 rounded-full blur-3xl"></div>
    </div>
  );
};

export default Home;
