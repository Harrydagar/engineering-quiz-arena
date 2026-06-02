from django.urls import path
from .views import SubjectListView, TopicListView, QuestionListView

urlpatterns = [
    path('subjects/', SubjectListView.as_view(), name='subjects'),
    path('topics/<int:subject_id>/', TopicListView.as_view(), name='topics'),
    path('questions/<int:topic_id>/', QuestionListView.as_view(), name='questions'),
]