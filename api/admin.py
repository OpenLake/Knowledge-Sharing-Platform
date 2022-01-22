from django.contrib import admin
from .models import Feedback, Note, PreviousYearQuestion


class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'name', 'course_id', 'course_instructor', 'batch', 'gdrive_link')


# Register your models here.
admin.site.register(Note, NoteAdmin)


class PreviousYearQuestionAdmin(admin.ModelAdmin):
    list_display = ('title', 'name', 'course_id', 'course_instructor', 'batch', 'gdrive_link')


# Register your models here.
admin.site.register(PreviousYearQuestion, PreviousYearQuestionAdmin)


class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('title', 'name', 'course_id', 'course_instructor', 'batch', 'Feedback')


# Register your models here.
admin.site.register(Feedback, FeedbackAdmin)
