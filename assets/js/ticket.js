        function loadTickets() {
            const lastPurchasedTickets = JSON.parse(localStorage.getItem('lastPurchasedTickets') || '[]');
            const allTickets = JSON.parse(localStorage.getItem('tickets') || '[]');
            
            const tickets = allTickets.filter(t => lastPurchasedTickets.includes(t.ticketId));
            const container = document.getElementById('ticketsContainer');

            if (tickets.length === 0) {
                container.innerHTML = '<p class="empty-state">No tickets found. <a href="events.html">Browse events</a> to purchase tickets.</p>';
                return;
            }

            container.innerHTML = tickets.map((ticket, index) => `
                <div class="ticket-card fade-in" style="animation-delay: ${index * 0.1}s">
                    <div class="ticket-header">
                        <h2>${ticket.eventName}</h2>
                        <span class="ticket-status ${ticket.used ? 'used' : 'valid'}">${ticket.used ? 'Used' : 'Valid'}</span>
                    </div>
                    <div class="ticket-details">
                        <div class="ticket-info">
                            <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
                            <p><strong>Holder:</strong> ${ticket.holderName}</p>
                            <p><strong>Email:</strong> ${ticket.holderEmail}</p>
                            <p><strong>Date:</strong> ${new Date(ticket.eventDate).toLocaleString()}</p>
                            <p><strong>Location:</strong> ${ticket.eventLocation}</p>
                            <p><strong>Price:</strong> $${ticket.price.toFixed(2)}</p>
                            <p><strong>Purchased:</strong> ${new Date(ticket.purchaseDate).toLocaleString()}</p>
                        </div>
                        <div class="ticket-qr">
                            <div id="qr-${ticket.ticketId}" class="qr-code"></div>
                            <p class="qr-label">Scan at entrance</p>
                        </div>
                    </div>
                    <div class="ticket-footer">
                        <button class="btn btn-secondary btn-small" onclick="downloadTicket('${ticket.ticketId}')">Download</button>
                        <button class="btn btn-primary btn-small" onclick="printTicket('${ticket.ticketId}')">Print</button>
                    </div>
                </div>
            `).join('');

            // Generate QR codes
            tickets.forEach(ticket => {
                const qrData = JSON.stringify({
                    ticketId: ticket.ticketId,
                    eventId: ticket.eventId,
                    holderName: ticket.holderName,
                    price: ticket.price,
                    eventName: ticket.eventName,
                    eventDate: ticket.eventDate
                });

                new QRCode(document.getElementById(`qr-${ticket.ticketId}`), {
                    text: qrData,
                    width: 200,
                    height: 200,
                    colorDark: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#000000',
                    colorLight: getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim() || '#ffffff',
                });
            });
        }

        function downloadTicket(ticketId) {
            alert('Download functionality would save the ticket as PDF/Image');
        }

        function printTicket(ticketId) {
            window.print();
        }

        loadTickets();
