from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils import timezone
import random
from accounts.models import UserProfile
from .models import (
    Subject, Topic, Question,
    QuizAttempt, UserAnswer,
    Option, DailyChallenge,
    UserDailyChallenge
)
from .serializers import SubjectSerializer, TopicSerializer, QuestionSerializer, QuizAttemptSerializer, UserAnswerSerializer, FinishQuizSerializer, DailyChallengeSerializer, DailyChallengeSubmitSerializer


class SubjectListView(generics.ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]


class TopicListView(generics.ListAPIView):
    serializer_class = TopicSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        subject_id = self.kwargs['subject_id']
        return Topic.objects.filter(subject_id=subject_id)    
    

class QuestionListView(generics.ListAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        topic_id = self.kwargs['topic_id']
        return Question.objects.filter(topic_id=topic_id)
    

class StartQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        subject_id = request.data.get("subject_id")

        try:
            subject = Subject.objects.get(id=subject_id)
        except Subject.DoesNotExist:
            return Response(
                {"error": "Subject not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Daily limit check
        today = timezone.now().date()

        attempts_today = QuizAttempt.objects.filter(
            user=request.user,
            started_at__date=today,
            status='COMPLETED'
        ).count()

        if attempts_today >= 10:
            return Response(
                {"error": "Daily quiz limit reached (10/day)"},
                status=status.HTTP_400_BAD_REQUEST
            )

        total_questions = min(
            10,
            Question.objects.filter(
                topic__subject=subject
            ).count()
        )

        attempt = QuizAttempt.objects.create(
            user=request.user,
            subject=subject,
            status='IN_PROGRESS',
            total_questions=total_questions
        )

        serializer = QuizAttemptSerializer(attempt)

        return Response(
            {
                "message": "Quiz started successfully",
                "attempt": serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    

class FetchQuestionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, attempt_id):
        try:
            attempt = QuizAttempt.objects.get(
                id=attempt_id,
                user=request.user
            )
        except QuizAttempt.DoesNotExist:
            return Response(
                {"error": "Quiz attempt not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Previously answered questions
        answered_question_ids = UserAnswer.objects.filter(
            quiz_attempt__user=request.user
        ).values_list(
            'question_id',
            flat=True
        )

        # Easy Questions
        easy_questions = list(
            Question.objects.filter(
                topic__subject=attempt.subject,
                difficulty='easy'
            ).exclude(
                id__in=answered_question_ids
            )
        )

        # Medium Questions
        medium_questions = list(
            Question.objects.filter(
                topic__subject=attempt.subject,
                difficulty='medium'
            ).exclude(
                id__in=answered_question_ids
            )
        )

        # Hard Questions
        hard_questions = list(
            Question.objects.filter(
                topic__subject=attempt.subject,
                difficulty='hard'
            ).exclude(
                id__in=answered_question_ids
            )
        )

        # Fallback if user has already attempted most questions
        if (
            len(easy_questions) < 4 or
            len(medium_questions) < 4 or
            len(hard_questions) < 2
        ):
            easy_questions = list(
                Question.objects.filter(
                    topic__subject=attempt.subject,
                    difficulty='easy'
                )
            )

            medium_questions = list(
                Question.objects.filter(
                    topic__subject=attempt.subject,
                    difficulty='medium'
                )
            )

            hard_questions = list(
                Question.objects.filter(
                    topic__subject=attempt.subject,
                    difficulty='hard'
                )
            )

        random.shuffle(easy_questions)
        random.shuffle(medium_questions)
        random.shuffle(hard_questions)

        # Target: 4 Easy + 4 Medium + 2 Hard
        questions = (
            easy_questions[:4] +
            medium_questions[:4] +
            hard_questions[:2]
        )

        # Fill missing slots if question bank is small
        if len(questions) < min(10, attempt.total_questions):

            remaining_questions = list(
                Question.objects.filter(
                    topic__subject=attempt.subject
                ).exclude(
                    id__in=[q.id for q in questions]
                )
            )

            random.shuffle(remaining_questions)

            questions.extend(
                remaining_questions[
                    :min(10, attempt.total_questions) - len(questions)
                ]
            )

        random.shuffle(questions)

        serializer = QuestionSerializer(
            questions,
            many=True
        )

        return Response(serializer.data)
    
class SubmitAnswerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserAnswerSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        attempt_id = serializer.validated_data['attempt_id']
        question_id = serializer.validated_data['question_id']
        selected_option_id = serializer.validated_data['selected_option_id']

        try:
            attempt = QuizAttempt.objects.get(
                id=attempt_id,
                user=request.user
            )

            question = Question.objects.get(
                id=question_id
            )

            selected_option = Option.objects.get(
                id=selected_option_id,
                question=question
            )

        except (
            QuizAttempt.DoesNotExist,
            Question.DoesNotExist,
            Option.DoesNotExist
        ):
            return Response(
                {"error": "Invalid data"},
                status=status.HTTP_400_BAD_REQUEST
            )

        is_correct = selected_option.is_correct

        existing_answer = UserAnswer.objects.filter(
            quiz_attempt=attempt,
            question=question
        ).exists()

        if existing_answer:
            return Response(
                {
                    "error": "Question already answered"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        UserAnswer.objects.create(
            quiz_attempt=attempt,
            question=question,
            selected_option=selected_option,
            is_correct=is_correct
        )

        return Response({
            "message": "Answer submitted",
            "is_correct": is_correct
        })

    
class FinishQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = FinishQuizSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        attempt_id = serializer.validated_data["attempt_id"]

        try:
            attempt = QuizAttempt.objects.get(
                id=attempt_id,
                user=request.user
            )
        except QuizAttempt.DoesNotExist:
            return Response(
                {"error": "Quiz attempt not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if attempt.status == "COMPLETED":
            return Response(
                {
                    "error": "Quiz already completed"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        score = 0

        

        correct_answers = attempt.answers.filter(
            is_correct=True
        )

        for answer in correct_answers:
            difficulty = answer.question.difficulty

            if difficulty == "easy":
                score += 5

            elif difficulty == "medium":
                score += 10

            elif difficulty == "hard":
                score += 15

        correct_count = correct_answers.count()

        total_questions = attempt.total_questions

        percentage = (
            (correct_count / total_questions) * 100
            if total_questions > 0
            else 0
       )

        attempt.score = score
        attempt.percentage = round(percentage, 2)
        attempt.status = "COMPLETED"
        attempt.completed_at = timezone.now()

        attempt.save()
        
        profile = request.user.userprofile

        if percentage >= 80:
            profile.rating += 20

        elif percentage >= 50:
            profile.rating += 5

        else:
            profile.rating = max(100, profile.rating - 10)

        profile.save()
        

        return Response({
            "score": score,
            "correct_answers": correct_count,
            "total_questions": total_questions,
            "percentage": round(percentage, 2),
            "status": attempt.status,
            "rating": profile.rating
        })

class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        leaderboard = (
            UserProfile.objects
            .select_related('user')
            .order_by('-rating')
        )

        data = []

        for rank, profile in enumerate(
            leaderboard,
            start=1
        ):
            data.append({
                "rank": rank,
                "username": profile.user.username,
                "rating": profile.rating
            })

        return Response(data)
    
class UserStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        completed_attempts = QuizAttempt.objects.filter(
            user=request.user,
            status='COMPLETED'
        )

        total_quizzes = completed_attempts.count()

        total_points = sum(
            attempt.score for attempt in completed_attempts
        )

        total_answers = UserAnswer.objects.filter(
            quiz_attempt__user=request.user
        ).count()

        correct_answers = UserAnswer.objects.filter(
            quiz_attempt__user=request.user,
            is_correct=True
        ).count()

        wrong_answers = total_answers - correct_answers

        accuracy = (
            (correct_answers / total_answers) * 100
            if total_answers > 0
            else 0
        )

        return Response({
            "total_quizzes": total_quizzes,
            "questions_attempted": total_answers,
            "correct_answers": correct_answers,
            "wrong_answers": wrong_answers,
            "accuracy": round(accuracy, 2),
            "total_points": total_points
        })
    
class SubjectPerformanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        subjects = Subject.objects.all()

        data = []

        for subject in subjects:
            answers = UserAnswer.objects.filter(
                quiz_attempt__user=request.user,
                quiz_attempt__subject=subject
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

            data.append({
                "subject": subject.name,
                "attempted": attempted,
                "correct": correct,
                "accuracy": round(accuracy, 2)
            })

        return Response(data)


class MyRankView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        leaderboard = (
            UserProfile.objects
            .select_related('user')
            .order_by('-rating')
        )

        rank = None

        for position, profile in enumerate(
            leaderboard,
            start=1
        ):
            if profile.user.id == request.user.id:
                rank = position
                break

        return Response({
            "username": request.user.username,
            "rating": request.user.userprofile.rating,
            "rank": rank
        })

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        completed_attempts = QuizAttempt.objects.filter(
            user=request.user,
            status='COMPLETED'
        )

        total_quizzes = completed_attempts.count()

        total_points = sum(
            attempt.score for attempt in completed_attempts
        )

        total_answers = UserAnswer.objects.filter(
            quiz_attempt__user=request.user
        ).count()

        correct_answers = UserAnswer.objects.filter(
            quiz_attempt__user=request.user,
            is_correct=True
        ).count()

        wrong_answers = total_answers - correct_answers

        accuracy = (
            (correct_answers / total_answers) * 100
            if total_answers > 0
            else 0
        )

        overall_stats = {
            "total_quizzes": total_quizzes,
            "questions_attempted": total_answers,
            "correct_answers": correct_answers,
            "wrong_answers": wrong_answers,
            "accuracy": round(accuracy, 2),
            "total_points": total_points
        }

        subject_stats = []

        for subject in Subject.objects.all():

            answers = UserAnswer.objects.filter(
                quiz_attempt__user=request.user,
                quiz_attempt__subject=subject
            )

            attempted = answers.count()

            correct = answers.filter(
                is_correct=True
            ).count()

            subject_accuracy = (
                (correct / attempted) * 100
                if attempted > 0
                else 0
            )

            subject_stats.append({
                "subject": subject.name,
                "attempted": attempted,
                "correct": correct,
                "accuracy": round(subject_accuracy, 2)
            })

        recent_attempts = []

        attempts = (
            QuizAttempt.objects
            .filter(
                user=request.user,
                status='COMPLETED'
            )
            .order_by('-completed_at')[:10]
        )

        for attempt in attempts:
            recent_attempts.append({
                "quiz_id": attempt.id,
                "subject": attempt.subject.name,
                "score": attempt.score,
                "total_questions": attempt.total_questions,
                "percentage": attempt.percentage,
                "completed_at": attempt.completed_at
            })

        leaderboard = (
            UserProfile.objects
            .select_related('user')
            .order_by('-rating')
        )

        rank = None

        for position, profile in enumerate(
            leaderboard,
            start=1
        ):
            if profile.user.id == request.user.id:
                rank = position
                break

        return Response({
            "rank": rank,
            "overall_stats": overall_stats,
            "subject_stats": subject_stats,
            "recent_attempts": recent_attempts,
            "rating": request.user.userprofile.rating,
        })

class RecentAttemptsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        attempts = (
            QuizAttempt.objects
            .filter(
                user=request.user,
                status='COMPLETED'
            )
            .order_by('-completed_at')[:10]
        )

        data = []

        for attempt in attempts:
            data.append({
                "quiz_id": attempt.id,
                "subject": attempt.subject.name,
                "score": attempt.score,
                "total_questions": attempt.total_questions,
                "percentage": attempt.percentage,
                "completed_at": attempt.completed_at
            })

        return Response(data)     
    
class DifficultyStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        data = {}

        for difficulty in ['easy', 'medium', 'hard']:

            answers = UserAnswer.objects.filter(
                quiz_attempt__user=request.user,
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

            data[difficulty] = {
                "attempted": attempted,
                "correct": correct,
                "accuracy": round(accuracy, 2)
            }

        return Response(data)

class DifficultyRecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        hard_answers = UserAnswer.objects.filter(
            quiz_attempt__user=request.user,
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
            quiz_attempt__user=request.user,
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

        return Response({
            "recommended_level": recommendation,
            "hard_accuracy": round(hard_accuracy, 2),
            "medium_accuracy": round(medium_accuracy, 2)
        })     

class QuizInsightsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        # Subject analysis
        subjects = Subject.objects.all()

        subject_scores = []

        for subject in subjects:

            answers = UserAnswer.objects.filter(
                quiz_attempt__user=request.user,
                quiz_attempt__subject=subject
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

        # Difficulty analysis
        difficulty_scores = {}

        for difficulty in ["easy", "medium", "hard"]:

            answers = UserAnswer.objects.filter(
                quiz_attempt__user=request.user,
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

        # Overall accuracy
        total_answers = UserAnswer.objects.filter(
            quiz_attempt__user=request.user
        ).count()

        correct_answers = UserAnswer.objects.filter(
            quiz_attempt__user=request.user,
            is_correct=True
        ).count()

        overall_accuracy = (
            (correct_answers / total_answers) * 100
            if total_answers > 0
            else 0
        )

        return Response({
            "strongest_subject": strongest_subject,
            "weakest_subject": weakest_subject,
            "best_difficulty": best_difficulty,
            "overall_accuracy": round(
                overall_accuracy,
                2
            )
        })     

from rest_framework.views import APIView


class TodayChallengeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()

        try:
            challenge = DailyChallenge.objects.get(
                date=today
            )
        except DailyChallenge.DoesNotExist:
            return Response(
                {
                    "message": "No challenge available today."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = DailyChallengeSerializer(challenge)

        return Response(serializer.data) 

class SubmitDailyChallengeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = DailyChallengeSubmitSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        challenge_id = serializer.validated_data[
            'challenge_id'
        ]

        option_id = serializer.validated_data[
            'selected_option_id'
        ]

        try:
            challenge = DailyChallenge.objects.get(
                id=challenge_id
            )
        except DailyChallenge.DoesNotExist:
            return Response(
                {
                    "error": "Challenge not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        already_attempted = UserDailyChallenge.objects.filter(
            user=request.user,
            challenge=challenge
        ).exists()

        if already_attempted:
            return Response(
                {
                    "error": "Challenge already attempted"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            option = Option.objects.get(
                id=option_id,
                question=challenge.question
            )
        except Option.DoesNotExist:
            return Response(
                {
                    "error": "Invalid option selected"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        is_correct = option.is_correct

        UserDailyChallenge.objects.create(
            user=request.user,
            challenge=challenge,
            is_completed=is_correct,
            completed_at=timezone.now()
        )

        if is_correct:
            profile = request.user.userprofile
            profile.rating += 2
            today = timezone.now().date()

            if profile.last_challenge_date:
                days_difference = (
                    today - profile.last_challenge_date
                ).days

                if days_difference == 1:
                    profile.current_streak += 1

                elif days_difference > 1:
                    profile.current_streak = 1

            else:   
                profile.current_streak = 1

            if profile.current_streak > profile.longest_streak:
                profile.longest_streak = profile.current_streak

            profile.last_challenge_date = today

        
            profile.save()

        return Response({
            "correct": is_correct,
            "points_earned": (
                challenge.points if is_correct else 0
            )
        })     

class UserStreakView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.userprofile

        return Response({
            "current_streak": profile.current_streak,
            "longest_streak": profile.longest_streak
        })   

class QuizReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, attempt_id):

        try:
            attempt = QuizAttempt.objects.get(
                id=attempt_id,
                user=request.user,
                status="COMPLETED"
            )

        except QuizAttempt.DoesNotExist:
            return Response(
                {"error": "Quiz not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        review_data = []

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
                "is_correct": answer.is_correct
            })

        return Response(review_data)     

class MistakeHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        mistakes = UserAnswer.objects.filter(
            quiz_attempt__user=request.user,
            is_correct=False
        ).select_related(
            "question",
            "selected_option"
        )

        data = []

        correct_options = {
           option.question_id: option
            for option in Option.objects.filter(
                is_correct=True
            )
        }

        for answer in mistakes:

            correct_option = correct_options[
               answer.question.id
            ]
            

            data.append({
                "question_id": answer.question.id,
                "question": answer.question.question_text,
                "difficulty": answer.question.difficulty,
                "your_answer": answer.selected_option.option_text,
                "correct_answer": correct_option.option_text
            })

        return Response(data)
    
class QuizHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        attempts = (
            QuizAttempt.objects
            .filter(
                user=request.user,
                status='COMPLETED'
            )
            .order_by('-completed_at')
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

        return Response(data)    
    

class ProgressAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        attempts = (
            QuizAttempt.objects
            .filter(
                user=request.user,
                status='COMPLETED'
            )
            .order_by('completed_at')
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

        return Response(data)    
class PerformanceSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        attempts = QuizAttempt.objects.filter(
            user=request.user,
            status='COMPLETED'
        )

        total_quizzes = attempts.count()

        average_accuracy = (
            sum(
                attempt.percentage
                for attempt in attempts
            ) / total_quizzes
            if total_quizzes > 0
            else 0
        )

        highest_score = (
            max(
                [attempt.score for attempt in attempts],
                default=0
            )
        )

        return Response({
            "total_quizzes": total_quizzes,
            "average_accuracy": round(
                average_accuracy,
                2
            ),
            "highest_score": highest_score
        })
