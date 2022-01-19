from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework import viewsets
from .models import Note, PreviousYearQuestion, Feedback
from .serializers import *
from django.shortcuts import render

class NoteView(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    queryset = Note.objects.all()

@api_view(['GET', 'POST'])
def Note_list(request):
    if request.method == 'GET':
        data = Note.objects.all()

        serializer = NoteSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PreviousYearQuestionView(viewsets.ModelViewSet):
    serializer_class = PreviousYearQuestionSerializer
    queryset = PreviousYearQuestion.objects.all()

@api_view(['GET', 'POST'])
def PreviousYearQuestion_list(request):
    if request.method == 'GET':
        data = PreviousYearQuestion.objects.all()

        serializer = PreviousYearQuestionSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = PreviousYearQuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FeedbackView(viewsets.ModelViewSet):
    serializer_class = Feedback
    queryset = Feedback.objects.all()

@api_view(['GET', 'POST'])
def Feedback_list(request):
    if request.method == 'GET':
        data = Feedback.objects.all()

        serializer = FeedbackSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
