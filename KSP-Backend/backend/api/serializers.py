from rest_framework import serializers
from .models import Feedback, PreviousYearQuestions, Notes
from vote.views import VoteMixin

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ('id', 'title', 'name', 'course_id','course_instructor','batch', 'feedback', 'completed')


class PreviousYearQuestionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreviousYearQuestions
        fields = ('id', 'title','name', 'course_id','course_instructor','batch','gdrive_link', 'completed')

class NotesSerializer(VoteMixin, serializers.ModelSerializer):
    class Meta:
        model = Notes
        fields = ('id', 'title','name', 'course_id','course_instructor','batch','gdrive_link', 'completed')