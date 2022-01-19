from django.db import models
#from vote.models import VoteModel
import datetime


YEAR_CHOICES = []
for year in range(2016, (datetime.datetime.now().year + 1)):
    YEAR_CHOICES.append((year, year))

class Course(models.Model):
    course_id = models.CharField(max_length=10)

    def _str_(self):
        return self.course_id
    
class Instructor(models.Model):
    course_instructor = models.CharField(max_length=100)

    def _str_(self):
        return self.course_instructor


class Note(models.Model):
    title = models.CharField(max_length=120)
    name = models.CharField(max_length=100)
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE)
    batch = models.IntegerField(choices=YEAR_CHOICES)
    course_instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE)
    gdrive_link = models.URLField(max_length=500)   

    def _str_(self):
        return self.title

class PreviousYearQuestion(models.Model):
    title = models.CharField(max_length=120)
    name = models.CharField(max_length=100)
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE)
    batch = models.IntegerField(choices=YEAR_CHOICES)
    course_instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE)
    gdrive_link = models.URLField(max_length=500)
    
    def _str_(self):
        return self.title

class Feedback(models.Model):
    title = models.CharField(max_length=120)
    name = models.CharField(max_length=100)
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE)
    batch = models.IntegerField(choices=YEAR_CHOICES)
    course_instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE)
    Feedback = models.CharField(max_length=1000)
    
    def _str_(self):
        return self.title