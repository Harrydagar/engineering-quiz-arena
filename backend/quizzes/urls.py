from django.urls import path
from .views import DashboardView, LeaderboardView, RecentAttemptsView, SubjectListView, SubjectPerformanceView, TopicListView, QuestionListView, StartQuizView, FetchQuestionsView, SubmitAnswerView, FinishQuizView, UserStatsView, MyRankView

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
    
]