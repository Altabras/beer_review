import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PubDetailPage = () => {
  const { id } = useParams(); // Отримуємо ID паба з URL
  const [pub, setPub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/pubs/${id}`) // Робимо запит на конкретний паб
      .then((response) => response.json())
      .then((data) => {
        setPub(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Помилка при завантаженні паба:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Завантаження інформації про паб...</div>;
  }

  if (!pub) {
    return <div>Паб не знайдено.</div>;
  }

  return (
    <div className="pub-detail-block">
      {/* Додаємо елемент зображення */}
      {pub.image_url && (
        <img
          src={pub.image_url} // Використовуємо без '/' на початку
          alt={pub.name} // Додаємо alt-текст для зображення
          className="pub-image" // Додаємо клас для стилізації
        />
      )}
      <h1 className="pubs-title-review">{pub.name}</h1>
      <p className="pubs-location-review"><strong>Місцезнаходження:</strong> {pub.location}</p>
      <p className="pubs-desc-review"><strong>Опис:</strong> {pub.description}</p>
      <p className="pubs-rating-review"><strong>Рейтинг:</strong> {pub.rating}/5</p>
    </div>
  );
};

export default PubDetailPage;
