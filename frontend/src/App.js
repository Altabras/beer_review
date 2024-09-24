import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header'; 
import './App.css'; 
import PubsPage from './PubsPage'; // Імпортуємо сторінку з пабами
import PubSingleReviews from './PubSingleReviews';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/pubs" element={<PubsPage />} /> {/* Підключаємо сторінку з пабами */}
          <Route path="/pub/:id" element={<PubSingleReviews />} />
          
          <Route path="/map" element={<div>Карта пабів</div>} />
          <Route path="/login" element={<div>Сторінка Входу/Реєстрації</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
