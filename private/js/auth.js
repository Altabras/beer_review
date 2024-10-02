export const initAuth = () => {
    const loginForm = document.getElementById('loginForm');
    const adminPanel = document.getElementById('adminPanel');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const loginMessage = document.getElementById('loginMessage');
    
    const token = localStorage.getItem('adminToken');
    

    if (token) {
        verifyToken(token).then(isValid => {
            if (isValid) {
                showAdminPanel();
                fetchItems(); // Завантаження паби і пиво, коли адмін панель показана
            } else {
                localStorage.removeItem('adminToken');
                showLoginForm();
            }
        });
    } else {
        showLoginForm();
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('/api/auth/admin-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('adminToken', data.token);
            loginMessage.textContent = 'Login successful!';
            loginMessage.style.color = 'green';
            showAdminPanel();
            fetchItems();
        } catch (error) {
            loginMessage.textContent = 'Invalid username or password';
            loginMessage.style.color = 'red';
        }
    });

    function showAdminPanel() {
        adminPanel.style.display = 'block';
        loginFormContainer.style.display = 'none';
    }

    function showLoginForm() {
        loginFormContainer.style.display = 'block';
        adminPanel.style.display = 'none';
    }

    async function verifyToken(token) {
        try {
            const response = await fetch('/api/auth/verify-token', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.ok;
        } catch {
            return false;
        }
    }
};
