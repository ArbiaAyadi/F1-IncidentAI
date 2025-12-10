from rest_framework import serializers
from .models import Team, TeamPilot

class TeamSerializer(serializers.ModelSerializer):
    total_championnats = serializers.ReadOnlyField()
    
    class Meta:
        model = Team
        fields = [
            'id', 'nom', 'nom_complet', 'budget', 'quartier_general', 'pays',
            'directeur', 'directeur_technique', 'moteur', 'chassis',
            'sponsor_principal', 'autres_sponsors', 'annee_creation',
            'championnats_constructeurs', 'championnats_pilotes', 'total_championnats',
            'couleur_principale', 'couleur_secondaire', 'logo_url', 'actif',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'total_championnats', 'created_at', 'updated_at']
    
    def validate_budget(self, value):
        """Valide que le budget est positif"""
        if value < 0:
            raise serializers.ValidationError("Le budget doit être positif")
        return value


class TeamListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste"""
    total_championnats = serializers.ReadOnlyField()
    
    class Meta:
        model = Team
        fields = [
            'id', 'nom', 'budget', 'quartier_general', 'pays', 'directeur',
            'moteur', 'sponsor_principal', 'championnats_constructeurs',
            'total_championnats', 'actif', 'logo_url'
        ]


class TeamPilotSerializer(serializers.ModelSerializer):
    team_nom = serializers.CharField(source='team.nom', read_only=True)
    pilot_nom = serializers.CharField(source='pilot.nom', read_only=True)
    pilot_prenom = serializers.CharField(source='pilot.prenom', read_only=True)
    season_annee = serializers.IntegerField(source='season.annee', read_only=True)
    
    class Meta:
        model = TeamPilot
        fields = [
            'id', 'team', 'team_nom', 'pilot', 'pilot_nom', 'pilot_prenom',
            'season', 'season_annee', 'numero_pilote', 'pilote_principal',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at']