import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ChallengePage from './pages/ChallengePage';
import { UserProvider } from './contexts/UserContext';
import { PrivateRoute } from './components/PrivateRoute';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>}/>
          <Route path="/login" element={<PrivateRoute authRequired={false}><Login/></PrivateRoute>}/>
          <Route path="/register" element={<PrivateRoute authRequired={false}><Register/></PrivateRoute>}/>
          <Route path="/profile/:id" element={<PrivateRoute><Profile/></PrivateRoute>}/>
          <Route path="/challenge" element={<PrivateRoute><ChallengePage/></PrivateRoute>}/>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;

