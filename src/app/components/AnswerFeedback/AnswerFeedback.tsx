import React from 'react';
import styles from './AnswerFeedback.module.css';

type AnswerFeedbackProps = {
    userAnswer: string | null;
    correctAnswer: string | undefined;
};

const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
    userAnswer,
    correctAnswer,
}) => {
    return (
        <div className={styles.feedbackContainer}>
            <p className={styles.feedbackText}>
                {userAnswer === correctAnswer ? 'Correct!' : 'Wrong!'} It was {correctAnswer}.
            </p>
        </div>
    );
};

export default AnswerFeedback;
