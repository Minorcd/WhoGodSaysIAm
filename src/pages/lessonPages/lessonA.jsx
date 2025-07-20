import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import lesson from '../../data/lessons/a.json';
import '../../styles/lessonStyle.css';

function LessonPage() {
    /* Navigation System */
    const navigate = useNavigate();
    /* Sections From Lesson Data */
    const alpha = lesson.lesson.alpha;
    const beginL = lesson.lesson.beginningLetter;
    const whichW = lesson.practice.whichWord;
    const sameS = lesson.practice.sameSound;
    const lowercase = lesson.practice.lowercase;
    const scripture = lesson.practice.scripture;

    /* Utilities to move through each section */
    const [currentSection, setCurrentSection] = useState("alpha");
    const [isSectionComplete, setIsSectionComplete] = useState(false);
    const [isLessonComplete, setIsLessonComplete] = useState(false);
    const [showNextSection, setShowNextSection] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    /*Utilities for lesson and practice sections */
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [showDescriptionIndex, setShowDescriptionIndex] = useState(null);
    const [isAnsCorrect, setIsAnsCorrect] = useState(false);
    const [showNext, setShowNext] = useState(false);

    const handleImgClick = (audioSrc, index) => {
        if(!imageAudioRef.current) {
            imageAudioRef.current = new Audio(audioSrc);
        } else {
            imageAudioRef.current.src = audioSrc;
        }

        imageAudioRef.current
            .play()
            .catch(error => console.error("Audio play failed:", error));
        
        if (typeof index !== "undefined") {
            setShowDescriptionIndex(index);
        }
    };

    const handleLetterClick = () => {
        setIsButtonClicked(true);
        if(letterAudioRef.current) {
            letterAudioRef.current.play();
        }
        setTimeout(() => setIsButtonClicked(false), 1000); //Resets button color after 1 second
    };

    const handleAudioEnd = () => {
        setIsSectionComplete(true);
    };

    const formatDescription = (description) => (
        <span>
            <span className="green-format">{description.charAt(0)}</span>
            <span className="black-format">{description.slice(1)}</span>
        </span>
    );

    /*Initialization for all audio references */
    const scriptureAudioRef = useRef(null);
    const letterAudioRef = useRef(null);
    const imageAudioRef = useRef(null);
    const correctAudioRef = useRef(new Audio("/assets/sounds/correct.wav"));
    const wrongAudioRef = useRef(new Audio("/assets/sounds/incorrect.wav"));

    /*Utilities for scripture section */
    const [scrambledWords, setScrambledWords] = useState([]);
    const [selectedWords, setSelectedWords] = useState([]);
    const [isScriptureComplete, setIsScriptureComplete] = useState(false);

    useEffect(() => {
        if(scripture.scriptureAudio) {
            scriptureAudioRef.current = new Audio(scripture.scriptureAudio);
        }
    }, [scripture.scriptureAudio]);

    useEffect(() => {
        if(scripture.completeScripture) {
            const words = scripture.completeScripture.split(" ");
            setScrambledWords(generateUniquePositions(words));
        }
    }, [scripture.completeScripture]);

    function generateUniquePositions(words) {
        let positions = [];
        return words.map(word => {
            let x, y, isOverlapping;
            do {
                x = Math.random() * 80 + 10;
                y = Math.random() * 80 + 10;
                isOverlapping = positions.some(pos => Math.abs(pos.x - x) < 10 && Math.abs(pos.y - y) < 10);
            } while (isOverlapping);
            positions.push({ x, y});
            return { word, x, y, clicked: false};
        });
    }

    const handleWordClick = (wordObj) => {
        setSelectedWords([...selectedWords, wordObj.word]);
        setScrambledWords(scrambledWords.map(w => (w.word === wordObj.word ? { ...w, clicked: true } : w )));
    };

    useEffect(() => {
        if (selectedWords.join(" ") === scripture.completeScripture) {
            correctAudioRef.current.play();
            setTimeout(() => {
                if(scriptureAudioRef.current) {
                    scriptureAudioRef.current.play();
                    setIsScriptureComplete(true);
                }
            }, 1000);
        }
    }, [selectedWords]);

    useEffect(() => {
        if(scriptureAudioRef.current) {
            scriptureAudioRef.current.onended = () => {
                setIsLessonComplete(true);
            };
        }
    }, [isScriptureComplete]);

    const formatFocusWord = (word) => (
        <span style={{ color: word === scripture.focusWord ? "green" : "black", fontweight: word === scripture.focusWord ? "bold" : "normal" }}>{word}</span>
    );

    const renderAlpha = () => (
        <div className="lesson-container">
            <h1>Click the letter to hear it.</h1>
            <button onClick={handleLetterClick} className="btn-style">{alpha.letter}</button>
            <audio ref={letterAudioRef} src={alpha.letterAudio} onEnded={handleAudioEnd}></audio>
            {isSectionComplete && (
                <div style={{ marginTop: "20px" }}>
                    <button className="next-btn" onClick={() => { setIsSectionComplete(false); setCurrentIndex(0); setCurrentSection("beginningLetter"); }}>Next</button>
                </div>
            )}
        </div>
    );

    const renderBeginLetter = () => {
        const currentItem = beginL[currentIndex];

        return (
            <div className="lesson-container">
                <p className="instruction" onClick={() => document.getElementById("instructionAudio").play()}>
                    {currentItem.instruction}
                </p>
                <audio id="instructionAudio" src={currentItem.instructionAudio}></audio>

                <img className="lesson-img" src={currentItem.img} alt={currentItem.imgDescription} onClick={() => {
                    handleImgClick(currentItem.imgAudio)
                    setShowDescription(true);
                }} />
                {showDescription && (
                    <p className="img-description">{formatDescription(currentItem.imgDescription)}</p>
                )}
                <audio id="imageAudio" src={currentItem.imgAudio}></audio>
                <div style={{ marginTop: "20px" }}>
                    {currentIndex > 0 && (
                        <button className="next-btn" onClick={() => { setCurrentIndex(currentIndex - 1); setShowDescription(false); }}>
                            Back
                        </button>
                    )}
                    {currentIndex + 1 < beginL.length ? (
                        <button className="next-btn" onClick={() => { setCurrentIndex(currentIndex + 1); setShowDescription(false); }}>
                            Next
                        </button>
                    ) : (
                        <button className="next-btn" onClick={() => { setCurrentSection("whichWord"); setShowDescription(false); }}>
                            Next Section
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const renderWhichWord = () => {
        const { question, questionAudio, imgs, ansOptions, correctAns } = whichW;

        const handleCheckAnswer = () => {
            const isCorrect = JSON.stringify([...selectedAnswers].sort()) === JSON.stringify([...correctAns].sort());
            if (isCorrect) {
                correctAudioRef.current?.play();
                setIsSectionComplete(true);
            } else {
                wrongAudioRef.current?.play();
                setSelectedAnswers([]);
            }
        };

        return (
            <div className="lesson-container">
                <h1 className="instruction" onClick={() => handleImgClick(questionAudio, null)}>{question}</h1>
                <div className="practice-layout">
                    {imgs.map((img, index) => (
                        <div key={index} style={{ textAlign: "center" }}>
                            <img className="lesson-img" src={img.file} alt={img.description} onClick={() => handleImgClick(img.audio, index)}/>
                            {showDescriptionIndex === index && (
                                <p className="img-description">{formatDescription(img.description)}</p>
                            )}
                            <div style={{ marginTop: "10px" }}>
                                <button className="ans-btn" onClick={() =>
                                    setSelectedAnswers((prev) =>
                                    prev.includes(img.description)
                                    ? prev.filter((ans) => ans !== img.description)
                                    : [...prev, img.description]
                                )}>
                                    {selectedAnswers.includes(img.description) ? "Selected" : "Select"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <button className="ans-btn" style={{ marginTop: "40px" }} onClick={handleCheckAnswer}>Check</button>
                    <div className="nav-btn">
                        <div style={{  marginTop: "20px", justifyContent: "center"}}>
                            <button className="next-btn" onClick={() => setCurrentSection("beginningLetter")}>Back</button>
                        </div>
                        {isSectionComplete && (
                            <div style={{  marginTop: "20px", justifyContent: "center" }}>
                                <button className="next-btn" onClick={() => setCurrentSection("lowercase")}>Next Section</button>
                            </div>
                        )}
                    </div>
            </div>
        );
    };

    const renderLowercase = () => {
        const { question,questionAudio,ansOptions, correctAns } = lowercase

        const handleAnswer = (answer) => {
            if(answer === correctAns) {
                correctAudioRef.current.play();
                setIsAnsCorrect(true);
                setTimeout(() => setShowNextSection(true), 1000);
            } else {
                wrongAudioRef.current.play();
                setIsAnsCorrect(false);
            }
        };

        return (
            <div className="lesson-container">
                <h1 onClick={() => handleImgClick(questionAudio, null)}>{question}</h1>
                <div className="lowercase-btn">
                    {ansOptions.map((options, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(options)}
                            className="ans-btn"
                        >
                            <span style={{ fontSize: "22px", fontWeight: "bold" }}>{options}</span>
                        </button>
                    ))}
                </div>
                <div className="nav-btn">
                    <button className="next-btn" style={{ display: "flex", marginTop: "20px" }}onClick={() => setCurrentSection("whichWord")}>Back</button>
                    {showNextSection && (
                            <button className="next-btn" style={{display: "flex", marginTop: "20px"}} onClick={() => setCurrentSection("sameSound")}>Next Section</button>
                    )}
                </div>
            </div>
        );
    };

    const renderSameSound = () => {
        if(!Array.isArray(sameS) || currentIndex >= sameS.length) {
            return null;
           }
    
        const currentItem = sameS[currentIndex];
        const {question, questionAudio, imgs , ansOptions, correctAns} = currentItem;

       
       

       const handleAnswer = (answer) => {
        if(answer === currentItem.correctAns) {
            correctAudioRef.current.play();
            setIsAnsCorrect(true);
            setShowNext(true);
        } else {
            wrongAudioRef.current.play();
            setIsAnsCorrect(false);
        }
       };

       return (
        <div className="lesson-container">
            <h1 className="instruction" onClick={() => handleImgClick(questionAudio, null)}>{question}</h1>
            <div className="practice-layout">
                {imgs.map((img, index) => (
                    <div key={index} style={{ textAlign: "center"}}>
                        <img className="lesson-img" src={img.file} alt={img.description} />
                        {showDescriptionIndex === index && (
                            <p className="img-description">{formatDescription(img.description)}</p>
                        )}
                    </div>
                ))}
            </div>
            <div className="ans-btn1">
                <button className="ans-btn" style={{ marginRight: "20px" }} onClick={() => handleAnswer("Yes")}>Yes</button>
                <button className="ans-btn" onClick={() => handleAnswer("No")}>No</button>
            </div>
            <div className="nav-btn">
                <button className="next-btn" onClick={() => setCurrentSection("lowercase")}>Back</button>
            {showNext && (
                <div style={{ marginTop: "20px" }}>
                    <button className="next-btn" onClick={() => setCurrentSection("scripture")}>Next Section</button>
                </div>
            )}
            </div>
        </div>
       );
    };

    const renderScripture = () => {
        return (
            <div>
                <h2>Arrange the words to form the scripture:</h2>
                <div className="scripture-format">
                   <h1>{selectedWords.map((word, index) => (
                    <span key={index}>
                        {formatFocusWord(word)}{index < selectedWords.length - 1 ? ' ' : ''}
                    </span>
                   ))}</h1>
                </div>
                <div className="scramble-container">
                    {scrambledWords.map((wordObj, index) => (
                        <button
                            className="word-btn"
                            onClick={() => handleWordClick(wordObj)}
                            disabled={wordObj.clicked} //Disables the button after is has been clicked
                            style={{
                                left: `${wordObj.x}%`,
                                top: `${wordObj.y}%`,
                                background: wordObj.clicked ? "#0577B0" : "transparent",
                                cursor: wordObj.clicked ? "default" : "pointer",
                                transition: "background-color 0.3s ease, color 0.3s ease"
                            }}
                            onMouseEnter={(e) => {
                                if (!wordObj.clicked) {
                                    e.target.style.backgroundColor = "#0577B0";
                                    e.target.style.color = "#ffffff"
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!wordObj.clicked) {
                                    e.target.style.backgroundColor = "transparent";
                                    e.target.style.color = "#000000";
                                }
                            }}
                            >{wordObj.word}</button>
                    ))}
                </div>

            </div>
        );
    };

    const renderCompletionMessage = () => {
        return (
            <div>
                <div className="custom-header">
                    <h1 className="custom-title" style={{textAlign: "center"}}>Congratulations!</h1>
                    <h1 className="custom-subtitle">You have completed the lesson!</h1>
                </div>
                <h1 style={{textAlign: "center"}}>You may go back to the lessons of the alphabet or go back to home.</h1>
                <div style = {{ display: "flex", justifyContent: "center", textAlign: "center", gap: "15px", marginTop: "10px"}}>
                    <button className="next-btn" onClick={() => navigate("/")}>Home</button>
                    <button className="next-btn" onClick={() => navigate("/Alphabet")}>Alphabet</button>
                </div>
            </div>
        );
    };

    const renderSection = () => {
        if(isLessonComplete) {
            return renderCompletionMessage();
        }

        switch (currentSection) {
            case "alpha":
                return (
                    <div>
                        {renderAlpha()}
                    </div>
                );
            case "beginningLetter":
                return (
                    <div>
                        {renderBeginLetter()}
                    </div>
                );
            case "whichWord":
                return (
                    <div>
                        {renderWhichWord()}
                    </div>
                );
            case "lowercase":
                return (
                    <div>
                        {renderLowercase()}
                    </div>
                );
            case "sameSound":
                return (
                    <div>
                        {renderSameSound()}
                    </div>
                );
            case "scripture":
                return (
                    <div>
                        {renderScripture()}
                    </div>
                );
            default:
                return <h1>Page Does Not Exist</h1>;
        }
    };

    return (
        <div>
            <div>{renderSection()}</div>
        </div>
    )

}

export default LessonPage;