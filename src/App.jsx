import { useState } from 'react'
import Sidebar from './components/Sidebar';
import './App.css'

export default function App() {
  return(
    <div className='min-h-screen w-full flex bg-bg-main text-text-subtle font-sans antialiased'>
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <main className='flex-1 min-w-0 flex flex-col min-h-screen'>
        {/* Top Header */}
      </main>
    </div>
  );
}
