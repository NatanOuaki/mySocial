import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profil from './pages/Profil';
import AddPost from './pages/AddPost';
import SearchUser from './pages/SearchUser';
import { AuthProvider } from './AuthContext';

const App = () => (
    <AuthProvider>
      <div style={{ display: 'flex' }}>
        <Navbar />
        <div>
          <div className='contentMain'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profil />} />
              <Route path="/addPost" element={<AddPost />} />
              <Route path="/searchuser" element={<SearchUser />} />
            </Routes>
            </div>
          <Footer />
        </div>
      </div>
    </AuthProvider>
);

export default App;
