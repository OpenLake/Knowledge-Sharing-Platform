from django.contrib import admin
from .models import Feedback, Notes, PreviousYearQuestions

class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('title', 'name', 'course_id','course_instructor','batch','feedback','completed')
# Register your models here.
admin.site.register(Feedback, FeedbackAdmin)


class NotesAdmin(admin.ModelAdmin):
    list_display = ('title', 'name' ,'course_id','course_instructor','batch','gdrive_link', 'completed')
# Register your models here.
admin.site.register(Notes, NotesAdmin)


class PreviousYearQuestionsAdmin(admin.ModelAdmin):
    list_display = ('title', 'name', 'course_id','course_instructor','batch','gdrive_link', 'completed')
# Register your models here.
admin.site.register(PreviousYearQuestions, PreviousYearQuestionsAdmin)