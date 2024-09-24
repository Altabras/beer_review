import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PubsPage = () => {
  const [pubs, setPubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Функція для отримання списку пабів з бекенду
  useEffect(() => {
    fetch('/api/pubs') // URL для вашого API, який повертає список пабів
      .then((response) => response.json())
      .then((data) => {
        setPubs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Помилка при отриманні пабів:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Завантаження пабів...</div>;
  }

  return (
    <div className="pubs-block">
      <h1 className="title-pubs_page">Список Пабів</h1>
      <div className="pubs-container">
        {pubs.length > 0 ? (
          pubs.map((pub) => (
            <div key={pub.id} className="pub-card">
              {/* Додаємо елемент зображення */}
              {pub.image_url && (
                <img
                src={pub.image_url} // Використовуємо без '/' на початку
                alt={pub.name} // Додаємо alt-текст для зображення
                className="pub-image" // Додаємо клас для стилізації
              />
              )}
              <h2>{pub.name}</h2>
              <p className="pubs-location"><strong>Місцезнаходження:</strong> {pub.location}</p>
              <p className="pubs-desc"><strong>Опис:</strong> {pub.description}</p>
              <p className="pubs-rating"><strong>Рейтинг:</strong> {pub.rating}/5</p>
              <Link to={`/pub/${pub.id}`}>Детальніше</Link> {/* Додаємо посилання на детальну сторінку */}
            </div>
          ))
        ) : (
          <p>Наразі немає доступних пабів.</p>
        )}
      </div>
    </div>
  );
};

export default PubsPage;
