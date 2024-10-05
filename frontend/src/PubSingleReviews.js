import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PubDetailPage = () => {
  const { id } = useParams();
  const [pub, setPub] = useState(null);
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/pubs/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setPub(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Помилка при завантаженні паба:', error);
        setLoading(false);
      });

    // Завантажуємо пиво для конкретного паба
    fetch(`/api/pubs/${id}/beers`)
      .then((response) => response.json())
      .then((data) => setBeers(data))
      .catch((error) => console.error('Помилка при завантаженні пива:', error));
  }, [id]);

  if (loading) {
    return <div>Завантаження інформації про паб...</div>;
  }

  if (!pub) {
    return <div>Паб не знайдено.</div>;
  }

  return (
    <div className="pub-detail-block">
      {pub.image_url && (
        <img
          src={`/${pub.image_url}`}
          alt={pub.name}
          className="pub-image-review"
        />
      )}
      <h1 className="pubs-title-review">{pub.name}</h1>
      <p className="pubs-location-review"><strong>Місцезнаходження:</strong> {pub.location}</p>
      <p className="pubs-desc-review"><strong>Опис:</strong> {pub.description}</p>
      <p className="pubs-rating-review"><strong>Рейтинг:</strong> {pub.rating}/5</p>

      <h2 className="beers-title">Список пива</h2>
      <div className="beer-grid">
        {beers.length > 0 ? (
          beers.map((beer) => (
            <div className="beer-card" key={beer.id}>
              <h3 className="beer-name">{beer.name}</h3>
              <span className="beer-type">Тип: {beer.type}</span>
              <p className="beer-description">{beer.description}</p>
              <span className="beer-rating">Рейтинг: {beer.rating}</span>
            </div>
          ))
        ) : (
          <p>У цьому пабі немає пива.</p>
        )}
      </div>
    </div>
  );
};

export default PubDetailPage;
