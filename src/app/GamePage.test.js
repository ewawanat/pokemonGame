import '@testing-library/jest-dom';
import { render, screen, act, waitFor } from '@testing-library/react';
import GamePage from './page';
import userEvent from '@testing-library/user-event';

const apiPokemonData = [
    {
        name: 'pikachu',
        sprites: {
            other: {
                'official-artwork': {
                    front_default: 'https://example.com/pikachu.png',
                },
            },
        },
    },
    {
        name: 'bulbasaur',
        sprites: {
            other: {
                'official-artwork': {
                    front_default: 'https://example.com/bulbasaur.png',
                },
            },
        },
    },
];

describe('GamePage', () => {
    afterEach(() => {
        // Restore the original fetch after each test
        global.fetch.mockRestore();
    });

    it('renders the page when correct data comes back from api', async () => {
        // Mock global fetch before the tests run
        global.fetch = jest.fn().mockImplementation(() => {
            return Promise.resolve({
                json: () => Promise.resolve(apiPokemonData),
            });
        });
        await act(async () => render(<GamePage />))
        expect(global.fetch).toHaveBeenCalledTimes(50); // Ensure the fetch was called once
        expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/1'); // Check if the correct URL was called

        const startGameButton = screen.getByRole('button', { name: /start game/i })
        userEvent.click(startGameButton)

    });
    it('renders an error message', async () => {
        const testError = 'Error occurred in Test'
        global.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockRejectedValue(testError) })
        await act(async () => render(<GamePage />))
        await waitFor(() => expect(screen.queryByText('Loading your Pokémon...')).not.toBeInTheDocument());

        const errorMessage = screen.getByText('Ooops! We caught an error, not a Pokémon! Please try again later.')
        expect(errorMessage).toBeInTheDocument()
    })
});