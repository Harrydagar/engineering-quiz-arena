from django.db import models
from django.conf import settings


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
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='quiz_attempts'
    )

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE
    )

    topic = models.ForeignKey(
        Topic,
        on_delete=models.CASCADE
    )

    score = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)

    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.topic.name}"


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

    def __str__(self):
        return f"{self.quiz_attempt.user.username} - Q{self.question.id}"