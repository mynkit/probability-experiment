import React from 'react';
import './App.css';
import MontyHallProblem from './components/MontyHallProblem';
import Home from './components/Home';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/montyhall" element={<MontyHallProblem />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
