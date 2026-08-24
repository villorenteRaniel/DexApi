// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Pokedex from './pages/Pokedex';
import Ability from './pages/Ability';
import Move from './pages/Move';
import Nature from './pages/Nature';
import Type from './pages/Type';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <div className="min-h-screen w-full relative flex bg-bg-main text-text-subtle font-sans antialiased">
      <Sidebar />
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pt-16 md:pl-20 lg:pl-64 min-h-screen">
        <Routes>
          {/* Default redirect to pokedex for now */}
          <Route path="/" element={<Navigate to="/pokedex" replace />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/ability" element={<Ability />} />
          <Route path="/move" element={<Move />} />
          <Route path="/type" element={<Type />} />
          <Route path="/nature" element={<Nature />} />
        </Routes>
      </main>
      {/* Scroll to top button */}
      <ScrollToTop />
    </div>
  );
}