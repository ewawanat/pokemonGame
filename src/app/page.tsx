'use client'
import React, { useState, useEffect } from 'react';
import { Pokemon, transformPokemonData } from './models/Pokemon';
import GameControls from '../app/components/GameControls/GameControls';
import PokemonQuestion from '../app/components/PokemonQuestion/PokemonQuestion';
import AnswerFeedback from '../app/components/AnswerFeedback/AnswerFeedback';
import styles from './GamePage.module.css'

export default function GamePage() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const responses = await Promise.all(
          Array.from({ length: 50 }, (_, i) =>
            fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`).then((res) => res.json())
          )
        );
        const transformedPokemon = transformPokemonData(responses);
        setPokemonList(transformedPokemon);
      } catch (error) {
        console.log(error);
        setError('Ooops! We caught an error, not a Pokémon! Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const startGame = () => {
    setIsGameStarted(true);
    setIsGameFinished(false);
    setScore(0);
    setTotalQuestions(0);
    setCorrectAnswers(0);
    generateQuestion(pokemonList);
  };

  const finishGame = () => {
    setIsGameFinished(true);
  };

  const generateQuestion = (list: Pokemon[]) => {
    const randomPokemon = list[Math.floor(Math.random() * list.length)];
    const options = [randomPokemon.name];
    while (options.length < 4) {
      const randomOption = list[Math.floor(Math.random() * list.length)].name;
      if (!options.includes(randomOption)) options.push(randomOption);
    }
    setOptions(options.sort(() => Math.random() - 0.5));
    setCurrentPokemon(randomPokemon);
    setShowAnswer(false);
    setTotalQuestions((prev) => prev + 1);
    setUserAnswer(null);
  };

  const handleAnswer = (answer: string) => {
    setUserAnswer(answer);
    if (answer === currentPokemon?.name) {
      setScore((prev) => prev + 1);
      setCorrectAnswers((prev) => prev + 1);
    }
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    generateQuestion(pokemonList);
  };

  if (error) return <div>{error}</div>;
  if (loading) return <div>Loading your Pokémon...</div>;

  return (
    <div className={styles.gameContainer}>
      <h1 className={styles.header}>Who’s That Pokémon?</h1>
      <GameControls
        isGameStarted={isGameStarted}
        isGameFinished={isGameFinished}
        score={score}
        totalQuestions={totalQuestions}
        correctAnswers={correctAnswers}
        startGame={startGame}
        finishGame={finishGame}
      />
      {!isGameFinished && currentPokemon && (
        <PokemonQuestion
          currentPokemon={currentPokemon}
          options={options}
          showAnswer={showAnswer}
          handleAnswer={handleAnswer}
        />
      )}
      {/* Always show the Next Pokémon button, but disable it until the user selects an answer */}
      {(isGameStarted && !isGameFinished) && (
        <button
          onClick={nextQuestion}
          disabled={userAnswer === null}
          className={styles.button}
        >
          Next Pokémon
        </button>
      )}
      {showAnswer && !isGameFinished && (
        <AnswerFeedback
          userAnswer={userAnswer}
          correctAnswer={currentPokemon?.name}
        />
      )}
    </div>

  );
}
