import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

let isRefreshing = false;           // verrou pour ne pas multiplier les refresh

const getAuthToken   = () => localStorage.getItem('token');
const getRefreshToken = () => localStorage.getItem('refreshToken');

/* ---------- instance axios ---------- */
const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

/* ---------- intercepteurs ---------- */
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,                       // tout va bien
  async (err) => {                     // erreur → gestion refresh
    const orig = err.config;

    if (err.response?.status === 401 && !orig._retry && !isRefreshing) {
      orig._retry = true;
      isRefreshing = true;

      const refreshTkn = getRefreshToken();
      if (!refreshTkn) {                // pas de refresh → on laisse l’erreur remonter
        isRefreshing = false;
        return Promise.reject(err);
      }

      try {                             // tentative de refresh
        const { data } = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshTkn,
        });
        const newAccess = data.access;
        localStorage.setItem('token', newAccess);
        apiClient.defaults.headers.Authorization = `Bearer ${newAccess}`;
        orig.headers.Authorization = `Bearer ${newAccess}`;
        isRefreshing = false;
        return apiClient(orig);         // on rejoue la requête
      } catch (refreshErr) {            // refresh échoué → on nettoie et on laisse l’erreur remonter
        isRefreshing = false;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);         // autre erreur
  }
);

/* ---------- service métier ---------- */
const incidentService = {
  predictRaceIncidents: (raceId) =>
    apiClient.get(`/incidents/predict/race/${raceId}/`).then((r) => r.data),

  predictPilotRisk: (pilotId, raceId) =>
    apiClient.get(`/incidents/predict/pilot/${pilotId}/`, {
      params: { race_id: raceId },
    }).then((r) => r.data),
};

export default incidentService;