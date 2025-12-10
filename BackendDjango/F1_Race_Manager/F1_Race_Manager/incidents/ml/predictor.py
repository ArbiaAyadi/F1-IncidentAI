# incidents/ml/predictor.py

import numpy as np
import joblib
import os
from tensorflow import keras
import json

class F1IncidentPredictor:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if self._initialized:
            return
        
        print("🔄 Chargement du modèle F1 Incident Predictor...")
        
        base_dir = os.path.dirname(__file__)
        weights_dir = os.path.join(base_dir, 'weights')
        
        # Vérifier que le dossier existe
        if not os.path.exists(weights_dir):
            raise FileNotFoundError(f"❌ Dossier weights introuvable: {weights_dir}")
        
        # Charger le modèle
        model_path = os.path.join(weights_dir, 'f1_model.h5')
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"❌ Modèle introuvable: {model_path}")
        
        self.model = keras.models.load_model(model_path)
        print("✅ Modèle CNN+LSTM chargé")
        
        # Charger les preprocesseurs
        self.scaler_static = joblib.load(os.path.join(weights_dir, 'scaler_static.pkl'))
        self.scaler_seq = joblib.load(os.path.join(weights_dir, 'scaler_seq.pkl'))
        self.encoders = joblib.load(os.path.join(weights_dir, 'encoders.pkl'))
        print("✅ Scalers et encoders chargés")
        
        # Charger métadonnées
        with open(os.path.join(weights_dir, 'metadata.json'), 'r') as f:
            self.metadata = json.load(f)
        
        self._initialized = True
        print(f"✅ Prédicteur initialisé (Accuracy: {self.metadata['test_accuracy']:.2%})")
    
    def predict(self, pilot_data, circuit_data, lap_times, race_data):
        """
        Prédit les risques d'incidents
        
        Args:
            pilot_data: dict avec 'code', 'team_slug'
            circuit_data: dict avec 'slug'
            lap_times: list de millisecondes
            race_data: dict avec 'grid_position', 'year', etc.
        
        Returns:
            dict avec probabilités par type d'incident
        """
        # Encodage
        driver_enc = self._safe_encode('driver', pilot_data.get('code', 'unknown'))
        circuit_enc = self._safe_encode('circuit', circuit_data.get('slug', 'unknown'))
        constructor_enc = self._safe_encode('constructor', pilot_data.get('team_slug', 'unknown'))
        
        # Features statiques [8 features]
        X_static = np.array([[
            race_data.get('grid_position', 10),
            circuit_enc,
            driver_enc,
            constructor_enc,
            race_data.get('year', 2024),
            len(lap_times) if lap_times else 0,
            race_data.get('num_pit_stops', 0),
            race_data.get('position_change', 0)
        ]])
        
        X_static_scaled = self.scaler_static.transform(X_static)
        
        # Séquence temporelle
        seq_length = self.metadata['seq_length']
        
        if not lap_times or len(lap_times) == 0:
            lap_times = [90000] * seq_length  # Temps par défaut
        elif len(lap_times) < seq_length:
            avg = np.mean(lap_times)
            lap_times = [avg] * (seq_length - len(lap_times)) + list(lap_times)
        
        lap_times = lap_times[-seq_length:]
        
        X_seq = np.array([lap_times]).reshape(1, seq_length, 1)
        X_seq_scaled = self.scaler_seq.transform(
            X_seq.reshape(1, seq_length)
        ).reshape(1, seq_length, 1)
        
        # Prédiction
        proba = self.model.predict([X_static_scaled, X_seq_scaled], verbose=0)[0]
        
        # Résultats
        classes = self.metadata['classes']
        result = {cls: float(proba[i]) for i, cls in enumerate(classes)}
        
        # Calculer risque total (exclure safety_car)
        result['risque_total'] = float(sum([
            v for k, v in result.items() 
            if k != 'safety_car'
        ]))
        
        return result
    
    def _safe_encode(self, encoder_type, value):
        """Encode avec fallback"""
        try:
            return self.encoders[encoder_type].transform([value])[0]
        except:
            return 0  # Valeur par défaut
    
    def get_info(self):
        """Retourne les infos du modèle"""
        return {
            'version': self.metadata.get('model_version', '1.0'),
            'accuracy': self.metadata.get('test_accuracy', 0.0),
            'classes': self.metadata.get('classes', []),
            'seq_length': self.metadata.get('seq_length', 10),
            'trained_date': self.metadata.get('trained_date', 'Unknown')
        }