from quizzes.models import (
    QuizAttempt,
    UserAnswer,
    Option
)
def get_quiz_history(user):

    attempts = (
        QuizAttempt.objects
        .filter(
            user=user,
            status="COMPLETED"
        )
        .order_by("-completed_at")
    )

    data = []

    for attempt in attempts:
        data.append({
            "id": attempt.id,
            "subject": attempt.subject.name,
            "score": attempt.score,
            "accuracy": attempt.percentage,
            "completed_at": attempt.completed_at
        })

    return data


def get_progress_analytics(user):

    attempts = (
        QuizAttempt.objects
        .filter(
            user=user,
            status="COMPLETED"
        )
        .order_by("completed_at")
    )

    data = []

    for index, attempt in enumerate(
        attempts,
        start=1
    ):
        data.append({
            "attempt": index,
            "accuracy": attempt.percentage,
            "score": attempt.score
        })

    return data


def get_mistake_history(user):

    mistakes = UserAnswer.objects.filter(
        quiz_attempt__user=user,
        is_correct=False
    ).select_related(
        "question",
        "selected_option"
    )

    correct_options = {
        option.question_id: option
        for option in Option.objects.filter(
            is_correct=True
        )
    }

    data = []

    for answer in mistakes:

        correct_option = correct_options[
            answer.question.id
        ]

        data.append({
            "question_id": answer.question.id,
            "question": answer.question.question_text,
            "difficulty": answer.question.difficulty,
            "your_answer": answer.selected_option.option_text,
            "correct_answer": correct_option.option_text,
            "explanation": answer.question.explanation,
        })

    return data


def get_quiz_review(user, attempt_id):

    try:
        attempt = QuizAttempt.objects.get(
            id=attempt_id,
            user=user,
            status="COMPLETED"
        )

    except QuizAttempt.DoesNotExist:
        return None

    answers = UserAnswer.objects.filter(
        quiz_attempt=attempt
    ).select_related(
        "question",
        "selected_option"
    )

    correct_options = {
        option.question_id: option
        for option in Option.objects.filter(
            is_correct=True
        )
    }

    review_data = []

    for answer in answers:

        correct_option = correct_options[
            answer.question.id
        ]

        review_data.append({
            "question_id": answer.question.id,
            "question": answer.question.question_text,
            "difficulty": answer.question.difficulty,
            "your_answer": answer.selected_option.option_text,
            "correct_answer": correct_option.option_text,
            "is_correct": answer.is_correct,
            "explanation": answer.question.explanation,
        })

    return review_data