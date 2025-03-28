import React from 'react';
import { useNavigate } from 'react-router-dom';

function alphabetPage () {
    const navigate = useNavigate();

    //Array of the alphabet letters
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    //Handle click event for a letter
    const handleLetterClick = (letter) => {
        navigate(`/lesson/${letter}`);
    };

    return (
        <div className="default-params">
            <div className="custom-header">
                <h1 className="page-title"> The Alphabet </h1>
                <p className="custom-subtitle"> Select a letter to begin a lesson.</p>
            </div>
            <div className="alphabet-container">
                <div className="alphabet-grid">
                    {letters.map((letter) => (
                        <button key={letter} className="alphabet-letter" onClick={() => handleLetterClick(letter)}>{letter}</button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default alphabetPage;