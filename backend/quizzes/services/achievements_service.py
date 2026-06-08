from accounts.models import UserProfile
from quizzes.models import (
    Achievement,
    UserAchievement,
    QuizAttempt,
    UserAnswer,
    UserDailyChallenge,
    Subject
)


def unlock_achievement(user, achievement_name):
    try:
        achievement = Achievement.objects.get(
            name=achievement_name
        )

        UserAchievement.objects.get_or_create(
            user=user,
            achievement=achievement
        )

    except Achievement.DoesNotExist:
        pass


def check_quiz_achievements(user):

    completed_quizzes = QuizAttempt.objects.filter(
        user=user,
        status='COMPLETED'
    ).count()

    if completed_quizzes >= 1:
        unlock_achievement(user, "First Quiz")

    if completed_quizzes >= 10:
        unlock_achievement(user, "Quiz Explorer")

    if completed_quizzes >= 50:
        unlock_achievement(user, "Quiz Master")

    if completed_quizzes >= 100:
        unlock_achievement(user, "Quiz Legend")

def check_rating_achievements(user):

    profile = user.userprofile

    if profile.rating >= 1100:
        unlock_achievement(user, "Rising Star")

    if profile.rating >= 1300:
        unlock_achievement(user, "Expert")

def check_streak_achievements(user):

    profile = user.userprofile

    if profile.longest_streak >= 3:
        unlock_achievement(user, "3-Day Streak")

    if profile.longest_streak >= 7:
        unlock_achievement(user, "7-Day Streak")

def check_daily_challenge_achievements(user):

    completed_challenges = (
        UserDailyChallenge.objects.filter(
            user=user,
            is_completed=True
        ).count()
    )

    if completed_challenges >= 10:
        unlock_achievement(
            user,
            "Daily Challenger"
        )

def check_score_achievements(user):

    completed_attempts = QuizAttempt.objects.filter(
        user=user,
        status='COMPLETED'
    )

    total_points = sum(
        attempt.score
        for attempt in completed_attempts
    )

    if total_points >= 1000:
        unlock_achievement(
            user,
            "Century Scorer"
        )

def check_accuracy_achievements(user):

    total_answers = UserAnswer.objects.filter(
        quiz_attempt__user=user
    ).count()

    correct_answers = UserAnswer.objects.filter(
        quiz_attempt__user=user,
        is_correct=True
    ).count()

    accuracy = (
        (correct_answers / total_answers) * 100
        if total_answers > 0
        else 0
    )

    if accuracy >= 90:
        unlock_achievement(
            user,
            "Accuracy Expert"
        )