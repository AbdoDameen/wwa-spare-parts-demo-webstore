document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.header-search input[type="search"]');
    const searchButton = document.querySelector('.header-search button');
    const searchContainer = document.querySelector('.header-search');
    let searchData = null;
    let searchAbortController = null;

    // Load search data when page loads
    fetch('search_data.json')
        .then(response => response.json())
        .then(data => {
            searchData = data;
        })
        .catch(error => {
            console.error('Error loading search data:', error);
        });

    function performSearch(query) {
        if (!searchData) return [];
        query = query.toLowerCase().trim();
        
        const results = {
            models: searchData.models.filter(model => 
                `${model.brand} ${model.id} ${model.name}`.toLowerCase().includes(query)
            ),
            parts: searchData.parts.filter(part => 
                `${part.number} ${part.name}`.toLowerCase().includes(query)
            )
        };
        
        return results;
    }

    function displayResults(results) {
        let resultsContainer = document.querySelector('.search-results');
        if (!resultsContainer) {
            resultsContainer = document.createElement('div');
            resultsContainer.className = 'search-results';
            searchContainer.appendChild(resultsContainer);
        }
        
        resultsContainer.innerHTML = '';
        
        if (!results.models.length && !results.parts.length) {
            resultsContainer.innerHTML = '<div class="no-results">No results found</div>';
            return;
        }

        const resultsList = document.createElement('div');
        resultsList.className = 'search-results-list';

        // Add models
        results.models.forEach(model => {
            const item = document.createElement('a');
            item.href = model.url;
            item.className = 'search-result-item';
            item.innerHTML = `
                <span class="result-icon model-icon"></span>
                <span class="result-content">${model.brand} ${model.id} - ${model.name}</span>
            `;
            resultsList.appendChild(item);
        });

        // Add parts
        results.parts.forEach(part => {
            const model = searchData.models.find(m => m.id === part.modelId);
            if (model) {
                const item = document.createElement('a');
                item.href = model.url;
                item.className = 'search-result-item';
                item.innerHTML = `
                    <span class="result-icon part-icon"></span>
                    <span class="result-content">${part.name} (${part.number}) - For ${model.brand} ${model.id}</span>
                `;
                resultsList.appendChild(item);
            }
        });

        resultsContainer.appendChild(resultsList);
    }

    // Event listeners
    if (searchInput && searchButton) {
        let debounceTimeout;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimeout);
            const query = e.target.value;
            
            if (query.length < 2) {
                const resultsContainer = document.querySelector('.search-results');
                if (resultsContainer) resultsContainer.innerHTML = '';
                return;
            }

            debounceTimeout = setTimeout(() => {
                const results = performSearch(query);
                displayResults(results);
            }, 300);
        });

        searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            const results = performSearch(searchInput.value);
            displayResults(results);
        });

        // Close results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                const resultsContainer = document.querySelector('.search-results');
                if (resultsContainer) resultsContainer.innerHTML = '';
            }
        });
    }
});
