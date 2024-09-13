document.addEventListener('DOMContentLoaded', () => {
    const addPubForm = document.getElementById('addPubForm');
    const addBeerForm = document.getElementById('addBeerForm');
    const pubsList = document.getElementById('pubsList');
    const beersList = document.getElementById('beersList');
    const loginForm = document.getElementById('loginForm');
    const adminPanel = document.getElementById('adminPanel');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const loginMessage = document.getElementById('loginMessage');

    // Перевірка наявності токена в localStorage
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

    // Обробка форми входу
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
            fetchItems(); // Завантаження паби і пиво, коли адмін панель показана
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

    function getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    function adminLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
    
        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token); // Зберігаємо токен
                document.getElementById('loginForm').style.display = 'none'; // Приховуємо форму входу
                document.getElementById('adminPanel').style.display = 'block'; // Показуємо адмін панель
                fetchItems(); // Завантажуємо паби і пиво
            } else {
                alert('Неправильний логін або пароль');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    // Отримання і відображення пабів і пива
    const fetchItems = async () => {
        try {
            const [pubsResponse, beersResponse] = await Promise.all([
                fetch('/api/pubs', { headers: getAuthHeaders() }),
                fetch('/api/beers', { headers: getAuthHeaders() })
            ]);

            if (!pubsResponse.ok || !beersResponse.ok) {
                throw new Error('Network response was not ok');
            }

            const pubs = await pubsResponse.json();
            const beers = await beersResponse.json();

            pubsList.innerHTML = pubs.map(pub => `
                <li>
                    ${pub.name} - ${pub.location} (${pub.rating})
                    <button onclick="openEditPubModal(${pub.id}, '${pub.name}', '${pub.location}', '${pub.description}', ${pub.rating})">Редагувати</button>
                    <button onclick="deletePub(${pub.id})">Видалити</button>
                </li>
            `).join('');

            beersList.innerHTML = beers.map(beer => `
                <li>
                    ${beer.name} - ${beer.type} (${beer.rating})
                    <button onclick="openEditBeerModal(${beer.id}, '${beer.name}', '${beer.type}', '${beer.description}', ${beer.rating})">Редагувати</button>
                    <button onclick="deleteBeer(${beer.id})">Видалити</button>
                </li>
            `).join('');
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    // Обробка форми додавання нового паба
    addPubForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('pubName').value;
        const location = document.getElementById('pubLocation').value;
        const description = document.getElementById('pubDescription').value;
        const rating = document.getElementById('pubRating').value;

        await fetch('/api/pubs', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ name, location, description, rating })
        });

        addPubForm.reset();
        fetchItems();
    });

    // Обробка форми додавання нового пива
    addBeerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('beerName').value;
        const type = document.getElementById('beerType').value;
        const description = document.getElementById('beerDescription').value;
        const rating = document.getElementById('beerRating').value;

        await fetch('/api/beers', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ name, type, description, rating })
        });

        addBeerForm.reset();
        fetchItems();
    });

    // Видалення паба
    window.deletePub = async (id) => {
        await fetch(`/api/pubs/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        fetchItems();
    };

    // Видалення пива
    window.deleteBeer = async (id) => {
        await fetch(`/api/beers/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        fetchItems();
    };

    // Відкриття попапу для редагування паба
    window.openEditPubModal = (id, name, location, description, rating) => {
        document.getElementById('editPubId').value = id;
        document.getElementById('editPubName').value = name;
        document.getElementById('editPubLocation').value = location;
        document.getElementById('editPubDescription').value = description;
        document.getElementById('editPubRating').value = rating;
        document.getElementById('editPubModal').style.display = 'block';
    };

    // Закриття попапу для редагування паба
    window.closeEditPubModal = () => {
        document.getElementById('editPubModal').style.display = 'none';
    };

    // Відкриття попапу для редагування пива
    window.openEditBeerModal = (id, name, type, description, rating) => {
        document.getElementById('editBeerId').value = id;
        document.getElementById('editBeerName').value = name;
        document.getElementById('editBeerType').value = type;
        document.getElementById('editBeerDescription').value = description;
        document.getElementById('editBeerRating').value = rating;
        document.getElementById('editBeerModal').style.display = 'block';
    };

    // Закриття попапу для редагування пива
    window.closeEditBeerModal = () => {
        document.getElementById('editBeerModal').style.display = 'none';
    };

    // Обробка форми редагування паба
    document.getElementById('editPubForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('editPubId').value;
        const name = document.getElementById('editPubName').value;
        const location = document.getElementById('editPubLocation').value;
        const description = document.getElementById('editPubDescription').value;
        const rating = document.getElementById('editPubRating').value;

        await fetch(`/api/pubs/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ name, location, description, rating })
        });

        closeEditPubModal();
        fetchItems();
    });

    // Обробка форми редагування пива
    document.getElementById('editBeerForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('editBeerId').value;
        const name = document.getElementById('editBeerName').value;
        const type = document.getElementById('editBeerType').value;
        const description = document.getElementById('editBeerDescription').value;
        const rating = document.getElementById('editBeerRating').value;

        await fetch(`/api/beers/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ name, type, description, rating })
        });

        closeEditBeerModal();
        fetchItems();
    });
});
