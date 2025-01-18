'use client';
import React, { useState, useEffect } from 'react';
import { Pokemon, transformPokemonData } from './models/Pokemon';
import GameControls from './components/GameControls/GameControls';
import PokemonQuestion from './components/PokemonQuestion/PokemonQuestion';
import AnswerFeedback from './components/AnswerFeedback/AnswerFeedback';
import styles from './GamePage.module.css';

const GamePage: React.FC = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const responses = await Promise.all(
          Array.from({ length: 50 }, (_, i) =>
            fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`).then((res) => res.json())
          )
        );
        if (responses) {
          const transformedPokemon = transformPokemonData(responses);
          setPokemonList(transformedPokemon);
        }
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
    setQuestionsAnswered(0); // Reset answered questions
    generateQuestion(pokemonList);
  };

  const finishGame = () => {
    if (userAnswer === null) {
      setShowModal(true); // Show the modal if the current question is unanswered
    } else {
      setIsGameFinished(true); // Finish the game if the current question is answered
    }
  };

  const confirmFinishGame = () => {
    setShowModal(false);
    setIsGameFinished(true); // Confirm finishing the game
  };

  const cancelFinishGame = () => {
    setShowModal(false); // Close the modal and stay on the current question
  };

  const generateQuestion = (list: Pokemon[]) => {
    //first choose a random pokemon for the current question: 
    const randomPokemon = list[Math.floor(Math.random() * list.length)]; // list.length is 50 so it will be between 0 and 50 e.g. 0.23*50 = 11.5 then math.floor to make sure it's between 0 and 49
    const options = [randomPokemon.name]; // add the correct pokemon name first ( randomPokemon is the Pokémon chosen for the current question, so its name is guaranteed to be the correct answer.)
    while (options.length < 4) { //then add more until there's 4
      const randomOption = list[Math.floor(Math.random() * list.length)].name;
      if (!options.includes(randomOption)) options.push(randomOption);
    }
    setOptions(options.sort(() => Math.random() - 0.5)); //shuffle the options 
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
    setQuestionsAnswered((prev) => prev + 1); // Increment answered questions
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    generateQuestion(pokemonList);
  };

  if (!loading && !!error) return <div>{error}</div>

  if (loading || pokemonList.length === 0) {
    return <div>Loading your Pokémon...</div>;
  }

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
        questionsAnswered={questionsAnswered} // Pass answered questions count
      />
      {!isGameFinished && currentPokemon && (
        <PokemonQuestion
          currentPokemon={currentPokemon}
          options={options}
          showAnswer={showAnswer}
          handleAnswer={handleAnswer}
        />
      )}
      {(isGameStarted && !isGameFinished) && (
        <button
          onClick={nextQuestion}
          disabled={userAnswer === null}
          className={styles.button}
        >
          Next Pokémon
        </button>
      )}
      {(showAnswer && !isGameFinished) && (
        <AnswerFeedback
          userAnswer={userAnswer}
          correctAnswer={currentPokemon?.name}
        />
      )}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Are you sure you want to submit without answering the current Pokémon?</h2>
            <button onClick={confirmFinishGame} className={styles.confirmButton}>
              Yes, Submit
            </button>
            <button onClick={cancelFinishGame} className={styles.cancelButton}>
              No, Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GamePage;