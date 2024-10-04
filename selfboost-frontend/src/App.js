import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/profile/:id" element={<Profile/>}/>
      </Routes>
    </Router>
  );
}

export default App;

