from django.db import models


class JobStream(models.TextChoices):
    BACKEND = 'backend', 'Backend Engineering'
    FULLSTACK = 'fullstack', 'Full Stack'
    MICROSERVICES = 'microservices', 'Microservices'
    CLOUD = 'cloud', 'Cloud Native'
    DATA = 'data', 'Data Engineering'
    DEVOPS = 'devops', 'DevOps / SRE'
    MOBILE = 'mobile', 'Mobile Backend'
    FINTECH = 'fintech', 'FinTech'
    ENTERPRISE = 'enterprise', 'Enterprise Java'


class ExperienceLevel(models.TextChoices):
    INTERN = 'intern', 'Intern'
    JUNIOR = 'junior', 'Junior (0-2 yrs)'
    MID = 'mid', 'Mid-Level (2-5 yrs)'
    SENIOR = 'senior', 'Senior (5-8 yrs)'
    LEAD = 'lead', 'Lead / Principal (8+ yrs)'


class Job(models.Model):
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=150)
    location = models.CharField(max_length=150)
    remote = models.BooleanField(default=False)
    stream = models.CharField(max_length=20, choices=JobStream.choices, default=JobStream.BACKEND)
    experience_level = models.CharField(max_length=10, choices=ExperienceLevel.choices, default=ExperienceLevel.MID)
    salary_min = models.IntegerField(null=True, blank=True)
    salary_max = models.IntegerField(null=True, blank=True)
    description = models.TextField()
    requirements = models.TextField()
    skills = models.CharField(max_length=500, help_text='Comma-separated skills')
    posted_at = models.DateField(auto_now_add=True)
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-is_featured', '-posted_at']

    def __str__(self):
        return f'{self.title} at {self.company}'

    @property
    def skills_list(self):
        return [s.strip() for s in self.skills.split(',') if s.strip()]

    @property
    def salary_display(self):
        if self.salary_min and self.salary_max:
            return f'${self.salary_min:,} – ${self.salary_max:,}'
        if self.salary_min:
            return f'From ${self.salary_min:,}'
        return 'Competitive'
