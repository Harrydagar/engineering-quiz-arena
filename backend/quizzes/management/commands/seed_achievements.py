from django.core.management.base import BaseCommand
from quizzes.models import Achievement


class Command(BaseCommand):
    help = "Seed default achievements"

    def handle(self, *args, **kwargs):

        achievements = [
            {
                "name": "First Quiz",
                "description": "Complete your first quiz",
                "badge_icon": "first_quiz"
            },
            {
                "name": "Quiz Explorer",
                "description": "Complete 10 quizzes",
                "badge_icon": "explorer"
            },
            {
                "name": "Quiz Master",
                "description": "Complete 50 quizzes",
                "badge_icon": "master"
            },
            {
                "name": "3-Day Streak",
                "description": "Maintain a 3 day streak",
                "badge_icon": "streak3"
            },
            {
                "name": "7-Day Streak",
                "description": "Maintain a 7 day streak",
                "badge_icon": "streak7"
            },
            {
                "name": "Rising Star",
                "description": "Reach 1100 rating",
                "badge_icon": "rising_star"
            },
            {
                "name": "Expert",
                "description": "Reach 1300 rating",
                "badge_icon": "expert"
            },
            {
                "name": "Century Scorer",
                "description": "Earn 1000 total quiz points",
                "badge_icon": "century"
            },
        ]

        for achievement in achievements:
            Achievement.objects.get_or_create(
                name=achievement["name"],
                defaults=achievement
            )

        self.stdout.write(
            self.style.SUCCESS("Achievements seeded successfully!")
        )

    def award_achievement(user, achievement_name):

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