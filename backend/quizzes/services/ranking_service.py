from accounts.models import UserProfile


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
        .order_by("-rating")
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
            "highest_rating": profile.highest_rating
        })

    return data