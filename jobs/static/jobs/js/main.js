function siteBase() {
    const meta = document.querySelector('meta[name="site-base"]');
    const value = meta ? meta.getAttribute('content') : '';
    if (value && (value.startsWith('.') || value === '')) {
        const directory = window.location.pathname.replace(/[^/]+$/, '');
        const resolved = new URL((value || '.') + '/', window.location.origin + directory);
        return resolved.pathname.replace(/\/$/, '');
    }
    if (value) return value.replace(/\/$/, '');
    const path = window.location.pathname.replace(/\/index\.html$/, '');
    const parts = path.split('/').filter(Boolean);
    const jobsIdx = parts.indexOf('jobs');
    if (jobsIdx >= 0) {
        return '/' + parts.slice(0, jobsIdx).join('/');
    }
    return path === '/' ? '' : path.replace(/\/$/, '');
}

function jobUrl(id) {
    return siteBase() + '/jobs/' + id + '/index.html';
}

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('hero-search-input');
    const suggestionsBox = document.getElementById('search-suggestions');

    if (searchInput && suggestionsBox) {
        let debounceTimer;
        let jobsCache = null;

        function showSuggestions(results) {
            if (!results.length) {
                suggestionsBox.classList.remove('active');
                return;
            }
            suggestionsBox.innerHTML = results.map(function (job) {
                return '<a href="' + jobUrl(job.id) + '" class="suggestion-item">' +
                    '<strong>' + job.title + '</strong>' +
                    '<span>' + job.company + ' · ' + job.location + '</span>' +
                    '</a>';
            }).join('');
            suggestionsBox.classList.add('active');
        }

        function localSearch(query) {
            const q = query.toLowerCase();
            return (jobsCache || []).filter(function (job) {
                return (job.title + ' ' + job.company + ' ' + (job.skills || '')).toLowerCase().indexOf(q) !== -1;
            }).slice(0, 8);
        }

        searchInput.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            const query = this.value.trim();
            if (query.length < 2) {
                suggestionsBox.classList.remove('active');
                suggestionsBox.innerHTML = '';
                return;
            }
            debounceTimer = setTimeout(function () {
                fetch(siteBase() + '/api/search/?q=' + encodeURIComponent(query))
                    .then(function (res) {
                        if (!res.ok) throw new Error('api missing');
                        return res.json();
                    })
                    .then(function (data) {
                        showSuggestions(data.results || []);
                    })
                    .catch(function () {
                        const apply = function () { showSuggestions(localSearch(query)); };
                        if (jobsCache) {
                            apply();
                            return;
                        }
                        fetch(siteBase() + '/jobs.json')
                            .then(function (res) { return res.json(); })
                            .then(function (data) {
                                jobsCache = data.results || [];
                                apply();
                            })
                            .catch(function () {
                                suggestionsBox.classList.remove('active');
                            });
                    });
            }, 300);
        });

        document.addEventListener('click', function (e) {
            if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
                suggestionsBox.classList.remove('active');
            }
        });
    }

    const filterForm = document.getElementById('filters-form');
    if (filterForm) {
        const staticExport = filterForm.getAttribute('data-static-export') === 'true';
        const items = document.querySelectorAll('.job-list-item');
        const countEl = document.getElementById('result-count');
        const empty = document.getElementById('empty-state');
        const list = document.getElementById('jobs-list');

        function applyFilters() {
            if (!items.length) return;
            const q = (filterForm.q.value || '').trim().toLowerCase();
            const stream = filterForm.stream.value;
            const level = filterForm.level.value;
            const location = (filterForm.location.value || '').trim().toLowerCase();
            const remote = filterForm.remote && filterForm.remote.checked;
            let visible = 0;
            items.forEach(function (item) {
                const haystack = [
                    item.getAttribute('data-title'),
                    item.getAttribute('data-company'),
                    item.getAttribute('data-skills')
                ].join(' ');
                const matchQ = !q || haystack.indexOf(q) !== -1;
                const matchStream = !stream || item.getAttribute('data-stream') === stream;
                const matchLevel = !level || item.getAttribute('data-level') === level;
                const matchLocation = !location || (item.getAttribute('data-location') || '').indexOf(location) !== -1;
                const matchRemote = !remote || item.getAttribute('data-remote') === 'true';
                const show = matchQ && matchStream && matchLevel && matchLocation && matchRemote;
                item.hidden = !show;
                if (show) visible += 1;
            });
            if (countEl) {
                countEl.textContent = visible + ' position' + (visible === 1 ? '' : 's') + ' found';
            }
            if (empty) empty.hidden = visible !== 0;
            if (list) list.hidden = visible === 0;
        }

        if (staticExport) {
            const params = new URLSearchParams(window.location.search);
            ['q', 'stream', 'level', 'location'].forEach(function (key) {
                if (params.get(key) && filterForm[key]) filterForm[key].value = params.get(key);
            });
            if (params.get('remote') === 'true' && filterForm.remote) filterForm.remote.checked = true;
            applyFilters();
            filterForm.addEventListener('submit', function (event) {
                event.preventDefault();
                applyFilters();
            });
            filterForm.querySelectorAll('select').forEach(function (select) {
                select.addEventListener('change', applyFilters);
            });
        } else {
            filterForm.querySelectorAll('select').forEach(function (select) {
                select.addEventListener('change', function () {
                    filterForm.submit();
                });
            });
        }
    }
});
