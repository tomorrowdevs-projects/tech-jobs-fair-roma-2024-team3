import React from 'react';
import AuthScreen from './components/AuthScreen';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AuthScreen />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
};

export default App;
