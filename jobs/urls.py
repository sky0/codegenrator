from django.urls import path

from . import views

app_name = 'jobs'

urlpatterns = [
    path('', views.home, name='home'),
    path('jobs/', views.job_list, name='job_list'),
    path('jobs/<int:pk>/', views.job_detail, name='job_detail'),
    path('jobs/<int:pk>/resume/', views.resume_form, name='resume_form'),
    path('jobs/<int:pk>/resume/generate/', views.generate_resume_view, name='generate_resume'),
    path('api/search/', views.api_search, name='api_search'),
]
