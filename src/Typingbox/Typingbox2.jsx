//new features to be added 
//? improve the  wpm counter
//? make a smooth caret
//? add varibles for themes instead of harcoded values
//? add the weak key feature

import React, { useEffect } from 'react'
import { useState, useRef } from 'react';
function Typingbox2() {
    const [temp, setTemp] = useState(0)
    const [generatedText, setGeneratedText] = useState(" ");//react hooks can only be called here not inside the return function
    const [inputText, setInputText] = useState("");
    const commonWords = [
        "the", "and", "that", "have", "for", "not", "with", "you", "this", "but",
        "his", "from", "they", "say", "her", "she", "will", "one", "all", "would",
        "there", "their", "what", "about", "which", "when", "make", "can", "like",
        "time", "just", "know", "take", "people", "into", "year", "your", "good",
        "some", "could", "them", "see", "other", "than", "then", "now", "look",
        "only", "come", "its", "over", "think", "also", "back", "after", "use",
        "two", "how", "our", "work", "first", "well", "way", "even", "new", "want",
        "because", "any", "these", "give", "day", "most", "us", "are", "as", "at",
        "be", "by", "do", "go", "he", "if", "in", "is", "it", "me", "my", "no",
        "of", "on", "or", "so", "to", "up", "we", "an", "as", "did", "has", "had",
        "man", "men", "boy", "boys", "girl", "girls", "cat", "dog", "run", "ran",
        "see", "saw", "say", "said", "ask", "asked", "put", "set", "cut", "let",
        "get", "got", "lot", "lot", "few", "far", "end", "new", "old", "big",
        "small", "long", "high", "low", "late", "early", "next", "last", "best",
        "less", "more", "same", "such", "true", "left", "right", "kind", "life",
        "line", "home", "head", "hand", "face", "eye", "feet", "mile", "king",
        "queen", "bird", "fish", "tree", "leaf", "rock", "star", "fire", "water",
        "snow", "rain", "wind", "road", "city", "town", "park", "farm", "room",
        "door", "wall", "book", "page", "word", "song", "game", "play", "work",
        "shop", "farm", "food", "milk", "meat", "cake", "rice", "salt", "soup",
        "cake", "cold", "warm", "hot", "hard", "soft", "free", "full", "true",
        "nice", "easy", "fast", "slow", "rich", "poor", "safe", "wild", "cool",
        "dark", "light", "late", "early", "last", "next", "near", "far", "deep",
        "wide", "thin", "fat", "old", "new", "young", "big", "small", "tall",
        "short", "red", "blue", "pink", "gray", "green", "black", "white", "gold",
        "silver", "brave", "calm", "cute", "evil", "fair", "fine", "good", "great",
        "kind", "lazy", "mean", "nice", "poor", "sad", "shy", "slow", "strong",
        "sweet", "tough", "warm", "wise"
    ];
    const caretRef = useRef(null)
    const textContainerRef = useRef(null);


    //splitting the text for word by word comparison
    const targetWords = generatedText.split(' ');
    const typedWords = inputText.split(' ');

    //time variables
    const [timeLeft, setTimeLeft] = useState(60);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState(60); // default to 60

    const inputRef = useRef(null);
    const [totalTime, setTotalTime] = useState(60)

    useEffect(() => {
        setTimeLeft(selectedDuration)
    }, [selectedDuration])
    const randomWordsGenerator = (count = 200) => {
        const randomWords = []
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * commonWords.length)
            randomWords.push(commonWords[randomIndex])
        }
        return randomWords.join(" ") //.join(" ") takes the array and joins all elements together, putting a space " " between each word:
    }

    useEffect(() => {
        if (textContainerRef.current && isStarted) {
            const currentCharIndex = inputText.length;
            const currentElement = textContainerRef.current.children[currentCharIndex];
            if (currentElement) {
                currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [inputText, isStarted]);

    useEffect(() => {
        if (!isStarted) return;
        if (timeLeft > 0 && !isTimeUp) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000);
            return () => clearInterval(timer)

        }
        else if (timeLeft == 0) {
            setIsTimeUp(true)
        }

    }, [timeLeft, isTimeUp, isStarted])


    const getCharacterStates = () => {
        let states = [];

        for (let wordIndex = 0; wordIndex < targetWords.length; wordIndex++) {
            const targetWord = targetWords[wordIndex];
            const typedWord = typedWords[wordIndex] || "";

            // Loop over each letter in the target word
            for (let charIndex = 0; charIndex < targetWord.length; charIndex++) {
                const targetChar = targetWord[charIndex];
                const typedChar = typedWord[charIndex];

                if (wordIndex < typedWords.length - 1) {
                    // Fully typed word
                    states.push(typedChar === targetChar ? "correct" : "incorrect");
                }
                else if (wordIndex === typedWords.length - 1) {
                    // Current word
                    if (charIndex < typedWord.length) {
                        states.push(typedChar === targetChar ? "correct" : "incorrect");
                    } else if (charIndex === typedWord.length) {
                        states.push("current");
                    } else {
                        states.push("untyped");
                    }
                }
                else {
                    // Future words
                    states.push("untyped");
                }
            }

            // Handle extra characters typed beyond the target word
            if (wordIndex === typedWords.length - 1 && typedWord.length > targetWord.length) {
                const extraCount = typedWord.length - targetWord.length;
                for (let i = 0; i < extraCount; i++) {
                    states.push("extra");
                }
            }

            // Handle space after the word
            if (wordIndex < targetWords.length - 1) {
                const isCurrentSpace = (
                    wordIndex === typedWords.length - 1 &&
                    typedWord.length === targetWord.length &&
                    inputText.endsWith(" ")
                );

                if (wordIndex < typedWords.length - 1) {
                    states.push("correct-space");
                } else if (isCurrentSpace) {
                    states.push("current");
                } else {
                    states.push("untyped-space");
                }
            }
        }

        return states;
    };


    const handleStart = () => {
        setGeneratedText(randomWordsGenerator());

        setTotalTime(selectedDuration);
        setTimeLeft(selectedDuration);   // always reset timer
        setInputText('');                // always clear input
        setIsTimeUp(false);              // reset time up state
        setIsStarted(true);              // start the test
        setTimeout(() => inputRef.current?.focus(), 0);
        if (textContainerRef.current) {
            textContainerRef.current.scrollTop = 0;
        }
    };


    const getExtraCharacters = () => {
        if (typedWords.length === 0) return ''; //so that it does not crash if the input is empty
        const currentWordIndex = inputText.endsWith(" ") ? typedWords.length : typedWords.length - 1
        const currentTypedWord = typedWords[currentWordIndex] || '';
        const currentTargetWord = targetWords[currentWordIndex] || '';
        if (currentTypedWord.length > currentTargetWord) {
            return currentTypedWord.slice(currentTargetWord.length)
        }
    }
    const characterStates = getCharacterStates();
    const extraChars = getExtraCharacters();
    const correctWords = typedWords.slice(0, -1).filter((word, index) => word === targetWords[index]).length
    const accuracy = Math.round((correctWords / Math.max(1, typedWords.slice(0, -1).length)) * 100) || 100;
    const correctChars = characterStates.filter(state => state === 'correct').length;
    const charAndSpaces = correctChars + ((correctChars / 5) - 1)
    const wpm = Math.round((Math.round(((charAndSpaces) / 5)) / (totalTime)) * 60)
    // Calculate correct chars

    return (
        <div className="max-w mx-auto p-8 bg-[#201420] min-h-screen text-white">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-center mb-4">Typing Project</h1>
                <div className="flex justify-center items-center space-x-6 text-lg">
                    <div>Accuracy: <span className="text-green-400">{accuracy}%</span></div>
                    <div>Words: <span className="text-blue-400">{correctWords}/{typedWords.length}</span></div>
                    <div>Time Left: <span className="text-yellow-400">{timeLeft}s</span></div>
                    <div>
                        <button
                            onClick={handleStart}
                            disabled={isStarted && !isTimeUp}
                            className={`px-4 py-1 rounded ${isStarted && !isTimeUp ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isStarted && !isTimeUp ? 'Running' : (isTimeUp ? 'Restart' : 'Start')}
                        </button>
                    </div>
                </div>
                <div className="w-64 h-12 mx-auto my-3 rounded-full flex gap-10 bg-[#5f3a3a5f] p-2 justify-center">


                    <button className="hover:text-[#acb82f] transition duration-300 [ease-in-out] hover:scale-150" onClick={() => { setSelectedDuration(15); setTimeLeft(15); handleStart(); setTotalTime(15) }}>15s</button>
                    <button className="hover:text-[#d5e337] transition duration-300 [ease-in-out] hover:scale-150" onClick={() => { setSelectedDuration(30); setTimeLeft(30); handleStart(); setTotalTime(30) }}>30s</button>
                    <button className="hover:text-[#acb82f] transition duration-300 [ease-in-out] hover:scale-150" onClick={() => { setSelectedDuration(60); setTimeLeft(60); handleStart(); setTotalTime(60) }}>60s</button>



                </div>
            </div>

            {!isTimeUp ? (
                <>
                    <div className="mb-6 p-6 bg-[#201420] rounded-lg">

                        <div className="text-[60px] leading-relaxed font-mono tracking-wide whitespace-pre-wrap break-words overflow-y-auto max-h-64 p-2 scrollbar-hide"
                            ref={textContainerRef}>


                            {generatedText.split('').map((char, index) => {
                                const state = characterStates[index];
                                let className = 'relative ';
                                switch (state) {
                                    case 'correct':
                                        className += 'text-green-400 '

                                            ; break;
                                    case 'incorrect': className += 'text-red-400 '; break;
                                    case 'current': className += '  border-l-2 border-white '; break;
                                    case 'correct-space': className += 'text-gray-400 '; break;
                                    case 'untyped-space': className += 'text-[#e6db74]'; break;
                                    case 'extra': className += 'text-[#e6db74]  border-b-2 border-red-400'; break;
                                    default: className += 'text-[#e6db74]';
                                }
                                return (
                                    <span key={index} className={className}>
                                        {char === ' ' ? '\u00A0' : char}
                                    </span>
                                );
                            })}

                            {extraChars && (
                                <span className="text-red-400 bg-red-400/30 border-b-2 border-red-400">
                                    {extraChars}
                                </span>
                            )}
                        </div>
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        disabled={!isStarted}

                        className="opacity-0 w-full p-4 bg-transparent border-2 border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-transparent caret-transparent"
                        placeholder={isStarted ? "Click here and start typing..." : "Press Start to begin the test"}
                        autoFocus
                    />
                </>
            ) : (
                <div className="text-center text-xl">
                    <p className="mb-4">⏳ Time's up!</p>
                    <p className="text-green-500 font-bold text-3xl">
                        WPM: <span className=" decoration-green-300">{wpm}</span>
                    </p>
                    <p className="text-blue-400 font-semibold text-2xl">
                        Accuracy: <span className="">{accuracy}%</span>
                    </p>
                    <p className="text-gray-300">
                        Correct chars: <span className="font-mono">{correctChars}</span>
                    </p>

                </div>
            )}

            <div className="text-center mt-8">
                <button
                    onClick={() => {
                        setInputText("");
                        setTimeLeft(selectedDuration);
                        setIsTimeUp(false);
                        setIsStarted(false);
                        if (textContainerRef.current) {
                            textContainerRef.current.scrollTop = 0;
                        }
                    }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                    Reset Test
                </button>
            </div>
        </div>
    );
}

export default Typingbox2
