        // Check if user is logged in as organizer
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (!currentUser || currentUser.type !== 'organizer') {
            alert('Please login as an organizer to access this page');
            window.location.href = 'login.html';
        }

        document.getElementById('welcomeMessage').textContent = `Welcome back, ${currentUser.name}!`;

        // Logout handler
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });

        // Create event handler
        document.getElementById('createEventForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const events = JSON.parse(localStorage.getItem('events') || '[]');
            
            const newEvent = {
                id: 'E' + Date.now(),
                name: document.getElementById('eventName').value,
                date: document.getElementById('eventDate').value,
                location: document.getElementById('eventLocation').value,
                category: document.getElementById('eventCategory').value,
                price: parseFloat(document.getElementById('eventPrice').value),
                totalTickets: parseInt(document.getElementById('eventTickets').value),
                availableTickets: parseInt(document.getElementById('eventTickets').value),
                description: document.getElementById('eventDescription').value,
                organizerId: currentUser.id,
                organizerName: currentUser.name,
                createdAt: new Date().toISOString()
            };

            events.push(newEvent);
            localStorage.setItem('events', JSON.stringify(events));
            
            alert('Event created successfully!');
            document.getElementById('createEventForm').reset();
            loadMyEvents();
        });

        // Load organizer's events
        function loadMyEvents() {
            const events = JSON.parse(localStorage.getItem('events') || '[]');
            const myEvents = events.filter(e => e.organizerId === currentUser.id);
            const container = document.getElementById('myEventsList');

            if (myEvents.length === 0) {
                container.innerHTML = '<p class="empty-state">No events created yet. Create your first event above!</p>';
                return;
            }

            container.innerHTML = myEvents.map(event => `
                <div class="event-item">
                    <div class="event-item-header">
                        <h3>${event.name}</h3>
                        <span class="event-badge">${event.category}</span>
                    </div>
                    <div class="event-item-details">
                        <p>📅 ${new Date(event.date).toLocaleString()}</p>
                        <p>📍 ${event.location}</p>
                        <p>💰 $${event.price.toFixed(2)}</p>
                        <p>🎟️ ${event.availableTickets} / ${event.totalTickets} tickets available</p>
                    </div>
                    <button class="btn btn-small btn-secondary" onclick="deleteEvent('${event.id}')">Delete Event</button>
                </div>
            `).join('');
        }

        function deleteEvent(eventId) {
            if (confirm('Are you sure you want to delete this event?')) {
                let events = JSON.parse(localStorage.getItem('events') || '[]');
                events = events.filter(e => e.id !== eventId);
                localStorage.setItem('events', JSON.stringify(events));
                loadMyEvents();
            }
        }

        loadMyEvents();
