from django.contrib import admin
from .models import (
    Subject,
    Topic,
    Question,
    Option,
    QuizAttempt,
    UserAnswer,
    DailyChallenge,
    UserDailyChallenge,
    Achievement,
    UserAchievement
)

admin.site.register(Subject)
admin.site.register(Topic)
admin.site.register(Question)
admin.site.register(Option)
admin.site.register(QuizAttempt)
admin.site.register(UserAnswer)
admin.site.register(DailyChallenge)
admin.site.register(UserDailyChallenge)
admin.site.register(Achievement)
admin.site.register(UserAchievement)