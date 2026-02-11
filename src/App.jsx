import React, { act, useEffect, useReducer } from "react";
import DateCounter from "./components/DateCounter";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import { Question } from "./components/Question";
import Options from "./components/Options";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

const SECS_PER_QUESTIONS = 30;

const initialState = {
  questions: [],

  // "loading" "error" "ready" "active" "finished"
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  seconds: null,
};

function reducer(state, action) {
  const question = state.questions.at(state.index);

  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };

    case "dataFailed":
      return { ...state, status: "error" };

    case "start":
      return { ...state, status: "active", seconds: state.questions.length * SECS_PER_QUESTIONS };

    case "newAnswer":
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    case "finished":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };

    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };
    
    case "tick":
      return { ...state, seconds: state.seconds - 1, status: state.seconds === 0 ? "finished" : state.status };


    default:
      return { ...state, status: "error" };
  }
}

const App = () => {
  const api = "http://localhost:9000/questions";
  const [{ questions, status, index, answer, points, highScore, seconds }, dispatch] =
    useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, curr) => {
    return prev + curr.points;
  }, 0);

  useEffect(function () {
    fetch(api)
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch(() => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <>
      <div className="app">
        <Header />
        <Main>
          {status === "loading" && <Loader />}
          {status === "error" && <Error />}
          {status === "ready" && (
            <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
          )}
          {status === "active" && (
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
          )}
          {status === "active" && (
            <Question
              questions={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            
          )}
          {status === "active" && (<Footer>
            <Timer answer={answer} dispatch={dispatch} seconds={seconds}/>
            <NextButton
              dispatch={dispatch}
              answer={answer}
              numQuestions={numQuestions}
              index={index}
              status={status}
            />
          </Footer>)}

          {status === "finished" && (
            <FinishScreen
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              highScore={highScore}
              dispatch={dispatch}
            />
          )}
        </Main>
      </div>
    </>
  );
};

export default App;
