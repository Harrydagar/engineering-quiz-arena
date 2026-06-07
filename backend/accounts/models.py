from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    rating = models.IntegerField(default=1000)

    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)

    total_quizzes = models.IntegerField(default=0)
    total_correct = models.IntegerField(default=0)
    highest_rating = models.IntegerField(default=1000)
    last_challenge_date = models.DateField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username