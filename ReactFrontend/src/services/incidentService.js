import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const incidentService = {
  // Prédire les incidents pour une course
  predictRaceIncidents: async (raceId) => {
    const response = await axios.get(`${API_URL}/incidents/predict/race/${raceId}/`);
    return response.data;
  },

  // Prédire le risque pour un pilote
  predictPilotRisk: async (pilotId, raceId) => {
    const response = await axios.get(
      `${API_URL}/incidents/predict/pilot/${pilotId}/`,
      { params: { race_id: raceId } }
    );
    return response.data;
  },
};

export default incidentService;