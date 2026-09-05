import json
import os
import re
import shutil
from pathlib import Path

from django.conf import settings
from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError
from django.test import Client
from django.urls import set_script_prefix

from jobs.models import Job


def relativize_html(html, relpath, base):
    parent = Path(relpath).parent
    depth = 0 if str(parent) == '.' else len(parent.parts)
    prefix = '' if depth == 0 else '../' * depth
    meta = '.' if depth == 0 else '/'.join(['..'] * depth)

    html = html.replace(f'{base}/static/', f'{prefix}static/')
    html = re.sub(re.escape(base) + r'/jobs/(\d+)/resume/?', prefix + r'jobs/\1/resume/index.html', html)
    html = re.sub(re.escape(base) + r'/jobs/(\d+)/?', prefix + r'jobs/\1/index.html', html)
    html = html.replace(f'{base}/jobs/', f'{prefix}jobs/index.html')
    html = html.replace(f'{base}/', f'{prefix}index.html')
    html = html.replace(f'content="{base}"', f'content="{meta}"')
    html = html.replace('content=""', f'content="{meta}"')
    return html


class Command(BaseCommand):
    help = 'Export the job board as a static site for GitHub Pages'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dest',
            default=os.path.join(settings.BASE_DIR, 'site'),
            help='Output directory',
        )
        parser.add_argument(
            '--base',
            default=os.environ.get('SITE_BASE', '/codegenrator'),
            help='URL prefix used while rendering, then rewritten to relative links',
        )

    def handle(self, *args, **options):
        dest = Path(options['dest'])
        base = options['base'].rstrip('/') or '/codegenrator'
        if dest.exists():
            shutil.rmtree(dest)
        dest.mkdir(parents=True)

        settings.SITE_BASE = base
        settings.STATIC_EXPORT = True
        settings.STATIC_URL = f'{base}/static/'
        set_script_prefix(base + '/')

        call_command('collectstatic', interactive=False, verbosity=0)
        shutil.copytree(settings.STATIC_ROOT, dest / 'static')

        (dest / '.nojekyll').write_text('')

        client = Client()

        def write(url, relpath):
            response = client.get(url)
            if response.status_code != 200:
                raise CommandError(f'{url} returned {response.status_code}')
            path = dest / relpath
            path.parent.mkdir(parents=True, exist_ok=True)
            html = relativize_html(response.content.decode('utf-8'), relpath, base)
            path.write_text(html, encoding='utf-8')

        write('/', 'index.html')
        write('/jobs/', 'jobs/index.html')

        payload = []
        for job in Job.objects.all():
            write(f'/jobs/{job.pk}/', f'jobs/{job.pk}/index.html')
            write(f'/jobs/{job.pk}/resume/', f'jobs/{job.pk}/resume/index.html')
            payload.append({
                'id': job.pk,
                'title': job.title,
                'company': job.company,
                'location': job.location,
                'stream': job.get_stream_display(),
                'stream_value': job.stream,
                'skills': job.skills,
            })

        (dest / 'jobs.json').write_text(json.dumps({'results': payload}), encoding='utf-8')
        (dest / '404.html').write_text(
            '<!DOCTYPE html><html><head><meta charset="utf-8">'
            '<meta http-equiv="refresh" content="0; url=./index.html">'
            '</head><body><a href="./index.html">Go to DevCareer Hub</a></body></html>',
            encoding='utf-8',
        )

        self.stdout.write(self.style.SUCCESS(f'Exported static site to {dest}'))
