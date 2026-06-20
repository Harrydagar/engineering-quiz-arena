from accounts.models import UserProfile
from quizzes.models import (
    UserAchievement
)
from django.db.models import Count

def get_user_rank(user):

    return (
        UserProfile.objects
        .filter(
            rating__gt=user.userprofile.rating
        )
        .count()
        + 1
    )


def get_leaderboard():

    leaderboard = (
        UserProfile.objects
        .select_related("user")
        .annotate(
            achievement_count=Count(
                "user__userachievement"
            )
        )
        .order_by("-rating")[:100]
    )

    data = []

    for rank, profile in enumerate(
        leaderboard,
        start=1
    ):
        
        data.append({
            "rank": rank,
            "username": profile.user.username,
            "rating": profile.rating,
            "highest_rating": profile.highest_rating,
            "current_streak": profile.current_streak,
            "achievement_count": profile.achievement_count,
        })

    return data