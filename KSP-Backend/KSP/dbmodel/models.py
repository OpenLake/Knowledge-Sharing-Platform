from django.db import models
from django.contrib.auth.models import AbstractUser

class professor (models.Model):
    id = models.IntegerField()
    photo_url = models.CharField(max_length=100)
    web_url = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    rating = models.FloatField() # between 1 to 10 
 

class course (models.Model):
    id =  models.ManyToManyField(professor)
    course_code = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    sem = models.CharField(max_length=100)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    department = models.CharField(max_length=100)

class course_notes (models.Model):
    id =  models.IntegerField()
    title  = models.CharField(max_length=100)
    upload_time = models.DateTimeField(auto_now_add=True)
    course_id =  models.ForeignKey(course, null=True, on_delete=models.SET_NULL)
    url  = models.CharField(max_length=100)
 

class user (AbstractUser):
    id =  models.IntegerField() 
    name  = models.CharField(max_length=100)
    gender  = models.CharField(max_length=100)
    batch  = models.CharField(max_length=100)
    program  = models.CharField(max_length=100)
    department  = models.CharField(max_length=100)
    rating = models.FloatField()
 

class tag (models.Model):
    id =  models.ManyToManyField(course_notes)
    value  = models.CharField(max_length=100)
 


class course_feedback (models.Model):
    course_id = models.ForeignKey(course, null=True, on_delete=models.SET_NULL)
    id =  models.IntegerField()
    user_id = models.ForeignKey(user, on_delete=models.SET_NULL)
    comment  = models.CharField(max_length=100)
    upvote = models.IntegerField()
    downvote = models.IntegerField()
 
