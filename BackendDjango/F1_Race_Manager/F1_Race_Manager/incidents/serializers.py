from rest_framework import serializers

class IncidentPredictionSerializer(serializers.Serializer):
    pilot_id = serializers.IntegerField()
    pilot_name = serializers.CharField()
    pilot_code = serializers.CharField()
    team_name = serializers.CharField()
    risks = serializers.DictField()
    risk_level = serializers.CharField()
    recommendation = serializers.CharField()

class RaceIncidentAnalysisSerializer(serializers.Serializer):
    race_id = serializers.IntegerField()
    race_name = serializers.CharField()
    circuit_name = serializers.CharField()
    predictions = IncidentPredictionSerializer(many=True)
    statistics = serializers.DictField()