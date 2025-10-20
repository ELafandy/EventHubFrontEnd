        // Tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.auth-form-container').forEach(f => f.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(tabName + 'Form').classList.add('active');
            });
        });

        // Login handler
        document.getElementById('loginFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const userType = document.getElementById('loginUserType').value;

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password && u.type === userType);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert('Login successful!');
                if (userType === 'organizer') {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'events.html';
                }
            } else {
                alert('Invalid credentials. Please try again.');
            }
        });

        // Register handler
        document.getElementById('registerFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const userType = document.getElementById('registerUserType').value;

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            if (users.find(u => u.email === email)) {
                alert('Email already registered!');
                return;
            }

            const newUser = {
                id: 'U' + Date.now(),
                name,
                email,
                password,
                type: userType
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            alert('Registration successful!');
            if (userType === 'organizer') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'events.html';
            }
        });
