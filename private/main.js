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

    // Отримання і відображення пабів і пива
const fetchItems = async () => {
    const [pubsResponse, beersResponse] = await Promise.all([
        fetch('/api/pubs'),
        fetch('/api/beers')
    ]);

    const pubs = await pubsResponse.json();
    const beers = await beersResponse.json();

    // Оновлюємо список пабів у селектах для додавання і редагування пива
    const pubOptions = pubs.map(pub => `<option value="${pub.id}">${pub.name}</option>`).join('');
    document.getElementById('beerPub').innerHTML = `<option value="">Виберіть паб</option>${pubOptions}`;
    document.getElementById('editBeerPub').innerHTML = `<option value="">Виберіть паб</option>${pubOptions}`;

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
            <button onclick="openEditBeerModal(${beer.id}, '${beer.name}', '${beer.type}', '${beer.description}', ${beer.rating}, ${beer.pubId})">Редагувати</button>
            <button onclick="deleteBeer(${beer.id})">Видалити</button>
        </li>
    `).join('');
};


    // Обробка форми додавання нового паба!
addPubForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('pubName').value;
    const location = document.getElementById('pubLocation').value;
    const description = document.getElementById('pubDescription').value;
    const rating = document.getElementById('pubRating').value;
    const image = document.getElementById('pubImage').files[0]; // Отримуємо файл

    // Створюємо FormData для відправки файлів і тексту
    const formData = new FormData();
    formData.append('name', name);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('rating', rating);
    formData.append('image', image); // Додаємо зображення до FormData

    // Відправка даних на сервер
    await fetch('/api/pubs', {
        method: 'POST',
        body: formData // Передаємо formData без заголовка 'Content-Type'
    });

    // Очищуємо форму після успішної відправки
    addPubForm.reset();
    fetchItems(); // Оновлюємо список пабів
});


    // Обробка форми додавання нового пива
addBeerForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Зупиняємо стандартну поведінку

    // Створюємо об'єкт FormData
    const formData = new FormData();
    
    // Додаємо дані пива до FormData
    formData.append('name', document.getElementById('beerName').value);
    formData.append('type', document.getElementById('beerType').value);
    formData.append('description', document.getElementById('beerDescription').value);
    formData.append('rating', document.getElementById('beerRating').value);
    formData.append('pubId', document.getElementById('beerPub').value); // Додаємо pubId
    formData.append('beer_img', document.getElementById('beerImage').files[0]); // Додаємо зображення

    fetch('/api/beers', {
        method: 'POST',
        body: formData // Відправляємо FormData без заголовка Content-Type
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Можливо, потрібно буде оновити список пива на сторінці
    })
    .catch(error => console.error('Error:', error));

    addBeerForm.reset();
    fetchItems(); // Оновлення списку пива (якщо це потрібно)
});


    // Видалення паба
    window.deletePub = async (id) => {
        await fetch(`/api/pubs/${id}`, {
            method: 'DELETE'
        });

        fetchItems();
    };

    // Видалення пива
    window.deleteBeer = async (id) => {
        await fetch(`/api/beers/${id}`, {
            method: 'DELETE'
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
    const imageFile = document.getElementById('editPubImage').files[0]; // Отримуємо файл зображення

    const formData = new FormData(); // Створюємо новий об'єкт FormData
    formData.append('name', name);
    formData.append('location', location);
    formData.append('description', description);
    formData.append('rating', rating);
    if (imageFile) {
        formData.append('image', imageFile); // Додаємо файл зображення, якщо він є
    }

    await fetch(`/api/pubs/${id}`, {
        method: 'PUT',
        body: formData // Відправляємо FormData, щоб включити файл
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
    const pubId = document.getElementById('editBeerPub').value; // Отримуємо ID вибраного пабу

    await fetch(`/api/beers/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, type, description, rating, pubId }) // Додаємо паб до тіла запиту
    });

    closeEditBeerModal();
    fetchItems();
});

});
