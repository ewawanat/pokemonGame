import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import AnswerFeedback from './AnswerFeedback';

// Extend Jest to include axe accessibility checks
expect.extend(toHaveNoViolations);

describe('AnswerFeedback Component', () => {
    const defaultProps = {
        userAnswer: null,
        correctAnswer: 'A',
    };

    const renderComponent = (props = {}) => {
        return render(<AnswerFeedback {...defaultProps} {...props} />);
    };

    it('renders the correct feedback when the answer is correct', () => {
        renderComponent({
            userAnswer: 'A',
            correctAnswer: 'A',
        });

        const feedbackText = screen.getByText(/correct!/i);
        expect(feedbackText).toBeInTheDocument();
        expect(feedbackText).toHaveTextContent('Correct! It was A.');
    });

    it('renders the wrong feedback when the answer is incorrect', () => {
        renderComponent({
            userAnswer: 'B',
            correctAnswer: 'A',
        });

        const feedbackText = screen.getByText(/wrong!/i);
        expect(feedbackText).toBeInTheDocument();
        expect(feedbackText).toHaveTextContent('Wrong! It was A.');
    });

    it('renders nothing when no answer is provided', () => {
        renderComponent({
            userAnswer: null,
            correctAnswer: 'A',
        });

        const feedbackText = screen.queryByText(/correct!/i);
        expect(feedbackText).not.toBeInTheDocument();
    });

    it('matches the snapshot when the answer is correct', () => {
        const { asFragment } = renderComponent({
            userAnswer: 'A',
            correctAnswer: 'A',
        });
        expect(asFragment()).toMatchSnapshot();
    });

    it('matches the snapshot when the answer is incorrect', () => {
        const { asFragment } = renderComponent({
            userAnswer: 'B',
            correctAnswer: 'A',
        });
        expect(asFragment()).toMatchSnapshot();
    });

    it('has no accessibility violations', async () => {
        const { container } = renderComponent({
            userAnswer: 'A',
            correctAnswer: 'A',
        });
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when the answer is wrong', async () => {
        const { container } = renderComponent({
            userAnswer: 'B',
            correctAnswer: 'A',
        });
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
