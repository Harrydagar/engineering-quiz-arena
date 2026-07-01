from django.db import models
from django.contrib.auth.models import User

class RatingHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    old_rating = models.IntegerField()
    new_rating = models.IntegerField()

    changed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.old_rating} → {self.new_rating}"