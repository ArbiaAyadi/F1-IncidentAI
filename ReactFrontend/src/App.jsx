import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import MainDashboard from './pages/MainDashboard';
import PilotesDashboard from './pages/PilotesDashboard';
import CircuitsDashboard from './pages/CircuitsDashboard';
import RacesDashboard from './pages/RacesDashboard';
import ChampionshipDashboard from './pages/ChampionshipDashboard';
import StrategyDashboard from './pages/StrategyDashboard';
import TeamsDashboard from './pages/TeamsDashboard';
import IncidentDashboard from './pages/IncidentDashboard';  

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
                        
            {/* Dashboard principal - PAGE D'ACCUEIL APRÈS LOGIN */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <MainDashboard />
                </PrivateRoute>
              }
            />
            
            {/* Module Gestion des Pilotes */}
            <Route
              path="/pilotes"
              element={
                <PrivateRoute>
                  <PilotesDashboard />
                </PrivateRoute>
              }
            />

            {/* Module Gestion des Circuits */}
            <Route
              path="/circuits"
              element={
                <PrivateRoute>
                  <CircuitsDashboard />
                </PrivateRoute>
              }
            />

            {/* Module Gestion des Courses */}
            <Route
              path="/races"
              element={
                <PrivateRoute>
                  <RacesDashboard />
                </PrivateRoute>
              }
            />
            {/* Classement Championnat */}
            <Route
              path="/championship"
              element={
                <PrivateRoute>
                  <ChampionshipDashboard />
                </PrivateRoute>
              }
            />     
            {/* Stratégies de Course */}
            <Route
              path="/strategies"
              element={
                <PrivateRoute>
                  <StrategyDashboard />
                </PrivateRoute>
              }
            />                  
            {/* Gestion des Équipes */}
            <Route
              path="/teams"
              element={
                <PrivateRoute>
                  <TeamsDashboard />
                </PrivateRoute>
              }
            />    
            {/* 🆕 Dashboard Prédiction d'Incidents IA */}
            <Route
              path="/incidents"
              element={
                <PrivateRoute>
                  <IncidentDashboard />
                </PrivateRoute>
              }
            />            

            {/* Profil utilisateur */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            
            {/* Changement de mot de passe */}
            <Route
              path="/change-password"
              element={
                <PrivateRoute>
                  <ChangePassword />
                </PrivateRoute>
              }
            />

            {/* Redirection par défaut */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;