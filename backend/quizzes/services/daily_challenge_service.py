from django.db.models import Count, Q
from django.utils import timezone

from quizzes.models import (
    Question,
    UserAnswer,
    QuizAttempt,
    UserDailyChallenge,
)


class DailyChallengeService:

    @staticmethod
    def get_wrong_question(user):
        """
        Priority 1:
        Questions the user answered incorrectly before.
        """

        wrong_question_ids = (
            UserAnswer.objects
            .filter(
                quiz_attempt__user=user,
                is_correct=False
            )
            .values_list(
                "question_id",
                flat=True
            )
        )

        used_question_ids = (
            UserDailyChallenge.objects
            .filter(user=user)
            .values_list(
                "question_id",
                flat=True
            )
        )

        return (
            Question.objects
            .filter(id__in=wrong_question_ids)
            .exclude(id__in=used_question_ids)
            .order_by("?")
            .first()
        )

    @staticmethod
    def get_weakest_subject(user):
        """
        Priority 2:
        Subject with lowest average percentage.
        """

        attempts = (
            QuizAttempt.objects
            .filter(
                user=user,
                status="COMPLETED"
            )
        )

        if not attempts.exists():
            return None

        subject_scores = {}

        for attempt in attempts:

            subject_id = attempt.subject_id

            if subject_id not in subject_scores:
                subject_scores[subject_id] = []

            subject_scores[subject_id].append(
                attempt.percentage
            )

        weakest_subject = min(
            subject_scores,
            key=lambda x: (
                sum(subject_scores[x])
                / len(subject_scores[x])
            )
        )

        return weakest_subject

    @staticmethod
    def get_weakest_difficulty(user):
        """
        Priority 3:
        Difficulty with lowest accuracy.
        """

        stats = (
            UserAnswer.objects
            .filter(
                quiz_attempt__user=user
            )
            .values(
                "question__difficulty"
            )
            .annotate(
                total=Count("id"),
                correct=Count(
                    "id",
                    filter=Q(is_correct=True)
                )
            )
        )

        if not stats:
            return None

        difficulty_accuracy = {}

        for item in stats:

            accuracy = (
                item["correct"]
                / item["total"]
            )

            difficulty_accuracy[
                item["question__difficulty"]
            ] = accuracy

        return min(
            difficulty_accuracy,
            key=difficulty_accuracy.get
        )

    @staticmethod
    def get_or_create_challenge(user):

        today = timezone.now().date()

        challenge = (
            UserDailyChallenge.objects
            .select_related("question")
            .filter(
                user=user,
                date=today
            )
            .first()
        )

        if challenge:
            return challenge

        previous_question_ids = (
            UserDailyChallenge.objects
            .filter(user=user)
            .values_list(
                "question_id",
                flat=True
            )
        )

        # Priority 1
        question = (
            DailyChallengeService
            .get_wrong_question(user)
        )

        # Priority 2 + 3
        if not question:

            weakest_subject = (
                DailyChallengeService
                .get_weakest_subject(user)
            )

            weakest_difficulty = (
                DailyChallengeService
                .get_weakest_difficulty(user)
            )

            if weakest_subject:

                queryset = (
                    Question.objects
                    .filter(
                        topic__subject_id=weakest_subject
                    )
                    .exclude(
                        id__in=previous_question_ids
                    )
                )

                if weakest_difficulty:
                    queryset = queryset.filter(
                        difficulty=weakest_difficulty
                    )

                question = (
                    queryset
                    .order_by("?")
                    .first()
                )

        # Priority 4
        if not question:

            question = (
                Question.objects
                .exclude(
                    id__in=previous_question_ids
                )
                .order_by("?")
                .first()
            )

        # Final fallback
        if not question:

            question = (
                Question.objects
                .order_by("?")
                .first()
            )

        if not question:
            return None

        difficulty_points = {
            "easy": 25,
            "medium": 50,
            "hard": 100,
        }

        points = difficulty_points.get(
            question.difficulty,
            50
        )

        challenge = UserDailyChallenge.objects.create(
            user=user,
            date=today,
            question=question,
            points=points,
        )

        return challenge

    @staticmethod
    def submit_challenge(
        user,
        selected_option_id
    ):

        today = timezone.now().date()

        challenge = (
            UserDailyChallenge.objects
            .select_related("question")
            .filter(
                user=user,
                date=today
            )
            .first()
        )

        if not challenge:
            return {
                "success": False,
                "message": "Challenge not found."
            }

        if challenge.is_completed:
            return {
                "success": False,
                "message": "Challenge already completed."
            }

        correct_option = (
            challenge.question.options
            .filter(is_correct=True)
            .first()
        )

        is_correct = (
            correct_option
            and
            correct_option.id == selected_option_id
        )

        challenge.is_completed = True

        if is_correct:
            challenge.earned_points = challenge.points
        else:
            challenge.earned_points = 0

        challenge.completed_at = timezone.now()
        challenge.save()

        return {
            "success": True,
            "correct": is_correct,
            "earned_points": challenge.earned_points,
            "correct_option": (
                correct_option.option_text
                if correct_option
                else None
            )
        }