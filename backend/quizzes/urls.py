from django.urls import path
from .views import DashboardView, DifficultyRecommendationView, DifficultyStatsView, LeaderboardView, QuizInsightsView, RecentAttemptsView, SubjectListView, SubjectPerformanceView, TopicListView, QuestionListView, StartQuizView, FetchQuestionsView, SubmitAnswerView, FinishQuizView, UserStatsView, MyRankView, TodayChallengeView, SubmitDailyChallengeView, UserStreakView, QuizReviewView, QuizHistoryView, MistakeHistoryView, ProgressAnalyticsView, PerformanceSummaryView, AchievementListView, MyAchievementsView

urlpatterns = [
    path('subjects/', SubjectListView.as_view(), name='subjects'),
    path('topics/<int:subject_id>/', TopicListView.as_view(), name='topics'),
    path('questions/<int:topic_id>/', QuestionListView.as_view(), name='questions'),
    path('start/', StartQuizView.as_view(), name='start-quiz'),
    path(
        '<int:attempt_id>/questions/',
        FetchQuestionsView.as_view(),
        name='fetch-questions'
    ),
    path(
    'submit-answer/',
    SubmitAnswerView.as_view(),
    name='submit-answer'
    ),
    
    path(
    'finish/',
    FinishQuizView.as_view(),
    name='finish-quiz'
    ),

    path(
        'leaderboard/',
        LeaderboardView.as_view(),
        name='leaderboard'
    ),

    path(
        'stats/',
        UserStatsView.as_view(),
        name='user-stats'
    ),
    
    path(
        'my-rank/',
        MyRankView.as_view(),
        name='my-rank'
    ),

    path(
        'analytics/subjects/',
        SubjectPerformanceView.as_view()
    ),

    path(
        'analytics/history/',
        RecentAttemptsView.as_view(),
        name='recent-attempts'
    ),

    path(
        'dashboard/',
        DashboardView.as_view(),
        name='dashboard'
    ),
    
    path(
        'analytics/difficulty/',
        DifficultyStatsView.as_view(),
        name='difficulty-stats'
    ),

    path(
        'analytics/recommendation/',
        DifficultyRecommendationView.as_view(),
        name='difficulty-recommendation'
    ),

    path(
        'analytics/insights/',
        QuizInsightsView.as_view(),
        name='quiz-insights'
    ),

    path(
        'challenges/today/',
        TodayChallengeView.as_view(),
        name='today-challenge'
    ),  

    path(
        'challenges/submit/',
        SubmitDailyChallengeView.as_view(),
        name='submit-daily-challenge'
    ),

    path(
        'challenges/streak/',
        UserStreakView.as_view(),
        name='user-streak'
    ), 

    path(
        "review/<int:attempt_id>/",
        QuizReviewView.as_view(),
        name="quiz-review"
    ), 

    path(
        "mistakes/",
        MistakeHistoryView.as_view(),
        name="mistake-history"
    ),
    path(
        'history/',
        QuizHistoryView.as_view(),
        name='quiz-history'
    ),

    path(
        'analytics/progress/',
        ProgressAnalyticsView.as_view(),
        name='progress-analytics'
    ),

    path(
        'analytics/summary/',
        PerformanceSummaryView.as_view(),
        name='performance-summary'
    ),

    path(
        'achievements/',
        AchievementListView.as_view(),
        name='achievements'
    ),

    path(
        'my-achievements/',
        MyAchievementsView.as_view(),
        name='my-achievements'
    ),


]