from django.utils import timezone

from quizzes.services.achievement_service import (
    check_daily_challenge_achievements,
    check_rating_achievements,
    check_streak_achievements,
)


def submit_daily_challenge(user, challenge, option):
    is_correct = option.is_correct

    challenge.is_completed = True
    challenge.completed_at = timezone.now()

    if is_correct:
        challenge.earned_points = challenge.points
    else:
        challenge.earned_points = 0

    challenge.save()

    if is_correct:
        profile = user.userprofile

        profile.rating += 2

        today = timezone.now().date()

        if profile.last_challenge_date:
            days_difference = (
                today - profile.last_challenge_date
            ).days

            if days_difference == 1:
                profile.current_streak += 1

            elif days_difference > 1:
                profile.current_streak = 1

        else:
            profile.current_streak = 1

        profile.longest_streak = max(
            profile.longest_streak,
            profile.current_streak
        )

        profile.last_challenge_date = today

        profile.highest_rating = max(
            profile.highest_rating,
            profile.rating
        )

        profile.save()

        check_daily_challenge_achievements(user)
        check_rating_achievements(user)
        check_streak_achievements(user)

    return {
        "correct": is_correct,
        "points_earned": (
            challenge.points if is_correct else 0
        )
    }