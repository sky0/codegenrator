#!/usr/bin/env bash
set -o errexit
python manage.py collectstatic --noinput
python manage.py migrate --noinput
python manage.py seed_jobs
gunicorn codeleadgenration.wsgi:application --bind 0.0.0.0:"${PORT:-8000}"
