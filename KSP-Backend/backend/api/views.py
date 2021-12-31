from django.shortcuts import render
from rest_framework import viewsets
from vote.views import VoteMixin
from .serializers import FeedbackSerializer, NotesSerializer, PreviousYearQuestionsSerializer
from .models import Feedback, Notes, PreviousYearQuestions

# Create your views here.

class FeedbackView(viewsets.ModelViewSet):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()

class NotesView(viewsets.ModelViewSet, VoteMixin):
    serializer_class = NotesSerializer
    queryset = Notes.objects.all()
    #review = Notes.objects.get(pk=1)
    #upvote
    #review.votes.up(id)

class PreviousYearQuestionsView(viewsets.ModelViewSet):
    serializer_class = PreviousYearQuestionsSerializer
    queryset = PreviousYearQuestions.objects.all()



def vote(request, note_id):
            notes = Notes.objects.get(pk=note_id)
            user_votes_up = notes.votes.user_ids(0)
            user_votes_down = notes.votes.user_ids(1)
            check = {"user_id": request.user.id}
            if request.GET.get("up"):
                if check in user_votes_up.values("user_id"):
                    notes.votes.delete(request.user.id)
                else:
                    notes.votes.up(request.user.id)
            if request.GET.get("down"):
                if check in user_votes_down.values("user_id"):
                    notes.votes.delete(request.user.id)
                else:
                    notes.votes.down(request.user.id)
            if request.GET.get("status"):
                has_upvoted = notes.votes.exists(request.user.id, action=0)
                has_downvoted = notes.votes.exists(request.user.id, action=1)
                return JsonResponse(
                    {
                        "has_upvoted": has_upvoted,
                        "has_downvoted": has_downvoted
                    }
                )
