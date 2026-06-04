from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils import timezone
import random
from django.db.models import Sum
from .models import Subject, Topic, Question, QuizAttempt, UserAnswer, Option
from .serializers import SubjectSerializer, TopicSerializer, QuestionSerializer, QuizAttemptSerializer, UserAnswerSerializer, FinishQuizSerializer


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

        questions = list(
            Question.objects.filter(
                topic__subject=attempt.subject
            )
        )

        random.shuffle(questions)

        questions = questions[:10]

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
        
        

        return Response({
            "score": score,
            "correct_answers": correct_count,
            "total_questions": total_questions,
            "percentage": round(percentage, 2),
            "status": attempt.status
        })

class LeaderboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        leaderboard = (
            QuizAttempt.objects
            .filter(status='COMPLETED')
            .values(
                'user__id',
                'user__username'
            )
            .annotate(
                total_points=Sum('score')
            )
            .order_by('-total_points')
        )

        data = []

        for rank, user in enumerate(
            leaderboard,
            start=1
        ):
            data.append({
                "rank": rank,
                "username": user['user__username'],
                "total_points": user['total_points']
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
class MyRankView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        leaderboard = QuizAttempt.objects.filter(
            status='COMPLETED'
        ).order_by('-score', '-percentage')

        user_rank = None

        for rank, attempt in enumerate(leaderboard, start=1):
            if attempt.user == request.user:
                user_rank = rank
                break

        return Response({
            "username": request.user.username,
            "rank": user_rank
        })    