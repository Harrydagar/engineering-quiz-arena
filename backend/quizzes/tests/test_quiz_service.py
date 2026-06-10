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

from quizzes.services.quiz_service import (
    calculate_score,
    finish_quiz,
)


User = get_user_model()


class QuizServiceTests(TestCase):

    def setUp(self):

        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123"
        )

        self.profile = self.user.userprofile
        self.profile.rating = 1000
        self.profile.highest_rating = 1000
        self.profile.save()

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
            explanation="Test"
        )

        self.medium_question = Question.objects.create(
            topic=self.topic,
            question_text="Medium Question",
            difficulty="medium",
            explanation="Test"
        )

        self.hard_question = Question.objects.create(
            topic=self.topic,
            question_text="Hard Question",
            difficulty="hard",
            explanation="Test"
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
            is_correct=True
        )

    def create_attempt(self):

        attempt = QuizAttempt.objects.create(
            user=self.user,
            subject=self.subject,
            total_questions=3,
            status="IN_PROGRESS"
        )

        return attempt

    def test_calculate_score(self):

        quiz_attempt = self.create_attempt()

        UserAnswer.objects.create(
            quiz_attempt=quiz_attempt,
            question=self.easy_question,
            selected_option=self.easy_option,
            is_correct=True
        )

        UserAnswer.objects.create(
            quiz_attempt=quiz_attempt,
            question=self.medium_question,
            selected_option=self.medium_option,
            is_correct=True
        )

        UserAnswer.objects.create(
            quiz_attempt=quiz_attempt,
            question=self.hard_question,
            selected_option=self.hard_option,
            is_correct=False
        )
        
        score, correct_count, percentage = (
            calculate_score(quiz_attempt)
        )

        self.assertEqual(score, 15)
        self.assertEqual(correct_count, 2)
        self.assertEqual(percentage, 66.67)

    def test_finish_quiz_high_score_rating_bonus(self):

        attempt = self.create_attempt()

        UserAnswer.objects.create(
            quiz_attempt=attempt,
            question=self.easy_question,
            selected_option=self.easy_option,
            is_correct=True
        )

        UserAnswer.objects.create(
            quiz_attempt=attempt,
            question=self.medium_question,
            selected_option=self.medium_option,
            is_correct=True
        )

        UserAnswer.objects.create(
            quiz_attempt=attempt,
            question=self.hard_question,
            selected_option=self.hard_option,
            is_correct=True
        )

        result = finish_quiz(
            attempt,
            self.user
        )

        self.profile.refresh_from_db()

        self.assertEqual(
            result["status"],
            "COMPLETED"
        )

        self.assertEqual(
            self.profile.rating,
            1020
        )

    def test_finish_quiz_pass_bonus(self):

        attempt = self.create_attempt()

        UserAnswer.objects.create(
            quiz_attempt=attempt,
            question=self.easy_question,
            selected_option=self.easy_option,
            is_correct=True
        )

        UserAnswer.objects.create(
            quiz_attempt=attempt,
            question=self.medium_question,
            selected_option=self.medium_option,
            is_correct=True
        )

        UserAnswer.objects.create(
            quiz_attempt=attempt,
            question=self.hard_question,
            selected_option=self.hard_option,
            is_correct=False
        )

        finish_quiz(
            attempt,
            self.user
        )

        self.profile.refresh_from_db()

        self.assertEqual(
            self.profile.rating,
            1005
        )

    def test_finish_quiz_fail_penalty(self):

        attempt = self.create_attempt()

        UserAnswer.objects.create(
            quiz_attempt=attempt,
            question=self.easy_question,
            selected_option=self.easy_option,
            is_correct=False
        )

        UserAnswer.objects.create(
            quiz_attempt=attempt,
            question=self.medium_question,
            selected_option=self.medium_option,
            is_correct=False
        )   

        UserAnswer.objects.create(
            quiz_attempt=attempt,
            question=self.hard_question,
            selected_option=self.hard_option,
            is_correct=False
        )

        finish_quiz(
            attempt,
            self.user
        )   

        self.profile.refresh_from_db()

        self.assertEqual(
            self.profile.rating,
            990
        )


    def test_finish_quiz_already_completed(self):

        attempt = self.create_attempt()

        attempt.status = "COMPLETED"
        attempt.save()

        with self.assertRaises(ValueError):
            finish_quiz(
                attempt,
                self.user
            )