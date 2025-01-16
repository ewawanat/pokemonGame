import { render, screen, fireEvent } from '@testing-library/react';
import PokemonQuestion from './PokemonQuestion';

// Mocking the Image component from Next.js
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
        image: '/images/pikachu.png',
        silhouette: '/images/pikachu-silhouette.png',
    };

    const options = ['Pikachu', 'Bulbasaur', 'Charmander', 'Squirtle'];

    // We render the component only once and reuse it in each test to avoid redundant rendering
    // const renderComponent = (showAnswer) => {
    //     render(
    //         <PokemonQuestion
    //             currentPokemon={pokemon}
    //             options={options}
    //             showAnswer={showAnswer}
    //             handleAnswer={mockHandleAnswer}
    //         />
    //     );
    // };

    it.only('renders the silhouette when showAnswer is false', () => {
        render(
            <PokemonQuestion
                currentPokemon={pokemon}
                options={options}
                showAnswer={false}
                handleAnswer={mockHandleAnswer}
            />
        );
        screen.logTestingPlaygroundURL()


        const image = screen.getByAltText("Who's that Pokémon?");
        expect(image).toHaveAttribute('src', pokemon.silhouette);
    });

    it('renders the actual image when showAnswer is true', () => {
        renderComponent(true);

        const image = screen.getByAltText("Who's that Pokémon?");
        expect(image).toHaveAttribute('src', pokemon.image);
    });

    it('renders all options as buttons', () => {
        renderComponent(false);

        options.forEach((option) => {
            const button = screen.getByText(option);
            expect(button).toBeInTheDocument();
        });
    });

    it('calls handleAnswer with the selected option when a button is clicked', () => {
        renderComponent(false);

        const button = screen.getByText('Pikachu');
        fireEvent.click(button);

        expect(mockHandleAnswer).toHaveBeenCalledWith('Pikachu');
    });

    it('disables the buttons when showAnswer is true', () => {
        renderComponent(true);

        options.forEach((option) => {
            const button = screen.getByText(option);
            expect(button).toBeDisabled();
        });
    });

    it('does not disable the buttons when showAnswer is false', () => {
        renderComponent(false);

        options.forEach((option) => {
            const button = screen.getByText(option);
            expect(button).not.toBeDisabled();
        });
    });
});
