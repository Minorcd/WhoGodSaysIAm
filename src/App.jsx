import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TabBar from './components/tabBar';
import Home from './pages/Home';
import About from './pages/About';
import Lessons from './pages/Lessons';
import lessonA from './pages/lessonPages/lessonA';

const App = () => {
    return (
        <Router>
            <div className="background-container">
                <Routes>
                    <Route path="/" element={<Home />} /> {/* Home Page */}
                    <Route path="/About" element={<About />} /> {/* About Page */}
                    <Route path="/Alphabet" element={<Lessons />} /> {/* List of Lessons */}
                    {/*<Route path="/Alphabet/:letter" element={<lessonA />} />  Lesson A */}
                </Routes>
                <TabBar />
            </div>
        </Router>
    )
};

export default App;