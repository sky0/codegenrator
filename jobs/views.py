from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views.decorators.http import require_POST

from .models import ExperienceLevel, Job, JobStream
from .resume_generator import generate_resume


def home(request):
    featured_jobs = Job.objects.filter(is_featured=True)[:6]
    if not featured_jobs.exists():
        featured_jobs = Job.objects.all()[:6]
    total_jobs = Job.objects.count()
    streams = JobStream.choices
    context = {
        'featured_jobs': featured_jobs,
        'total_jobs': total_jobs,
        'streams': streams,
    }
    return render(request, 'jobs/home.html', context)


def job_list(request):
    jobs = Job.objects.all()
    q = request.GET.get('q', '').strip()
    stream = request.GET.get('stream', '')
    level = request.GET.get('level', '')
    remote = request.GET.get('remote', '')
    location = request.GET.get('location', '').strip()

    if q:
        jobs = jobs.filter(
            Q(title__icontains=q)
            | Q(company__icontains=q)
            | Q(description__icontains=q)
            | Q(skills__icontains=q)
            | Q(requirements__icontains=q)
        )
    if stream:
        jobs = jobs.filter(stream=stream)
    if level:
        jobs = jobs.filter(experience_level=level)
    if remote == 'true':
        jobs = jobs.filter(remote=True)
    if location:
        jobs = jobs.filter(location__icontains=location)

    context = {
        'jobs': jobs,
        'q': q,
        'stream': stream,
        'level': level,
        'remote': remote,
        'location': location,
        'streams': JobStream.choices,
        'levels': ExperienceLevel.choices,
        'result_count': jobs.count(),
    }
    return render(request, 'jobs/job_list.html', context)


def job_detail(request, pk):
    job = get_object_or_404(Job, pk=pk)
    related = Job.objects.filter(stream=job.stream).exclude(pk=pk)[:3]
    context = {
        'job': job,
        'related_jobs': related,
    }
    return render(request, 'jobs/job_detail.html', context)


def resume_form(request, pk):
    job = get_object_or_404(Job, pk=pk)
    context = {'job': job}
    return render(request, 'jobs/resume_form.html', context)


@require_POST
def generate_resume_view(request, pk):
    job = get_object_or_404(Job, pk=pk)
    profile = {
        'name': request.POST.get('name', '').strip() or 'John Doe',
        'email': request.POST.get('email', '').strip() or 'john.doe@email.com',
        'phone': request.POST.get('phone', '').strip() or '+1 (555) 123-4567',
        'linkedin': request.POST.get('linkedin', '').strip() or 'linkedin.com/in/johndoe',
        'location': request.POST.get('location', '').strip() or 'San Francisco, CA',
        'education': request.POST.get('education', '').strip() or 'B.S. Computer Science — State University (2016)',
    }
    resume = generate_resume(job, profile)
    context = {
        'job': job,
        'resume': resume,
    }
    return render(request, 'jobs/resume_preview.html', context)


def api_search(request):
    q = request.GET.get('q', '').strip()
    if not q or len(q) < 2:
        return JsonResponse({'results': []})
    jobs = Job.objects.filter(
        Q(title__icontains=q) | Q(company__icontains=q) | Q(skills__icontains=q)
    )[:8]
    results = [
        {
            'id': job.pk,
            'title': job.title,
            'company': job.company,
            'location': job.location,
            'stream': job.get_stream_display(),
        }
        for job in jobs
    ]
    return JsonResponse({'results': results})
