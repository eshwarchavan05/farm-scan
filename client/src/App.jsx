import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LangProvider } from './i18n/LangContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Scan from './pages/Scan';
import CropDoctor from './pages/CropDoctor';
import Weather from './pages/Weather';

function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/doctor" element={<CropDoctor />} />
          <Route path="/weather" element={<Weather />} />
        </Routes>
      </BrowserRouter>
    </LangProvider>
  );
}

export default App;
