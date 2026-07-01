from django.test import TestCase
from django.contrib.auth import get_user_model

from quizzes.models import (
    Subject,
    Topic,
    Question,
    Option,
    QuizAttempt,
    UserAnswer,
)

from quizzes.services.history_service import (
    get_quiz_history,
    get_progress_analytics,
    get_mistake_history,
    get_quiz_review,
)

User = get_user_model()


class HistoryServiceTests(TestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            username="testuser",
            password="password123"
        )

        self.subject = Subject.objects.create(
            name="Python"
        )

        self.topic = Topic.objects.create(
            subject=self.subject,
            name="Basics"
        )

        self.question = Question.objects.create(
            topic=self.topic,
            question_text="What is Python?",
            difficulty="easy"
        )

        self.correct_option = Option.objects.create(
            question=self.question,
            option_text="Programming Language",
            is_correct=True
        )

        self.wrong_option = Option.objects.create(
            question=self.question,
            option_text="Database",
            is_correct=False
        )

        self.attempt = QuizAttempt.objects.create(
            user=self.user,
            subject=self.subject,
            score=10,
            percentage=50,
            total_questions=1,
            status="COMPLETED"
        )

        UserAnswer.objects.create(
            quiz_attempt=self.attempt,
            question=self.question,
            selected_option=self.wrong_option,
            is_correct=False
        )

    def test_get_quiz_history(self):

        history = get_quiz_history(
            self.user
        )

        self.assertEqual(
            len(history),
            1
        )

        self.assertEqual(
            history[0]["subject"],
            "Python"
        )

        self.assertEqual(
            history[0]["score"],
            10
        )

    def test_get_progress_analytics(self):

        progress = get_progress_analytics(
            self.user
        )

        self.assertEqual(
            len(progress),
            1
        )

        self.assertEqual(
            progress[0]["attempt"],
            1
        )

        self.assertEqual(
            progress[0]["accuracy"],
            50
        )

    def test_get_mistake_history(self):

        mistakes = get_mistake_history(
            self.user
        )

        self.assertEqual(
            len(mistakes),
            1
        )

        self.assertEqual(
            mistakes[0]["question"],
            "What is Python?"
        )

        self.assertEqual(
            mistakes[0]["your_answer"],
            "Database"
        )

        self.assertEqual(
            mistakes[0]["correct_answer"],
            "Programming Language"
        )

    def test_get_quiz_review(self):

        review = get_quiz_review(
            self.user,
            self.attempt.id
        )

        self.assertEqual(
            len(review),
            1
        )

        self.assertFalse(
            review[0]["is_correct"]
        )

        self.assertEqual(
            review[0]["your_answer"],
            "Database"
        )

    def test_get_quiz_review_invalid_attempt(self):

        review = get_quiz_review(
            self.user,
            9999
        )

        self.assertIsNone(
            review
        )