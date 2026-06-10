from django.utils import timezone
from django.db import transaction
from quizzes.services.achievement_service import (
    check_quiz_achievements,
    check_score_achievements,
    check_accuracy_achievements,
    check_rating_achievements,
)

HIGH_SCORE_BONUS = 20
PASS_BONUS = 5
FAIL_PENALTY = 10
MIN_RATING = 100

@transaction.atomic
def finish_quiz(attempt, user):

    if attempt.status == "COMPLETED":
        raise ValueError(
            "Quiz already completed"
        )
    
    score, correct_count, percentage = (
        calculate_score(attempt)
    )

    attempt.score = score
    attempt.percentage = percentage
    attempt.status = "COMPLETED"
    attempt.completed_at = timezone.now()

    attempt.save()

    profile = user.userprofile

    if percentage >= 80:
        profile.rating += HIGH_SCORE_BONUS

    elif percentage >= 50:
        profile.rating += PASS_BONUS

    else:
        profile.rating = max(
            MIN_RATING,
            profile.rating - FAIL_PENALTY
        )

    profile.highest_rating = max(
        profile.highest_rating,
        profile.rating
    )

    profile.save()

    check_quiz_achievements(user)
    check_score_achievements(user)
    check_accuracy_achievements(user)
    check_rating_achievements(user)

    return {
        "score": score,
        "correct_count": correct_count,
        "percentage": percentage,
        "total_questions": attempt.total_questions,
        "status": attempt.status,
    }

def calculate_score(attempt):

    score = 0

    correct_answers = list(
        attempt.answers
        .select_related("question")
        .filter(is_correct=True)
    )

    correct_count = len(correct_answers)

    for answer in correct_answers:

        difficulty = (
            answer.question.difficulty
        )

        if difficulty == "easy":
            score += 5

        elif difficulty == "medium":
            score += 10

        elif difficulty == "hard":
            score += 15

    percentage = (
        (
            correct_count /
            attempt.total_questions
        ) * 100
        if attempt.total_questions > 0
        else 0
    )

    return (
        score,
        correct_count,
        round(percentage, 2)
    )