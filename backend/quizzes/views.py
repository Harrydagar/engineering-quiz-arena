from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils import timezone
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

        attempt = QuizAttempt.objects.create(
            user=request.user,
            subject=subject,
            status='IN_PROGRESS'
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

        questions = Question.objects.filter(
            topic__subject=attempt.subject
        )

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

        answers = UserAnswer.objects.filter(
            quiz_attempt=attempt
        )

        correct_answers = answers.filter(
            is_correct=True
        ).count()

        total_questions = Question.objects.filter(
            topic__subject=attempt.subject
        ).count()

        percentage = (
            (correct_answers / total_questions) * 100
            if total_questions > 0 else 0
        )

        attempt.score = correct_answers
        attempt.total_questions = total_questions
        attempt.status = "COMPLETED"
        attempt.completed_at = timezone.now()
        attempt.save()

        return Response({
            "score": correct_answers,
            "total_questions": total_questions,
            "percentage": round(percentage, 2),
            "status": attempt.status
        })    