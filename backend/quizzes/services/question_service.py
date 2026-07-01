import random

from quizzes.models import (
    Question,
    UserAnswer
)


def get_quiz_questions(user, attempt):

    answered_question_ids = (
        UserAnswer.objects.filter(
            quiz_attempt=attempt
        ).values_list(
            "question_id",
            flat=True
        )
    )

    easy_questions = list(
        Question.objects.filter(
            topic__subject=attempt.subject,
            difficulty="easy"
        ).exclude(
            id__in=answered_question_ids
        )
    )

    medium_questions = list(
        Question.objects.filter(
            topic__subject=attempt.subject,
            difficulty="medium"
        ).exclude(
            id__in=answered_question_ids
        )
    )

    hard_questions = list(
        Question.objects.filter(
            topic__subject=attempt.subject,
            difficulty="hard"
        ).exclude(
            id__in=answered_question_ids
        )
    )

    if (
        len(easy_questions) < 4 or
        len(medium_questions) < 4 or
        len(hard_questions) < 2
    ):
        easy_questions = list(
            Question.objects.filter(
                topic__subject=attempt.subject,
                difficulty="easy"
            )
        )

        medium_questions = list(
            Question.objects.filter(
                topic__subject=attempt.subject,
                difficulty="medium"
            )
        )

        hard_questions = list(
            Question.objects.filter(
                topic__subject=attempt.subject,
                difficulty="hard"
            )
        )

    random.shuffle(easy_questions)
    random.shuffle(medium_questions)
    random.shuffle(hard_questions)

    questions = (
        easy_questions[:4] +
        medium_questions[:4] +
        hard_questions[:2]
    )

    if len(questions) < min(10, attempt.total_questions):

        remaining_questions = list(
            Question.objects.filter(
                topic__subject=attempt.subject
            ).exclude(
                id__in=[q.id for q in questions]
            )
        )

        random.shuffle(
            remaining_questions
        )

        questions.extend(
            remaining_questions[
                :min(
                    10,
                    attempt.total_questions
                ) - len(questions)
            ]
        )

    random.shuffle(questions)
    return questions