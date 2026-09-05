from django.contrib import admin

from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'stream', 'experience_level', 'location', 'remote', 'is_featured')
    list_filter = ('stream', 'experience_level', 'remote', 'is_featured')
    search_fields = ('title', 'company', 'skills', 'description')
