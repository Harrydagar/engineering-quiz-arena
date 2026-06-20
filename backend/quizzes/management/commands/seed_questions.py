from django.core.management.base import BaseCommand
from quizzes.models import Subject, Topic, Question, Option
import random

class Command(BaseCommand):
    help = "Seed sample questions"

    def handle(self, *args, **kwargs):

        # Clear old data
        Option.objects.all().delete()
        Question.objects.all().delete()
        Topic.objects.all().delete()
        Subject.objects.all().delete()

        # Subjects
        math = Subject.objects.create(
            name="Mathematics",
            description="Mathematics quizzes"
        )

        physics = Subject.objects.create(
            name="Physics",
            description="Physics quizzes"
        )

        # Topics
        algebra = Topic.objects.create(
            subject=math,
            name="Algebra"
        )

        mechanics = Topic.objects.create(
            subject=physics,
            name="Mechanics"
        )

        def add_question(
            topic,
            text,
            difficulty,
            correct,
            options
        ):
            question = Question.objects.create(
                topic=topic,
                question_text=text,
                difficulty=difficulty
            )

            option_data = []

            for option in options:
                option_data.append(
                    (
                        option,
                        option == correct
                    )
                )

            random.shuffle(option_data)

            for option_text, is_correct in option_data:
                Option.objects.create(
                    question=question,
                    option_text=option_text,
                    is_correct=is_correct
                )
                
        # ALGEBRA (10)

        add_question(
            algebra,
            "What is 2 + 2?",
            "easy",
            "4",
            ["1", "2", "3", "4"]
        )

        add_question(
            algebra,
            "What is 15 + 27?",
            "easy",
            "42",
            ["40", "41", "42", "43"]
        )

        add_question(
            algebra,
            "What is 8 × 7?",
            "easy",
            "56",
            ["54", "55", "56", "57"]
        )

        add_question(
            algebra,
            "What is the square root of 64?",
            "easy",
            "8",
            ["6", "7", "8", "9"]
        )

        add_question(
            algebra,
            "What is 100 ÷ 5?",
            "easy",
            "20",
            ["10", "15", "20", "25"]
        )

        add_question(
            algebra,
            "What is 12²?",
            "medium",
            "144",
            ["124", "134", "144", "154"]
        )

        add_question(
            algebra,
            "Solve: x + 9 = 20",
            "medium",
            "11",
            ["9", "10", "11", "12"]
        )

        add_question(
            algebra,
            "What is 25% of 200?",
            "medium",
            "50",
            ["25", "40", "50", "60"]
        )

        add_question(
            algebra,
            "Solve: 2x + 7 = 15",
            "medium",
            "4",
            ["2", "3", "4", "5"]
        )

        add_question(
            algebra,
            "Solve: 4x² = 64",
            "hard",
            "4",
            ["2", "3", "4", "8"]
        )

        # MECHANICS (10)

        add_question(
            mechanics,
            "What is the SI unit of force?",
            "easy",
            "Newton",
            ["Joule", "Newton", "Watt", "Pascal"]
        )

        add_question(
            mechanics,
            "Which law states F = ma?",
            "easy",
            "Newton's Second Law",
            [
                "Newton's First Law",
                "Newton's Second Law",
                "Ohm's Law",
                "Hooke's Law"
            ]
        )

        add_question(
            mechanics,
            "What is the SI unit of work?",
            "easy",
            "Joule",
            ["Joule", "Newton", "Watt", "Volt"]
        )

        add_question(
            mechanics,
            "What quantity is measured in kg?",
            "easy",
            "Mass",
            ["Weight", "Mass", "Force", "Energy"]
        )

        add_question(
            mechanics,
            "What is acceleration?",
            "medium",
            "Rate of change of velocity",
            [
                "Rate of change of velocity",
                "Distance travelled",
                "Force applied",
                "Momentum"
            ]
        )

        add_question(
            mechanics,
            "What is momentum?",
            "medium",
            "Mass × Velocity",
            [
                "Mass × Velocity",
                "Force × Time",
                "Mass × Acceleration",
                "Energy × Time"
            ]
        )

        add_question(
            mechanics,
            "What is the SI unit of power?",
            "medium",
            "Watt",
            ["Volt", "Ampere", "Watt", "Joule"]
        )

        add_question(
            mechanics,
            "Which quantity is scalar?",
            "medium",
            "Speed",
            [
                "Velocity",
                "Acceleration",
                "Speed",
                "Force"
            ]
        )

        add_question(
            mechanics,
            "What is kinetic energy?",
            "hard",
            "Energy of motion",
            [
                "Energy of motion",
                "Stored energy",
                "Heat energy",
                "Electrical energy"
            ]
        )

        add_question(
            mechanics,
            "What is the SI unit of pressure?",
            "hard",
            "Pascal",
            ["Pascal", "Newton", "Joule", "Watt"]
        )

        self.stdout.write(
            self.style.SUCCESS(
                "Questions seeded successfully!"
            )
        )