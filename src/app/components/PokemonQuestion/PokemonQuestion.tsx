import React from 'react';
import Image from 'next/image';
import styles from './PokemonQuestion.module.css';
import { Pokemon } from '../../models/Pokemon';

type PokemonQuestionProps = {
    currentPokemon: Pokemon;
    options: string[];
    showAnswer: boolean;
    handleAnswer: (answer: string) => void;
};

const PokemonQuestion: React.FC<PokemonQuestionProps> = ({
    currentPokemon,
    options,
    showAnswer,
    handleAnswer,
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                <Image
                    src={showAnswer ? currentPokemon.image : currentPokemon.silhouette}
                    alt="Who's that Pokémon?"
                    width={200}
                    height={200}
                    className={showAnswer ? styles.image : styles.silhouette}
                    priority
                />
            </div>
            <div className={styles.optionsContainer}>
                {options.map((option) => (
                    <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        className={styles.optionButton}
                        disabled={showAnswer}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PokemonQuestion;
