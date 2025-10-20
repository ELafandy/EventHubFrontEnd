        let selectedEvent = null;

        // Load and display events
        function loadEvents() {
            const events = JSON.parse(localStorage.getItem('events') || '[]');
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const categoryFilter = document.getElementById('categoryFilter').value;
            const priceFilter = document.getElementById('priceFilter').value;

            let filteredEvents = events.filter(event => {
                const matchesSearch = event.name.toLowerCase().includes(searchTerm) || 
                                    event.location.toLowerCase().includes(searchTerm) ||
                                    event.description.toLowerCase().includes(searchTerm);
                
                const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
                
                let matchesPrice = true;
                if (priceFilter === 'free') matchesPrice = event.price === 0;
                else if (priceFilter === '0-50') matchesPrice = event.price >= 0 && event.price <= 50;
                else if (priceFilter === '50-100') matchesPrice = event.price > 50 && event.price <= 100;
                else if (priceFilter === '100+') matchesPrice = event.price > 100;

                return matchesSearch && matchesCategory && matchesPrice && event.availableTickets > 0;
            });

            const container = document.getElementById('eventsGrid');

            if (filteredEvents.length === 0) {
                container.innerHTML = '<p class="empty-state">No events found. Try adjusting your filters.</p>';
                return;
            }

            container.innerHTML = filteredEvents.map(event => `
                <div class="event-card slide-up">
                    <div class="event-card-header">
                        <span class="event-category-badge">${event.category}</span>
                        <span class="event-price">$${event.price.toFixed(2)}</span>
                    </div>
                    <h3 class="event-card-title">${event.name}</h3>
                    <div class="event-card-details">
                        <p>📅 ${new Date(event.date).toLocaleDateString()} at ${new Date(event.date).toLocaleTimeString()}</p>
                        <p>📍 ${event.location}</p>
                        <p>👤 ${event.organizerName}</p>
                        <p>🎟️ ${event.availableTickets} tickets left</p>
                    </div>
                    <p class="event-card-description">${event.description}</p>
                    <button class="btn btn-primary btn-full" onclick="openPurchaseModal('${event.id}')">Buy Ticket</button>
                </div>
            `).join('');
        }

        // Search and filter handlers
        document.getElementById('searchInput').addEventListener('input', loadEvents);
        document.getElementById('categoryFilter').addEventListener('change', loadEvents);
        document.getElementById('priceFilter').addEventListener('change', loadEvents);

        // Modal handlers
        function openPurchaseModal(eventId) {
            const events = JSON.parse(localStorage.getItem('events') || '[]');
            selectedEvent = events.find(e => e.id === eventId);
            
            if (!selectedEvent) return;

            document.getElementById('modalEventDetails').innerHTML = `
                <div class="modal-event-info">
                    <h3>${selectedEvent.name}</h3>
                    <p>📅 ${new Date(selectedEvent.date).toLocaleString()}</p>
                    <p>📍 ${selectedEvent.location}</p>
                    <p>💰 $${selectedEvent.price.toFixed(2)} per ticket</p>
                </div>
            `;

            document.getElementById('ticketQuantity').max = selectedEvent.availableTickets;
            document.getElementById('purchaseModal').style.display = 'flex';
        }

        document.querySelector('.modal-close').addEventListener('click', () => {
            document.getElementById('purchaseModal').style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('purchaseModal')) {
                document.getElementById('purchaseModal').style.display = 'none';
            }
        });

        // Purchase handler
        document.getElementById('purchaseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const quantity = parseInt(document.getElementById('ticketQuantity').value);
            const buyerName = document.getElementById('buyerName').value;
            const buyerEmail = document.getElementById('buyerEmail').value;

            if (quantity > selectedEvent.availableTickets) {
                alert('Not enough tickets available!');
                return;
            }

            const purchaseData = {
                event: selectedEvent,
                quantity: quantity,
                buyerName: buyerName,
                buyerEmail: buyerEmail
            };

            localStorage.setItem('pendingPurchase', JSON.stringify(purchaseData));
            window.location.href = 'payment.html';
        });

        loadEvents();
