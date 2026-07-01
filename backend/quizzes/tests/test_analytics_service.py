from django.test import TestCase
from django.contrib.auth import get_user_model

from accounts.models import UserProfile

from quizzes.models import (
    Subject,
    Topic,
    Question,
    Option,
    QuizAttempt,
    UserAnswer,
)

from quizzes.services.analytics_service import (
    get_overall_stats,
    get_subject_performance,
    get_recent_attempts,
    get_difficulty_stats,
    get_difficulty_recommendation,
    get_quiz_insights,
    get_performance_summary,
)

User = get_user_model()


class AnalyticsServiceTests(TestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            username="testuser",
            password="password123"
        )

        profile = self.user.userprofile
        profile.rating = 1000
        profile.highest_rating = 1000
        profile.save()

        self.subject = Subject.objects.create(
            name="Python"
        )

        self.topic = Topic.objects.create(
            subject=self.subject,
            name="Basics"
        )

        self.easy_question = Question.objects.create(
            topic=self.topic,
            question_text="Easy Question",
            difficulty="easy",
            explanation="Test explanation"
        )

        self.medium_question = Question.objects.create(
            topic=self.topic,
            question_text="Medium Question",
            difficulty="medium",
            explanation="Test explanation"
        )

        self.hard_question = Question.objects.create(
            topic=self.topic,
            question_text="Hard Question",
            difficulty="hard",
            explanation="Test explanation"
        )

        self.attempt = QuizAttempt.objects.create(
            user=self.user,
            subject=self.subject,
            total_questions=3,
            score=20,
            percentage=66.67,
            status="COMPLETED"
        )

        self.easy_option = Option.objects.create(
            question=self.easy_question,
            option_text="A",
            is_correct=True
        )

        self.medium_option = Option.objects.create(
            question=self.medium_question,
            option_text="B",
            is_correct=True
        )

        self.hard_option = Option.objects.create(
            question=self.hard_question,
            option_text="C",
            is_correct=False
        )

        UserAnswer.objects.create(
            quiz_attempt=self.attempt,
            question=self.easy_question,
            selected_option=self.easy_option,
            is_correct=True
        )

        UserAnswer.objects.create(
            quiz_attempt=self.attempt,
            question=self.medium_question,
            selected_option=self.medium_option,
            is_correct=True
        )

        UserAnswer.objects.create(
            quiz_attempt=self.attempt,
            question=self.hard_question,
            selected_option=self.hard_option,
            is_correct=False
        )

    def test_get_overall_stats(self):

        stats = get_overall_stats(
            self.user
        )

        self.assertEqual(
            stats["total_quizzes"],
            1
        )

        self.assertEqual(
            stats["questions_attempted"],
            3
        )

        self.assertEqual(
            stats["correct_answers"],
            2
        )

        self.assertEqual(
            stats["wrong_answers"],
            1
        )

    def test_get_subject_performance(self):

        data = get_subject_performance(
            self.user
        )

        self.assertEqual(
            data[0]["subject"],
            "Python"
        )

        self.assertEqual(
            data[0]["attempted"],
            3
        )

        self.assertEqual(
            data[0]["correct"],
            2
        )

    def test_get_recent_attempts(self):

        attempts = get_recent_attempts(
            self.user
        )

        self.assertEqual(
            len(attempts),
            1
        )

        self.assertEqual(
            attempts[0]["score"],
            20
        )

    def test_get_difficulty_stats(self):

        stats = get_difficulty_stats(
            self.user
        )

        self.assertEqual(
            stats["easy"]["correct"],
            1
        )

        self.assertEqual(
            stats["medium"]["correct"],
            1
        )

        self.assertEqual(
            stats["hard"]["correct"],
            0
        )

    def test_get_difficulty_recommendation(self):

        result = get_difficulty_recommendation(
            self.user
        )

        self.assertIn(
            result["recommended_level"],
            ["easy", "medium", "hard"]
        )

    def test_get_quiz_insights(self):

        insights = get_quiz_insights(
            self.user
        )

        self.assertEqual(
            insights["strongest_subject"],
            "Python"
        )

        self.assertEqual(
            insights["weakest_subject"],
            "Python"
        )

    def test_get_performance_summary(self):

        summary = get_performance_summary(
            self.user
        )

        self.assertEqual(
            summary["total_quizzes"],
            1
        )

        self.assertEqual(
            summary["highest_score"],
            20
        )