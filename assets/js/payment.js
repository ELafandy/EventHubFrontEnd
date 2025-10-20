        let purchaseData = null;

        // Load purchase data from localStorage
        function loadPurchaseData() {
            const data = localStorage.getItem('pendingPurchase');
            if (!data) {
                alert('No purchase data found. Redirecting to events page...');
                window.location.href = 'events.html';
                return;
            }

            purchaseData = JSON.parse(data);
            displayOrderSummary();
        }

        // Display order summary
        function displayOrderSummary() {
            const total = purchaseData.quantity * purchaseData.event.price;
            
            document.getElementById('orderSummary').innerHTML = `
                <div class="order-item">
                    <h3>${purchaseData.event.name}</h3>
                    <div class="order-item-details">
                        <p><strong>Date:</strong> ${new Date(purchaseData.event.date).toLocaleString()}</p>
                        <p><strong>Location:</strong> ${purchaseData.event.location}</p>
                        <p><strong>Ticket Holder:</strong> ${purchaseData.buyerName}</p>
                        <p><strong>Email:</strong> ${purchaseData.buyerEmail}</p>
                    </div>
                </div>
                <div class="order-breakdown">
                    <div class="order-line">
                        <span>Ticket Price:</span>
                        <span>$${purchaseData.event.price.toFixed(2)}</span>
                    </div>
                    <div class="order-line">
                        <span>Quantity:</span>
                        <span>×${purchaseData.quantity}</span>
                    </div>
                    <div class="order-line">
                        <span>Service Fee:</span>
                        <span>$${(total * 0.05).toFixed(2)}</span>
                    </div>
                    <div class="order-line order-total">
                        <span><strong>Total:</strong></span>
                        <span><strong>$${(total * 1.05).toFixed(2)}</strong></span>
                    </div>
                </div>
            `;

            document.getElementById('totalAmount').textContent = `$${(total * 1.05).toFixed(2)}`;
        }

        // Format card number with spaces
        document.getElementById('cardNumber').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;

            // Detect card type (simple Visa detection)
            if (value.startsWith('4')) {
                document.getElementById('cardTypeIndicator').innerHTML = '<span class="card-type-visa">VISA</span>';
            } else {
                document.getElementById('cardTypeIndicator').innerHTML = '';
            }
        });

        // Format expiry date
        document.getElementById('expiryDate').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });

        // Only allow numbers for CVV
        document.getElementById('cvv').addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });

        // Handle payment form submission
        document.getElementById('paymentForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validate card number (simple validation)
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
            if (cardNumber.length < 13 || cardNumber.length > 19) {
                alert('Please enter a valid card number');
                return;
            }

            // Validate expiry date
            const expiry = document.getElementById('expiryDate').value;
            const [month, year] = expiry.split('/');
            const currentDate = new Date();
            const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
            
            if (expiryDate < currentDate) {
                alert('Card has expired');
                return;
            }

            // Validate CVV
            const cvv = document.getElementById('cvv').value;
            if (cvv.length < 3) {
                alert('Please enter a valid CVV');
                return;
            }

            // Show processing modal
            document.getElementById('processingModal').style.display = 'flex';

            // Simulate payment processing
            setTimeout(() => {
                processPayment();
            }, 2000);
        });

        // Process payment and create tickets
        function processPayment() {
            // Update event tickets
            let events = JSON.parse(localStorage.getItem('events') || '[]');
            const eventIndex = events.findIndex(e => e.id === purchaseData.event.id);
            events[eventIndex].availableTickets -= purchaseData.quantity;
            localStorage.setItem('events', JSON.stringify(events));

            // Create tickets
            const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
            const ticketIds = [];

            for (let i = 0; i < purchaseData.quantity; i++) {
                const ticket = {
                    ticketId: 'T' + Date.now() + i,
                    eventId: purchaseData.event.id,
                    eventName: purchaseData.event.name,
                    eventDate: purchaseData.event.date,
                    eventLocation: purchaseData.event.location,
                    holderName: purchaseData.buyerName,
                    holderEmail: purchaseData.buyerEmail,
                    price: purchaseData.event.price,
                    purchaseDate: new Date().toISOString(),
                    used: false,
                    paymentMethod: 'Visa ending in ' + document.getElementById('cardNumber').value.slice(-4)
                };
                tickets.push(ticket);
                ticketIds.push(ticket.ticketId);
            }

            localStorage.setItem('tickets', JSON.stringify(tickets));
            localStorage.setItem('lastPurchasedTickets', JSON.stringify(ticketIds));
            localStorage.removeItem('pendingPurchase');

            // Hide processing modal and redirect
            document.getElementById('processingModal').style.display = 'none';
            alert('Payment successful! Redirecting to your tickets...');
            window.location.href = 'ticket.html';
        }

        // Load data on page load
        loadPurchaseData();
