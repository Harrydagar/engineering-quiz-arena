from django.db import models
from django.conf import settings
from django.utils import timezone


class Subject(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Topic(models.Model):
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='topics'
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Question(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    topic = models.ForeignKey(
        Topic,
        on_delete=models.CASCADE,
        related_name='questions'
    )

    question_text = models.TextField()

    difficulty = models.CharField(
        max_length=10,
        choices=DIFFICULTY_CHOICES
    )

    explanation = models.TextField(blank=True)

    def __str__(self):
        return self.question_text[:50]


class Option(models.Model):
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='options'
    )

    option_text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.option_text


class QuizAttempt(models.Model):
    STATUS_CHOICES = [
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='quiz_attempts'
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='quiz_attempts'
    )

    score = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    percentage = models.FloatField(default=0)

    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='IN_PROGRESS'
    )

    def __str__(self):
        return f"{self.user.username} - {self.subject.name}"


class UserAnswer(models.Model):
    quiz_attempt = models.ForeignKey(
        QuizAttempt,
        on_delete=models.CASCADE,
        related_name='answers'
    )

    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE
    )

    selected_option = models.ForeignKey(
        Option,
        on_delete=models.CASCADE
    )

    is_correct = models.BooleanField(default=False)

    answered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.quiz_attempt.user.username} - Q{self.question.id}"
    


from django.db import models
from django.conf import settings


class UserDailyChallenge(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="daily_challenges"
    )

    date = models.DateField()

    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="user_daily_challenges"
    )

    points = models.IntegerField(default=10)

    is_completed = models.BooleanField(default=False)

    earned_points = models.IntegerField(default=0)

    completed_at = models.DateTimeField(
        null=True,
        blank=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "date"],
                name="unique_user_daily_challenge"
            )
        ]
        ordering = ["-date"]

    def __str__(self):
        return f"{self.user.username} - {self.date}"

class Achievement(models.Model):
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    badge_icon = models.CharField(
        max_length=100,
        blank=True
    )

    def __str__(self):
        return self.name


class UserAchievement(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    achievement = models.ForeignKey(
        Achievement,
        on_delete=models.CASCADE
    )

    earned_at = models.DateTimeField(
        auto_now_add=True
    )


    class Meta:
        unique_together = [
            'user',
            'achievement'
        ]

    def __str__(self):
        return (
            f"{self.user.username} - "
            f"{self.achievement.name}"
        )    