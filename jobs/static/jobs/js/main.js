document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('hero-search-input');
    const suggestionsBox = document.getElementById('search-suggestions');

    if (searchInput && suggestionsBox) {
        let debounceTimer;

        searchInput.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            const query = this.value.trim();

            if (query.length < 2) {
                suggestionsBox.classList.remove('active');
                suggestionsBox.innerHTML = '';
                return;
            }

            debounceTimer = setTimeout(function () {
                fetch('/api/search/?q=' + encodeURIComponent(query))
                    .then(function (res) { return res.json(); })
                    .then(function (data) {
                        if (data.results.length === 0) {
                            suggestionsBox.classList.remove('active');
                            return;
                        }

                        suggestionsBox.innerHTML = data.results.map(function (job) {
                            return '<a href="/jobs/' + job.id + '/" class="suggestion-item">' +
                                '<strong>' + job.title + '</strong>' +
                                '<span>' + job.company + ' · ' + job.location + '</span>' +
                                '</a>';
                        }).join('');
                        suggestionsBox.classList.add('active');
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
        const selects = filterForm.querySelectorAll('select');
        selects.forEach(function (select) {
            select.addEventListener('change', function () {
                filterForm.submit();
            });
        });
    }
});
