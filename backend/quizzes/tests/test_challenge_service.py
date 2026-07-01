from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

from quizzes.models import (
    Question,
    Topic,
    Subject,
    Option,
    UserDailyChallenge,
)

from quizzes.services.challenge_service import (
    submit_daily_challenge,
)

User = get_user_model()


class DailyChallengeServiceTests(TestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            username="testuser",
            password="password123"
        )

        self.profile = self.user.userprofile
        self.profile.rating = 1000
        self.profile.current_streak = 0
        self.profile.longest_streak = 0
        self.profile.save()

        self.subject = Subject.objects.create(
            name="Python"
        )

        self.topic = Topic.objects.create(
            subject=self.subject,
            name="Basics"
        )

        self.question = Question.objects.create(
            topic=self.topic,
            question_text="Question",
            difficulty="easy"
        )

        self.correct_option = Option.objects.create(
            question=self.question,
            option_text="Correct",
            is_correct=True
        )

        self.wrong_option = Option.objects.create(
            question=self.question,
            option_text="Wrong",
            is_correct=False
        )

        self.challenge = UserDailyChallenge.objects.create(
            user=self.user,
            question=self.question,
            date=timezone.now().date(),
            points=5,
            is_completed=False,
        )

    def test_submit_daily_challenge_correct(self):

        result = submit_daily_challenge(
            self.user,
            self.challenge,
            self.correct_option
        )

        self.profile.refresh_from_db()
        self.challenge.refresh_from_db()

        self.assertTrue(result["correct"])
        self.assertEqual(
            result["points_earned"],
            5
        )

        self.assertTrue(
            self.challenge.is_completed
        )

    def test_submit_daily_challenge_wrong(self):

        result = submit_daily_challenge(
            self.user,
            self.challenge,
            self.wrong_option
        )

        self.profile.refresh_from_db()

        self.assertFalse(
            result["correct"]
        )

        self.assertEqual(
            result["points_earned"],
            0
        )

    def test_streak_increment(self):

        self.profile.last_challenge_date = (
            timezone.now().date()
            - timedelta(days=1)
        )

        self.profile.current_streak = 3
        self.profile.save()

        submit_daily_challenge(
            self.user,
            self.challenge,
            self.correct_option
        )

        self.profile.refresh_from_db()

        self.assertEqual(
            self.profile.current_streak,
            4
        )

    def test_streak_reset(self):

        self.profile.last_challenge_date = (
            timezone.now().date()
            - timedelta(days=3)
        )

        self.profile.current_streak = 5
        self.profile.save()

        submit_daily_challenge(
            self.user,
            self.challenge,
            self.correct_option
        )

        self.profile.refresh_from_db()

        self.assertEqual(
            self.profile.current_streak,
            1
        )

    def test_user_daily_challenge_exists(self):

        self.assertEqual(
            UserDailyChallenge.objects.count(),
            1
        )