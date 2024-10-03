import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Register/>}/>
        <Route path="/register" element={<Login/>}/>
        <Route path="/profile/:id" element={<Profile/>}/>
      </Routes>
    </Router>
  );
}

export default App;

