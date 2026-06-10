from django.test import TestCase
from django.contrib.auth import get_user_model

from accounts.models import UserProfile

from quizzes.services.ranking_service import (
    get_user_rank,
    get_leaderboard,
)

User = get_user_model()


class LeaderboardServiceTests(TestCase):

    def setUp(self):

        self.user1 = User.objects.create_user(
            username="user1",
            password="pass"
        )

        self.user2 = User.objects.create_user(
            username="user2",
            password="pass"
        )

        self.user3 = User.objects.create_user(
            username="user3",
            password="pass"
        )

        profile1 = self.user1.userprofile
        profile1.rating = 1500
        profile1.highest_rating = 1500
        profile1.save()

        profile2 = self.user2.userprofile
        profile2.rating = 1200
        profile2.highest_rating = 1200
        profile2.save()

        profile3 = self.user3.userprofile
        profile3.rating = 900
        profile3.highest_rating = 900
        profile3.save()

    def test_get_user_rank_first_place(self):

        rank = get_user_rank(
            self.user1
        )

        self.assertEqual(
            rank,
            1
        )

    def test_get_user_rank_second_place(self):

        rank = get_user_rank(
            self.user2
        )

        self.assertEqual(
            rank,
            2
        )

    def test_get_user_rank_third_place(self):

        rank = get_user_rank(
            self.user3
        )

        self.assertEqual(
            rank,
            3
        )

    def test_get_leaderboard(self):

        leaderboard = get_leaderboard()

        self.assertEqual(
            len(leaderboard),
            3
        )

        self.assertEqual(
            leaderboard[0]["username"],
            "user1"
        )

        self.assertEqual(
            leaderboard[1]["username"],
            "user2"
        )

        self.assertEqual(
            leaderboard[2]["username"],
            "user3"
        )

        self.assertEqual(
            leaderboard[0]["rank"],
            1
        )