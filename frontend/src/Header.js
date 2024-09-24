import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';


// Створення компонента Хедер
const Header = () => { 
  return (
    <header className="header">
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item"><Link to="/pubs" className="nav-link">Паби</Link></li>
          
          <li className="nav-item"><Link to="/map" className="nav-link">Карти пабів</Link></li>
          <li className="nav-item"><Link to="/login" className="nav-link">Вхід/Реєстрація</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;