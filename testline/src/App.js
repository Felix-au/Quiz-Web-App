import React, { useEffect, useState } from 'react';
import './App.css';
import correctSound from './sounds/correct.mp3';
import wrongSound from './sounds/wrong.mp3';

function QuizApp() {
    const [quizData, setQuizData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [timer, setTimer] = useState(5);
    const [leaderboard, setLeaderboard] = useState(() => {
        const storedLeaderboard = localStorage.getItem('leaderboard');
        return storedLeaderboard ? JSON.parse(storedLeaderboard) : [];
    });
    const [gameStarted, setGameStarted] = useState(false);
    const [error, setError] = useState(null);
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
    const [userName, setUserName] = useState('');
    const [summary, setSummary] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const response = await fetch(`https://api.allorigins.win/raw?url=https://api.jsonserve.com/Uw5CrX`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch quiz data: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setQuizData(data);
            } catch (error) {
                console.error('Error fetching quiz data:', error);
                setError(error.message);
            }
        };
        fetchQuizData();
    }, []);

    useEffect(() => {
        if (timer > 0 && gameStarted) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            handleTimerExpired();
        }
    }, [timer, gameStarted]);

    const handleAnswerClick = (isCorrect, answer) => {
        const newScore = isCorrect ? score + 4 : score - 1;
        const newSelectedAnswer = { isCorrect, answer };
        const newUserAnswers = [...userAnswers, answer];

        setScore(newScore);
        setSelectedAnswer(newSelectedAnswer);
        setUserAnswers(newUserAnswers);

        if (isCorrect) {
            new Audio(correctSound).play();
        } else {
            new Audio(wrongSound).play();
        }

        setShowCorrectAnswer(true);
        setTimeout(() => {
            setShowCorrectAnswer(false);
            const nextQuestion = currentQuestion + 1;
            if (nextQuestion < quizData.questions.length) {
                setCurrentQuestion(nextQuestion);
                setTimer(5);
                setSelectedAnswer(null);
            } else {
                handleEndQuiz();
            }
        }, 2000);
    };

    const handleTimerExpired = () => {
        setShowCorrectAnswer(true);
        setTimeout(() => {
            setShowCorrectAnswer(false);
            const nextQuestion = currentQuestion + 1;
            if (nextQuestion < quizData.questions.length) {
                setCurrentQuestion(nextQuestion);
                setTimer(5);
                setSelectedAnswer(null);
            } else {
                handleEndQuiz();
            }
        }, 2000);
    };

    const handleEndQuiz = () => {
        setShowResult(true);
        handleSummary();
    };

    const startGame = () => {
        setGameStarted(true);
        setTimer(5);
    };

    const handleNameChange = (event) => {
        setUserName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        startGame();
    };

    const handleSummary = () => {
        const summaryData = quizData.questions.map((question, index) => ({
            question: question.description,
            yourAnswer: userAnswers[index] || "Not answered",
            correctAnswer: question.options.find(option => option.is_correct)?.description || "Not available",
            topic: question.topic,
            detailedSolution: question.detailed_solution || "Not available",
            readingMaterial: question.reading_material?.content_sections?.join(" ") || "Not available",
        }));
        setSummary(summaryData);

        const newLeaderboardEntry = {
            name: userName,
            score: score,
        };
        setLeaderboard(prev => [...prev, newLeaderboardEntry]);
        localStorage.setItem('leaderboard', JSON.stringify([...leaderboard, newLeaderboardEntry]));
    };

    if (error) return <h2>Error: {error}</h2>;
    if (!quizData) return <h2>Loading quiz...</h2>;

    return (
        <div className="quiz-container">
            {!gameStarted ? (
                <div className="start-screen">
                    <h2>Welcome to the Quiz!</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" value={userName} onChange={handleNameChange} placeholder="Enter your name" />
                        <button type="submit">Start Quiz</button>
                    </form>
                </div>
            ) : showResult ? (
                <div className="result-page">
                    <div className="result">
                        <h2>Quiz Completed</h2>
                        <h3>Final Score: {score}</h3>
                    </div>
                    <div className="leaderboard-container">
                        <h3>Top 3 Leaderboard</h3>
                        <ul className="leaderboard">
                            {JSON.parse(localStorage.getItem('leaderboard')).sort((a, b) => b.score - a.score).slice(0, 3).map((entry, index) => (
                                <li key={index}>
                                    {index === 0 && <span>🥇</span>}
                                    {index === 1 && <span>🥈</span>}
                                    {index === 2 && <span>🥉</span>}
                                    {entry.name}: {entry.score}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <h3>Summary</h3>
                    <ul className="summary-list">
                        {summary.map((entry, index) => (
                            <li key={index}>
                                <details>
                                    <summary>Question {index + 1}: {entry.question}</summary>
                                    <p><strong>Your Answer:</strong> {entry.yourAnswer}</p>
                                    <p><strong>Correct Answer:</strong> {entry.correctAnswer}</p>
                                    <p><strong>Topic:</strong> {entry.topic}</p>
                                    <details>
                                        <summary>Reading Material</summary>
                                        <div dangerouslySetInnerHTML={{ __html: entry.readingMaterial }}></div>
                                    </details>
                                </details>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="question-card">
                    <h2>{quizData.questions[currentQuestion].description}</h2>
                    <p>Question {currentQuestion + 1} of {quizData.questions.length}</p>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${(currentQuestion + 1) / quizData.questions.length * 100}%` }}></div>
                    </div>
                    <p>Time Left: {timer}s | Score: {score}</p>
                    <div className="options">
                        {quizData.questions[currentQuestion].options.map(option => (
                            <button
                                key={option.id}
                                onClick={() => handleAnswerClick(option.is_correct, option.description)}
                                className={selectedAnswer && selectedAnswer.answer === option.description ? (selectedAnswer.isCorrect ? 'correct-answer' : 'wrong-answer') : ''}
                            >
                                {option.description}
                            </button>
                        ))}
                    </div>
                    {showCorrectAnswer && (
                        <p>
                            Correct Answer: {quizData.questions[currentQuestion].options.find(option => option.is_correct).description}
                        </p>
                    )}
                    <button onClick={handleEndQuiz} className="end-quiz-button">End Quiz</button>
                </div>
            )}
        </div>
    );
}

export default QuizApp;