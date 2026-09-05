const SKILL_PATTERNS = {
    java: ['java', 'jdk', 'jvm', 'j2ee', 'jakarta ee'],
    'spring boot': ['spring boot', 'springboot'],
    spring: ['spring framework', 'spring mvc', 'spring security', 'spring data', 'spring cloud'],
    hibernate: ['hibernate', 'jpa', 'orm'],
    microservices: ['microservices', 'microservice', 'service mesh'],
    'rest api': ['rest', 'restful', 'rest api', 'api design'],
    sql: ['sql', 'mysql', 'postgresql', 'postgres', 'oracle', 'mssql'],
    nosql: ['mongodb', 'redis', 'cassandra', 'dynamodb', 'elasticsearch'],
    kafka: ['kafka', 'event streaming', 'message queue', 'rabbitmq', 'activemq'],
    docker: ['docker', 'containerization', 'containers'],
    kubernetes: ['kubernetes', 'k8s', 'helm'],
    aws: ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'ecs', 'eks'],
    azure: ['azure', 'azure devops'],
    gcp: ['gcp', 'google cloud'],
    'ci/cd': ['ci/cd', 'jenkins', 'gitlab ci', 'github actions', 'circleci'],
    testing: ['junit', 'mockito', 'testng', 'tdd', 'unit test', 'integration test'],
    agile: ['agile', 'scrum', 'kanban', 'safe'],
    git: ['git', 'github', 'bitbucket', 'version control'],
    maven: ['maven', 'gradle', 'build tool'],
    react: ['react', 'reactjs', 'frontend'],
    angular: ['angular', 'angularjs'],
    typescript: ['typescript', 'javascript', 'node.js', 'nodejs'],
    graphql: ['graphql', 'grpc'],
    security: ['oauth', 'oauth2', 'jwt', 'sso', 'security'],
    'design patterns': ['design patterns', 'solid', 'clean code', 'oop'],
    'system design': ['system design', 'distributed systems', 'scalability', 'high availability']
};

const DEFAULT_EXPERIENCE = [
    {
        title: 'Senior Software Engineer',
        company: 'TechCorp Solutions',
        duration: '2021 – Present',
        bullets: [
            'Architected and delivered microservices using {spring} and {hibernate}, serving 2M+ daily API requests.',
            'Designed RESTful APIs with {spring boot}, implementing {security} and reducing latency by 35%.',
            'Led migration from monolith to {microservices} on {aws} using {docker} and {kubernetes}.',
            'Mentored team of 5 engineers on {java} best practices, {testing}, and code review standards.'
        ]
    },
    {
        title: 'Software Engineer',
        company: 'InnovateSoft Inc.',
        duration: '2018 – 2021',
        bullets: [
            'Built enterprise applications with {java}, {spring boot}, and {hibernate} for financial services clients.',
            'Optimized database queries and {sql} performance, improving report generation by 50%.',
            'Implemented event-driven architecture using {kafka} for real-time data processing.',
            'Collaborated in {agile} sprints, delivering features with 95% on-time completion rate.'
        ]
    },
    {
        title: 'Junior Java Developer',
        company: 'StartUp Labs',
        duration: '2016 – 2018',
        bullets: [
            'Developed backend services using {java} and {spring} framework for e-commerce platform.',
            'Wrote comprehensive {testing} suites with JUnit and Mockito, achieving 85% code coverage.',
            'Integrated third-party payment APIs and implemented {rest api} endpoints.',
            'Participated in {git}-based workflows and {ci/cd} pipeline improvements.'
        ]
    }
];

const DEFAULT_PROJECTS = [
    {
        name: 'E-Commerce Microservices Platform',
        tech: '{spring boot}, {hibernate}, {kafka}, {docker}',
        description: 'Built scalable order processing system handling 10K+ transactions/day with event-driven architecture.'
    },
    {
        name: 'Cloud-Native API Gateway',
        tech: '{spring cloud}, {kubernetes}, {aws}',
        description: 'Designed API gateway with rate limiting, authentication, and service discovery for 15+ microservices.'
    },
    {
        name: 'Real-Time Analytics Dashboard',
        tech: '{java}, {sql}, {redis}, {rest api}',
        description: 'Created backend services for real-time analytics with sub-second query response times.'
    }
];

const SUMMARY_TEMPLATES = {
    backend: 'Results-driven {level} Software Engineer with expertise in {java} and {spring boot}. Proven track record building scalable backend systems using {hibernate}, {rest api}, and {sql}. Passionate about clean architecture, {testing}, and delivering high-quality software solutions.',
    fullstack: 'Versatile {level} Full Stack Engineer specializing in {java}/{spring boot} backend and modern frontend technologies. Experienced in end-to-end application development with {hibernate}, {react}, and {rest api}. Strong advocate for {agile} methodologies and cross-functional collaboration.',
    microservices: 'Experienced {level} Engineer with deep expertise in {microservices} architecture using {spring boot} and {spring cloud}. Skilled in {kafka}, {docker}, and {kubernetes} for building resilient distributed systems. Track record of migrating legacy systems to cloud-native solutions on {aws}.',
    cloud: 'Cloud-focused {level} Engineer proficient in {java}, {spring boot}, and {aws} cloud services. Expert in containerization with {docker}/{kubernetes} and implementing {ci/cd} pipelines. Experienced designing highly available systems with {microservices} and {system design} principles.',
    data: 'Data-oriented {level} Engineer with strong {java} and {spring boot} foundation. Experienced building data pipelines with {kafka}, {sql}, and {nosql} databases. Skilled in ETL processes, real-time streaming, and {hibernate} for data persistence layers.',
    devops: '{level} DevOps-minded Software Engineer with expertise in {java}/{spring boot} and infrastructure automation. Proficient in {docker}, {kubernetes}, {ci/cd}, and {aws} cloud platforms. Bridge between development and operations with focus on reliability and {testing}.',
    mobile: '{level} Backend Engineer supporting mobile platforms with robust {java} and {spring boot} APIs. Expert in {rest api} design, {security}, and high-performance {sql}/{nosql} data layers. Experience with push notifications, real-time sync, and mobile-optimized backend services.',
    fintech: '{level} FinTech Engineer with expertise in secure {java} applications using {spring boot} and {hibernate}. Strong background in payment systems, {security} (OAuth2/JWT), and regulatory compliance. Experienced with high-throughput transaction processing and {sql} optimization.',
    enterprise: '{level} Enterprise Java Developer with extensive experience in {java}, {spring}, and {hibernate}. Proven ability delivering large-scale enterprise applications with {design patterns} and {system design}. Expert in legacy modernization, {agile} delivery, and stakeholder communication.'
};

const LEVEL_LABELS = {
    intern: 'Motivated',
    junior: 'Enthusiastic',
    mid: 'Accomplished',
    senior: 'Senior',
    lead: 'Principal'
};

function extractSkills(text) {
    const lower = text.toLowerCase();
    const found = [];
    Object.keys(SKILL_PATTERNS).forEach(function (skill) {
        const match = SKILL_PATTERNS[skill].some(function (pattern) {
            return lower.indexOf(pattern) !== -1;
        });
        if (match) found.push(skill);
    });
    return found;
}

function fillTemplate(text, skills) {
    const skillSet = {};
    skills.forEach(function (s) { skillSet[s] = true; });
    Object.keys(SKILL_PATTERNS).forEach(function (skill) {
        const placeholder = '{' + skill + '}';
        const replacement = skillSet[skill] ? titleCase(skill) : '';
        text = text.split(placeholder).join(replacement);
    });
    return text
        .replace(/,\s*,/g, ',')
        .replace(/\s+/g, ' ')
        .replace(/,\s*\./g, '.')
        .replace(/\s+,/g, ',')
        .trim();
}

function titleCase(skill) {
    return skill.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
}

function unique(list) {
    const seen = {};
    const out = [];
    list.forEach(function (item) {
        if (!seen[item]) {
            seen[item] = true;
            out.push(item);
        }
    });
    return out;
}

function generateResume(job, profile) {
    const jdText = [job.description, job.requirements, job.skills].join(' ');
    const detected = extractSkills(jdText);
    const jobSkills = (job.skills || '').split(',').map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
    const allSkills = unique(detected.concat(jobSkills));
    const level = job.experience_level || 'mid';
    const levelLabel = LEVEL_LABELS[level] || 'Experienced';
    const summaryTemplate = SUMMARY_TEMPLATES[job.stream] || SUMMARY_TEMPLATES.backend;
    const summary = fillTemplate(summaryTemplate.replace('{level}', levelLabel), allSkills);

    const expCount = { intern: 1, junior: 2, mid: 3, senior: 3, lead: 3 }[level] || 3;
    const experience = DEFAULT_EXPERIENCE.slice(0, expCount).map(function (exp) {
        const bullets = exp.bullets.map(function (b) { return fillTemplate(b, allSkills); }).filter(Boolean);
        const limit = 3 + (level === 'senior' || level === 'lead' ? 1 : 0);
        return {
            title: (level === 'senior' || level === 'lead') ? exp.title : exp.title.replace('Senior ', ''),
            company: exp.company,
            duration: exp.duration,
            bullets: bullets.slice(0, limit)
        };
    });

    const projectCount = (level === 'intern' || level === 'junior') ? 2 : 3;
    const projects = DEFAULT_PROJECTS.slice(0, projectCount).map(function (proj) {
        return {
            name: proj.name,
            tech: fillTemplate(proj.tech, allSkills),
            description: fillTemplate(proj.description, allSkills)
        };
    });

    const coreSkills = [];
    const priority = ['java', 'spring boot', 'hibernate', 'spring', 'rest api', 'sql', 'microservices', 'docker', 'kubernetes', 'aws', 'kafka', 'testing'];
    priority.forEach(function (skill) {
        if (allSkills.indexOf(skill) !== -1) coreSkills.push(titleCase(skill));
    });
    allSkills.forEach(function (skill) {
        const titled = titleCase(skill);
        if (coreSkills.indexOf(titled) === -1) coreSkills.push(titled);
    });

    const certMap = {
        aws: 'AWS Certified Developer – Associate',
        kubernetes: 'Certified Kubernetes Application Developer (CKAD)',
        spring: 'Spring Professional Certification',
        java: 'Oracle Certified Professional, Java SE'
    };
    const certifications = [];
    Object.keys(certMap).forEach(function (skill) {
        if (allSkills.indexOf(skill) !== -1) certifications.push(certMap[skill]);
    });

    return {
        name: profile.name || 'John Doe',
        email: profile.email || 'john.doe@email.com',
        phone: profile.phone || '+1 (555) 123-4567',
        linkedin: profile.linkedin || 'linkedin.com/in/johndoe',
        location: profile.location || 'San Francisco, CA',
        summary: summary,
        skills: coreSkills.slice(0, 12),
        experience: experience,
        projects: projects,
        education: profile.education || 'B.S. Computer Science — State University (2016)',
        certifications: certifications.slice(0, 3),
        target_role: job.title,
        target_company: job.company,
        matched_skills: allSkills.slice(0, 8).map(titleCase)
    };
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function renderResume(resume, job) {
    const skills = resume.skills.map(function (s) {
        return '<span class="resume-skill">' + escapeHtml(s) + '</span>';
    }).join('');
    const matched = resume.matched_skills.map(function (s) {
        return '<span class="skill-tag sm">' + escapeHtml(s) + '</span>';
    }).join('');
    const experience = resume.experience.map(function (exp) {
        const bullets = exp.bullets.map(function (b) { return '<li>' + escapeHtml(b) + '</li>'; }).join('');
        return '<div class="resume-exp-item"><div class="resume-exp-header"><strong>' +
            escapeHtml(exp.title) + '</strong><span class="resume-exp-duration">' +
            escapeHtml(exp.duration) + '</span></div><div class="resume-exp-company">' +
            escapeHtml(exp.company) + '</div><ul>' + bullets + '</ul></div>';
    }).join('');
    const projects = resume.projects.map(function (proj) {
        return '<div class="resume-project-item"><strong>' + escapeHtml(proj.name) +
            '</strong><span class="resume-project-tech">' + escapeHtml(proj.tech) +
            '</span><p>' + escapeHtml(proj.description) + '</p></div>';
    }).join('');
    const certs = resume.certifications.length
        ? '<section class="resume-section"><h2>Certifications</h2><ul class="resume-certs">' +
            resume.certifications.map(function (c) { return '<li>' + escapeHtml(c) + '</li>'; }).join('') +
            '</ul></section>'
        : '';

    return '<div class="resume-match-banner"><span class="match-icon">✨</span> Resume tailored for <strong>' +
        escapeHtml(job.title) + '</strong> at <strong>' + escapeHtml(job.company) +
        '</strong><div class="matched-skills">Matched skills: ' + matched +
        '</div></div><div class="resume-document" id="resume-document"><header class="resume-header"><h1>' +
        escapeHtml(resume.name) + '</h1><div class="resume-contact"><span>' +
        escapeHtml(resume.email) + '</span><span class="sep">|</span><span>' +
        escapeHtml(resume.phone) + '</span><span class="sep">|</span><span>' +
        escapeHtml(resume.location) + '</span><span class="sep">|</span><span>' +
        escapeHtml(resume.linkedin) + '</span></div></header><section class="resume-section"><h2>Professional Summary</h2><p>' +
        escapeHtml(resume.summary) + '</p></section><section class="resume-section"><h2>Core Skills</h2><div class="resume-skills">' +
        skills + '</div></section><section class="resume-section"><h2>Professional Experience</h2>' +
        experience + '</section><section class="resume-section"><h2>Projects</h2>' +
        projects + '</section>' + certs +
        '<section class="resume-section"><h2>Education</h2><p>' +
        escapeHtml(resume.education) + '</p></section></div>' +
        '<div class="resume-actions" style="margin-top:24px;justify-content:center">' +
        '<button type="button" class="btn btn-primary" onclick="window.print()">🖨️ Print / Save PDF</button></div>';
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('resume-form');
    const output = document.getElementById('resume-output');
    const jobNode = document.getElementById('job-json');
    if (!form || !output || !jobNode) return;

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const job = JSON.parse(jobNode.textContent);
        const profile = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            phone: form.phone.value.trim(),
            linkedin: form.linkedin.value.trim(),
            location: form.location.value.trim(),
            education: form.education.value.trim()
        };
        const resume = generateResume(job, profile);
        output.innerHTML = renderResume(resume, job);
        output.hidden = false;
        form.hidden = true;
        output.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
