from rest_framework import serializers
from .models import Circuit

class CircuitSerializer(serializers.ModelSerializer):
    distance_totale = serializers.ReadOnlyField()
    
    class Meta:
        model = Circuit
        fields = [
            'id',
            'nom',
            'pays',
            'ville',
            'longueur',
            'type_circuit',
            'nombre_tours',
            'premiere_course',
            'record_tour',
            'detenteur_record',
            'description',
            'image_url',
            'actif',
            'distance_totale',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'distance_totale']
    
    def validate_longueur(self, value):
        """Valide que la longueur est positive"""
        if value <= 0:
            raise serializers.ValidationError("La longueur doit être supérieure à 0")
        if value > 20:
            raise serializers.ValidationError("La longueur ne peut pas dépasser 20 km")
        return value
    
    def validate_nombre_tours(self, value):
        """Valide que le nombre de tours est valide"""
        if value <= 0:
            raise serializers.ValidationError("Le nombre de tours doit être supérieur à 0")
        if value > 100:
            raise serializers.ValidationError("Le nombre de tours ne peut pas dépasser 100")
        return value
    
    def validate_premiere_course(self, value):
        """Valide l'année de la première course"""
        if value and (value < 1950 or value > 2030):
            raise serializers.ValidationError("L'année doit être entre 1950 et 2030")
        return value


class CircuitListSerializer(serializers.ModelSerializer):
    """Serializer simplifié pour la liste des circuits"""
    distance_totale = serializers.ReadOnlyField()
    
    class Meta:
        model = Circuit
        fields = [
            'id',
            'nom',
            'pays',
            'ville',
            'longueur',
            'type_circuit',
            'nombre_tours',
            'distance_totale',
            'actif',
            'image_url',
        ]