from accounts.models import UserProfile


def get_user_rank(user):
    leaderboard = (
        UserProfile.objects
        .select_related("user")
        .order_by("-rating")
    )

    for position, profile in enumerate(
        leaderboard,
        start=1
    ):
        if profile.user_id == user.id:
            return position

    return None