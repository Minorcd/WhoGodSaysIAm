import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Lessons from './pages/Lessons';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} /> {/* Home Page */}
                <Route path="/about" element={<About />} /> {/* About Page */}
                <Route path="/lessons" element={<Lessons />} /> {/* List of Lessons */}
            </Routes>
        </Router>
    )
};

export default App;