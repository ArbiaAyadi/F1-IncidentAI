
from django.db import models

class Pilote(models.Model):
    nom = models.CharField(max_length=100)
    equipe = models.CharField(max_length=150)
    nationalite = models.CharField(max_length=50)
    age = models.IntegerField()
    experience = models.IntegerField(default=0)
    victoires = models.IntegerField(default=0)
    podiums = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-victoires']
        verbose_name = 'Pilote'
        verbose_name_plural = 'Pilotes'

    def __str__(self):
        return f"{self.nom} - {self.equipe}"