import React from'react';
import { NavLink } from 'react-router-dom';
import '../styles/tabBar.css';

function tabBar() {
    console.log('Tab bar is rendering');
    return (
        <div className="tab-bar">
            <NavLink to="/" className="tab-item" activeclassname="active">Home</NavLink>
            <NavLink to="/about" className="tab-item" activeclassname="active">About</NavLink>
            <NavLink to="/alphabet" className="tab-item" activeclassname="active">Alphabet</NavLink>
        </div>
    );
}

export default tabBar;