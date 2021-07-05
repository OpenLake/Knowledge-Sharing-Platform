from django.db import models
from django.contrib.auth.models import AbstractUser

class Professor (models.Model):
    id = models.IntegerField()
    photo_url = models.CharField(max_length=100)
    web_url = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    rating = models.FloatField() # between 1 to 10 
 
class Course (models.Model):
    professors =  models.ManyToManyField(Professor)
    course_code = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    sem = models.CharField(max_length=100)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    department = models.CharField(max_length=100)

class CourseNotes (models.Model):
    title  = models.CharField(max_length=100)
    upload_time = models.DateTimeField(auto_now_add=True)
    course_id =  models.ForeignKey(Course, null=True, on_delete=models.SET_NULL)
    url  = models.CharField(max_length=100)
 
class User (AbstractUser):
    name  = models.CharField(max_length=100)
    gender  = models.CharField(max_length=100)
    batch  = models.CharField(max_length=100)
    program  = models.CharField(max_length=100)
    department  = models.CharField(max_length=100)
    rating = models.FloatField()
 
class Tag (models.Model):
    notes =  models.ManyToManyField(CourseNotes)
    value  = models.CharField(max_length=100)
 
class CourseFeedback (models.Model):
    courses = models.ForeignKey(Course, null=True, on_delete=models.SET_NULL)
    students = models.ForeignKey(User, on_delete=models.SET_NULL)
    comment  = models.CharField(max_length=100)
    upvote = models.IntegerField()
    downvote = models.IntegerField()
 
