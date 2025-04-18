document.addEventListener('DOMContentLoaded', () => {

    // --- Card Fade-in Animation ---
    const cards = document.querySelectorAll('.item-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, 100 + (index * 50)); // Stagger animation
    });

    // --- Cart Functionality ---
    const cart = {
        items: JSON.parse(localStorage.getItem('cart-items') || '[]'),
        total: 0
    };
    const cartIcon = document.querySelector('.header-cart');
    const cartDropdown = document.querySelector('.cart-dropdown');
    const cartCount = document.querySelector('.cart-count');
    const cartItemsEl = document.querySelector('.cart-items'); // Renamed variable
    const cartTotalEl = document.querySelector('.cart-total .amount'); // Renamed variable
    const clearCartButton = document.querySelector('.cart-buttons .clear');

    // Toggle cart dropdown
    if (cartIcon && cartDropdown) {
        cartIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            cartDropdown.classList.toggle('active');
        });
    }

    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        if (cartDropdown && cartIcon && !cartDropdown.contains(e.target) && !cartIcon.contains(e.target)) {
            cartDropdown.classList.remove('active');
        }
    });

    // Handle "Add to Cart" buttons (ensure this runs *after* potential dynamic content)
    // We might need event delegation if parts lists are loaded dynamically
    document.body.addEventListener('click', function(event) {
        if (event.target.matches('.parts-list button:not([disabled])')) {
            const button = event.target;
            const row = button.closest('tr');
            if (!row) return; // Safety check

            const nameEl = row.querySelector('[data-label="Part Name"]');
            const priceEl = row.querySelector('[data-label="Price"]');
            const partNumberEl = row.querySelector('[data-label="Part Number"]');

            if (nameEl && priceEl && partNumberEl) {
                 const item = {
                    name: nameEl.textContent,
                    price: parseFloat(priceEl.textContent.replace('$', '')) || 0, // Add fallback
                    partNumber: partNumberEl.textContent
                };
                addToCart(item);
                if (cartDropdown) cartDropdown.classList.add('active'); // Show cart
            } else {
                console.error("Could not find part details in row:", row);
            }
        }
    });


    function addToCart(item) {
        const existingItem = cart.items.find(i => i.partNumber === item.partNumber);
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.items.push({...item, quantity: 1});
        }
        updateCartUI(); // Renamed for clarity
        saveCart();
    }

    function updateCartUI() {
        if (!cartCount || !cartItemsEl || !cartTotalEl) return; // Ensure elements exist

        // Update count
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;

        // Update items list
        cartItemsEl.innerHTML = cart.items.length ? cart.items.map(item => `
            <div class="cart-item">
                <div>
                    <div>${item.name}</div>
                    <small>${item.partNumber} × ${item.quantity}</small>
                </div>
                <div>$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('') : '<div class="empty-cart">Your cart is empty</div>';

        // Update total
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalEl.textContent = `$${cart.total.toFixed(2)}`;
    }

    function saveCart() {
        localStorage.setItem('cart-items', JSON.stringify(cart.items));
    }

    // Handle clear cart
    if (clearCartButton) {
        clearCartButton.addEventListener('click', function() {
            cart.items = [];
            updateCartUI();
            saveCart();
        });
    }

    // Initial cart update
    updateCartUI();


    // --- Search Functionality ---
    const searchInput = document.querySelector('.header-search input[type="search"]');
    const searchButton = document.querySelector('.header-search button');
    const searchContainer = document.querySelector('.header-search'); // Get the container
    let searchAbortController = null; // To cancel previous fetch requests

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Debounced search function call
    const debouncedPerformSearch = debounce(performSearch, 300); // 300ms delay

    if (searchInput && searchButton && searchContainer) {
        // Search on input (live search)
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            if (searchTerm.length >= 2) {
                debouncedPerformSearch();
            } else {
                clearResults(); // Clear if less than 2 chars or empty
            }
        });

        // Perform search when button is clicked
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch(); // Perform immediately
        });

        // Perform search when Enter key is pressed
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(); // Perform immediately
            }
        });

        // Clear search results when clicking outside *the search container*
        document.addEventListener('click', function(e) {
            if (!searchContainer.contains(e.target)) {
                clearResults();
            }
        });

        // Prevent closing results when clicking inside input or results
        searchContainer.addEventListener('click', function(e) {
             e.stopPropagation();
        });

    } else {
         console.error("Search input, button, or container not found!");
    }


    function performSearch() {
        const searchTerm = searchInput.value.trim();

        // Clear previous results immediately for responsiveness
        clearResults();

        if (searchTerm.length < 2) {
            return; // Don't search if term is too short
        }

        // Abort any ongoing fetch request
        if (searchAbortController) {
            searchAbortController.abort();
        }
        searchAbortController = new AbortController();
        const signal = searchAbortController.signal;

        // Indicate loading (optional)
        displayLoading();

        fetch('search_data.json', { signal }) // Pass the signal to fetch
            .then(response => {
                if (!response.ok) {
                    if (response.status === 0) { // fetch aborted
                         throw new Error('Search aborted');
                    }
                    throw new Error(`Network response was not ok (${response.status})`);
                }
                return response.json();
            })
            .then(data => {
                searchAbortController = null; // Clear controller once fetch succeeds
                const results = searchItems(data, searchTerm);
                displayResults(results);
            })
            .catch(error => {
                searchAbortController = null; // Clear controller on error too
                if (error.name === 'AbortError') {
                     console.log('Search fetch aborted'); // Expected when typing quickly
                     // Don't display an error message for aborted searches
                } else {
                     console.error('Search Error:', error);
                     displayError();
                }
            });
    }

    function searchItems(data, term) {
        term = term.toLowerCase();
        const results = {
            models: [],
            parts: []
        };

        if (!data || !data.models || !data.parts) {
            console.error("Invalid search data format");
            return results; // Return empty results if data is bad
        }

        // Search models
        data.models.forEach(model => {
            // Ensure properties exist before accessing
            const brand = model.brand || '';
            const id = model.id || '';
            const name = model.name || '';
            const url = model.url || '#'; // Default URL if missing

            const searchableText = `${brand} ${id} ${name}`.toLowerCase();
            if (searchableText.includes(term)) {
                results.models.push({
                    matchType: 'model',
                    displayName: `${brand} ${id} - ${name}`,
                    url: url
                });
            }
        });

        // Search parts
        data.parts.forEach(part => {
            // Ensure properties exist
            const number = part.number || '';
            const name = part.name || '';
            const modelId = part.modelId || '';

            const searchableText = `${number} ${name}`.toLowerCase();
            if (searchableText.includes(term)) {
                const model = data.models.find(m => m.id === modelId);
                if (model) {
                    const modelBrand = model.brand || '';
                    const modelIdStr = model.id || ''; // Renamed to avoid conflict
                    const modelUrl = model.url || '#';
                    results.parts.push({
                        matchType: 'part',
                        displayName: `${name} (${number}) - For ${modelBrand} ${modelIdStr}`,
                        url: modelUrl // Link to the model page for the part
                    });
                } else {
                     // Optional: Handle parts with missing models if needed
                     results.parts.push({
                         matchType: 'part',
                         displayName: `${name} (${number}) - Model info unavailable`,
                         url: '#' // No specific page to link to
                     });
                }
            }
        });

        return results;
    }

    function displayLoading() {
        clearResults(); // Clear previous results first
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'search-results'; // Use the same class
        resultsDiv.innerHTML = '<div class="search-loading">Searching...</div>'; // Style this class if needed
        searchContainer.appendChild(resultsDiv);
    }


    function displayResults(results) {
        clearResults(); // Clear loading indicator or previous results

        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'search-results';

        const allResults = [...results.models, ...results.parts].sort((a, b) =>
            a.displayName.localeCompare(b.displayName)
        );

        if (allResults.length > 0) {
            const resultsList = document.createElement('div');
            resultsList.className = 'search-results-list';

            allResults.forEach(result => {
                const resultItem = document.createElement('a'); // Use <a> for direct navigation
                resultItem.href = result.url;
                resultItem.className = 'search-result-item';

                const icon = document.createElement('span');
                // Use ::before pseudo-elements for icons as defined in CSS
                icon.className = `result-icon ${result.matchType}-icon`;

                const content = document.createElement('span');
                content.className = 'result-content';
                content.textContent = result.displayName;

                resultItem.appendChild(icon);
                resultItem.appendChild(content);
                resultsList.appendChild(resultItem);
            });

            resultsDiv.appendChild(resultsList);
        } else {
            // Only show "No matches" if the search input is not empty
            if (searchInput.value.trim().length > 0) {
                resultsDiv.innerHTML = '<div class="no-results">No matches found</div>';
            } else {
                 // Don't show anything if the input is empty
                 return;
            }
        }

        searchContainer.appendChild(resultsDiv);
    }

    function clearResults() {
        const existing = searchContainer.querySelector('.search-results');
        if (existing) {
            existing.remove();
        }
    }

    function displayError() {
        clearResults();
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'search-results';
        resultsDiv.innerHTML = '<div class="search-error">Error loading search results</div>';
        searchContainer.appendChild(resultsDiv);
    }

}); // End of DOMContentLoaded listener