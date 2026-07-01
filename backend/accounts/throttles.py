from rest_framework.throttling import AnonRateThrottle


class RegisterThrottle(AnonRateThrottle):
    rate = "5/hour"


class LoginThrottle(AnonRateThrottle):
    rate = "5/min"


class RefreshThrottle(AnonRateThrottle):
    rate = "30/min"