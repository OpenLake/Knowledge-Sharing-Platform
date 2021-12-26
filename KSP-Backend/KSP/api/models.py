import datetime
from django.db import models

YEAR_CHOICES = []
for year in range(2016, (datetime.datetime.now().year + 1)):
    YEAR_CHOICES.append((year, year))


class Notes(models.Model):
    course_id = models.CharField(max_length=10)
    batch = models.IntegerField(choices=YEAR_CHOICES)
    course_instructor = models.CharField(max_length=100)
    uploaded_at = models.DateTimeField(auto_now=True)
    gdrive_link = models.URLField(max_length=500)

class Feedback(models.Model):
    name = models.CharField(max_length=100)
    course_id = models.CharField(max_length=10)
    course_instructor = models.CharField(max_length=100)
    batch = models.IntegerField(choices=YEAR_CHOICES)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    feedback = models.TextField()

class PYQs(models.Model):
    course_id = models.CharField(max_length=10)
    batch = models.IntegerField(choices=YEAR_CHOICES)
    course_instructor = models.CharField(max_length=100)
    uploaded_at = models.DateTimeField(auto_now=True)
    gdrive_link = models.URLField(max_length=500)

class Resources(models.Model):
    course_id = models.CharField(max_length=10)
    batch = models.IntegerField(choices=YEAR_CHOICES)
    course_instructor = models.CharField(max_length=100)
    uploaded_at = models.DateTimeField(auto_now=True)
    gdrive_link = models.URLField(max_length=500)
