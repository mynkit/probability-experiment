import React, { useState, useEffect } from 'react';
import './App.css';
import MontyHallProblem from './components/MontyHallProblem';
import Lottery from './components/Lottery';
import MonteCarloPI from './components/MonteCarloPI';
import Home from './components/Home';
import Sidebar from './components/Sidebar';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

type Props = {
  targetPage: string;
}

const Site: React.FC<Props> = ({ targetPage }) => {
  const [target, setTarget] = useState(targetPage);
  return (
    <>
      <Sidebar target={target} setTarget={setTarget}/>
      {
        target==='montyhall' ? (
          <MontyHallProblem />
        ) : (
        target==='lottery' ? (
          <Lottery />
        ) : (
        target==='montecarlo' ? (
          <MonteCarloPI />
        ) : (
          <></>
        )))
      }
    </>
  )
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Site targetPage='montyhall'/>} />
        <Route path="/montyhall" element={<Site targetPage='montyhall'/>} />
        <Route path="/lottery" element={<Site targetPage='lottery'/>} />
        <Route path="/montecarlo" element={<Site targetPage='montecarlo'/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
