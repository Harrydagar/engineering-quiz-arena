from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils import timezone

from quizzes.services.question_service import (
    get_quiz_questions
)

from quizzes.services.daily_challenge_service import (
    DailyChallengeService
)

from quizzes.services.history_service import (
    get_quiz_history,
    get_progress_analytics,
    get_mistake_history,
    get_quiz_review
)

from quizzes.services.ranking_service import (
    get_leaderboard,
    get_user_rank
)

from .services.analytics_service import (
    get_overall_stats,
    get_subject_performance,
    get_recent_attempts,
    get_difficulty_stats,
    get_difficulty_recommendation,
    get_quiz_insights,
    get_performance_summary
)

from .models import (
    Subject, Topic, Question,
    QuizAttempt, UserAnswer,
    Option,
    UserDailyChallenge,
    Achievement,
    UserAchievement
)

from quizzes.services.achievement_service import (
    get_achievement_summary,
    get_user_achievements,
    check_daily_challenge_achievements,
    check_streak_achievements,
)

from .serializers import (
    SubjectSerializer,
    TopicSerializer,
    QuestionSerializer,
    QuizAttemptSerializer,
    UserAnswerSerializer,
    FinishQuizSerializer,
    AchievementSerializer,
    UserAchievementSerializer,
    DailyChallengeSubmitSerializer,
    UserDailyChallengeSerializer
)
from quizzes.services.quiz_service import finish_quiz

from .throttles import (
    QuizStartThrottle,
    SubmitAnswerThrottle,
    FinishQuizThrottle,
    DailyChallengeThrottle,
)

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
    throttle_classes = [QuizStartThrottle]

    def post(self, request):
        subject_id = request.data.get("subject_id")

        from django.shortcuts import get_object_or_404

        subject = get_object_or_404(
            Subject,
            id=subject_id
        )

        # Daily limit check
        today = timezone.now().date()

        attempts_today = QuizAttempt.objects.filter(
            user=request.user,
            started_at__date=today,
            status="COMPLETED"
        ).count()

        if attempts_today >= 10:
            return Response(
                {
                    "error":
                        "Daily quiz limit reached (10/day)"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Remove unfinished quizzes for this subject
        QuizAttempt.objects.filter(
            user=request.user,
            subject=subject,
            status="IN_PROGRESS"
        ).delete()

        total_questions = min(
            10,
            Question.objects.filter(
                topic__subject=subject
            ).count()
        )

        attempt = QuizAttempt.objects.create(
            user=request.user,
            subject=subject,
            status="IN_PROGRESS",
            total_questions=total_questions
        )

        serializer = QuizAttemptSerializer(
            attempt
        )

        return Response(
            {
                "message":
                    "Quiz started successfully",
                "attempt":
                    serializer.data,
                "resume": False
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

        questions = get_quiz_questions(
            request.user,
            attempt
        )

        serializer = QuestionSerializer(
            questions,
            many=True
        )

        return Response(serializer.data)

class SubmitAnswerView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [SubmitAnswerThrottle]

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
                id=question_id,
                topic__subject=attempt.subject
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

        if attempt.status == "COMPLETED":
            return Response(
                {
                    "error":
                        "Quiz already completed"
                },
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
    throttle_classes = [FinishQuizThrottle]

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

        answered_count = attempt.answers.count()

        if answered_count < attempt.total_questions:
            return Response(
                {
                    "error": (
                        f"Answer all "
                        f"{attempt.total_questions} questions first."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        result = finish_quiz(
            attempt,
            request.user
        )

        return Response({
            "score": result["score"],
            "correct_answers": result["correct_count"],
            "total_questions": result["total_questions"],
            "percentage": round(
                result["percentage"],
                2   
            ),
            "status": result["status"],
            "new_rating": result["new_rating"],
            "rating_change": result["rating_change"],
            "highest_rating": result["highest_rating"],
        })
    
class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            get_leaderboard()
        )
    
class UserStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            get_overall_stats(
                request.user
            )
        )
    
class SubjectPerformanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            get_subject_performance(
                request.user
            )
        )


class MyRankView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        rank = get_user_rank(
            request.user
        )

        return Response({
            "username": request.user.username,
            "rating": request.user.userprofile.rating,
            "rank": rank
        })
    

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        overall_stats = get_overall_stats(
            request.user
        )

        subject_stats = get_subject_performance(
            request.user
        )

        recent_attempts = get_recent_attempts(
            request.user
        )

        rank = get_user_rank(
            request.user
        )

        achievement_data = get_achievement_summary(
           request.user
        )

        today_challenge = (
            UserDailyChallenge.objects
            .filter(
                user=request.user,
                date=timezone.now().date()
            )
            .first()
        )

        return Response({
            "rank": rank,
            "overall_stats": overall_stats,
            "subject_stats": subject_stats,
            "recent_attempts": recent_attempts,
            "today_challenge_completed":
                today_challenge.is_completed
                if today_challenge
                else False,
            "profile": {
                "rating": request.user.userprofile.rating,
                "highest_rating":
                    request.user.userprofile.highest_rating,
                "current_streak":
                    request.user.userprofile.current_streak,
                "longest_streak":
                    request.user.userprofile.longest_streak,
            },
            **achievement_data
        })

class RecentAttemptsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            get_recent_attempts(
                request.user
            )
        )

    
class DifficultyStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            get_difficulty_stats(
                request.user
            )
        )

class DifficultyRecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            get_difficulty_recommendation(
                request.user
            )
        )

class QuizInsightsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            get_quiz_insights(
                request.user
            )
        )
    
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

        review_data = get_quiz_review(
            request.user,
            attempt_id
        )

        if review_data is None:
            return Response(
                {"error": "Quiz not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(review_data)



class MistakeHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            get_mistake_history(
                request.user
            )
        )
    

class QuizHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            get_quiz_history(
                request.user
            )
        )

class TodayChallengeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        challenge = (
            DailyChallengeService
            .get_or_create_challenge(
                request.user
            )
        )

        if not challenge:
            return Response(
                {
                    "message": "No challenge available."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = UserDailyChallengeSerializer(
            challenge
        )

        return Response(serializer.data)

class SubmitDailyChallengeView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [DailyChallengeThrottle]

    def post(self, request):

        serializer = (
            DailyChallengeSubmitSerializer(
                data=request.data
            )
        )

        serializer.is_valid(
            raise_exception=True
        )

        result = (
            DailyChallengeService
            .submit_challenge(
                request.user,
                serializer.validated_data[
                    "selected_option_id"
                ]
            )
        )

        if result["success"]:

            check_daily_challenge_achievements(
                request.user
            )

            check_streak_achievements(
                request.user
            )

        return Response(result)

class ProgressAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            get_progress_analytics(
                request.user
            )
        )


class PerformanceSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(
            get_performance_summary(
                request.user
            )
        )
    
class AchievementListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        achievements = Achievement.objects.all()

        serializer = AchievementSerializer(
            achievements,
            many=True
        )

        return Response(serializer.data)


class MyAchievementsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        return Response(
            get_user_achievements(
            request.user
        )
    )


class AchievementSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        return Response(
            get_achievement_summary(
                request.user
            )
        )