from rest_framework import serializers
from .models import RaceStrategy, Season, Race, RaceResult, Championship
from circuits.serializers import CircuitListSerializer
from pilots.serializers import PiloteSerializer


class RaceStrategySerializer(serializers.ModelSerializer):
    pilot_nom = serializers.CharField(source='pilot.nom', read_only=True)
    pilot_prenom = serializers.CharField(source='pilot.prenom', read_only=True)
    pilot_numero = serializers.IntegerField(source='pilot.numero', read_only=True)
    
    class Meta:
        model = RaceStrategy
        fields = [
            'id', 'race', 'pilot', 'pilot_nom', 'pilot_prenom', 'pilot_numero',
            'pneu_depart', 'pneu_stint2', 'pneu_stint3', 'pneu_stint4',
            'nombre_pitstops', 'tour_pitstop1', 'tour_pitstop2', 'tour_pitstop3',
            'consommation_carburant', 'meteo_prevue', 'temperature_piste',
            'resultat_strategie', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        
class SeasonSerializer(serializers.ModelSerializer):
    nombre_courses = serializers.SerializerMethodField()
    
    class Meta:
        model = Season
        fields = ['id', 'annee', 'actif', 'nombre_courses', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def get_nombre_courses(self, obj):
        return obj.races.count()


class RaceResultSerializer(serializers.ModelSerializer):
    pilot_nom = serializers.CharField(source='pilot.nom', read_only=True)
    pilot_prenom = serializers.CharField(source='pilot.prenom', read_only=True)
    pilot_numero = serializers.IntegerField(source='pilot.numero', read_only=True)
    
    class Meta:
        model = RaceResult
        fields = [
            'id', 'race', 'pilot', 'pilot_nom', 'pilot_prenom', 'pilot_numero',
            'position', 'points', 'temps_total', 'meilleur_tour',
            'tours_completés', 'statut_course', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'points', 'created_at', 'updated_at']


class RaceSerializer(serializers.ModelSerializer):
    circuit_nom = serializers.CharField(source='circuit.nom', read_only=True)
    circuit_pays = serializers.CharField(source='circuit.pays', read_only=True)
    season_annee = serializers.IntegerField(source='season.annee', read_only=True)
    results = RaceResultSerializer(many=True, read_only=True)
    nombre_participants = serializers.SerializerMethodField()
    
    class Meta:
        model = Race
        fields = [
            'id', 'nom', 'season', 'season_annee', 'circuit', 'circuit_nom', 
            'circuit_pays', 'date', 'heure', 'meteo', 'statut', 'numero_manche',
            'results', 'nombre_participants', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_nombre_participants(self, obj):
        return obj.results.count()


class RaceListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste"""
    circuit_nom = serializers.CharField(source='circuit.nom', read_only=True)
    season_annee = serializers.IntegerField(source='season.annee', read_only=True)
    
    class Meta:
        model = Race
        fields = [
            'id', 'nom', 'season_annee', 'circuit_nom', 
            'date', 'meteo', 'statut', 'numero_manche'
        ]


class ChampionshipSerializer(serializers.ModelSerializer):
    pilot_nom = serializers.CharField(source='pilot.nom', read_only=True)
    pilot_prenom = serializers.CharField(source='pilot.prenom', read_only=True)
    pilot_numero = serializers.IntegerField(source='pilot.numero', read_only=True)
    pilot_nationalite = serializers.CharField(source='pilot.nationalite', read_only=True)
    season_annee = serializers.IntegerField(source='season.annee', read_only=True)
    
    class Meta:
        model = Championship
        fields = [
            'id', 'season', 'season_annee', 'pilot', 'pilot_nom', 'pilot_prenom',
            'pilot_numero', 'pilot_nationalite', 'position', 'total_points',
            'victoires', 'podiums', 'courses_completes', 'updated_at'
        ]
        read_only_fields = ['id', 'updated_at']