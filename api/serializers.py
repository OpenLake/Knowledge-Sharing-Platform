from rest_framework import serializers
from .models import Note, PreviousYearQuestion, Feedback

class NoteSerializer( serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ('pk', 'title','name', 'course_id','course_instructor','batch','gdrive_link')


class PreviousYearQuestionSerializer( serializers.ModelSerializer):
    class Meta:
        model = PreviousYearQuestion
        fields = ('pk', 'title','name', 'course_id','course_instructor','batch','gdrive_link')


class FeedbackSerializer( serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ('pk', 'title','name', 'course_id','course_instructor','batch','Feedback')