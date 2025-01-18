import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

import PokemonQuestion from './PokemonQuestion';

// Extend Jest with accessibility matcher
expect.extend(toHaveNoViolations);

// tell Jest to replace the next/image module with the mock definition.
jest.mock('next/image', () => ({
    __esModule: true,
    default: ({ src, alt, width, height, className }) => (
        <img src={src} alt={alt} width={width} height={height} className={className} />
    ),
}));

describe('PokemonQuestion Component', () => {
    const mockHandleAnswer = jest.fn();
    const pokemon = {
        name: 'Pikachu',
        image: 'http://localhost/images/pikachu.png',
        silhouette: 'http://localhost/images/pikachu-silhouette.png',
    };

    const options = ['Pikachu', 'Bulbasaur', 'Charmander', 'Squirtle'];
    it('renders the silhouette when showAnswer is false', () => {
        render(
            <PokemonQuestion
                currentPokemon={pokemon}
                options={options}
                showAnswer={false}
                handleAnswer={mockHandleAnswer}
            />
        );
        const image = screen.getByAltText('silhouette of a pokemon');
        expect(image).toHaveProperty('src', pokemon.silhouette);
    });

    it('renders the actual image when showAnswer is true', () => {
        render(
            <PokemonQuestion
                currentPokemon={pokemon}
                options={options}
                showAnswer={true}
                handleAnswer={mockHandleAnswer}
            />
        );
        const image = screen.getByAltText('Pikachu');
        expect(image).toHaveProperty('src', pokemon.image);
    });

    it('renders all options as buttons', () => {
        render(
            <PokemonQuestion
                currentPokemon={pokemon}
                options={options}
                showAnswer={false}
                handleAnswer={mockHandleAnswer}
            />
        );
        const pikachuButton = screen.getByRole('button', { name: /pikachu/i });
        const bulbasaurButton = screen.getByRole('button', { name: /bulbasaur/i });

        const charmanderButton = screen.getByRole('button', { name: /charmander/i });

        const squirtleButton = screen.getByRole('button', { name: /squirtle/i });

        expect(pikachuButton).toBeInTheDocument();
        expect(bulbasaurButton).toBeInTheDocument();
        expect(charmanderButton).toBeInTheDocument();
        expect(squirtleButton).toBeInTheDocument();

    });

    it('calls handleAnswer with the selected option when a button is clicked', async () => {
        render(
            <PokemonQuestion
                currentPokemon={pokemon}
                options={options}
                showAnswer={false}
                handleAnswer={mockHandleAnswer}
            />
        );

        const button = screen.getByText('Pikachu');
        await userEvent.click(button);

        expect(mockHandleAnswer).toHaveBeenCalledWith('Pikachu');
    });

    it('disables the buttons when showAnswer is true', () => {
        render(
            <PokemonQuestion
                currentPokemon={pokemon}
                options={options}
                showAnswer={true}
                handleAnswer={mockHandleAnswer}
            />
        );

        const pikachuButton = screen.getByRole('button', { name: /pikachu/i });
        const bulbasaurButton = screen.getByRole('button', { name: /bulbasaur/i });
        const charmanderButton = screen.getByRole('button', { name: /charmander/i });
        const squirtleButton = screen.getByRole('button', { name: /squirtle/i });

        expect(pikachuButton).toBeDisabled();
        expect(bulbasaurButton).toBeDisabled();
        expect(charmanderButton).toBeDisabled();
        expect(squirtleButton).toBeDisabled();
    });

    it('does not disable the buttons when showAnswer is false', () => {
        render(
            <PokemonQuestion
                currentPokemon={pokemon}
                options={options}
                showAnswer={false}
                handleAnswer={mockHandleAnswer}
            />
        );


        const pikachuButton = screen.getByRole('button', { name: /pikachu/i });
        const bulbasaurButton = screen.getByRole('button', { name: /bulbasaur/i });
        const charmanderButton = screen.getByRole('button', { name: /charmander/i });
        const squirtleButton = screen.getByRole('button', { name: /squirtle/i });

        expect(pikachuButton).not.toBeDisabled();
        expect(bulbasaurButton).not.toBeDisabled();
        expect(charmanderButton).not.toBeDisabled();
        expect(squirtleButton).not.toBeDisabled();
    });
    it('has no accessibility violations when showAnswer is false', async () => {
        const { container } = render(
            <PokemonQuestion
                currentPokemon={pokemon}
                options={options}
                showAnswer={false}
                handleAnswer={mockHandleAnswer}
            />
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when showAnswer is true', async () => {
        const { container } = render(
            <PokemonQuestion
                currentPokemon={pokemon}
                options={options}
                showAnswer={true}
                handleAnswer={mockHandleAnswer}
            />
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    it('matches the snapshot', () => {

        const { asFragment } = render(
            <PokemonQuestion
                currentPokemon={pokemon}
                options={options}
                showAnswer={false}
                handleAnswer={mockHandleAnswer}
            />
        );

        expect(asFragment()).toMatchSnapshot();
    });
});
