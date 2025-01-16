'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

import { Pokemon, transformPokemonData } from './models/Pokemon';

export default function GamePage() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false); // Track if the game is started
  const [isGameFinished, setIsGameFinished] = useState(false); // Track if the game is finished
  const [totalQuestions, setTotalQuestions] = useState(0); // Track total number of questions asked
  const [correctAnswers, setCorrectAnswers] = useState(0); // Track number of correct answers
  const [userAnswer, setUserAnswer] = useState<string | null>(null); // Track the user's selected answer
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Pokémon data
  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true)
      try {
        const responses = await Promise.all(
          Array.from({ length: 50 }, (_, i) =>
            fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`).then((res) => res.json())
          )
        );
        console.log('responses', responses);

        const transformedPokemon = transformPokemonData(responses);
        setPokemonList(transformedPokemon);
      }
      catch (error) {
        console.log('error occured on fetching pokemon:', error) //TODO: log the error somewhere useful
        setLoading(false)
        setError('Ooops! We caught an error, not a Pokémon! Please try again later.')
      }
      finally {
        setLoading(false)
      }
    };

    fetchPokemon();
  }, []);

  const startGame = () => {
    if (pokemonList.length > 0) {
      setIsGameStarted(true); // Start the game when clicked
      setIsGameFinished(false); // Reset the game finished state
      setScore(0); // Reset the score
      setTotalQuestions(0); // Reset total questions count
      setCorrectAnswers(0); // Reset correct answers count
      generateQuestion(pokemonList); // Start the first question
    }
  };

  const finishGame = () => {
    setIsGameFinished(true); // Mark the game as finished
  };

  // Generate a new question
  const generateQuestion = (list: Pokemon[]) => {
    const randomPokemon = list[Math.floor(Math.random() * list.length)];
    const options = [randomPokemon.name];
    while (options.length < 4) {
      const randomOption = list[Math.floor(Math.random() * list.length)].name;
      if (!options.includes(randomOption)) options.push(randomOption);
    }
    setOptions(shuffleArray(options));
    setCurrentPokemon(randomPokemon);
    setShowAnswer(false);
    setTotalQuestions((prev) => prev + 1); // Increment total questions count
    setUserAnswer(null); // Reset user's answer
  };

  // Shuffle options array
  const shuffleArray = (array: string[]) => array.sort(() => Math.random() - 0.5);

  // Handle answer selection
  const handleAnswer = (answer: string) => {
    setUserAnswer(answer); // Store the selected answer
    if (answer === currentPokemon?.name) {
      setScore((prev) => prev + 1);
      setCorrectAnswers((prev) => prev + 1); // Increment correct answers count
    }
    setShowAnswer(true);
  };

  // Move to the next question
  const nextQuestion = () => {
    generateQuestion(pokemonList);
  };

  // Calculate percentage of correct answers
  const calculatePercentage = () => {
    return totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(2) : '0';
  };
  if (error) return <div>{error}</div>
  if (loading) return <div>Loading your Pokémon...</div>

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Who’s That Pokémon?</h1>

      {/* Button toggles between Start and Finish */}
      {!isGameStarted || isGameFinished ? (
        <button onClick={startGame}>Start Game</button>
      ) : (
        <button onClick={finishGame}>Finish Game</button>
      )}


      <p>Score: {score}</p>

      {/* Display Final Score and Percentage */}
      {isGameFinished && totalQuestions > 0 && (
        <div>
          <h2>Final Score: {score}</h2>
          <p>Correct Answers: {correctAnswers} / {totalQuestions}</p>
          <p>Percentage: {calculatePercentage()}%</p>
        </div>
      )}

      {/* Display Current Question */}
      {!isGameFinished && currentPokemon && (
        <div>
          <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto' }}>
            <Image
              src={showAnswer ? currentPokemon.image : currentPokemon.silhouette}
              alt="Who's that Pokémon?"
              width={200}
              height={200}
              style={{
                filter: showAnswer ? 'none' : 'brightness(0)',
              }}
              priority // Ensures the image loads faster
            />
          </div>
          <div style={{ marginTop: '20px' }}>
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                style={{
                  margin: '5px',
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
                disabled={showAnswer}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Show Answer Feedback and Next Question Button */}
      {showAnswer && !isGameFinished && (
        <div style={{ marginTop: '20px' }}>
          <p>
            {userAnswer === currentPokemon?.name
              ? 'Correct!'
              : 'Wrong!'}{' '}
            It was {currentPokemon?.name}.
          </p>
          <button onClick={nextQuestion} style={{ padding: '10px 20px', marginTop: '10px' }}>
            Next Pokémon
          </button>
        </div>
      )}
    </div>
  );
}
