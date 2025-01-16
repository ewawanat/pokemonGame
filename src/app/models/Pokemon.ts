export type OfficialArtwork = {
    'official-artwork': {
        front_default: string;
    };
};

export type Sprites = {
    other: OfficialArtwork;
};

export type PokemonApiResponse = {
    name: string;
    sprites: Sprites;
};

export type Pokemon = {
    name: string;
    image: string;
    silhouette: string;
};

export const transformPokemonData = (apiPokemonData: PokemonApiResponse[]): Pokemon[] => {
    return apiPokemonData.map((anApiPokemon: PokemonApiResponse) => ({
        name: anApiPokemon.name,
        image: anApiPokemon.sprites.other['official-artwork'].front_default,
        silhouette: anApiPokemon.sprites.other['official-artwork'].front_default,
    }));
};
