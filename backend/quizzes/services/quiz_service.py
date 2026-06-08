def calculate_score(attempt):

    score = 0

    correct_answers = attempt.answers.filter(
        is_correct=True
    )

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

    correct_count = (
        correct_answers.count()
    )

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