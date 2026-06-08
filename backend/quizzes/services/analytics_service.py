from django.db.models import (
    Count,
    Sum,
    Q
)
from accounts.models import UserProfile
def get_user_rank(user):
    user_profile = user.userprofile

    return (
        UserProfile.objects.filter(
            rating__gt=user_profile.rating
        ).count()
        + 1
    )

from quizzes.models import (
    Subject,
    UserAnswer,
    QuizAttempt,
    UserAchievement
)


def get_overall_stats(user):

    completed_attempts = QuizAttempt.objects.filter(
        user=user,
        status="COMPLETED"
    )

    attempt_stats = completed_attempts.aggregate(
        total_quizzes=Count("id"),
        total_points=Sum("score")
    )

    answer_stats = UserAnswer.objects.filter(
        quiz_attempt__user=user
    ).aggregate(
        total_answers=Count("id"),
        correct_answers=Count(
            "id",
            filter=Q(is_correct=True)
        )
    )

    total_quizzes = attempt_stats["total_quizzes"]
    total_points = attempt_stats["total_points"] or 0

    total_answers = answer_stats["total_answers"]
    correct_answers = answer_stats["correct_answers"]

    wrong_answers = (
        total_answers -
        correct_answers
    )

    accuracy = (
        (correct_answers / total_answers) * 100
        if total_answers > 0
        else 0
    )

    return {
        "total_quizzes": total_quizzes,
        "questions_attempted": total_answers,
        "correct_answers": correct_answers,
        "wrong_answers": wrong_answers,
        "accuracy": round(accuracy, 2),
        "total_points": total_points
    }


def get_subject_performance(user):

    subjects = Subject.objects.annotate(
        attempted=Count(
            "quiz_attempts__answers",
            filter=Q(
                quiz_attempts__user=user
            )
        ),
        correct=Count(
            "quiz_attempts__answers",
            filter=Q(
                quiz_attempts__user=user,
                quiz_attempts__answers__is_correct=True
            )
        )
    )

    return [
        {
            "subject": subject.name,
            "attempted": subject.attempted,
            "correct": subject.correct,
            "accuracy": round(
                (
                    subject.correct /
                    subject.attempted * 100
                )
                if subject.attempted else 0,
                2
            )
        }
        for subject in subjects
    ]

def get_recent_attempts(
    user,
    limit=10
):

    attempts = (
        QuizAttempt.objects
        .select_related("subject")
        .filter(
            user=user,
            status="COMPLETED"
        )
        .order_by("-completed_at")[:limit]
    )

    return [
        {
            "quiz_id": attempt.id,
            "subject": attempt.subject.name,
            "score": attempt.score,
            "total_questions": attempt.total_questions,
            "percentage": attempt.percentage,
            "completed_at": attempt.completed_at
        }
        for attempt in attempts
    ]


def get_subject_performance(user):

    subjects = Subject.objects.annotate(
        attempted=Count(
            "quiz_attempts__answers",
            filter=Q(
                quiz_attempts__user=user
            )
        ),
        correct=Count(
            "quiz_attempts__answers",
            filter=Q(
                quiz_attempts__user=user,
                quiz_attempts__answers__is_correct=True
            )
        )
    )

    return [
        {
            "subject": subject.name,
            "attempted": subject.attempted,
            "correct": subject.correct,
            "accuracy": round(
                (
                    subject.correct /
                    subject.attempted * 100
                )
                if subject.attempted else 0,
                2
            )
        }
        for subject in subjects
    ]


def get_difficulty_stats(user):

    stats = (
        UserAnswer.objects
        .filter(
            quiz_attempt__user=user
        )
        .values("question__difficulty")
        .annotate(
            attempted=Count("id"),
            correct=Count(
                "id",
                filter=Q(is_correct=True)
            )
        )
    )

    data = {
        "easy": {
            "attempted": 0,
            "correct": 0,
            "accuracy": 0
        },
        "medium": {
            "attempted": 0,
            "correct": 0,
            "accuracy": 0
        },
        "hard": {
            "attempted": 0,
            "correct": 0,
            "accuracy": 0
        }
    }

    for row in stats:
        attempted = row["attempted"]
        correct = row["correct"]

        data[row["question__difficulty"]] = {
            "attempted": attempted,
            "correct": correct,
            "accuracy": round(
                (correct / attempted) * 100,
                2
            ) if attempted else 0
        }

    return data

def get_recent_attempts(user):

    attempts = (
        QuizAttempt.objects
        .select_related("subject")
        .filter(
            user=user,
            status="COMPLETED"
        )
        .order_by("-completed_at")[:10]
    )

    return [
        {
            "quiz_id": attempt.id,
            "subject": attempt.subject.name,
            "score": attempt.score,
            "total_questions": attempt.total_questions,
            "percentage": attempt.percentage,
            "completed_at": attempt.completed_at
        }
        for attempt in attempts
    ]

def get_user_rank(user):
    user_profile = user.userprofile

    return (
        UserProfile.objects.filter(
            rating__gt=user_profile.rating
        ).count()
        + 1
    )

def get_achievement_summary(user):

    user_achievements = (
        UserAchievement.objects
        .filter(user=user)
        .select_related("achievement")
        .order_by("-earned_at")
    )

    return {
        "achievements": user_achievements.count(),
        "recent_achievements": list(
            user_achievements.values_list(
                "achievement__name",
                flat=True
            )[:3]
        )
    }