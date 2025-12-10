from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Count, Q
from .models import Season, Race, RaceResult, Championship, RaceStrategy
from .serializers import (
    SeasonSerializer, RaceSerializer, RaceListSerializer,
    RaceResultSerializer, ChampionshipSerializer, RaceStrategySerializer
)


class SeasonViewSet(viewsets.ModelViewSet):
    """Gestion des saisons F1"""
    queryset = Season.objects.all()
    serializer_class = SeasonSerializer
    permission_classes = [IsAuthenticated]
    ordering = ['-annee']
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Retourne la saison active"""
        season = self.queryset.filter(actif=True).first()
        if season:
            serializer = self.get_serializer(season)
            return Response(serializer.data)
        return Response({'message': 'Aucune saison active'}, status=404)


class RaceViewSet(viewsets.ModelViewSet):
    """Gestion des courses F1"""
    queryset = Race.objects.all()
    serializer_class = RaceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['season', 'circuit', 'statut', 'meteo']
    search_fields = ['nom', 'circuit__nom']
    ordering_fields = ['date', 'numero_manche']
    ordering = ['date']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return RaceListSerializer
        return RaceSerializer
    
    @action(detail=False, methods=['get'])
    def calendar(self, request):
        """Calendrier des courses par saison"""
        season_id = request.query_params.get('season')
        if season_id:
            races = self.queryset.filter(season_id=season_id)
        else:
            races = self.queryset.filter(season__actif=True)
        
        serializer = RaceListSerializer(races, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_result(self, request, pk=None):
        """Ajouter un résultat à une course"""
        race = self.get_object()
        serializer = RaceResultSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(race=race)
            self._update_championship(race.season)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        """Résultats d'une course"""
        race = self.get_object()
        results = race.results.all().order_by('position')
        serializer = RaceResultSerializer(results, many=True)
        return Response(serializer.data)
    
    def _update_championship(self, season):
        """Met à jour le classement du championnat"""
        # Récupérer tous les résultats de la saison
        results = RaceResult.objects.filter(race__season=season)
        
        # Grouper par pilote
        pilot_stats = results.values('pilot').annotate(
            total_points=Sum('points'),
            victoires=Count('id', filter=Q(position=1)),
            podiums=Count('id', filter=Q(position__lte=3)),
            courses=Count('id')
        ).order_by('-total_points')
        
        # Mettre à jour ou créer les classements
        for idx, stat in enumerate(pilot_stats, start=1):
            Championship.objects.update_or_create(
                season=season,
                pilot_id=stat['pilot'],
                defaults={
                    'position': idx,
                    'total_points': stat['total_points'],
                    'victoires': stat['victoires'],
                    'podiums': stat['podiums'],
                    'courses_completes': stat['courses']
                }
            )


class RaceResultViewSet(viewsets.ModelViewSet):
    """Gestion des résultats de course"""
    queryset = RaceResult.objects.all()
    serializer_class = RaceResultSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['race', 'pilot', 'position']


class ChampionshipViewSet(viewsets.ReadOnlyModelViewSet):
    """Classement du championnat (lecture seule)"""
    queryset = Championship.objects.all()
    serializer_class = ChampionshipSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['season', 'pilot']
    ordering = ['position']
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        """Classement de la saison active"""
        season = Season.objects.filter(actif=True).first()
        if not season:
            return Response({'message': 'Aucune saison active'}, status=404)
        
        championship = self.queryset.filter(season=season).order_by('position')
        serializer = self.get_serializer(championship, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def update_standings(self, request):
        """Recalculer le classement d'une saison"""
        season_id = request.data.get('season')
        if not season_id:
            return Response({'error': 'season_id requis'}, status=400)
        
        try:
            season = Season.objects.get(id=season_id)
            # Utiliser la méthode de mise à jour du RaceViewSet
            race_viewset = RaceViewSet()
            race_viewset._update_championship(season)
            
            return Response({'message': 'Classement mis à jour avec succès'})
        except Season.DoesNotExist:
            return Response({'error': 'Saison non trouvée'}, status=404)


class RaceStrategyViewSet(viewsets.ModelViewSet):
    """Gestion des stratégies de course"""
    queryset = RaceStrategy.objects.all()
    serializer_class = RaceStrategySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['race', 'pilot', 'nombre_pitstops', 'resultat_strategie']
    
    @action(detail=False, methods=['get'])
    def by_race(self, request):
        """Stratégies pour une course spécifique"""
        race_id = request.query_params.get('race_id')
        if not race_id:
            return Response({'error': 'race_id requis'}, status=400)
        
        strategies = self.queryset.filter(race_id=race_id)
        serializer = self.get_serializer(strategies, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Statistiques sur les stratégies"""
        race_id = request.query_params.get('race_id')
        queryset = self.queryset.filter(race_id=race_id) if race_id else self.queryset
        
        stats = {
            'total': queryset.count(),
            'par_pitstops': {
                '1_stop': queryset.filter(nombre_pitstops=1).count(),
                '2_stops': queryset.filter(nombre_pitstops=2).count(),
                '3_stops': queryset.filter(nombre_pitstops=3).count(),
            },
            'par_resultat': {
                'reussi': queryset.filter(resultat_strategie='reussi').count(),
                'partiellement_reussi': queryset.filter(resultat_strategie='partiellement_reussi').count(),
                'echec': queryset.filter(resultat_strategie='echec').count(),
            },
            'pneu_depart_populaire': queryset.values('pneu_depart').annotate(
                count=Count('id')
            ).order_by('-count').first()
        }
        
        return Response(stats) 