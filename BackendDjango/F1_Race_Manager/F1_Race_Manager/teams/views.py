from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Count, Avg
from .models import Team, TeamPilot
from .serializers import TeamSerializer, TeamListSerializer, TeamPilotSerializer


class TeamViewSet(viewsets.ModelViewSet):
    """Gestion des équipes F1"""
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['pays', 'actif', 'moteur']
    search_fields = ['nom', 'nom_complet', 'directeur', 'quartier_general']
    ordering_fields = ['nom', 'budget', 'championnats_constructeurs', 'annee_creation']
    ordering = ['nom']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return TeamListSerializer
        return TeamSerializer
    
    def list(self, request, *args, **kwargs):
        """Liste toutes les équipes"""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'count': queryset.count(),
            'results': serializer.data
        })
    
    def create(self, request, *args, **kwargs):
        """Crée une nouvelle équipe"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response(
            {
                'message': 'Équipe créée avec succès',
                'data': serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    
    def update(self, request, *args, **kwargs):
        """Met à jour une équipe"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            'message': 'Équipe mise à jour avec succès',
            'data': serializer.data
        })
    
    def destroy(self, request, *args, **kwargs):
        """Supprime une équipe"""
        instance = self.get_object()
        team_nom = instance.nom
        self.perform_destroy(instance)
        
        return Response(
            {
                'message': f'Équipe "{team_nom}" supprimée avec succès'
            },
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def actives(self, request):
        """Retourne uniquement les équipes actives"""
        teams = self.queryset.filter(actif=True)
        serializer = self.get_serializer(teams, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistiques(self, request):
        """Statistiques des équipes"""
        queryset = self.get_queryset()
        
        stats = {
            'total': queryset.count(),
            'actives': queryset.filter(actif=True).count(),
            'budget_total': queryset.aggregate(Sum('budget'))['budget__sum'],
            'budget_moyen': queryset.aggregate(Avg('budget'))['budget__avg'],
            'total_championnats_constructeurs': queryset.aggregate(
                Sum('championnats_constructeurs')
            )['championnats_constructeurs__sum'],
            'par_pays': list(queryset.values('pays').annotate(
                count=Count('id')
            ).order_by('-count')),
            'par_moteur': list(queryset.values('moteur').annotate(
                count=Count('id')
            ).order_by('-count')),
        }
        
        return Response(stats)
    
    @action(detail=True, methods=['get'])
    def pilots(self, request, pk=None):
        """Pilotes d'une équipe"""
        team = self.get_object()
        season_id = request.query_params.get('season')
        
        team_pilots = TeamPilot.objects.filter(team=team)
        if season_id:
            team_pilots = team_pilots.filter(season_id=season_id)
        
        serializer = TeamPilotSerializer(team_pilots, many=True)
        return Response(serializer.data)


class TeamPilotViewSet(viewsets.ModelViewSet):
    """Gestion des pilotes d'équipe"""
    queryset = TeamPilot.objects.all()
    serializer_class = TeamPilotSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['team', 'pilot', 'season', 'pilote_principal']
    
    @action(detail=False, methods=['get'])
    def by_season(self, request):
        """Pilotes par saison"""
        season_id = request.query_params.get('season_id')
        if not season_id:
            return Response({'error': 'season_id requis'}, status=400)
        
        team_pilots = self.queryset.filter(season_id=season_id).order_by('team', '-pilote_principal')
        serializer = self.get_serializer(team_pilots, many=True)
        return Response(serializer.data)
