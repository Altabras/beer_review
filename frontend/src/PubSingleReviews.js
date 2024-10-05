import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PubDetailPage = () => {
  const { id } = useParams();
  const [pub, setPub] = useState(null);
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pubResponse = await fetch(`/api/pubs/${id}`);
        const pubData = await pubResponse.json();
        console.log('Дані паба:', pubData); // Додайте це
        setPub(pubData);
  
        const beersResponse = await fetch(`/api/pubs/${id}/beers`);
        const beersData = await beersResponse.json();
        console.log('Дані пива:', beersData); // Додайте це
        setBeers(beersData);
      } catch (error) {
        console.error('Помилка при завантаженні:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
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
          src={`/${pub.image_url}`} // Переконайтеся, що у вашому API pub.image_url правильний
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
              <img 
                src={`/${beer.beer_img}`} // Переконайтеся, що beer.beer_img правильний
                alt={`Зображення ${beer.name}`} 
                className="beer-image" 
              />
              <h3 className="beer-name">{beer.name}</h3>
              <span className="beer-type">Тип: {beer.type}</span>
              <p className="beer-description">Опис:{beer.description}</p>
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
