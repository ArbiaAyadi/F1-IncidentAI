from django.db import models

class Circuit(models.Model):
    TYPE_CHOICES = [
        ('urbain', 'Urbain'),
        ('permanent', 'Permanent'),
        ('semi-permanent', 'Semi-permanent'),
    ]
    
    nom = models.CharField(max_length=200, verbose_name="Nom du circuit")
    pays = models.CharField(max_length=100, verbose_name="Pays")
    ville = models.CharField(max_length=100, verbose_name="Ville", blank=True, null=True)
    longueur = models.DecimalField(
        max_digits=5, 
        decimal_places=3, 
        verbose_name="Longueur (km)",
        help_text="Longueur du circuit en kilomètres"
    )
    type_circuit = models.CharField(
        max_length=20, 
        choices=TYPE_CHOICES, 
        default='permanent',
        verbose_name="Type de circuit"
    )
    nombre_tours = models.PositiveIntegerField(
        verbose_name="Nombre de tours",
        help_text="Nombre de tours en course"
    )
    premiere_course = models.IntegerField(
        verbose_name="Première course F1",
        blank=True,
        null=True,
        help_text="Année de la première course F1"
    )
    record_tour = models.CharField(
        max_length=20,
        verbose_name="Record du tour",
        blank=True,
        null=True,
        help_text="Temps du record (ex: 1:24.123)"
    )
    detenteur_record = models.CharField(
        max_length=100,
        verbose_name="Détenteur du record",
        blank=True,
        null=True
    )
    description = models.TextField(
        verbose_name="Description",
        blank=True,
        null=True
    )
    image_url = models.URLField(
        verbose_name="URL de l'image",
        blank=True,
        null=True,
        help_text="URL de l'image du circuit"
    )
    actif = models.BooleanField(
        default=True,
        verbose_name="Circuit actif",
        help_text="Indique si le circuit est utilisé cette saison"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Circuit"
        verbose_name_plural = "Circuits"
        ordering = ['nom']
    
    def __str__(self):
        return f"{self.nom} - {self.pays}"
    
    @property
    def distance_totale(self):
        """Calcule la distance totale de la course"""
        return float(self.longueur) * self.nombre_tours
