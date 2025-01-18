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
    return apiPokemonData.map((anApiPokemon: PokemonApiResponse) => {
        const image = anApiPokemon.sprites?.other?.['official-artwork']?.front_default || 'default-image-url';
        const silhouette = image; // silhouette is the same as the image

        return {
            name: anApiPokemon.name ? anApiPokemon.name : 'No name',
            image,
            silhouette,
        };
    });
};
