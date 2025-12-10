import { useState, useEffect } from 'react';
import raceService from '../services/raceService';

const ChampionshipDashboard = () => {
  const [standings, setStandings] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedSeason) {
      loadStandings();
    }
  }, [selectedSeason]);

  const loadData = async () => {
    try {
      setLoading(true);
      const seasonsData = await raceService.getAllSeasons();
      setSeasons(seasonsData.results || seasonsData);
      
      // Charger la saison active par défaut
      const activeSeason = (seasonsData.results || seasonsData).find(s => s.actif);
      if (activeSeason) {
        setSelectedSeason(activeSeason.id);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStandings = async () => {
    try {
      const data = await raceService.getChampionship(selectedSeason);
      setStandings(data.results || data);
    } catch (error) {
      console.error('Erreur:', error);
      setStandings([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Chargement...</div>
      </div>
    );
  }

  const topThree = standings.slice(0, 3);
  const others = standings.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => window.location.href = '/races'} className="text-yellow-400 hover:text-yellow-300 mb-4">
            ← Retour 
          </button>
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-white">
            <h1 className="text-4xl font-black tracking-wider">🏆 CLASSEMENT CHAMPIONNAT</h1>
            <p className="text-yellow-100 mt-2">Classement des pilotes F1</p>
          </div>
        </div>

        {/* Sélecteur de saison */}
        <div className="bg-gray-900/90 backdrop-blur-xl border-2 border-yellow-500/50 rounded-xl p-6 mb-6">
          <select
            value={selectedSeason || ''}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="w-full md:w-64 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-yellow-500 focus:outline-none"
          >
            {seasons.map(s => (
              <option key={s.id} value={s.id}>
                Saison {s.annee} {s.actif && '(Active)'}
              </option>
            ))}
          </select>
        </div>

        {standings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">Aucun classement disponible pour cette saison</p>
          </div>
        ) : (
          <>
            {/* Podium */}
            {topThree.length > 0 && <Podium topThree={topThree} />}

            {/* Classement complet */}
            <div className="bg-gray-900/90 backdrop-blur-xl border-2 border-yellow-500/50 rounded-xl overflow-hidden mt-8">
              <table className="w-full">
                <thead className="bg-yellow-600">
                  <tr className="text-white">
                    <th className="px-6 py-4 text-left font-black">POS</th>
                    <th className="px-6 py-4 text-left font-black">PILOTE</th>
                    <th className="px-6 py-4 text-center font-black">N°</th>
                    <th className="px-6 py-4 text-center font-black">POINTS</th>
                    <th className="px-6 py-4 text-center font-black">🏆</th>
                    <th className="px-6 py-4 text-center font-black">🥇🥈🥉</th>
                    <th className="px-6 py-4 text-center font-black">COURSES</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((standing, idx) => (
                    <tr 
                      key={standing.id} 
                      className={`border-b border-gray-700 hover:bg-gray-800 transition-colors ${
                        idx < 3 ? 'bg-yellow-500/10' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className={`text-2xl font-black ${
                          standing.position === 1 ? 'text-yellow-400' :
                          standing.position === 2 ? 'text-gray-300' :
                          standing.position === 3 ? 'text-orange-400' :
                          'text-white'
                        }`}>
                          {standing.position}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-bold">
                            {standing.pilot_prenom} {standing.pilot_nom}
                          </p>
                          <p className="text-gray-400 text-sm">{standing.pilot_nationalite}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-gray-700 text-white px-3 py-1 rounded-full font-bold">
                          {standing.pilot_numero}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-yellow-400 text-2xl font-black">
                          {standing.total_points}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-white font-bold">
                        {standing.victoires}
                      </td>
                      <td className="px-6 py-4 text-center text-white font-bold">
                        {standing.podiums}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-400">
                        {standing.courses_completes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Podium = ({ topThree }) => {
  const [first, second, third] = topThree;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-black text-white mb-6 text-center">🏆 PODIUM</h2>
      <div className="flex items-end justify-center gap-4">
        {/* 2ème place */}
        {second && (
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-gray-300 to-gray-500 rounded-lg p-6 w-48 h-32 flex flex-col items-center justify-center border-4 border-gray-400 shadow-2xl">
              <p className="text-6xl font-black text-white mb-2">2</p>
              <p className="text-white font-bold text-center">{second.pilot_prenom} {second.pilot_nom}</p>
              <p className="text-yellow-300 text-xl font-black">{second.total_points} pts</p>
            </div>
            <div className="bg-gray-500 w-48 h-24 rounded-t-lg mt-2 flex items-center justify-center">
              <span className="text-4xl">🥈</span>
            </div>
          </div>
        )}

        {/* 1ère place */}
        {first && (
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg p-6 w-56 h-40 flex flex-col items-center justify-center border-4 border-yellow-500 shadow-2xl transform scale-110">
              <p className="text-7xl font-black text-white mb-2">1</p>
              <p className="text-white font-black text-center text-lg">{first.pilot_prenom} {first.pilot_nom}</p>
              <p className="text-white text-2xl font-black">{first.total_points} pts</p>
            </div>
            <div className="bg-yellow-500 w-56 h-32 rounded-t-lg mt-2 flex items-center justify-center">
              <span className="text-5xl">🏆</span>
            </div>
          </div>
        )}

        {/* 3ème place */}
        {third && (
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg p-6 w-48 h-28 flex flex-col items-center justify-center border-4 border-orange-500 shadow-2xl">
              <p className="text-5xl font-black text-white mb-2">3</p>
              <p className="text-white font-bold text-center">{third.pilot_prenom} {third.pilot_nom}</p>
              <p className="text-yellow-300 text-xl font-black">{third.total_points} pts</p>
            </div>
            <div className="bg-orange-500 w-48 h-20 rounded-t-lg mt-2 flex items-center justify-center">
              <span className="text-4xl">🥉</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChampionshipDashboard;