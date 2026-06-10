from django.test import TestCase
from django.contrib.auth import get_user_model

from quizzes.models import (
    Achievement,
    UserAchievement
)

from quizzes.services.achievement_service import (
    unlock_achievement,
    get_achievement_summary
)

User = get_user_model()


class AchievementServiceTests(TestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123"
        )

        self.achievement = Achievement.objects.create(
            name="First Quiz",
            description="Complete first quiz"
        )

    def test_unlock_achievement(self):

        created = unlock_achievement(
            self.user,
            "First Quiz"
        )

        self.assertTrue(created)

    def test_duplicate_unlock(self):

        unlock_achievement(
            self.user,
            "First Quiz"
        )

        created = unlock_achievement(
            self.user,
            "First Quiz"
        )

        self.assertFalse(created)

    def test_achievement_summary(self):

        unlock_achievement(
            self.user,
            "First Quiz"
        )

        summary = get_achievement_summary(
            self.user
        )

        self.assertEqual(
            summary["total_unlocked"],
            1
        )

    def test_unlock_nonexistent_achievement(self):

        created = unlock_achievement(
            self.user,
            "Does Not Exist"
        )

        self.assertFalse(created)