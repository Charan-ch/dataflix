import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Registration from './Registration';
import Login from './Login';
import HomePage from './Homepage';
import TaskManager from './TaskManager';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/taskmanager" element={<TaskManager />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
