import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RaceCarIcon, CheckeredFlagIcon, TrophyIcon } from '../components/icons';

const BrainIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M21.33 12.91c.09 1.55-.62 3.04-1.89 3.95l.77 1.49c.23.45.26.98.06 1.45-.19.47-.58.84-1.06 1l-.79.26c-.56.18-1.16.12-1.67-.16-.51-.28-.87-.76-1-1.33l-.26-1.13c-.26.02-.53.03-.79.03-4.53 0-8.22-3.69-8.22-8.22 0-4.53 3.69-8.22 8.22-8.22 4.53 0 8.22 3.69 8.22 8.22 0 .27-.01.54-.04.8l1.13.26c.57.13 1.05.49 1.33 1 .28.51.34 1.11.16 1.67l-.26.79c-.16.48-.53.87-1 1.06-.47.2-1 .17-1.45-.06l-1.49-.77c-.91 1.27-2.4 1.98-3.95 1.89z"/>
  </svg>
);

const MainDashboard = () => {
  const { user } = useAuth();

  const dashboardCards = [
    {
      id: 1,
      title: 'Pilotes',
      description: 'Gérer les pilotes, statistiques et performances',
      icon: RaceCarIcon,
      link: '/pilotes',
      color: 'from-red-600 to-red-800',
      available: true,
    },
    {
      id: 2,
      title: 'Circuits',
      description: 'Calendrier et informations des circuits F1',
      icon: CheckeredFlagIcon,
      link: '/circuits',
      color: 'from-blue-600 to-blue-800',
      available: true,
    },
    {
      id: 3,
      title: 'Courses',
      description: 'Gestion des courses, résultats et classements',
      icon: TrophyIcon,
      link: '/races',
      color: 'from-orange-600 to-red-600',
      available: true,
    },
    {
      id: 4,
      title: 'Équipes',
      description: 'Gestion des écuries et classements',
      icon: TrophyIcon,
      link: '/teams',
      color: 'from-purple-600 to-purple-800',
      available: true,
    },
    // 🆕 NOUVEAU : Dashboard Incidents IA
    {
      id: 5,
      title: 'Incidents IA',
      description: 'Prédiction d\'incidents par Intelligence Artificielle',
      icon: BrainIcon,
      link: '/incidents',
      color: 'from-emerald-600 to-teal-800',
      available: true,
      badge: 'IA Powered',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black py-12 px-4 relative overflow-hidden">
      {/* Grille de fond */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      
      {/* Lignes racing */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-0 w-full h-1 bg-red-500"></div>
        <div className="absolute bottom-20 left-0 w-full h-1 bg-red-500"></div>
      </div>

      {/* Accent lumineux */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-lg transform -skew-x-6 shadow-2xl border-2 border-white mb-4">
            <h1 className="text-5xl font-black skew-x-6 tracking-wider">
              F1 RACE MANAGER
            </h1>
          </div>
          <p className="text-2xl text-white font-bold mt-4">
            Bienvenue, {user?.first_name || user?.username} !
          </p>
          <p className="text-gray-400 mt-2">
            Sélectionnez un module pour commencer
          </p>
        </div>

        {/* Dashboard Cards - Modifié pour 5 cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-12">
          {dashboardCards.map((card) => (
            <div key={card.id} className="relative group">
              {card.available ? (
                <Link
                  to={card.link}
                  className="block h-full"
                >
                  <div className={`bg-gradient-to-br ${card.color} rounded-2xl p-8 border-2 border-white/20 transform hover:scale-105 hover:shadow-2xl transition-all duration-300 h-full cursor-pointer relative overflow-hidden`}>
                    {/* Effet de brillance au survol */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                      {/* Icône */}
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform duration-300">
                        <card.icon className="w-16 h-16 text-white" />
                      </div>

                      {/* Titre */}
                      <h3 className="text-2xl font-black text-white uppercase tracking-wider">
                        {card.title}
                      </h3>

                      {/* Description */}
                      <p className="text-white/80 text-sm">
                        {card.description}
                      </p>

                      {/* Badge Spécial pour IA ou Badge Disponible */}
                      {card.badge ? (
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                          {card.badge}
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Disponible
                        </div>
                      )}

                      {/* Flèche */}
                      <div className="absolute bottom-4 right-4 transform group-hover:translate-x-2 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className={`bg-gradient-to-br ${card.color} opacity-50 rounded-2xl p-8 border-2 border-white/10 h-full cursor-not-allowed relative`}>
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Icône */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
                      <card.icon className="w-16 h-16 text-white/50" />
                    </div>

                    {/* Titre */}
                    <h3 className="text-2xl font-black text-white/70 uppercase tracking-wider">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/50 text-sm">
                      {card.description}
                    </p>

                    {/* Badge Prochainement */}
                    <div className="inline-flex items-center gap-2 bg-gray-700 text-gray-300 px-4 py-2 rounded-full text-sm font-bold">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                      </svg>
                      Prochainement
                    </div>

                    {/* Badge Verrouillé */}
                    <div className="absolute top-4 right-4 bg-gray-800 text-gray-400 p-2 rounded-full">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Effet de lumière */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
    </div>
  );
};

export default MainDashboard;