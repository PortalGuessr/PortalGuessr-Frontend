import { useContext } from "react";
import axios from "axios";
import StartingCards from "../cards/StartingCards";
import { GuessrContext } from "../../../types/utiltypes/GuessrContextType";
import { AlertContext } from "../../../types/utiltypes/AlertContextType";
import { convertToAbbreviate } from "../../utils/convertToAbbreviate";
import { GuessrDifficulty } from "../../../types/utiltypes/GuessrGameTypes";

const PORTALGUESSR_API_ENDPOINT =
  "https://portalguessr-api.cyclic.app/chambers/random";

const GameStart = () => {
  const { setCurrentQuestion, setQuestions, resetCounter, setIsGameRunning } =
    useContext(GuessrContext);

  const { showAlert } = useContext(AlertContext);

  let isFetching = false;

  function handleGameStart(
    difficulty: GuessrDifficulty,
    timeoutSeconds: number,
    amount: number
  ) {
    if (isFetching) {
      console.warn(
        "WARNING: Still fetching data from server, can't start another instance of game."
      );
      return;
    }

    isFetching = true;

    const difficultyAbbreviate = convertToAbbreviate(difficulty);
    const endpoint = `${PORTALGUESSR_API_ENDPOINT}/${
      amount + (difficultyAbbreviate !== null ? `/${difficultyAbbreviate}` : "")
    }`;
    // Goofy workaround but it works!

    async function fetchQuestions() {
      try {
        const response = await axios.get(endpoint);
        const questions = response.data;

        setQuestions(questions);
        setCurrentQuestion(questions[0]);
        resetCounter(timeoutSeconds);
        setIsGameRunning(true);
      } catch (error) {
        showAlert(`An error occurred: ${error}`, "danger", 3000);
      } finally {
        isFetching = false;
      }
    }

    fetchQuestions();
  }

  return (
    <section className="my-4 mx-2">
      <h4 className="text-center mb-4">⭐ Select a difficulty to continue</h4>
      <StartingCards handleGameStart={handleGameStart} />
    </section>
  );
};

export default GameStart;
