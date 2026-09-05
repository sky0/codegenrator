import re
from collections import Counter


SKILL_PATTERNS = {
    'java': ['java', 'jdk', 'jvm', 'j2ee', 'jakarta ee'],
    'spring boot': ['spring boot', 'springboot'],
    'spring': ['spring framework', 'spring mvc', 'spring security', 'spring data', 'spring cloud'],
    'hibernate': ['hibernate', 'jpa', 'orm'],
    'microservices': ['microservices', 'microservice', 'service mesh'],
    'rest api': ['rest', 'restful', 'rest api', 'api design'],
    'sql': ['sql', 'mysql', 'postgresql', 'postgres', 'oracle', 'mssql'],
    'nosql': ['mongodb', 'redis', 'cassandra', 'dynamodb', 'elasticsearch'],
    'kafka': ['kafka', 'event streaming', 'message queue', 'rabbitmq', 'activemq'],
    'docker': ['docker', 'containerization', 'containers'],
    'kubernetes': ['kubernetes', 'k8s', 'helm'],
    'aws': ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'ecs', 'eks'],
    'azure': ['azure', 'azure devops'],
    'gcp': ['gcp', 'google cloud'],
    'ci/cd': ['ci/cd', 'jenkins', 'gitlab ci', 'github actions', 'circleci'],
    'testing': ['junit', 'mockito', 'testng', 'tdd', 'unit test', 'integration test'],
    'agile': ['agile', 'scrum', 'kanban', 'safe'],
    'git': ['git', 'github', 'bitbucket', 'version control'],
    'maven': ['maven', 'gradle', 'build tool'],
    'react': ['react', 'reactjs', 'frontend'],
    'angular': ['angular', 'angularjs'],
    'typescript': ['typescript', 'javascript', 'node.js', 'nodejs'],
    'graphql': ['graphql', 'grpc'],
    'security': ['oauth', 'oauth2', 'jwt', 'sso', 'security'],
    'design patterns': ['design patterns', 'solid', 'clean code', 'oop'],
    'system design': ['system design', 'distributed systems', 'scalability', 'high availability'],
}


DEFAULT_EXPERIENCE = [
    {
        'title': 'Senior Software Engineer',
        'company': 'TechCorp Solutions',
        'duration': '2021 – Present',
        'bullets': [
            'Architected and delivered microservices using {spring} and {hibernate}, serving 2M+ daily API requests.',
            'Designed RESTful APIs with {spring boot}, implementing {security} and reducing latency by 35%.',
            'Led migration from monolith to {microservices} on {aws} using {docker} and {kubernetes}.',
            'Mentored team of 5 engineers on {java} best practices, {testing}, and code review standards.',
        ],
    },
    {
        'title': 'Software Engineer',
        'company': 'InnovateSoft Inc.',
        'duration': '2018 – 2021',
        'bullets': [
            'Built enterprise applications with {java}, {spring boot}, and {hibernate} for financial services clients.',
            'Optimized database queries and {sql} performance, improving report generation by 50%.',
            'Implemented event-driven architecture using {kafka} for real-time data processing.',
            'Collaborated in {agile} sprints, delivering features with 95% on-time completion rate.',
        ],
    },
    {
        'title': 'Junior Java Developer',
        'company': 'StartUp Labs',
        'duration': '2016 – 2018',
        'bullets': [
            'Developed backend services using {java} and {spring} framework for e-commerce platform.',
            'Wrote comprehensive {testing} suites with JUnit and Mockito, achieving 85% code coverage.',
            'Integrated third-party payment APIs and implemented {rest api} endpoints.',
            'Participated in {git}-based workflows and {ci/cd} pipeline improvements.',
        ],
    },
]

DEFAULT_PROJECTS = [
    {
        'name': 'E-Commerce Microservices Platform',
        'tech': '{spring boot}, {hibernate}, {kafka}, {docker}',
        'description': 'Built scalable order processing system handling 10K+ transactions/day with event-driven architecture.',
    },
    {
        'name': 'Cloud-Native API Gateway',
        'tech': '{spring cloud}, {kubernetes}, {aws}',
        'description': 'Designed API gateway with rate limiting, authentication, and service discovery for 15+ microservices.',
    },
    {
        'name': 'Real-Time Analytics Dashboard',
        'tech': '{java}, {sql}, {redis}, {rest api}',
        'description': 'Created backend services for real-time analytics with sub-second query response times.',
    },
]

SUMMARY_TEMPLATES = {
    'backend': 'Results-driven {level} Software Engineer with expertise in {java} and {spring boot}. '
               'Proven track record building scalable backend systems using {hibernate}, {rest api}, and {sql}. '
               'Passionate about clean architecture, {testing}, and delivering high-quality software solutions.',
    'fullstack': 'Versatile {level} Full Stack Engineer specializing in {java}/{spring boot} backend and modern frontend technologies. '
                 'Experienced in end-to-end application development with {hibernate}, {react}, and {rest api}. '
                 'Strong advocate for {agile} methodologies and cross-functional collaboration.',
    'microservices': 'Experienced {level} Engineer with deep expertise in {microservices} architecture using {spring boot} and {spring cloud}. '
                     'Skilled in {kafka}, {docker}, and {kubernetes} for building resilient distributed systems. '
                     'Track record of migrating legacy systems to cloud-native solutions on {aws}.',
    'cloud': 'Cloud-focused {level} Engineer proficient in {java}, {spring boot}, and {aws} cloud services. '
             'Expert in containerization with {docker}/{kubernetes} and implementing {ci/cd} pipelines. '
             'Experienced designing highly available systems with {microservices} and {system design} principles.',
    'data': 'Data-oriented {level} Engineer with strong {java} and {spring boot} foundation. '
            'Experienced building data pipelines with {kafka}, {sql}, and {nosql} databases. '
            'Skilled in ETL processes, real-time streaming, and {hibernate} for data persistence layers.',
    'devops': '{level} DevOps-minded Software Engineer with expertise in {java}/{spring boot} and infrastructure automation. '
              'Proficient in {docker}, {kubernetes}, {ci/cd}, and {aws} cloud platforms. '
              'Bridge between development and operations with focus on reliability and {testing}.',
    'mobile': '{level} Backend Engineer supporting mobile platforms with robust {java} and {spring boot} APIs. '
              'Expert in {rest api} design, {security}, and high-performance {sql}/{nosql} data layers. '
              'Experience with push notifications, real-time sync, and mobile-optimized backend services.',
    'fintech': '{level} FinTech Engineer with expertise in secure {java} applications using {spring boot} and {hibernate}. '
               'Strong background in payment systems, {security} (OAuth2/JWT), and regulatory compliance. '
               'Experienced with high-throughput transaction processing and {sql} optimization.',
    'enterprise': '{level} Enterprise Java Developer with extensive experience in {java}, {spring}, and {hibernate}. '
                  'Proven ability delivering large-scale enterprise applications with {design patterns} and {system design}. '
                  'Expert in legacy modernization, {agile} delivery, and stakeholder communication.',
}

LEVEL_LABELS = {
    'intern': 'Motivated',
    'junior': 'Enthusiastic',
    'mid': 'Accomplished',
    'senior': 'Senior',
    'lead': 'Principal',
}


def extract_skills_from_text(text):
    text_lower = text.lower()
    found = []
    for skill, patterns in SKILL_PATTERNS.items():
        for pattern in patterns:
            if pattern in text_lower:
                found.append(skill)
                break
    return list(dict.fromkeys(found))


def _fill_template(text, skills):
    skill_set = set(skills)
    for skill in SKILL_PATTERNS:
        placeholder = '{' + skill + '}'
        replacement = skill.title() if skill in skill_set else ''
        text = text.replace(placeholder, replacement)
    text = re.sub(r',\s*,', ',', text)
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r',\s*\.', '.', text)
    text = re.sub(r'\s+,', ',', text)
    return text.strip()


def generate_resume(job, profile):
    jd_text = f'{job.description} {job.requirements} {job.skills}'
    detected_skills = extract_skills_from_text(jd_text)
    job_skills = [s.lower() for s in job.skills_list]
    all_skills = list(dict.fromkeys(detected_skills + job_skills))

    stream = job.stream
    level = job.experience_level
    level_label = LEVEL_LABELS.get(level, 'Experienced')

    summary_template = SUMMARY_TEMPLATES.get(stream, SUMMARY_TEMPLATES['backend'])
    summary = _fill_template(summary_template.replace('{level}', level_label), all_skills)

    experience = []
    exp_count = {'intern': 1, 'junior': 2, 'mid': 3, 'senior': 3, 'lead': 3}.get(level, 3)
    for exp in DEFAULT_EXPERIENCE[:exp_count]:
        bullets = []
        for bullet in exp['bullets']:
            filled = _fill_template(bullet, all_skills)
            if filled and not filled.startswith(' '):
                bullets.append(filled)
        experience.append({
            'title': exp['title'] if level in ('senior', 'lead') else exp['title'].replace('Senior ', ''),
            'company': exp['company'],
            'duration': exp['duration'],
            'bullets': bullets[:3 + (1 if level in ('senior', 'lead') else 0)],
        })

    projects = []
    for proj in DEFAULT_PROJECTS[:2 if level in ('intern', 'junior') else 3]:
        projects.append({
            'name': proj['name'],
            'tech': _fill_template(proj['tech'], all_skills),
            'description': _fill_template(proj['description'], all_skills),
        })

    core_skills = []
    priority_skills = ['java', 'spring boot', 'hibernate', 'spring', 'rest api', 'sql',
                       'microservices', 'docker', 'kubernetes', 'aws', 'kafka', 'testing']
    for skill in priority_skills:
        if skill in all_skills:
            core_skills.append(skill.title())
    for skill in all_skills:
        titled = skill.title()
        if titled not in core_skills:
            core_skills.append(titled)

    education = profile.get('education', 'B.S. Computer Science — State University (2016)')

    certifications = []
    cert_map = {
        'aws': 'AWS Certified Developer – Associate',
        'kubernetes': 'Certified Kubernetes Application Developer (CKAD)',
        'spring': 'Spring Professional Certification',
        'java': 'Oracle Certified Professional, Java SE',
    }
    for skill, cert in cert_map.items():
        if skill in all_skills:
            certifications.append(cert)

    return {
        'name': profile.get('name', 'John Doe'),
        'email': profile.get('email', 'john.doe@email.com'),
        'phone': profile.get('phone', '+1 (555) 123-4567'),
        'linkedin': profile.get('linkedin', 'linkedin.com/in/johndoe'),
        'location': profile.get('location', 'San Francisco, CA'),
        'summary': summary,
        'skills': core_skills[:12],
        'experience': experience,
        'projects': projects,
        'education': education,
        'certifications': certifications[:3],
        'target_role': job.title,
        'target_company': job.company,
        'matched_skills': [s.title() for s in all_skills[:8]],
    }
