from django.db import models
from vote.models import VoteModel
import datetime
#from vote.models import VoteModel

# Create your models here.
YEAR_CHOICES = []
for year in range(2016, (datetime.datetime.now().year + 1)):
    YEAR_CHOICES.append((year, year))



class PreviousYearQuestions(models.Model):
    title = models.CharField(max_length=120, default="")
    name = models.CharField(max_length=100, default="")
    course_id = models.CharField(max_length=10, default="")
    batch = models.IntegerField(choices=YEAR_CHOICES, default="")
    course_instructor = models.CharField(max_length=100, default="")
    #uploaded_at = models.DateTimeField(auto_now=True)
    gdrive_link = models.URLField(max_length=500, default="")
    completed = models.BooleanField(default=False)

    def _str_(self):
        return self.title

class Notes(VoteModel, models.Model):
    

    title = models.CharField(max_length=120, default="")
    name = models.CharField(max_length=100, default="")
    course_id = models.CharField(max_length=10, default="")
    batch = models.IntegerField(choices=YEAR_CHOICES, default=2020)
    course_instructor = models.CharField(max_length=100, default="")
    #uploaded_at = models.DateTimeField(auto_now=True)
    gdrive_link = models.URLField(max_length=500, default="")
    completed = models.BooleanField(default=False)

    def _str_(self):
        return self.title

class Feedback(models.Model):
    title = models.CharField(max_length=120, default="")
    name = models.CharField(max_length=100, default="")
    course_id = models.CharField(max_length=10, default="")
    course_instructor = models.CharField(max_length=100, default="")
    batch = models.IntegerField(choices=YEAR_CHOICES, default=2020)
    #created_date = models.DateTimeField(auto_now_add=True,defaul)
    #updated_date = models.DateTimeField(auto_now=True)
    feedback = models.TextField(default="")
    completed = models.BooleanField(default=False)

    def _str_(self):
        return self.title