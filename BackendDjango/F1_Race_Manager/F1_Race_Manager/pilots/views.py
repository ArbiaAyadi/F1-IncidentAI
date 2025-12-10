
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .models import Pilote
from .serializers import PiloteSerializer, UserSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Utilisateur créé avec succès',
            'user': serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PiloteViewSet(viewsets.ModelViewSet):
    queryset = Pilote.objects.all()
    serializer_class = PiloteSerializer
    permission_classes = [AllowAny]  # Changé de IsAuthenticated à AllowAny pour supprimer l'authentification
    filter_backends = [filters.SearchFilter]
    search_fields = ['nom', 'equipe', 'nationalite']
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_pilotes = self.queryset.count()
        total_victoires = sum(p.victoires for p in self.queryset)
        total_podiums = sum(p.podiums for p in self.queryset)
        equipes = self.queryset.values_list('equipe', flat=True).distinct().count()
        
        return Response({
            'total_pilotes': total_pilotes,
            'total_victoires': total_victoires,
            'total_podiums': total_podiums,
            'total_equipes': equipes
        })
