        let currentUser = null;
        let allUserTickets = [];
        let currentFilter = 'all';

        function checkAuth() {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (!user) {
                window.location.href = 'login.html';
                return null;
            }
            return user;
        }

        function loadUserProfile() {
            currentUser = checkAuth();
            if (!currentUser) return;

            // Display user info
            document.getElementById('userName').textContent = currentUser.name || currentUser.email;
            document.getElementById('userEmail').textContent = currentUser.email;
            document.getElementById('userType').textContent = currentUser.type === 'organizer' ? 'Event Organizer' : 'Customer';
            
            if (currentUser.profilePhoto) {
                document.getElementById('userProfilePhoto').src = currentUser.profilePhoto;
                document.getElementById('userProfilePhoto').style.display = 'block';
                document.getElementById('userInitials').style.display = 'none';
            }
            
            // Set initials
            const initials = (currentUser.name || currentUser.email)
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);
            document.getElementById('userInitials').textContent = initials;

            // Load user's tickets
            loadUserTickets();
        }

        function loadUserTickets() {
            const allTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
            
            // Filter tickets for current user
            allUserTickets = allTickets.filter(ticket => 
                ticket.holderEmail === currentUser.email
            );

            // Update ticket count
            document.getElementById('ticketCount').textContent = 
                `${allUserTickets.length} ticket${allUserTickets.length !== 1 ? 's' : ''}`;

            // Display tickets
            displayTickets(currentFilter);
        }

        function displayTickets(filter) {
            const container = document.getElementById('ticketsGrid');
            const now = new Date();

            let filteredTickets = allUserTickets;

            if (filter === 'upcoming') {
                filteredTickets = allUserTickets.filter(t => new Date(t.eventDate) >= now);
            } else if (filter === 'past') {
                filteredTickets = allUserTickets.filter(t => new Date(t.eventDate) < now);
            }

            if (filteredTickets.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">🎫</div>
                        <h3>No tickets found</h3>
                        <p>${filter === 'all' ? 'You haven\'t purchased any tickets yet.' : `No ${filter} tickets.`}</p>
                        <a href="events.html" class="btn btn-primary">Browse Events</a>
                    </div>
                `;
                return;
            }

            container.innerHTML = filteredTickets.map((ticket, index) => {
                const eventDate = new Date(ticket.eventDate);
                const isPast = eventDate < now;
                const isUsed = ticket.used || false;

                return `
                    <div class="ticket-card slide-up" style="animation-delay: ${index * 0.1}s">
                        <div class="ticket-status-badge ${isPast ? 'past' : 'upcoming'}">
                            ${isPast ? 'Past Event' : 'Upcoming'}
                        </div>
                        <div class="ticket-card-header">
                            <h3>${ticket.eventName}</h3>
                            <span class="ticket-id">#${ticket.ticketId}</span>
                        </div>
                        <div class="ticket-card-body">
                            <div class="ticket-details-grid">
                                <div class="detail-item">
                                    <span class="detail-label">Date</span>
                                    <span class="detail-value">${eventDate.toLocaleDateString()}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Time</span>
                                    <span class="detail-value">${eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Location</span>
                                    <span class="detail-value">${ticket.eventLocation}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Price</span>
                                    <span class="detail-value">$${ticket.price.toFixed(2)}</span>
                                </div>
                            </div>
                            <div class="ticket-qr-container">
                                <div id="qr-${ticket.ticketId}" class="qr-code-small"></div>
                                <p class="qr-status ${isUsed ? 'used' : 'valid'}">
                                    ${isUsed ? '✓ Used' : '✓ Valid'}
                                </p>
                            </div>
                        </div>
                        <div class="ticket-card-footer">
                            <button class="btn-link" onclick="viewTicketDetails('${ticket.ticketId}')">View Details</button>
                            ${!isPast ? '<button class="btn-link" onclick="downloadTicket(\'' + ticket.ticketId + '\')">Download</button>' : ''}
                        </div>
                    </div>
                `;
            }).join('');

            // Generate QR codes
            setTimeout(() => {
                filteredTickets.forEach(ticket => {
                    const qrElement = document.getElementById(`qr-${ticket.ticketId}`);
                    if (qrElement && qrElement.innerHTML === '') {
                        const qrData = JSON.stringify({
                            ticketId: ticket.ticketId,
                            eventId: ticket.eventId,
                            holderName: ticket.holderName,
                            price: ticket.price,
                            eventName: ticket.eventName,
                            eventDate: ticket.eventDate
                        });

                        new QRCode(qrElement, {
                            text: qrData,
                            width: 120,
                            height: 120,
                            colorDark: getComputedStyle(document.documentElement)
                                .getPropertyValue('--text-primary').trim() || '#000000',
                            colorLight: getComputedStyle(document.documentElement)
                                .getPropertyValue('--bg-primary').trim() || '#ffffff',
                        });
                    }
                });
            }, 100);
        }

        function viewTicketDetails(ticketId) {
            localStorage.setItem('lastPurchasedTickets', JSON.stringify([ticketId]));
            window.location.href = 'ticket.html';
        }

        function downloadTicket(ticketId) {
            alert('Download functionality: This would generate a PDF of your ticket.');
        }

        function openEditProfileModal() {
            document.getElementById('editName').value = currentUser.name || '';
            document.getElementById('editEmail').value = currentUser.email || '';
            document.getElementById('editProfileModal').style.display = 'flex';
        }

        function closeEditProfileModal() {
            document.getElementById('editProfileModal').style.display = 'none';
        }

        function saveProfileChanges(e) {
            e.preventDefault();
            
            const newName = document.getElementById('editName').value;
            const newEmail = document.getElementById('editEmail').value;
            const photoInput = document.getElementById('profilePhotoInput');

            // Update user data
            currentUser.name = newName;
            currentUser.email = newEmail;

            // Handle photo upload
            if (photoInput.files && photoInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    currentUser.profilePhoto = event.target.result;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    loadUserProfile();
                    closeEditProfileModal();
                    alert('Profile updated successfully!');
                };
                reader.readAsDataURL(photoInput.files[0]);
            } else {
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                loadUserProfile();
                closeEditProfileModal();
                alert('Profile updated successfully!');
            }
        }

        // Filter functionality
        document.addEventListener('DOMContentLoaded', () => {
            loadUserProfile();

            document.getElementById('editProfileBtn').addEventListener('click', openEditProfileModal);
            document.getElementById('closeEditModal').addEventListener('click', closeEditProfileModal);
            document.getElementById('cancelEditBtn').addEventListener('click', closeEditProfileModal);
            document.getElementById('editProfileForm').addEventListener('submit', saveProfileChanges);

            // Close modal when clicking outside
            window.addEventListener('click', (e) => {
                const modal = document.getElementById('editProfileModal');
                if (e.target === modal) {
                    closeEditProfileModal();
                }
            });

            // Filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    currentFilter = e.target.dataset.filter;
                    displayTickets(currentFilter);
                });
            });

            // Logout
            document.getElementById('logoutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Are you sure you want to logout?')) {
                    localStorage.removeItem('currentUser');
                    window.location.href = 'login.html';
                }
            });
        });
