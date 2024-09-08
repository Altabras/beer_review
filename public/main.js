document.addEventListener('DOMContentLoaded', () => {
    const addPubForm = document.getElementById('addPubForm');
    const addBeerForm = document.getElementById('addBeerForm');
    const pubsList = document.getElementById('pubsList');
    const beersList = document.getElementById('beersList');

    // Отримання і відображення пабів і пива
    const fetchItems = async () => {
        const [pubsResponse, beersResponse] = await Promise.all([
            fetch('/api/pubs'),
            fetch('/api/beers')
        ]);

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
            headers: {
                'Content-Type': 'application/json'
            },
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, type, description, rating })
        });

        addBeerForm.reset();
        fetchItems();
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

        await fetch(`/api/pubs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, type, description, rating })
        });

        closeEditBeerModal();
        fetchItems();
    });

    // Завантажити паби і пиво при завантаженні сторінки
    fetchItems();
});
