from rest_framework.throttling import UserRateThrottle


class QuizStartThrottle(UserRateThrottle):
    rate = "30/hour"


class SubmitAnswerThrottle(UserRateThrottle):
    rate = "300/hour"


class FinishQuizThrottle(UserRateThrottle):
    rate = "50/hour"


class DailyChallengeThrottle(UserRateThrottle):
    rate = "20/hour"