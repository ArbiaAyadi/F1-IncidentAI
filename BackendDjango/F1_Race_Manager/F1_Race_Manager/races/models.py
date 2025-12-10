from django.db import models
from circuits.models import Circuit
from pilots.models import Pilote

class Season(models.Model):
    """Saison F1"""
    annee = models.IntegerField(unique=True, verbose_name="Année")
    actif = models.BooleanField(default=True, verbose_name="Saison active")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Saison"
        verbose_name_plural = "Saisons"
        ordering = ['-annee']
    
    def __str__(self):
        return f"Saison {self.annee}"


class Race(models.Model):
    """Course de Formule 1"""
    METEO_CHOICES = [
        ('ensoleille', 'Ensoleillé'),
        ('nuageux', 'Nuageux'),
        ('pluvieux', 'Pluvieux'),
        ('orage', 'Orage'),
    ]
    
    STATUT_CHOICES = [
        ('planifie', 'Planifié'),
        ('en_cours', 'En cours'),
        ('termine', 'Terminé'),
        ('annule', 'Annulé'),
    ]
    
    nom = models.CharField(max_length=200, verbose_name="Nom de la course")
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name='races', verbose_name="Saison")
    circuit = models.ForeignKey(Circuit, on_delete=models.CASCADE, related_name='races', verbose_name="Circuit")
    date = models.DateField(verbose_name="Date de la course")
    heure = models.TimeField(blank=True, null=True, verbose_name="Heure de départ")
    meteo = models.CharField(max_length=20, choices=METEO_CHOICES, default='ensoleille', verbose_name="Météo")
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='planifie', verbose_name="Statut")
    numero_manche = models.PositiveIntegerField(verbose_name="Numéro de manche", help_text="Position dans le calendrier")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Course"
        verbose_name_plural = "Courses"
        ordering = ['season', 'date']
        unique_together = ['season', 'numero_manche']
    
    def __str__(self):
        return f"{self.nom} - {self.season.annee}"


class RaceStrategy(models.Model):
    """Stratégie de course pour un pilote"""
    TYPE_PNEU_CHOICES = [
        ('soft', 'Soft (Tendre)'),
        ('medium', 'Medium (Moyen)'),
        ('hard', 'Hard (Dur)'),
        ('intermediate', 'Intermédiaire'),
        ('wet', 'Pluie'),
    ]
    
    RESULTAT_CHOICES = [
        ('reussi', 'Réussi'),
        ('partiellement_reussi', 'Partiellement réussi'),
        ('echec', 'Échec'),
        ('non_applique', 'Non appliqué'),
    ]
    
    race = models.ForeignKey(Race, on_delete=models.CASCADE, related_name='strategies', verbose_name="Course")
    pilot = models.ForeignKey(Pilote, on_delete=models.CASCADE, related_name='strategies', verbose_name="Pilote")
    
    # Pneumatiques
    pneu_depart = models.CharField(max_length=20, choices=TYPE_PNEU_CHOICES, verbose_name="Pneu de départ")
    pneu_stint2 = models.CharField(max_length=20, choices=TYPE_PNEU_CHOICES, blank=True, null=True, verbose_name="Pneu stint 2")
    pneu_stint3 = models.CharField(max_length=20, choices=TYPE_PNEU_CHOICES, blank=True, null=True, verbose_name="Pneu stint 3")
    pneu_stint4 = models.CharField(max_length=20, choices=TYPE_PNEU_CHOICES, blank=True, null=True, verbose_name="Pneu stint 4")
    
    # Stratégie d'arrêts
    nombre_pitstops = models.PositiveIntegerField(default=1, verbose_name="Nombre de pitstops")
    tour_pitstop1 = models.PositiveIntegerField(blank=True, null=True, verbose_name="Tour pitstop 1")
    tour_pitstop2 = models.PositiveIntegerField(blank=True, null=True, verbose_name="Tour pitstop 2")
    tour_pitstop3 = models.PositiveIntegerField(blank=True, null=True, verbose_name="Tour pitstop 3")
    
    # Carburant et météo
    consommation_carburant = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        verbose_name="Consommation carburant (kg)",
        help_text="Carburant prévu en kg"
    )
    meteo_prevue = models.CharField(max_length=20, choices=Race.METEO_CHOICES, verbose_name="Météo prévue")
    temperature_piste = models.DecimalField(
        max_digits=4, 
        decimal_places=1, 
        blank=True, 
        null=True,
        verbose_name="Température piste (°C)"
    )
    
    # Résultat de la stratégie
    resultat_strategie = models.CharField(
        max_length=30, 
        choices=RESULTAT_CHOICES, 
        default='non_applique',
        verbose_name="Résultat de la stratégie"
    )
    notes = models.TextField(blank=True, null=True, verbose_name="Notes sur la stratégie")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Stratégie de course"
        verbose_name_plural = "Stratégies de course"
        ordering = ['race', 'pilot']
        unique_together = ['race', 'pilot']
    
    def __str__(self):
        return f"{self.pilot.nom} - {self.race.nom} ({self.nombre_pitstops} stop{'s' if self.nombre_pitstops > 1 else ''})"


class RaceResult(models.Model):
    """Résultat d'un pilote dans une course"""
    race = models.ForeignKey(Race, on_delete=models.CASCADE, related_name='results', verbose_name="Course")
    pilot = models.ForeignKey(Pilote, on_delete=models.CASCADE, related_name='race_results', verbose_name="Pilote")
    position = models.PositiveIntegerField(verbose_name="Position finale")
    points = models.PositiveIntegerField(default=0, verbose_name="Points marqués")
    temps_total = models.CharField(max_length=20, blank=True, null=True, verbose_name="Temps total")
    meilleur_tour = models.CharField(max_length=20, blank=True, null=True, verbose_name="Meilleur tour")
    tours_completés = models.PositiveIntegerField(default=0, verbose_name="Tours complétés")
    statut_course = models.CharField(
        max_length=50, 
        default='Terminé',
        verbose_name="Statut",
        help_text="Terminé, Abandon, DNF, etc."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Résultat de course"
        verbose_name_plural = "Résultats de course"
        ordering = ['race', 'position']
        unique_together = ['race', 'pilot']
    
    def __str__(self):
        return f"{self.pilot.nom} - {self.race.nom} (P{self.position})"
    
    def save(self, *args, **kwargs):
        # Attribution automatique des points selon le système F1 2024
        points_system = {
            1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
            6: 8, 7: 6, 8: 4, 9: 2, 10: 1
        }
        self.points = points_system.get(self.position, 0)
        super().save(*args, **kwargs)


class Championship(models.Model):
    """Classement du championnat par saison"""
    season = models.ForeignKey(Season, on_delete=models.CASCADE, related_name='championships', verbose_name="Saison")
    pilot = models.ForeignKey(Pilote, on_delete=models.CASCADE, related_name='championships', verbose_name="Pilote")
    total_points = models.PositiveIntegerField(default=0, verbose_name="Total de points")
    position = models.PositiveIntegerField(verbose_name="Position au classement")
    victoires = models.PositiveIntegerField(default=0, verbose_name="Nombre de victoires")
    podiums = models.PositiveIntegerField(default=0, verbose_name="Nombre de podiums")
    courses_completes = models.PositiveIntegerField(default=0, verbose_name="Courses terminées")
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Classement championnat"
        verbose_name_plural = "Classements championnat"
        ordering = ['season', 'position']
        unique_together = ['season', 'pilot']
    
    def __str__(self):
        return f"{self.pilot.nom} - Saison {self.season.annee} (P{self.position})"