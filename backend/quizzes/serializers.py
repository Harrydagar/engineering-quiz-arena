from rest_framework import serializers
from .models import (
    Subject,
    Topic,
    Question,
    Option,
    QuizAttempt,
    DailyChallenge,
    UserDailyChallenge
)

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'name', 'subject']


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'option_text']


class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = [
            'id',
            'question_text',
            'difficulty',
            'options'
        ]

class QuizAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAttempt
        fields = [
            'id',
            'subject',
            'score',
            'total_questions',
            'percentage',
            'status',
            'started_at',
            'completed_at',
        ]

class UserAnswerSerializer(serializers.Serializer):
    attempt_id = serializers.IntegerField()
    question_id = serializers.IntegerField()
    selected_option_id = serializers.IntegerField()


class FinishQuizSerializer(serializers.Serializer):
    attempt_id = serializers.IntegerField()

class DailyChallengeSerializer(serializers.ModelSerializer):
    question = serializers.CharField(
        source='question.question_text'
    )

    options = OptionSerializer(
        source='question.options',
        many=True,
        read_only=True
    )

    class Meta:
        model = DailyChallenge
        fields = [
            'id',
            'date',
            'question',
            'points',
            'options'
        ]
class DailyChallengeSubmitSerializer(serializers.Serializer):
    challenge_id = serializers.IntegerField()
    selected_option_id = serializers.IntegerField()        