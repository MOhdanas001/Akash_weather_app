// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CitiesTable from './components/CitiesTable.tsx';
import WeatherPage from './components/WeatherPage.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CitiesTable />} />
        <Route path="/weather/:cityId" element={<WeatherPage />} />
      </Routes>
    </Router>
  );
};

export default App;
