from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from .models import Circuit
from .serializers import CircuitSerializer, CircuitListSerializer


class CircuitViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour gérer les circuits de Formule 1
    """
    queryset = Circuit.objects.all()
    serializer_class = CircuitSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Filtres
    filterset_fields = ['pays', 'type_circuit', 'actif']
    
    # Recherche
    search_fields = ['nom', 'pays', 'ville']
    
    # Tri
    ordering_fields = ['nom', 'pays', 'longueur', 'nombre_tours', 'premiere_course']
    ordering = ['nom']
    
    def get_serializer_class(self):
        """Utilise un serializer différent pour la liste"""
        if self.action == 'list':
            return CircuitListSerializer
        return CircuitSerializer
    
    def list(self, request, *args, **kwargs):
        """Liste tous les circuits"""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        
        return Response({
            'count': queryset.count(),
            'results': serializer.data
        })
    
    def create(self, request, *args, **kwargs):
        """Crée un nouveau circuit"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response(
            {
                'message': 'Circuit créé avec succès',
                'data': serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    
    def retrieve(self, request, *args, **kwargs):
        """Récupère les détails d'un circuit"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        """Met à jour un circuit"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            'message': 'Circuit mis à jour avec succès',
            'data': serializer.data
        })
    
    def destroy(self, request, *args, **kwargs):
        """Supprime un circuit"""
        instance = self.get_object()
        circuit_nom = instance.nom
        self.perform_destroy(instance)
        
        return Response(
            {
                'message': f'Circuit "{circuit_nom}" supprimé avec succès'
            },
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def actifs(self, request):
        """Retourne uniquement les circuits actifs"""
        circuits = self.queryset.filter(actif=True)
        serializer = self.get_serializer(circuits, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def par_pays(self, request):
        """Groupe les circuits par pays"""
        circuits = self.queryset.all()
        pays_dict = {}
        
        for circuit in circuits:
            if circuit.pays not in pays_dict:
                pays_dict[circuit.pays] = []
            pays_dict[circuit.pays].append(CircuitListSerializer(circuit).data)
        
        return Response(pays_dict)
    
    @action(detail=False, methods=['get'])
    def statistiques(self, request):
        """Retourne des statistiques sur les circuits"""
        queryset = self.get_queryset()
        
        stats = {
            'total': queryset.count(),
            'actifs': queryset.filter(actif=True).count(),
            'inactifs': queryset.filter(actif=False).count(),
            'par_type': {
                'urbain': queryset.filter(type_circuit='urbain').count(),
                'permanent': queryset.filter(type_circuit='permanent').count(),
                'semi_permanent': queryset.filter(type_circuit='semi-permanent').count(),
            },
            'longueur_moyenne': queryset.aggregate(
                models.Avg('longueur')
            )['longueur__avg'],
            'nombre_pays': queryset.values('pays').distinct().count(),
        }
        
        return Response(stats)
