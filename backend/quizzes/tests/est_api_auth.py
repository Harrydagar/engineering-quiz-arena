from rest_framework.test import APITestCase
from rest_framework import status


class QuizAPITests(APITestCase):

    def test_start_quiz_requires_auth(self):
        response = self.client.post(
            '/api/quizzes/start/',
            {}
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    def test_dashboard_requires_auth(self):
        response = self.client.get(
            '/api/quizzes/dashboard/'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    def test_leaderboard_requires_auth(self):
        response = self.client.get(
            '/api/quizzes/leaderboard/'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    def test_history_requires_auth(self):
        response = self.client.get(
            '/api/quizzes/history/'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )

    def test_mistakes_requires_auth(self):
        response = self.client.get(
            '/api/quizzes/mistakes/'
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )