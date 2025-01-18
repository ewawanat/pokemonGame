import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import GameControls from './GameControls';

// Extend Jest to include axe accessibility checks
expect.extend(toHaveNoViolations);

describe('GameControls Component', () => {
    const mockStartGame = jest.fn();
    const mockFinishGame = jest.fn();

    const defaultProps = {
        isGameStarted: false,
        isGameFinished: false,
        score: 0,
        totalQuestions: 10,
        correctAnswers: 0,
        startGame: mockStartGame,
        finishGame: mockFinishGame,
        questionsAnswered: 0,
    };

    const renderComponent = (props = {}) => {
        return render(<GameControls {...defaultProps} {...props} />);
    };

    it('renders the "Start Game" button when the game is not started or finished', () => {
        renderComponent();

        const startButton = screen.getByRole('button', { name: /start game/i });
        expect(startButton).toBeInTheDocument();
        expect(startButton).toHaveTextContent('Start Game');
    });

    it('renders the "Finish Game" button when the game is started and not finished', () => {
        renderComponent({ isGameStarted: true });

        const finishButton = screen.getByRole('button', { name: /finish game/i });
        expect(finishButton).toBeInTheDocument();
        expect(finishButton).toHaveTextContent('Finish Game');
    });

    it('calls startGame when the "Start Game" button is clicked', async () => {
        renderComponent();

        const startButton = screen.getByRole('button', { name: /start game/i });
        await userEvent.click(startButton);

        expect(mockStartGame).toHaveBeenCalledTimes(1);
    });

    it('calls finishGame when the "Finish Game" button is clicked', async () => {
        renderComponent({ isGameStarted: true });

        const finishButton = screen.getByRole('button', { name: /finish game/i });
        await userEvent.click(finishButton);

        expect(mockFinishGame).toHaveBeenCalledTimes(1);
    });

    it('displays the score correctly', () => {
        renderComponent({ score: 50 });

        const scoreText = screen.getByText(/score: 50/i);
        expect(scoreText).toBeInTheDocument();
    });

    it('displays the final results when the game is finished', () => {
        renderComponent({
            isGameFinished: true,
            score: 80,
            correctAnswers: 8,
            totalQuestions: 10,
        });

        const finalScore = screen.getByText(/final score: 80/i);
        const correctAnswersText = screen.getByText(/correct answers: 8 \/ 10/i);
        const percentageText = screen.getByText(/percentage: 80.00%/i);

        expect(finalScore).toBeInTheDocument();
        expect(correctAnswersText).toBeInTheDocument();
        expect(percentageText).toBeInTheDocument();
    });

    it('does not display final results when the game is not finished', () => {
        renderComponent();

        const finalScore = screen.queryByText(/final score:/i);
        expect(finalScore).not.toBeInTheDocument();
    });

    it('matches the snapshot when the game is not started', () => {
        const { asFragment } = renderComponent();
        expect(asFragment()).toMatchSnapshot();
    });

    it('matches the snapshot when the game is finished', () => {
        const { asFragment } = renderComponent({
            isGameFinished: true,
            score: 80,
            correctAnswers: 8,
            totalQuestions: 10,
        });
        expect(asFragment()).toMatchSnapshot();
    });

    it('has no accessibility violations', async () => {
        const { container } = renderComponent();
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when the game is finished', async () => {
        const { container } = renderComponent({
            isGameFinished: true,
            score: 80,
            correctAnswers: 8,
            totalQuestions: 10,
        });
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
