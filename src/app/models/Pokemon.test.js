import { transformPokemonData } from './Pokemon';

describe('transformPokemonData', () => {
    it('should transform API response to Pokemon objects correctly', () => {
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

        const expectedTransformedData = [
            {
                name: 'pikachu',
                image: 'https://example.com/pikachu.png',
                silhouette: 'https://example.com/pikachu.png',
            },
            {
                name: 'bulbasaur',
                image: 'https://example.com/bulbasaur.png',
                silhouette: 'https://example.com/bulbasaur.png',
            },
        ];

        const result = transformPokemonData(apiPokemonData);

        expect(result).toEqual(expectedTransformedData);
    });

    it('should handle empty API response', () => {
        const apiPokemonData = [];
        const expectedTransformedData = [];

        const result = transformPokemonData(apiPokemonData);

        expect(result).toEqual(expectedTransformedData);
    });

    it('should handle a single Pokémon in the API response', () => {
        const apiPokemonData = [
            {
                name: 'charmander',
                sprites: {
                    other: {
                        'official-artwork': {
                            front_default: 'https://example.com/charmander.png',
                        },
                    },
                },
            },
        ];

        const expectedTransformedData = [
            {
                name: 'charmander',
                image: 'https://example.com/charmander.png',
                silhouette: 'https://example.com/charmander.png',
            },
        ];

        const result = transformPokemonData(apiPokemonData);

        expect(result).toEqual(expectedTransformedData);
    });

    it('should handle malformed API response gracefully', () => {
        const apiPokemonData = [
            {
                name: 'squirtle',
                sprites: {
                    other: {
                        'official-artwork': {
                            front_default: '',
                        },
                    },
                },
            },
        ];

        const expectedTransformedData = [
            {
                name: 'squirtle',
                image: '',
                silhouette: '',
            },
        ];

        const result = transformPokemonData(apiPokemonData);

        expect(result).toEqual(expectedTransformedData);
    });
});
