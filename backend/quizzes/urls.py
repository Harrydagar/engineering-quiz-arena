from django.urls import path
from .views import LeaderboardView, SubjectListView, TopicListView, QuestionListView, StartQuizView, FetchQuestionsView, SubmitAnswerView, FinishQuizView

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


]