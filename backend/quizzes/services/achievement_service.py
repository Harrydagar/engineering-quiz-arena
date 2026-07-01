from quizzes.models import (
    Achievement,
    UserAchievement,
    QuizAttempt,
    UserAnswer,
    UserDailyChallenge
)

from django.db.models import (
    Count,
    Q,
    Sum
)

def unlock_achievement(user, achievement_name):

    try:
        achievement = Achievement.objects.get(
            name=achievement_name
        )

        user_achievement, created = (
            UserAchievement.objects.get_or_create(
                user=user,
                achievement=achievement
            )

        )

        return created

    except Achievement.DoesNotExist:
        return False


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

    total_points = (
        QuizAttempt.objects.filter(
            user=user,
            status='COMPLETED'
        ).aggregate(
            total=Sum("score")
        )["total"] or 0
    )

    if total_points >= 100:
        unlock_achievement(
            user,
            "Century Scorer"
        )

def check_accuracy_achievements(user):

    stats = UserAnswer.objects.filter(
        quiz_attempt__user=user
    ).aggregate(
        total=Count("id"),
        correct=Count(
            "id",
            filter=Q(is_correct=True)
        )
    )

    total_answers = stats["total"]
    correct_answers = stats["correct"]

    accuracy = (
        (correct_answers / total_answers) * 100
        if total_answers > 0
        else 0
    )

    if (
        total_answers >= 50
        and
        accuracy >= 90
    ):
        unlock_achievement(
            user,
            "Accuracy Expert"
        )


def check_achievements(user):
    check_quiz_achievements(user)
    check_rating_achievements(user)
    check_streak_achievements(user)
    check_daily_challenge_achievements(user)
    check_score_achievements(user)
    check_accuracy_achievements(user)    


def get_achievement_summary(user):

    total_available = (
        Achievement.objects.count()
    )

    unlocked = (
        UserAchievement.objects.filter(
            user=user
        )
    )

    total_unlocked = unlocked.count()

    completion_percentage = (
        (total_unlocked / total_available) * 100
        if total_available > 0
        else 0
    )

    recent_achievements = (
        unlocked
        .select_related("achievement")
        .order_by("-earned_at")[:5]
    )

    return {
        "total_unlocked": total_unlocked,
        "total_available": total_available,
        "remaining": total_available - total_unlocked,
        "completion_percentage": round(
            completion_percentage,
            2
        ),
        "recent_achievements": [
            {
               "id": ua.achievement.id,
                "name": ua.achievement.name,
                "description": ua.achievement.description,
                "badge_icon": ua.achievement.badge_icon,
                "earned_at": ua.earned_at,
            }
            
            for ua in recent_achievements
        ]
    }

def get_user_achievements(user):

    achievements = (
        UserAchievement.objects
        .filter(user=user)
        .select_related("achievement")
        .order_by("-earned_at")
    )

    return [
        {
            "id": ua.achievement.id,
            "name": ua.achievement.name,
            "description": ua.achievement.description,
            "badge_icon": ua.achievement.badge_icon,
            "earned_at": ua.earned_at,
        }
        for ua in achievements
    ]