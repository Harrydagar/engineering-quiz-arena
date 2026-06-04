from django.core.management.base import BaseCommand
from quizzes.models import Topic, Question, Option


class Command(BaseCommand):
    help = "Seed sample questions"

    def handle(self, *args, **kwargs):

        topic = Topic.objects.first()

        if not topic:
            self.stdout.write(
                self.style.ERROR(
                    "No topics found. Create a topic first."
                )
            )
            return

        question = Question.objects.create(
            topic=topic,
            question_text="What is 15 + 27?",
            difficulty="easy"
        )

        Option.objects.create(
            question=question,
            option_text="40",
            is_correct=False
        )

        Option.objects.create(
            question=question,
            option_text="41",
            is_correct=False
        )

        Option.objects.create(
            question=question,
            option_text="42",
            is_correct=True
        )

        Option.objects.create(
            question=question,
            option_text="43",
            is_correct=False
        )

        self.stdout.write(
            self.style.SUCCESS(
                "Questions seeded successfully!"
            )
        )