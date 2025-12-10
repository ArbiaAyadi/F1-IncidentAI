from django.db import models
from pilots.models import Pilote
from races.models import Season

class Team(models.Model):
    """Équipe de Formule 1"""
    nom = models.CharField(max_length=200, unique=True, verbose_name="Nom de l'équipe")
    nom_complet = models.CharField(max_length=300, blank=True, null=True, verbose_name="Nom complet")
    budget = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        verbose_name="Budget annuel",
        help_text="Budget en millions USD"
    )
    quartier_general = models.CharField(max_length=200, verbose_name="Quartier général")
    pays = models.CharField(max_length=100, verbose_name="Pays")
    directeur = models.CharField(max_length=200, verbose_name="Directeur d'équipe")
    directeur_technique = models.CharField(
        max_length=200, 
        blank=True, 
        null=True,
        verbose_name="Directeur technique"
    )
    
    # Moteurs et technique
    moteur = models.CharField(max_length=100, verbose_name="Moteur utilisé")
    chassis = models.CharField(max_length=100, blank=True, null=True, verbose_name="Châssis")
    
    # Sponsors
    sponsor_principal = models.CharField(max_length=200, blank=True, null=True, verbose_name="Sponsor principal")
    autres_sponsors = models.TextField(blank=True, null=True, verbose_name="Autres sponsors")
    
    # Informations supplémentaires
    annee_creation = models.IntegerField(blank=True, null=True, verbose_name="Année de création")
    championnats_constructeurs = models.PositiveIntegerField(
        default=0,
        verbose_name="Championnats constructeurs",
        help_text="Nombre de championnats constructeurs gagnés"
    )
    championnats_pilotes = models.PositiveIntegerField(
        default=0,
        verbose_name="Championnats pilotes",
        help_text="Nombre de championnats pilotes gagnés"
    )
    
    # Couleurs et branding
    couleur_principale = models.CharField(max_length=50, blank=True, null=True, verbose_name="Couleur principale")
    couleur_secondaire = models.CharField(max_length=50, blank=True, null=True, verbose_name="Couleur secondaire")
    logo_url = models.URLField(blank=True, null=True, verbose_name="URL du logo")
    
    # Statut
    actif = models.BooleanField(default=True, verbose_name="Équipe active")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Équipe"
        verbose_name_plural = "Équipes"
        ordering = ['nom']
    
    def __str__(self):
        return self.nom
    
    @property
    def total_championnats(self):
        """Total des championnats gagnés"""
        return self.championnats_constructeurs + self.championnats_pilotes


class TeamPilot(models.Model):
    """Relation entre une équipe et un pilote pour une saison"""

    
    team = models.ForeignKey('Team', on_delete=models.CASCADE, related_name='team_pilots', verbose_name="Équipe")
    pilot = models.ForeignKey(Pilote, on_delete=models.CASCADE, related_name='team_contracts', verbose_name="Pilote")
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name='team_pilots', verbose_name="Saison")
    numero_pilote = models.PositiveIntegerField(verbose_name="Numéro du pilote")
    pilote_principal = models.BooleanField(default=False, verbose_name="Pilote principal")
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Pilote d'équipe"
        verbose_name_plural = "Pilotes d'équipe"
        unique_together = ['team', 'pilot', 'season']
        ordering = ['season', 'team', '-pilote_principal']
    
    def __str__(self):
        return f"{self.pilot.nom} - {self.team.nom} ({self.season.annee})"