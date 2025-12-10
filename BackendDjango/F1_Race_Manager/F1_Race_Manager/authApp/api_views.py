from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .serializers import (
    UserSerializer, 
    RegisterSerializer, 
    LoginSerializer,
    ChangePasswordSerializer
)


class RegisterAPIView(generics.CreateAPIView):
    """API: Inscription d'un nouvel utilisateur"""
    
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Utilisateur créé avec succès'
        }, status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
    """API: Connexion et génération de tokens JWT"""
    
    permission_classes = (AllowAny,)
    serializer_class = LoginSerializer
    
    def post(self, request):
        serializer = self.serializer_class(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # Générer les tokens JWT
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'message': 'Connexion réussie'
        }, status=status.HTTP_200_OK)


class LogoutAPIView(APIView):
    """API: Déconnexion et blacklist du refresh token"""
    
    permission_classes = (IsAuthenticated,)
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({
                'message': 'Déconnexion réussie'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': 'Token invalide'
            }, status=status.HTTP_400_BAD_REQUEST)


class UserProfileAPIView(generics.RetrieveUpdateAPIView):
    """API: Voir et modifier le profil utilisateur"""
    
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    
    def get_object(self):
        return self.request.user


class ChangePasswordAPIView(APIView):
    """API: Changer le mot de passe"""
    
    permission_classes = (IsAuthenticated,)
    
    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            return Response({
                'message': 'Mot de passe modifié avec succès'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RefreshTokenAPIView(APIView):
    """API: Rafraîchir l'access token"""
    
    permission_classes = (AllowAny,)
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response({
                    'error': 'Refresh token requis'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            refresh = RefreshToken(refresh_token)
            
            return Response({
                'access': str(refresh.access_token)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': 'Token invalide ou expiré'
            }, status=status.HTTP_400_BAD_REQUEST)