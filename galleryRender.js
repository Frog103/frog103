const ITEMS_PER_PAGE = 15;
        let currentPage = 1;
        let filteredItems = [];
        let allItems = [];
        let searchText = '';

        function updatePagination(totalItems) {
            const paginationDiv = document.getElementById('pagination');
            const pageCount = Math.ceil(totalItems / ITEMS_PER_PAGE);
            paginationDiv.innerHTML = '';

            for (let i = 1; i <= pageCount; i++) {
                const button = document.createElement('button');
                button.textContent = i;
                button.classList.toggle('active', i === currentPage);
                button.onclick = () => {
                    currentPage = i;
                    displayItems(filteredItems, currentPage);
                };
                paginationDiv.appendChild(button);
            }
        }

        function setupFilters(items) {
            const tagFilter = document.getElementById('tagFilter');
            tagFilter.innerHTML = '<option value="">All Tags</option>';
            
            const tags = [...new Set(items.flatMap(item => item.tags))];
            tags.sort().forEach(tag => {
                const option = document.createElement('option');
                option.value = tag;
                option.textContent = tag;
                tagFilter.appendChild(option);
            });
        }

        function displayItems(items, page) {
            const container = document.getElementById('gallery-container');
            container.innerHTML = '';
            
            if (items.length === 0) {
                container.innerHTML = '<p style="text-align: center; width: 100%;">No items found matching your criteria.</p>';
                return;
            }

            const start = (page - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            const paginatedItems = items.slice(start, end);

            const fragment = document.createDocumentFragment();
            paginatedItems.forEach(item => {
                const div = document.createElement('div');
                div.className = 'gallery-picture';
                
                const dateStr = item.date.split('T')[0]; // This handles both "YYYY-MM-DD" and "YYYY-MM-DDT00:00:00" formats
                
                div.innerHTML = `
                    <a href="OAGpost.html?id=${item.id}">
                        <img src="${item.thumbnail || item.image}" alt="${item.title}" loading="lazy">
                    </a>
                    <div class="item-info">
                        <p>${item.title}</p>
                        <p class="date">${formatDate(dateStr)}</p>
                    </div>
                `;
                fragment.appendChild(div);
            });
            
            container.appendChild(fragment);
            updatePagination(items.length);
        }

        
        function formatDate(dateStr) {
            const [year, month, day] = dateStr.split('-');
            return new Date(year, month - 1, day).toLocaleDateString();
        }

        function sortByDate(items, direction) {
            return [...items].sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return direction === 'asc' ? dateA - dateB : dateB - dateA;
            });
        }

        function filterItems() {
            const tagFilter = document.getElementById('tagFilter').value;
            const sortDirection = document.getElementById('dateSort').value;

            filteredItems = allItems.filter(item => {
                const tagMatch = !tagFilter || (item.tags && item.tags.includes(tagFilter));
                const searchMatch = !searchText || item.title.toLowerCase().includes(searchText.toLowerCase());
                return tagMatch && searchMatch;
            });

            filteredItems = sortByDate(filteredItems, sortDirection);

            currentPage = 1;
            displayItems(filteredItems, currentPage);
        }

        function resetFilters() {
            document.getElementById('tagFilter').value = '';
            document.getElementById('dateSort').value = 'desc';
            document.getElementById('searchInput').value = '';
            searchText = '';
            filteredItems = sortByDate(allItems, 'desc');
            currentPage = 1;
            displayItems(filteredItems, currentPage);
        }

        async function initializeGallery() {
            try {
                const response = await fetch('otherArtGallery.json');
                if (!response.ok) throw new Error('Network response was not ok');
                
                const data = await response.json();
                allItems = data.items;
                
                filteredItems = sortByDate(allItems, 'desc');
                
                setupFilters(allItems);
                displayItems(filteredItems, currentPage);


                document.getElementById('tagFilter').addEventListener('change', filterItems);
                document.getElementById('dateSort').addEventListener('change', filterItems);
                document.getElementById('searchInput').addEventListener('input', (e) => {
                    searchText = e.target.value;
                    filterItems();
                });
            } catch (error) {
                console.error('Error loading gallery:', error);
                document.getElementById('gallery-container').innerHTML = 
                    '<p style="text-align: center; color: red;">Error loading gallery. Please try again later.</p>';
            }
        }

        
        window.addEventListener('DOMContentLoaded', initializeGallery);

        document.addEventListener('contextmenu', (event) => {
            if (event.target.tagName === 'IMG') {
                event.preventDefault();
            }
        });
