import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import tabBar from './components/tabBar';
import Home from './pages/Home';
import About from './pages/About';
import Lessons from './pages/Lessons';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Home />} /> {/* Home Page */}
                    <Route path="/about" element={<About />} /> {/* About Page */}
                    <Route path="/alphabet" element={<Lessons />} /> {/* List of Lessons */}
                </Routes>
                <tabBar />
            </div>
        </Router>
    )
};

export default App;