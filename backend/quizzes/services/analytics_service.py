from django.db.models import (
    Count,
    Sum,
    Q,
    Avg,
    Max
)

from accounts.models import UserProfile

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
        if subject.attempted > 0
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


def get_difficulty_recommendation(user):

    hard_answers = UserAnswer.objects.filter(
        quiz_attempt__user=user,
        question__difficulty='hard'
    )

    hard_attempted = hard_answers.count()

    hard_correct = hard_answers.filter(
        is_correct=True
    ).count()

    hard_accuracy = (
        (hard_correct / hard_attempted) * 100
        if hard_attempted > 0
        else 0
    )

    medium_answers = UserAnswer.objects.filter(
        quiz_attempt__user=user,
        question__difficulty='medium'
    )

    medium_attempted = medium_answers.count()

    medium_correct = medium_answers.filter(
        is_correct=True
    ).count()

    medium_accuracy = (
        (medium_correct / medium_attempted) * 100
        if medium_attempted > 0
        else 0
    )

    if hard_accuracy >= 70:
        recommendation = "hard"

    elif medium_accuracy >= 70:
        recommendation = "medium"

    else:
        recommendation = "easy"

    return {
        "recommended_level": recommendation,
        "hard_accuracy": round(hard_accuracy, 2),
        "medium_accuracy": round(medium_accuracy, 2)
    }

def get_quiz_insights(user):

    subjects = Subject.objects.all()

    subject_scores = []

    for subject in subjects:

        answers = UserAnswer.objects.filter(
            quiz_attempt__user=user,
            quiz_attempt__subject=subject
        )

        attempted = answers.count()

        if attempted == 0:
            continue

        correct = answers.filter(
                is_correct=True
        ).count()

        accuracy = (
            (correct / attempted) * 100
            if attempted > 0
            else 0
        )

        subject_scores.append({
            "subject": subject.name,
            "accuracy": accuracy
        })

    strongest_subject = None
    weakest_subject = None

    if subject_scores:
        strongest_subject = max(
            subject_scores,
            key=lambda x: x["accuracy"]
        )["subject"]

        weakest_subject = min(
            subject_scores,
            key=lambda x: x["accuracy"]
        )["subject"]

    difficulty_scores = {}

    for difficulty in ["easy", "medium", "hard"]:

        answers = UserAnswer.objects.filter(
            quiz_attempt__user=user,
            question__difficulty=difficulty
        )

        attempted = answers.count()

        correct = answers.filter(
            is_correct=True
        ).count()

        accuracy = (
            (correct / attempted) * 100
            if attempted > 0
            else 0
        )

        difficulty_scores[difficulty] = accuracy

    best_difficulty = max(
        difficulty_scores,
        key=difficulty_scores.get
    )

    total_answers = UserAnswer.objects.filter(
        quiz_attempt__user=user
    ).count()

    correct_answers = UserAnswer.objects.filter(
        quiz_attempt__user=user,
        is_correct=True
    ).count()

    overall_accuracy = (
        (correct_answers / total_answers) * 100
        if total_answers > 0
        else 0
    )

    return {
        "strongest_subject": strongest_subject,
        "weakest_subject": weakest_subject,
        "best_difficulty": best_difficulty,
        "overall_accuracy": round(
            overall_accuracy,
            2
        )
    }


def get_performance_summary(user):

    attempts = QuizAttempt.objects.filter(
        user=user,
        status="COMPLETED"
    )

    summary = attempts.aggregate(
        total_quizzes=Count("id"),
        average_accuracy=Avg("percentage"),
        highest_score=Max("score"),
        highest_accuracy=Max("percentage"),
    )

    return {
        "total_quizzes": summary["total_quizzes"],
        "average_accuracy": round(
            summary["average_accuracy"] or 0,
            2
        ),
        "highest_accuracy":
            summary["highest_accuracy"] or 0,
        "highest_score": summary["highest_score"] or 0
    }