import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profil from './pages/Profil';
import AddPost from './pages/AddPost';
import SearchUser from './pages/SearchUser';
import { useAuth } from './AuthContext';
import AuthRoute from './AuthRoute';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';


const App = () => {
    const { currentUser } = useAuth(); 

    return (
        <div>
            {currentUser && <Navbar />} {}
            <div style={currentUser ? {width: '87vw', marginLeft: '13vw'} : { }}>
                    <div className='contentMain'>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
                            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
                            <Route path="/profile" element={<PrivateRoute><Profil /></PrivateRoute>} />
                            <Route path="/addPost" element={<PrivateRoute><AddPost /></PrivateRoute>} />
                            <Route path="/searchuser" element={<PrivateRoute><SearchUser /></PrivateRoute>} />
                        </Routes>
                    </div>
                    <Footer />
            </div>
        </div>
    );
};

export default App;
