from rest_framework import serializers
from .models import (
    Subject,
    Topic,
    Question,
    Option,
    QuizAttempt,
    UserDailyChallenge,
    Achievement,
    UserAchievement
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


class UserDailyChallengeSerializer(serializers.ModelSerializer):
    question = serializers.CharField(
        source="question.question_text"
    )

    options = serializers.SerializerMethodField()

    class Meta:
        model = UserDailyChallenge
        fields = [
            "id",
            "date",
            "question",
            "points",
            "earned_points",
            "is_completed",
            "options",
        ]

    def get_options(self, obj):
        return [
            {
                "id": option.id,
                "option_text": option.option_text
            }
            for option in obj.question.options.all()
        ]
     
class DailyChallengeSubmitSerializer(
    serializers.Serializer
):
    selected_option_id = serializers.IntegerField()


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = [
            'id',
            'name',
            'description',
            'badge_icon'
        ]


class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer()

    class Meta:
        model = UserAchievement
        fields = [
            'achievement',
            'earned_at'
        ]          