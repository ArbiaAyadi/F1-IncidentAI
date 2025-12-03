import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Créer une instance axios avec configuration par défaut
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Service pour la gestion des circuits
const circuitService = {
  // Récupérer tous les circuits
  getAllCircuits: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/circuits/', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer un circuit par ID
  getCircuitById: async (id) => {
    try {
      const response = await axiosInstance.get(`/circuits/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Créer un nouveau circuit
  createCircuit: async (circuitData) => {
    try {
      const response = await axiosInstance.post('/circuits/', circuitData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mettre à jour un circuit
  updateCircuit: async (id, circuitData) => {
    try {
      const response = await axiosInstance.put(`/circuits/${id}/`, circuitData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mettre à jour partiellement un circuit
  patchCircuit: async (id, circuitData) => {
    try {
      const response = await axiosInstance.patch(`/circuits/${id}/`, circuitData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Supprimer un circuit
  deleteCircuit: async (id) => {
    try {
      const response = await axiosInstance.delete(`/circuits/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer les circuits actifs uniquement
  getActiveCircuits: async () => {
    try {
      const response = await axiosInstance.get('/circuits/actifs/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer les circuits groupés par pays
  getCircuitsByCountry: async () => {
    try {
      const response = await axiosInstance.get('/circuits/par_pays/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer les statistiques des circuits
  getStatistics: async () => {
    try {
      const response = await axiosInstance.get('/circuits/statistiques/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Filtrer les circuits
  filterCircuits: async (filters) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.type_circuit) params.append('type_circuit', filters.type_circuit);
      if (filters.pays) params.append('pays', filters.pays);
      if (filters.actif !== undefined) params.append('actif', filters.actif);
      if (filters.search) params.append('search', filters.search);
      if (filters.ordering) params.append('ordering', filters.ordering);
      
      const response = await axiosInstance.get('/circuits/', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Rechercher des circuits
  searchCircuits: async (searchTerm) => {
    try {
      const response = await axiosInstance.get('/circuits/', {
        params: { search: searchTerm }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default circuitService;