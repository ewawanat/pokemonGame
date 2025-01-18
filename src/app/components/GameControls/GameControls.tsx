import React from 'react';
import styles from './GameControls.module.css';

type GameControlsProps = {
    isGameStarted: boolean;
    isGameFinished: boolean;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    startGame: () => void;
    finishGame: () => void;
    questionsAnswered: number;
};

const GameControls: React.FC<GameControlsProps> = ({
    isGameStarted,
    isGameFinished,
    score,
    totalQuestions,
    correctAnswers,
    startGame,
    finishGame,
}) => {
    const calculatePercentage = () => {
        return totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : '0';
    };

    return (
        <div className={styles.controlsContainer}>
            <button
                onClick={!isGameStarted || isGameFinished ? startGame : finishGame}
                className={styles.controlButton}
            >
                {!isGameStarted || isGameFinished ? 'Start Game' : 'Finish Game'}
            </button>
            <p className={styles.score}>Score: {score}</p>
            {isGameFinished && (
                <div className={styles.results}>
                    <h2 className={styles.finalScore}>Final Score: {score}</h2>
                    <p>
                        Correct Answers: {correctAnswers} / {totalQuestions}
                    </p>
                    <p>Percentage: {calculatePercentage()}%</p>
                </div>
            )}
        </div>
    );
};

export default GameControls;
